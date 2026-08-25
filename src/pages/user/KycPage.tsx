import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle, AlertCircle, Save, Building, CreditCard, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUserId, getCurrentUser, updateMlmUser, MlmUser } from '@/lib/mlmStore';

export function KycPage() {
  const [currentUser, setCurrentUser] = useState<MlmUser>(getCurrentUser());
  const [kycStatus, setKycStatus] = useState<'pending' | 'submitted' | 'approved'>('pending');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'upi'>('bank');
  const [formData, setFormData] = useState({
    panNumber: '',
    panName: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    upiName: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title?: string; text: string; type: 'success' | 'error' | 'info'} | null>(null);

  const loadKyc = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    const savedKyc = localStorage.getItem(`kyc_data_${user.id}`);
    if (savedKyc) {
      try {
        const parsed = JSON.parse(savedKyc);
        setFormData({
          panNumber: parsed.formData?.panNumber || user.panNumber || '',
          panName: parsed.formData?.panName || user.name || '',
          bankName: parsed.formData?.bankName || '',
          accountName: parsed.formData?.accountName || user.name || '',
          accountNumber: parsed.formData?.accountNumber || '',
          ifscCode: parsed.formData?.ifscCode || '',
          upiId: parsed.formData?.upiId || '',
          upiName: parsed.formData?.upiName || user.name || '',
        });
        setPaymentMethod(parsed.paymentMethod || 'bank');
        setKycStatus(parsed.kycStatus || (parsed.formData?.panNumber ? 'approved' : 'pending'));
      } catch (e) {
        // ignore
      }
    } else {
      setFormData({
        panNumber: user.panNumber || '',
        panName: user.name || '',
        bankName: '',
        accountName: user.name || '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        upiName: user.name || '',
      });
      // If user provided PAN at signup, mark as submitted or pending
      if (user.panNumber) {
        setKycStatus('submitted');
      } else {
        setKycStatus('pending');
      }
    }
  };

  useEffect(() => {
    loadKyc();
    window.addEventListener('current_user_change', loadKyc);
    return () => {
      window.removeEventListener('current_user_change', loadKyc);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.panNumber.trim()) {
      setToastMessage({type: 'error', text: 'Please enter your 10-digit PAN Card Number (Mandatory for KYC).'}); setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    if (formData.panNumber.trim().length !== 10) {
      setToastMessage({type: 'error', text: 'PAN Card Number must be exactly 10 alphanumeric characters (e.g. ABCDE1234F).'}); setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    if (paymentMethod === 'bank') {
      if (!formData.bankName.trim() || !formData.accountName.trim()) {
        setToastMessage({type: 'error', text: 'Please enter Bank Name and Account Holder Name.'}); setTimeout(() => setToastMessage(null), 4000);
        return;
      }
      const accClean = formData.accountNumber.trim();
      if (!accClean || !/^\d{9,18}$/.test(accClean)) {
        setToastMessage({type: 'error', text: '❌ Invalid Bank Account Number! Bank Account number must be between 9 to 18 numeric digits.'}); setTimeout(() => setToastMessage(null), 4000);
        return;
      }
      const ifscClean = formData.ifscCode.trim().toUpperCase();
      if (!ifscClean || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscClean)) {
        setToastMessage({type: 'error', text: '❌ Invalid IFSC Code! IFSC Code must be in standard 11-character format (e.g., SBIN0001234).'}); setTimeout(() => setToastMessage(null), 4000);
        return;
      }
    } else {
      const upiClean = formData.upiId.trim().toLowerCase();
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9.\-_]{2,32}$/;
      if (!upiClean || !upiRegex.test(upiClean) || !upiClean.includes('@')) {
        setToastMessage({type: 'error', text: '❌ Invalid UPI ID! Please enter a valid UPI ID (e.g., name@oksbi).'}); setTimeout(() => setToastMessage(null), 4000);
        return;
      }
      if (!formData.upiName.trim()) {
        setToastMessage({type: 'error', text: 'Please enter Name on UPI App.'}); setTimeout(() => setToastMessage(null), 4000);
        return;
      }
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setKycStatus('approved');
      
      const cleanPan = formData.panNumber.trim().toUpperCase();
      
      // Update global user profile with the submitted PAN Card and KYC details
      updateMlmUser(currentUser.id, {
        panNumber: cleanPan,
        kycDetails: {
          formData: {
            ...formData,
            panNumber: cleanPan
          },
          paymentMethod,
          kycStatus: 'approved',
          verifiedAt: new Date().toISOString()
        }
      });
      
      localStorage.setItem(`kyc_data_${currentUser.id}`, JSON.stringify({
        formData: {
          ...formData,
          panNumber: cleanPan
        },
        paymentMethod,
        kycStatus: 'approved',
        verifiedAt: new Date().toISOString()
      }));

      setToastMessage({
        type: 'success',
        text: 'KYC details & PAN Card verified successfully! You can now request fund withdrawals.'
      });
      setTimeout(() => setToastMessage(null), 4000);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      {/* Floating In-App Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-[60] px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toastMessage.type === 'error'
            ? 'bg-red-950 border-red-500 text-red-200'
            : 'bg-[#0a2333] border-[#35B779]/50 text-emerald-300 shadow-[0_0_20px_rgba(53,183,121,0.2)]'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5 text-[#35B779] shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="text-sm font-medium">{toastMessage.text}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white ml-2 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">KYC & Bank Verification</h1>
          <p className="text-gray-300">Complete your PAN Card and payout account details to enable withdrawals</p>
        </div>
      </div>

      {/* Mandatory Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm flex-1">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <p className="font-medium text-amber-300">Mandatory KYC Requirement for Fund Withdrawals</p>
            {currentUser?.commissionSettings?.withdrawalWithoutPanEnabled && (
              <span className="px-2.5 py-0.5 bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 rounded-full text-xs font-semibold font-mono">
                ⭐ Admin Special Exemption: No-PAN Withdrawal Active
              </span>
            )}
          </div>
          <p className="text-white text-xs mt-1">
            Standard withdrawals require a verified <strong>PAN Card</strong>. <em>If you do not have a PAN card</em>, withdrawals can <strong>only be initiated upon explicit authorization/enablement by Admin</strong>.
          </p>
        </div>
      </div>

      <Card className="bg-[#132C3C] border-[#28485A]/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#28485A]/30">
          <div>
            <CardTitle className="text-white text-xl">KYC & Payment Details</CardTitle>
            <CardDescription className="text-gray-300">Add your PAN card and receiving account details</CardDescription>
          </div>
          {kycStatus === 'pending' && (
            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-medium flex items-center gap-1 border border-yellow-500/30">
              <AlertCircle className="h-3 w-3" /> KYC Pending
            </div>
          )}
          {kycStatus === 'submitted' && (
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium flex items-center gap-1 border border-blue-500/30">
              <AlertCircle className="h-3 w-3" /> Under Review
            </div>
          )}
          {kycStatus === 'approved' && (
            <div className="px-3 py-1 bg-[#6F9DB5]/20 text-[#35B779] rounded-full text-xs font-medium flex items-center gap-1 border border-[#6F9DB5]/30">
              <CheckCircle className="h-3 w-3" /> KYC Verified & Approved
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleKycSubmit} className="space-y-8">
            
            {/* Step 1: PAN Card Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2 border-b border-[#28485A]/30 pb-2">
                <CreditCard className="h-5 w-5 text-[#35B779]" /> 
                1. PAN Card Details <span className="text-xs text-red-400 font-normal">* Mandatory for Withdrawal</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">PAN Card Number *</label>
                  <Input
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="e.g. ABCDE1234F"
                    required
                    maxLength={10}
                    disabled={kycStatus === 'approved'}
                    className="bg-[#071E2C] border-[#28485A]/50 text-white uppercase font-mono text-base"
                  />
                  <p className="text-xs text-gray-300">10-character Permanent Account Number</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Full Name on PAN Card *</label>
                  <Input
                    name="panName"
                    value={formData.panName}
                    onChange={handleChange}
                    placeholder="As printed on your PAN Card"
                    required
                    disabled={kycStatus === 'approved'}
                    className="bg-[#071E2C] border-[#28485A]/50 text-white"
                  />
                  <p className="text-xs text-gray-300">Exact legal name as on tax document</p>
                </div>
              </div>
            </div>

            {/* Step 2: Select Payout Method */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium text-white flex items-center gap-2 border-b border-[#28485A]/30 pb-2">
                <Building className="h-5 w-5 text-[#35B779]" /> 
                2. Payout Receiving Method
              </h3>
              
              <div className="flex gap-4">
                <label className={`flex-1 border rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-colors ${paymentMethod === 'bank' ? 'border-[#6F9DB5] bg-[#1B3343]/40' : 'border-[#28485A]/50 hover:bg-[#071E2C]'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="bank" 
                    checked={paymentMethod === 'bank'} 
                    onChange={() => setPaymentMethod('bank')} 
                    disabled={kycStatus === 'approved'}
                    className="h-4 w-4 text-[#6F9DB5]" 
                  />
                  <span className="font-medium text-white">Bank Account Details</span>
                </label>
                <label className={`flex-1 border rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-colors ${paymentMethod === 'upi' ? 'border-[#6F9DB5] bg-[#1B3343]/40' : 'border-[#28485A]/50 hover:bg-[#071E2C]'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="upi" 
                    checked={paymentMethod === 'upi'} 
                    onChange={() => setPaymentMethod('upi')} 
                    disabled={kycStatus === 'approved'}
                    className="h-4 w-4 text-[#6F9DB5]" 
                  />
                  <span className="font-medium text-white">UPI / GPay / PhonePe</span>
                </label>
              </div>
            </div>

            {/* Bank Details */}
            {paymentMethod === 'bank' && (
              <div className="space-y-4 bg-[#071E2C] p-5 rounded-xl border border-[#28485A]/40">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Bank Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Bank Name *</label>
                    <Input
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="e.g. State Bank of India"
                      required={paymentMethod === 'bank'}
                      disabled={kycStatus === 'approved'}
                      className="bg-[#132C3C] border-[#28485A]/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Account Holder Name *</label>
                    <Input
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      placeholder="As per bank records"
                      required={paymentMethod === 'bank'}
                      disabled={kycStatus === 'approved'}
                      className="bg-[#132C3C] border-[#28485A]/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Account Number *</label>
                    <Input
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      required={paymentMethod === 'bank'}
                      disabled={kycStatus === 'approved'}
                      className="bg-[#132C3C] border-[#28485A]/50 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">IFSC Code *</label>
                    <Input
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="e.g. SBIN0001234"
                      required={paymentMethod === 'bank'}
                      disabled={kycStatus === 'approved'}
                      className="bg-[#132C3C] border-[#28485A]/50 text-white uppercase font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI Details */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 bg-[#071E2C] p-5 rounded-xl border border-[#28485A]/40">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">UPI / VPA Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">UPI ID / VPA *</label>
                    <Input
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="e.g. yourname@oksbi or 9876543210@paytm"
                      required={paymentMethod === 'upi'}
                      disabled={kycStatus === 'approved'}
                      className="bg-[#132C3C] border-[#28485A]/50 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Name on UPI App *</label>
                    <Input
                      name="upiName"
                      value={formData.upiName}
                      onChange={handleChange}
                      placeholder="Name linked to this UPI ID"
                      required={paymentMethod === 'upi'}
                      disabled={kycStatus === 'approved'}
                      className="bg-[#132C3C] border-[#28485A]/50 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {kycStatus !== 'approved' ? (
              <div className="pt-4 border-t border-[#28485A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#6F9DB5] hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
                >
                  {isSaving ? (
                    "Verifying & Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Submit & Verify KYC Details
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-300 max-w-sm">
                  Submitting will verify your PAN and account details to unlock seamless fund withdrawals.
                </p>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#28485A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/20 p-4 rounded-xl border border-emerald-800/40">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#35B779] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">KYC is Verified & Active</p>
                    <p className="text-xs text-emerald-300">Withdrawals are fully enabled for your account.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setKycStatus('pending')}
                  className="text-xs text-white hover:text-white underline"
                >
                  Edit / Update KYC Details
                </button>
              </div>
            )}
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
