import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Network, FileText, QrCode, Upload, ChevronDown, ChevronUp, Copy, Check, CheckCircle, Eye, EyeOff, Package, MapPin, User, Phone, Mail, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { addMlmUser, setCurrentUserId, MlmUser, getMlmUsers, validateUtrNumber, validatePaymentScreenshot, getMlmPackages, MlmPackage, getPackagePriceBreakdown } from '@/lib/mlmStore';
import { createActiveUserSession } from '@/lib/sessionManager';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form State
  const [sponsorId, setSponsorId] = useState('');
  const [isFromRefLink, setIsFromRefLink] = useState(false);
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [availablePackages, setAvailablePackages] = useState<MlmPackage[]>(getMlmPackages());
  const [selectedPackageId, setSelectedPackageId] = useState<number>(availablePackages[0]?.id || 1);
  const [selectedPackageItem, setSelectedPackageItem] = useState<string>('Suit Length & Pant (Green Colour)');

  const loadPackagesData = () => {
    const pkgs = getMlmPackages();
    setAvailablePackages(pkgs);
  };

  useEffect(() => {
    loadPackagesData();
    window.addEventListener('mlm_packages_update', loadPackagesData);
    return () => {
      window.removeEventListener('mlm_packages_update', loadPackagesData);
    };
  }, []);

  const currentSelectedPkg = availablePackages.find(p => p.id === selectedPackageId) || availablePackages[0] || {
    id: 1,
    name: 'Premium',
    price: 8599,
    directIncome: 1500,
    binaryIncome: 1000,
    capping: 10000,
    status: 'Active',
    productChoices: [
      'Suit Length & Pant (Navy Blue Colour)',
      'Suit Length & Vanarsi Sadi',
      'Double Set Vanarsi Sadi'
    ]
  };

  const handlePackageSelect = (pkg: MlmPackage) => {
    setSelectedPackageId(pkg.id);
    const isBasic = pkg.name.toLowerCase().includes('basic') || pkg.price === 6699;
    const defaultChoices = isBasic ? [
      { name: 'Suit Length (navy blue Colour - Single Set)', comingSoon: false },
      { name: 'Vanarsi Sadi - Single Set', comingSoon: false },
      { name: 'Healthcare & Wellness Package', comingSoon: true }
    ] : [
      { name: 'Suit Length & Pant (Navy Blue Colour)', comingSoon: false },
      { name: 'Suit Length & Vanarsi Sadi', comingSoon: false },
      { name: 'Double Set Vanarsi Sadi', comingSoon: false }
    ];

    const productList = pkg.productChoices && pkg.productChoices.length > 0 
      ? pkg.productChoices.map(c => ({
          name: c,
          comingSoon: c.toLowerCase().includes('healthcare') || c.toLowerCase().includes('wellness')
        }))
      : defaultChoices;

    // Automatically select the first valid product of this package
    const firstAvailable = productList.find(p => !p.comingSoon) || productList[0];
    if (firstAvailable) {
      setSelectedPackageItem(firstAvailable.name);
    }
  };
  const [password, setPassword] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>('');
  
  // UI State
  const [showPayment, setShowPayment] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<MlmUser | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { ref: routeRef } = useParams<{ ref?: string }>();

  useEffect(() => {
    // Check for route parameter or query parameters in URL
    const searchParams = new URLSearchParams(location.search);
    const refParam = 
      routeRef || 
      searchParams.get('ref') || 
      searchParams.get('r') || 
      searchParams.get('sponsor') || 
      searchParams.get('code') || 
      searchParams.get('sp') || 
      searchParams.get('referral');

    const posParam = searchParams.get('pos') || searchParams.get('position');
    if (posParam && (posParam.toLowerCase() === 'left' || posParam.toLowerCase() === 'right')) {
      setPosition(posParam.toLowerCase() as 'left' | 'right');
    }

    if (refParam && refParam.trim()) {
      const cleanRef = refParam.trim();
      setSponsorId(cleanRef);
      setIsFromRefLink(true);
      try {
        sessionStorage.setItem('referral_sponsor_id', cleanRef);
        localStorage.setItem('referral_sponsor_id', cleanRef);
      } catch (e) {
        // ignore storage errors
      }
    } else {
      // Check if stored from a previous page visit in this session
      const savedRef = sessionStorage.getItem('referral_sponsor_id') || localStorage.getItem('referral_sponsor_id');
      if (savedRef && savedRef.trim()) {
        setSponsorId(savedRef.trim());
        setIsFromRefLink(true);
      }
    }
  }, [location.search, routeRef]);

  // Lookup sponsor
  const users = getMlmUsers();
  const matchedSponsor = users.find(
    u => u.id.toLowerCase() === sponsorId.trim().toLowerCase() ||
         u.mobile.toLowerCase() === sponsorId.trim().toLowerCase()
  );

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    
    let formattedVal = val;
    if (val.length >= 5) {
      formattedVal = `${val.slice(0, 2)} / ${val.slice(2, 4)} / ${val.slice(4)}`;
    } else if (val.length >= 3) {
      formattedVal = `${val.slice(0, 2)} / ${val.slice(2)}`;
    }
    
    setDob(formattedVal);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
        return;
      }

      // Check file size (minimum 5KB, maximum 10MB)
      if (file.size < 5000) {
        setErrorMsg('The selected image file is too small or blank. Please upload a full screenshot of the payment receipt.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('The selected image is too large (max 10MB). Please select a compressed screenshot.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        // Pre-validate screenshot uniqueness
        const proofCheck = validatePaymentScreenshot(base64Data);
        if (!proofCheck.valid) {
          setErrorMsg(proofCheck.error || 'Duplicate or invalid payment screenshot.');
          setPaymentProofPreview('');
          return;
        }
        setPaymentProofPreview(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!sponsorId.trim()) {
      setErrorMsg('Please enter a valid Referral Code.');
      return;
    }

    if (!password) {
      setErrorMsg('Please create a password for your account.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    if (dob) {
      const parts = dob.split(' / ');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 0-indexed
        const year = parseInt(parts[2], 10);
        
        const birthDate = new Date(year, month, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 18) {
          setErrorMsg('You must be at least 18 years old to register.');
          return;
        }
      } else {
        setErrorMsg('Please enter a valid Date of Birth.');
        return;
      }
    }

    const allUsers = getMlmUsers();

    if (!username.trim()) {
      setErrorMsg('Username is required.');
      return;
    }

    if (username.trim()) {
      const isDuplicateUsername = allUsers.some(u => u.username && u.username.trim().toLowerCase() === username.trim().toLowerCase());
      if (isDuplicateUsername) {
        setErrorMsg('This username is already taken. Please choose a different username.');
        return;
      }
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMsg('Please enter a valid email format (e.g. name@gmail.com).');
        return;
      }

      const isDuplicateEmail = allUsers.some(u => u.email && u.email.trim().toLowerCase() === email.trim().toLowerCase());
      if (isDuplicateEmail) {
        setErrorMsg('This email address is already registered with an existing account. Please provide a unique email address.');
        return;
      }
    }

    if (mobile.trim()) {
      const isDuplicateMobile = allUsers.some(u => u.mobile && u.mobile.trim() === mobile.trim());
      if (isDuplicateMobile) {
        setErrorMsg('This mobile number is already registered with an existing account. Please provide a unique mobile number.');
        return;
      }
    }

    if (!agreedToTerms) {
      setErrorMsg("You must agree to the Terms & Conditions to register.");
      return;
    }

    if (!showPayment) {
      setShowPayment(true);
      setTimeout(() => {
        const paymentElem = document.getElementById('payment-section');
        if (paymentElem) {
          paymentElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    // Validate UTR Number (Check fake formats & duplicate usage)
    const utrCheck = validateUtrNumber(utrNumber);
    if (!utrCheck.valid) {
      setErrorMsg(utrCheck.error || 'Invalid or duplicate Transaction ID / UTR Number.');
      const utrElem = document.getElementById('utrNumber');
      if (utrElem) utrElem.focus();
      return;
    }

    // Validate Payment Screenshot (Check mandatory upload & duplicate usage)
    if (!paymentProofPreview) {
      setErrorMsg('Payment Screenshot is mandatory. Please upload a clear photo/screenshot of your completed payment.');
      return;
    }

    const proofCheck = validatePaymentScreenshot(paymentProofPreview);
    if (!proofCheck.valid) {
      setErrorMsg(proofCheck.error || 'Invalid or duplicate Payment Screenshot.');
      return;
    }

    try {
      const pkgAmount = currentSelectedPkg.price;
      const pkgName = currentSelectedPkg.name;

      const newUser = await addMlmUser({
        name: fullName.trim(),
        username: username.trim() || undefined,
        mobile: mobile.trim(),
        email: email.trim(),
        dob: dob.trim(),
        gender: gender,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        panNumber: panNumber.trim().toUpperCase(),
        package: pkgName,
        selectedProduct: selectedPackageItem,
        sponsorId: sponsorId.trim(),
        position: position === 'left' ? 'Left' : 'Right',
        password: password,
        utrNumber: utrNumber.trim(),
        paymentProof: paymentProofPreview,
        paymentAmount: pkgAmount,
        status: 'Inactive'
      });

      setRegisteredUser(newUser);
      createActiveUserSession(newUser.id);
      setCurrentUserId(newUser.id);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your referral code and try again.');
    }
  };

  if (isSubmitted && registeredUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#071E2C] py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-xl border-[#28485A]/50 bg-[#132C3C] shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-8 px-6 text-center">
            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-4 text-amber-400">
              <CheckCircle className="h-9 w-9 text-amber-400" />
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-1">Registration Request Submitted!</h2>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Your details and payment have reached Admin for verification. Admin will check your payment & UTR, then approve your ID.
            </p>

            {/* Registration Summary Card */}
            <div className="w-full bg-[#071E2C] border border-[#28485A]/40 rounded-xl p-5 mb-6 text-left space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-[#28485A]/30">
                <span className="text-xs text-gray-300">Generated Login ID</span>
                <span className="text-base font-mono font-semibold text-[#35B779]">{registeredUser.id}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#28485A]/30">
                <span className="text-xs text-gray-300">Account Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-900/30 text-amber-300 border border-amber-500/40">
                  Pending Admin Approval
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-300 block">Name:</span>
                  <span className="text-white font-medium">{registeredUser.name}</span>
                </div>
                <div>
                  <span className="text-gray-300 block">Mobile:</span>
                  <span className="text-white font-medium">{registeredUser.mobile}</span>
                </div>
                <div>
                  <span className="text-gray-300 block">Package:</span>
                  <span className="text-white font-medium">
                    {registeredUser.package} (₹{new Intl.NumberFormat('en-IN').format(registeredUser.paymentAmount || (registeredUser.package?.includes('Basic') ? 6699 : 6699))})
                  </span>
                </div>
                <div>
                  <span className="text-gray-300 block">Selected Product:</span>
                  <span className="text-white font-medium">{registeredUser.selectedProduct}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-300 block">Delivery Address:</span>
                  <span className="text-white font-medium">
                    {registeredUser.address}, {registeredUser.city}, {registeredUser.state} - {registeredUser.pincode}
                  </span>
                </div>
                <div>
                  <span className="text-gray-300 block">UTR Number:</span>
                  <span className="text-white font-mono">{registeredUser.utrNumber}</span>
                </div>
                <div>
                  <span className="text-gray-300 block">Referral Code:</span>
                  <span className="text-white font-mono">{registeredUser.sponsorId}</span>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/user/dashboard')} 
                className="flex-1 h-11 text-sm font-medium bg-[#6F9DB5] hover:bg-emerald-700 text-white rounded-xl"
              >
                Go to User Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/login')} 
                className="flex-1 h-11 text-sm font-medium bg-[#1B3343] hover:bg-[#28485A] text-white rounded-xl"
              >
                Go to Account Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#071E2C] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-xl border-[#28485A]/50 bg-[#132C3C]">
        <CardHeader className="space-y-1 flex flex-col items-center pb-4">
          <div className="w-12 h-12 bg-[#1B3343]/50 rounded-full flex items-center justify-center mb-2">
            <Network className="h-6 w-6 text-[#8FA3AF]" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center text-gray-300 text-sm">
            Join Future Grow and start building your team
          </CardDescription>

          {/* Auto Filled Referral Sponsor Banner */}
          <div className="w-full mt-3 bg-[#071E2C] border border-emerald-500/50 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>⚡ Auto Filled from Referral Link</span>
                </div>
                <div className="text-sm text-white font-medium mt-0.5">
                  <span className="text-gray-400 font-normal">Sponsor: </span>
                  <span className="text-white font-semibold">{matchedSponsor ? `${matchedSponsor.name} (${matchedSponsor.id})` : (sponsorId || 'Company Root (FGPL000001)')}</span>
                </div>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Verified
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Referral Details */}
            <div className="bg-[#071E2C] p-4 rounded-xl border border-[#28485A]/50 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#35B779]" />
                  Referral Details
                </h4>
                {isFromRefLink && (
                  <span className="text-xs bg-emerald-900/60 border border-[#6F9DB5]/40 text-emerald-300 px-2.5 py-0.5 rounded-full font-medium">
                    ⚡ Auto-Filled from Referral Link
                  </span>
                )}
              </div>

              {matchedSponsor ? (
                <div className="bg-emerald-950/30 border border-[#6F9DB5]/40 rounded-lg p-3 flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#35B779] shrink-0" />
                    <div>
                      <p className="font-medium text-white">Sponsor: {matchedSponsor.name}</p>
                      <p className="text-[#35B779]">ID: {matchedSponsor.id} • Package: {matchedSponsor.package || 'Premium'}</p>
                    </div>
                  </div>
                  <span className="bg-[#6F9DB5]/20 text-emerald-300 px-2 py-1 rounded text-[11px] font-semibold">Verified</span>
                </div>
              ) : sponsorId ? (
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-300 flex items-center gap-2">
                  <span>Referral Code Entered: <strong className="text-white font-mono">{sponsorId}</strong></span>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-gray-200" htmlFor="sponsorId">
                    Referral Code <span className="text-red-400">*</span>
                  </label>
                  <Input 
                    id="sponsorId" 
                    value={sponsorId} 
                    onChange={(e) => setSponsorId(e.target.value)} 
                    placeholder="Enter Referral Code" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-gray-200" htmlFor="position">
                    Position <span className="text-red-400">*</span>
                  </label>
                  <select 
                    id="position" 
                    value={position}
                    onChange={(e) => setPosition(e.target.value as 'left' | 'right')}
                    className="flex h-10 w-full rounded-md border border-[#28485A]/50 bg-[#132C3C] px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3343] focus-visible:ring-offset-2"
                    required
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Details */}
              <div className="space-y-2 md:col-span-2 border-b border-[#28485A]/30 pb-2 mt-2">
                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#35B779]" />
                  Personal Details
                </h4>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="fullName">
                  Full Name (As per ID Proof) <span className="text-red-400">*</span>
                </label>
                <Input 
                  id="fullName" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Umesh Yadav" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="username">
                  Username <span className="text-red-400">*</span>
                </label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="e.g. umesh123" 
                  required
                />
                <p className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                  <span>★</span> Compulsory & Important: Used for direct login and unique account identification.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="mobile">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <Input 
                  id="mobile" 
                  type="tel" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 9876543210" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="dob">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <Input id="dob" type="text" value={dob} onChange={handleDobChange} placeholder="DD / MM / YYYY" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="gender">
                  Gender <span className="text-red-400">*</span>
                </label>
                <select 
                  id="gender" 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-[#28485A]/50 bg-[#132C3C] px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3343] focus-visible:ring-offset-2"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="email">
                  Email Address <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email (optional, e.g. user@gmail.com)" 
                />
              </div>

              {/* Delivery Address Section */}
              <div className="space-y-2 md:col-span-2 border-b border-[#28485A]/30 pb-2 mt-4">
                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#35B779]" />
                  Product Delivery Address
                </h4>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="address">
                  Street Address <span className="text-red-400">*</span>
                </label>
                <Input 
                  id="address" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House No, Street, Landmark" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="city">
                  City / District <span className="text-red-400">*</span>
                </label>
                <Input 
                  id="city" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City Name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="state">
                  State <span className="text-red-400">*</span>
                </label>
                <Input 
                  id="state" 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State Name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="pincode">
                  PIN Code <span className="text-red-400">*</span>
                </label>
                <Input 
                  id="pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="6 Digits PIN Code" 
                  maxLength={6} 
                  required 
                />
              </div>
              
              {/* KYC Details Section */}
              <div className="space-y-2 border-b border-[#28485A]/30 pb-2 mt-4 md:col-span-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-white">PAN / KYC Details (Optional during Signup)</h4>
                  <span className="text-xs bg-emerald-950/60 text-[#35B779] border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">Optional</span>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="panNumber">
                  PAN Card Number <span className="text-xs text-gray-300 font-normal">(Optional)</span>
                </label>
                <Input 
                  id="panNumber" 
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCDE1234F (Optional - can add during KYC)" 
                  className="uppercase" 
                />
                <p className="text-xs text-[#35B779]/90 mt-1">
                  💡 Note: If you don't have your PAN Card handy, you can skip this now and submit it later in the KYC section before requesting withdrawals.
                </p>
              </div>

              {/* Password Section */}
              <div className="space-y-2 md:col-span-2 border-b border-[#28485A]/30 pb-2 mt-4">
                <h4 className="text-sm font-medium text-white">Security & Password</h4>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none text-gray-200" htmlFor="password">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-[#8FA3AF] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {showPassword ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Show</>}
                  </button>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password" 
                    className="pr-10"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none text-gray-200" htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-xs text-[#8FA3AF] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {showConfirmPassword ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Show</>}
                  </button>
                </div>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password" 
                    className="pr-10"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Select Payment Method Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowPayment(!showPayment)}
                className="w-full flex items-center justify-between p-4 bg-[#1B3343] hover:bg-[#28485A] text-white rounded-lg transition-colors font-medium"
              >
                <span className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5" />
                  <span>{showPayment ? 'Hide Payment Details' : 'Proceed to Payment & Select Package'}</span>
                </span>
                {showPayment ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>

            {/* Payment Section */}
            {showPayment && (
              <div id="payment-section" className="mt-6 border-t border-[#28485A]/30 pt-6 space-y-6">
                {/* Package Selection */}
                <div className="mb-6 rounded-md bg-[#132C3C] p-4 border border-[#28485A]/30">
                  <h5 className="font-medium text-white border-b border-[#28485A]/30 pb-2 mb-3">Select Package</h5>
                  <div className="space-y-4">
                    
                    {availablePackages.filter(pkg => pkg.status === 'Active').map(pkg => {
                      const isSelected = currentSelectedPkg.id === pkg.id;
                      const isBasicType = pkg.name.toLowerCase().includes('basic') || pkg.price === 6699;

                      const defaultChoices = isBasicType ? [
                        { name: 'Suit Length (navy blue Colour - Single Set)', comingSoon: false },
                        { name: 'Pant (navy blue Colour - Single Set)', comingSoon: false },
                        { name: 'Healthcare & Wellness Package', comingSoon: true }
                      ] : [
                        { name: 'Suit Length & Pant (Green Colour)', comingSoon: false },
                        { name: 'Suit Length & Pant (Navy Blue Colour)', comingSoon: false },
                      ];

                      const productList = pkg.productChoices && pkg.productChoices.length > 0 
                        ? pkg.productChoices.map(c => ({
                            name: c,
                            comingSoon: c.toLowerCase().includes('healthcare') || c.toLowerCase().includes('wellness')
                          }))
                        : defaultChoices;

                      return (
                        <div 
                          key={pkg.id}
                          className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-[#35B779] bg-gradient-to-br from-[#132C3C] via-[#0E2838] to-[#0A261E] shadow-[0_0_16px_rgba(53,183,121,0.2)] ring-1 ring-[#35B779]' 
                              : 'border-[#28485A]/60 bg-[#071E2C] hover:border-[#6F9DB5]/60 hover:bg-[#1B3343]/30'
                          }`}
                          onClick={() => handlePackageSelect(pkg)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                            <div className="flex items-start sm:items-center gap-2.5">
                              <input 
                                type="radio" 
                                name="package-selection" 
                                value={pkg.id}
                                checked={isSelected}
                                onChange={() => handlePackageSelect(pkg)}
                                className="w-4 h-4 text-[#35B779] focus:ring-[#35B779] bg-transparent border-[#28485A] mt-0.5 sm:mt-0 cursor-pointer"
                              />
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-white text-sm sm:text-base">{pkg.name} Package</span>
                                  <span className="text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded uppercase tracking-wider">
                                    Lifetime
                                  </span>
                                  {isSelected && (
                                    <span className="text-[9px] font-bold bg-[#35B779] text-gray-950 px-1.5 py-0.2 rounded uppercase tracking-wider">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                  <span className="text-[10px] font-medium text-purple-300 bg-purple-950/70 border border-purple-500/40 px-2 py-0.5 rounded shadow-sm">
                                    Daily capping: ₹{pkg.capping.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[10px] font-medium text-[#35B779] bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded shadow-sm">
                                    Matching: ₹{pkg.binaryIncome.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[10px] font-medium text-sky-300 bg-sky-950/70 border border-sky-500/40 px-2 py-0.5 rounded shadow-sm">
                                    Direct: ₹{pkg.directIncome.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex sm:flex-col items-baseline sm:items-end justify-between border-t sm:border-t-0 border-[#28485A]/30 pt-1.5 sm:pt-0">
                              <span className="text-[9px] text-gray-400 uppercase font-medium sm:block">Package Price</span>
                              <span className="font-bold text-lg sm:text-xl text-[#35B779] tracking-tight">
                                ₹{pkg.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="pt-2.5 border-t border-[#28485A]/50 mt-2.5">
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-[11px] text-gray-300 font-medium">Select Product from this package:</p>
                                <span className="text-[10px] text-[#35B779] font-medium bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                                  Selected: {selectedPackageItem}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {productList.map(item => {
                                  const isNavyBlue = item.name.toLowerCase().includes('navy blue') || item.name.toLowerCase().includes('blue');
                                  const isGreen = item.name.toLowerCase().includes('green');

                                  return (
                                    <label 
                                      key={item.name} 
                                      className={`flex items-center justify-between text-xs p-2 sm:p-2.5 rounded-lg border transition-all ${
                                        item.comingSoon 
                                          ? 'opacity-60 bg-[#071E2C]/60 border-[#28485A]/30 cursor-not-allowed'
                                          : selectedPackageItem === item.name 
                                            ? 'border-[#35B779] bg-[#1B3343] text-white cursor-pointer shadow-[0_0_10px_rgba(53,183,121,0.2)] ring-1 ring-[#35B779]' 
                                            : 'border-[#28485A]/50 bg-[#071E2C] text-white cursor-pointer hover:bg-[#1B3343]/50 hover:border-[#6F9DB5]/60'
                                      }`}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <input 
                                          type="radio" 
                                          name={`package-item-${pkg.id}`} 
                                          value={item.name}
                                          disabled={item.comingSoon}
                                          checked={selectedPackageItem === item.name}
                                          onChange={() => !item.comingSoon && setSelectedPackageItem(item.name)}
                                          className="text-[#35B779] focus:ring-[#35B779] disabled:opacity-40 w-3.5 h-3.5"
                                        />
                                        <div className="flex items-center gap-1.5">
                                          {isNavyBlue && (
                                            <span className="w-3 h-3 rounded-full bg-[#0A2540] border-2 border-blue-400 shadow-sm shrink-0" title="Navy Blue Colour" />
                                          )}
                                          {isGreen && (
                                            <span className="w-3 h-3 rounded-full bg-[#059669] border-2 border-emerald-300 shadow-sm shrink-0" title="Green Colour" />
                                          )}
                                          <span className="text-[11px] font-medium leading-tight">{item.name}</span>
                                        </div>
                                      </div>
                                      {item.comingSoon ? (
                                        <span className="text-[8px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1 py-0.2 rounded uppercase tracking-wider shrink-0 ml-1">
                                          Coming Soon
                                        </span>
                                      ) : selectedPackageItem === item.name ? (
                                        <span className="text-[9px] font-bold text-[#35B779] shrink-0 ml-1">
                                          ✓ Selected
                                        </span>
                                      ) : null}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 rounded-md bg-[#132C3C] p-4 border border-[#28485A]/30">
                  <h5 className="font-medium text-white border-b border-[#28485A]/30 pb-2 mb-3">Activation Summary ({currentSelectedPkg.name})</h5>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      const breakdown = getPackagePriceBreakdown(currentSelectedPkg.price);
                      return (
                        <>
                          <div className="flex justify-between items-center text-white">
                            <span>Package Price (Base):</span>
                            <span>₹{breakdown.baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between items-center text-white">
                            <span>GST:</span>
                            <span>₹{breakdown.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between items-center font-medium text-white pt-2 border-t border-[#28485A]/30 mt-2">
                            <span>Total Amount to Pay:</span>
                            <span className="text-lg text-[#35B779] font-semibold">₹{breakdown.totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4 rounded-md bg-[#132C3C] p-4 border border-[#28485A]/30">
                    <h5 className="font-medium text-white border-b border-[#28485A]/30 pb-2">Bank Details</h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Bank Name:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">Baroda UP Gramin Bank</span>
                          <button 
                            type="button" 
                            onClick={() => handleCopy('Baroda UP Gramin Bank', 'bankName')}
                            className="text-[#8FA3AF] hover:text-white transition-colors"
                          >
                            {copiedField === 'bankName' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Account Holder:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">Rinki Yadav</span>
                          <button 
                            type="button" 
                            onClick={() => handleCopy('Rinki Yadav', 'holder')}
                            className="text-[#8FA3AF] hover:text-white transition-colors"
                          >
                            {copiedField === 'holder' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Account No:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">801702000000013</span>
                          <button 
                            type="button" 
                            onClick={() => handleCopy('801702000000013', 'account')}
                            className="text-[#8FA3AF] hover:text-white transition-colors"
                          >
                            {copiedField === 'account' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">IFSC Code:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">BARB0BUPGBX</span>
                          <button 
                            type="button" 
                            onClick={() => handleCopy('BARB0BUPGBX', 'ifsc')}
                            className="text-[#8FA3AF] hover:text-white transition-colors"
                          >
                            {copiedField === 'ifsc' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <h5 className="font-medium text-white border-b border-[#28485A]/30 pb-2 mt-4 pt-2">UPI Details</h5>
                    <div className="flex justify-between items-center text-sm pt-2">
                      <span className="text-gray-300">UPI ID:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">reyanshiyadav0-1@oksbi</span>
                        <button 
                          type="button" 
                          onClick={() => handleCopy('reyanshiyadav0-1@oksbi', 'upi')}
                          className="text-[#8FA3AF] hover:text-white transition-colors"
                        >
                          {copiedField === 'upi' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-4 rounded-md bg-[#132C3C] p-4 border border-[#28485A]/30">
                    <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-white p-2">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=reyanshiyadav0-1@oksbi&pn=Rinki%20Yadav" 
                        alt="UPI QR Code" 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium text-white">Scan to Pay via UPI</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium leading-none text-gray-200" htmlFor="utrNumber">
                        Transaction ID / UTR Number (12-Digit Ref) <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[11px] text-[#35B779] font-medium">Real banking verification</span>
                    </div>
                    <Input 
                      id="utrNumber" 
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="Enter 12-digit UPI UTR or Bank Ref (e.g. 423891048291)" 
                      className="font-mono text-sm tracking-wide"
                      required={showPayment} 
                    />
                    <p className="text-[11px] text-gray-300">
                      Please enter the genuine UTR / Transaction ID from your payment app (Google Pay, PhonePe, Paytm, Bank). Duplicate or fake numbers will be automatically rejected.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium leading-none text-gray-200" htmlFor="paymentProof">
                        Payment Screenshot / Receipt <span className="text-red-400">* (Mandatory)</span>
                      </label>
                      <span className="text-[11px] text-gray-300">JPG, PNG or WEBP</span>
                    </div>

                    {paymentProofPreview ? (
                      <div className="relative rounded-xl border border-[#6F9DB5]/50 bg-[#071E2C] p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={paymentProofPreview} 
                            alt="Payment Receipt Preview" 
                            className="w-14 h-14 object-cover rounded-lg border border-[#28485A]/40" 
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#35B779] flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Payment Receipt Attached
                            </p>
                            <p className="text-[11px] text-gray-300">Verified image file ready for submission</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPaymentProofPreview('')}
                          className="px-3 py-1.5 bg-red-900/40 hover:bg-red-800/60 text-red-300 text-xs font-medium rounded-lg border border-red-500/30 transition-colors"
                        >
                          Remove / Change
                        </button>
                      </div>
                    ) : (
                      <div className="flex w-full items-center justify-center">
                        <label htmlFor="paymentProof" className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#28485A]/50 bg-[#132C3C] hover:bg-[#1B3343]/30 transition-colors">
                          <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            <Upload className="mb-3 h-8 w-8 text-[#8FA3AF]" />
                            <p className="mb-1 text-sm text-gray-300">
                              <span className="font-medium text-white">Click to upload payment screenshot</span> or drag and drop
                            </p>
                            <p className="text-xs text-amber-400 font-medium">Screenshot upload is required for verification</p>
                          </div>
                          <input 
                            id="paymentProof" 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 mt-4 pt-4 border-t border-[#28485A]/30">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#28485A]/70 text-blue-500 focus:ring-blue-600 cursor-pointer" 
              />
              <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer select-none leading-relaxed">
                I agree to the{' '}
                <span 
                  onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} 
                  className="text-blue-400 font-medium hover:text-blue-300 hover:underline cursor-pointer transition-colors"
                >
                  <FileText className="inline-block w-4 h-4 mr-1 mb-0.5" />
                  Terms & Conditions, Privacy Policy, and Refund Policy
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full mt-6 bg-[#6F9DB5] hover:bg-emerald-700 text-white font-semibold whitespace-normal h-auto py-3 text-sm">
              {showPayment ? 'Submit Payment & Register Account' : 'Proceed to Payment & Complete Registration'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col border-t border-[#28485A]/30 pt-5 pb-6">
          <p className="text-center text-sm text-white">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Account Login
            </Link>
          </p>

          <div className="w-full mt-4 pt-4 border-t border-[#28485A]/40 text-center space-y-2.5">
            <p className="text-xs text-gray-300 font-medium">
              Want to explore the full website and business plan without creating an account?
            </p>
            <Link
              to="/"
              className="w-full py-2.5 px-4 rounded-xl bg-[#081F2D] hover:bg-[#0E2F44] border border-[#28485A] hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Explore Full Website (Read as Guest)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B202D] border border-[#28485A] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-[#28485A]/50">
              <h2 className="text-xl font-bold text-white">Future Grow — Legal Guidelines, Policies & Terms</h2>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar text-sm text-gray-300 space-y-5 flex-1">
              <p className="text-sm">If <strong>Future Grow</strong> operates as a <strong>Suiting & Shirting product-based Direct Selling/MLM company</strong>, the following 10 policy points apply as our general framework:</p>
              
              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">1. 18+ Eligibility</h3>
                <p>A person must be <strong>at least 18 years old</strong> to become a Distributor. Valid PAN, bank account, and required KYC documents in the applicant’s own name may be required.</p>
              </div>

              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">2. Product-Based Business</h3>
                <p>The business must be based on the sale of genuine <strong>Suiting & Shirting and other company-approved products</strong>. Income should not be represented as being earned merely by joining the company or depositing money.</p>
              </div>

              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">3. No Guaranteed Income</h3>
                <p>Future Grow does not guarantee any fixed monthly income, guaranteed profit, or fixed return. Distributor earnings depend on eligible product sales, performance, and the applicable compensation plan.</p>
              </div>

              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">4. No Misleading Promotion</h3>
                <p>Distributors must not make false, misleading, exaggerated, or unsupported claims about the company, products, business opportunity, or potential earnings.</p>
              </div>

              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">5. Independent Distributor Status</h3>
                <p>A Distributor is an <strong>Independent Distributor/Business Associate</strong> and is not an employee, partner, or agent of Future Grow unless separately agreed in writing.</p>
              </div>

              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">6. Payment & Payout Policy</h3>
                <p>Direct, Matching, and other incentives will be calculated according to the company’s applicable compensation plan and eligible product sales. Applicable taxes and lawful deductions will be handled according to the company policy and applicable law.</p>
              </div>

              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">7. KYC & Account Security</h3>
                <p>All PAN, bank account, identity, and other KYC information must be genuine and belong to the Distributor. The company may maintain a <strong>one-ID-per-PAN</strong> policy, subject to its applicable rules.</p>
              </div>

              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">8. Prohibited Activities</h3>
                <p className="mb-1">The following activities are prohibited:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Fake or fraudulent documents</li>
                  <li>False income claims</li>
                  <li>Fraudulent transactions</li>
                  <li>Unauthorized collection of money</li>
                  <li>Cross-sponsoring</li>
                  <li>Improper solicitation of another Distributor’s customers or team members</li>
                  <li>Activities that unlawfully damage the company’s reputation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">9. Refund, Return & Consumer Rights</h3>
                <p>Product returns, refunds, replacements, and customer complaints will be handled according to the company’s <strong>Refund/Return Policy</strong> and applicable Indian laws. Nothing in the company’s policy should remove or restrict a consumer’s statutory rights.</p>
              </div>

              <div>
                <h3 className="text-[#6F9DB5] font-semibold text-base mb-1">10. Suspension, Termination & Amendments</h3>
                <p className="mb-2">If a Distributor violates the Terms & Conditions, commits fraud, or engages in serious misconduct, Future Grow may suspend or terminate the Distributor ID in accordance with its policies and applicable law.</p>
                <p>Future Grow may update its <strong>Terms & Conditions, Products, Policies, or Compensation Plan</strong> from time to time. Updated policies should be published through the company’s official website/platform.</p>
              </div>
            </div>

            <div className="p-4 border-t border-[#28485A]/50 flex justify-end gap-3 bg-[#071E2C] rounded-b-2xl">
              <Button 
                onClick={() => setShowTermsModal(false)}
                variant="outline"
                className="border-[#28485A] text-white hover:bg-[#132C3C]"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setAgreedToTerms(true);
                  setShowTermsModal(false);
                }}
                className="bg-[#35B779] hover:bg-emerald-600 text-white"
              >
                I Agree
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
