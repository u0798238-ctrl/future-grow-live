import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Save, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Copy, 
  Check, 
  Key, 
  MapPin, 
  Calendar, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Trash2
} from 'lucide-react';
import { getCurrentUser, getCurrentUserId, updateMlmUser, MlmUser } from '@/lib/mlmStore';
import { copyTextToClipboard } from '@/lib/utils';

export function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<MlmUser>(getCurrentUser());
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser.name || '',
    username: currentUser.username || '',
    email: currentUser.email || '',
    phone: currentUser.mobile || '',
    dob: currentUser.dob || '',
    gender: currentUser.gender || 'male',
    address: currentUser.address || '',
    city: currentUser.city || '',
    state: currentUser.state || '',
    pincode: currentUser.pincode || '',
    panNumber: currentUser.panNumber || '',
    currentPassword: currentUser.password || '123456',
    password: '',
    confirmPassword: ''
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string>(currentUser.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadUserData = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setAvatarPreview(user.avatar || '');
    setFormData(prev => ({
      ...prev,
      fullName: user.name || '',
      username: user.username || '',
      phone: user.mobile || '',
      email: user.email || '',
      dob: user.dob || '',
      gender: user.gender || 'male',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || '',
      panNumber: user.panNumber || '',
      currentPassword: user.password || '123456'
    }));
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener('mlm_update', loadUserData);
    window.addEventListener('current_user_change', loadUserData);
    return () => {
      window.removeEventListener('mlm_update', loadUserData);
      window.removeEventListener('current_user_change', loadUserData);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (statusMessage) setStatusMessage(null);
  };

  const handleCopyUsername = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.username) return;
    const ok = await copyTextToClipboard(formData.username);
    if (ok) {
      setCopiedUsername(true);
      setTimeout(() => setCopiedUsername(false), 2000);
    }
  };

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    const ok = await copyTextToClipboard(formData.email);
    if (ok) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatusMessage({ type: 'error', text: 'Image size should be less than 5MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        const currentId = getCurrentUserId();
        updateMlmUser(currentId, { avatar: result });
        setStatusMessage({ type: 'success', text: 'Profile photo updated successfully!' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarPreview('');
    const currentId = getCurrentUserId();
    updateMlmUser(currentId, { avatar: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setStatusMessage({ type: 'success', text: 'Profile photo removed.' });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(formData.currentPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (formData.password && formData.password.length < 4) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 4 characters long.' });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirm password do not match!' });
      return;
    }

    setIsSaving(true);
    
    const currentId = getCurrentUserId();
    const updates: Partial<MlmUser> = {
      name: formData.fullName.trim(),
      username: formData.username.trim() || undefined,
      avatar: avatarPreview,
      mobile: formData.phone.trim(),
      email: formData.email.trim(),
      dob: formData.dob.trim(),
      gender: formData.gender,
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      panNumber: formData.panNumber.trim().toUpperCase()
    };

    if (formData.password.trim()) {
      updates.password = formData.password.trim();
      localStorage.setItem(`user_password_${currentId}`, formData.password.trim());
    }

    updateMlmUser(currentId, updates);

    // Also update KYC name if saved for this user
    const savedKycStr = localStorage.getItem(`kyc_data_${currentId}`);
    const savedKyc = currentUser?.kycDetails || (savedKycStr ? JSON.parse(savedKycStr) : null);
    if (savedKyc) {
      try {
        const parsed = savedKyc;
        if (parsed.formData) {
          parsed.formData.accountName = formData.fullName.trim();
          parsed.formData.upiName = formData.fullName.trim();
          parsed.formData.panNumber = formData.panNumber.trim().toUpperCase();
          localStorage.setItem(`kyc_data_${currentId}`, JSON.stringify(parsed));
          updateMlmUser(currentId, { kycDetails: parsed });
        }
      } catch (e) {
        // ignore
      }
    }

    setTimeout(() => {
      setIsSaving(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: formData.password.trim() ? formData.password.trim() : prev.currentPassword,
        password: '',
        confirmPassword: ''
      }));
      setStatusMessage({ type: 'success', text: 'Profile information saved successfully!' });
      
      setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Profile</h1>
          <p className="text-gray-300">Manage your personal information, address, and account security for {currentUser.id}</p>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-900/30 border-[#6F9DB5]/50 text-emerald-300' 
            : 'bg-red-900/30 border-red-500/50 text-red-300'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#35B779] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{statusMessage.text}</span>
        </div>
      )}

      <Card className="bg-[#132C3C] border-2 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
        <CardHeader className="border-b border-[#28485A]/30 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-white text-xl">Personal Information & Settings</CardTitle>
              <CardDescription className="text-gray-300">
                User ID: <span className="font-semibold text-white font-mono">{currentUser.id}</span>
                {currentUser.username && <span className="text-[#35B779] font-medium ml-1">(@{currentUser.username})</span>} • Status: <span className="text-[#35B779] font-medium">{currentUser.status}</span>
              </CardDescription>
            </div>
            <div className="px-3 py-1 bg-[#1B3343] rounded-lg text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              {currentUser.package} Package
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Profile Photo Uploader Section */}
          <div className="mb-8 p-4 bg-[#071E2C] rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg shadow-emerald-950/50" 
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#1B3343] border-2 border-emerald-500/50 flex flex-col items-center justify-center text-emerald-300 font-bold text-3xl shadow-inner">
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-full shadow-md border-2 border-[#071E2C] transition-all"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="text-base font-semibold text-white">Profile Photo</h3>
              <p className="text-xs text-gray-300">
                Upload your picture to display on your dashboard, profile, and leaderboard ranks. (JPG, PNG, WebP max 5MB)
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/80 text-red-300 border border-red-500/30 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Basic Identity */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#35B779] mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#35B779]" /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="bg-[#071E2C] border-emerald-500/30 focus:border-emerald-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">
                      Username <span className="text-gray-400 text-xs">(Unique Login ID)</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="e.g. umesh123"
                      className="bg-[#071E2C] border-emerald-500/30 focus:border-emerald-500 text-white pr-20"
                    />
                    <button
                      type="button"
                      onClick={handleCopyUsername}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                    >
                      {copiedUsername ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedUsername ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Phone / Mobile Number <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="bg-[#071E2C] border-emerald-500/30 focus:border-emerald-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">
                      Email Address <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="bg-[#071E2C] border-emerald-500/30 focus:border-emerald-500 text-white pr-20"
                    />
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedEmail ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Date of Birth (DOB)
                    </label>
                    <Input
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      placeholder="DD / MM / YYYY"
                      className="bg-[#071E2C] border-[#28485A]/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md bg-[#071E2C] border border-[#28485A]/50 text-white text-sm focus:outline-none focus:border-[#28485A]"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#8FA3AF]" /> PAN Card Number
                  </label>
                  <Input
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="e.g. ABCDE1234F"
                    className="bg-[#071E2C] border-[#28485A]/50 text-white uppercase font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Address & Location */}
            <div className="pt-4 border-t border-[#28485A]/30">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8FA3AF] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white">Full Address</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House / Flat No., Street, Landmark"
                    className="bg-[#071E2C] border-[#28485A]/50 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">City / District</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="bg-[#071E2C] border-[#28485A]/50 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">State</label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="bg-[#071E2C] border-[#28485A]/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Pincode</label>
                    <Input
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      className="bg-[#071E2C] border-[#28485A]/50 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Password & Security */}
            <div className="pt-4 border-t border-[#28485A]/30">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8FA3AF] mb-4 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" /> Account Security & Password
              </h3>
              
              {/* Current Active Password Box */}
              <div className="bg-[#071E2C] border border-[#28485A]/50 rounded-xl p-4 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-[#8FA3AF]">Current Login Password</span>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-xl sm:text-2xl font-mono font-semibold text-white tracking-wider">
                        {showCurrentPassword ? formData.currentPassword : '••••••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#1B3343] hover:bg-[#28485A] text-white flex items-center gap-1.5 transition-colors"
                      >
                        {showCurrentPassword ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> View Password</>}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#1B3343] hover:bg-[#28485A] text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedPassword ? <><Check className="w-3.5 h-3.5 text-[#35B779]" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#8FA3AF]" /> Change To New Password (Optional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">New Password</label>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-xs text-[#8FA3AF] hover:text-white flex items-center gap-1"
                    >
                      {showNewPassword ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Show</>}
                    </button>
                  </div>
                  <Input
                    name="password"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password (optional)"
                    className="bg-[#071E2C] border-[#28485A]/50 text-white font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Confirm New Password</label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-xs text-[#8FA3AF] hover:text-white flex items-center gap-1"
                    >
                      {showConfirmPassword ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Show</>}
                    </button>
                  </div>
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="bg-[#071E2C] border-[#28485A]/50 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#28485A]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                {isSaving ? "Saving Changes..." : <><Save className="h-4 w-4" /> Save Profile & Password</>}
              </Button>
              <p className="text-xs text-gray-300 text-center sm:text-right">
                All changes are saved instantly to your account
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
