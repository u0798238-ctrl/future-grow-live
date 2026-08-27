import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, ArrowRight, AlertCircle, Building, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getMlmUsers, getCurrentUser, getCurrentUserId, MlmUser, getSystemSettings, SystemSettings } from '@/lib/mlmStore';

// Validation helpers
export const isValidUpiId = (upi: string): boolean => {
  if (!upi) return false;
  const trimmed = upi.trim();
  // Standard Indian UPI ID regex format: username@bankhandle (e.g., 9876543210@paytm, user@oksbi, name.surname@ybl)
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9.\-_]{2,32}$/;
  return upiRegex.test(trimmed) && trimmed.includes('@') && !trimmed.endsWith('@') && !trimmed.startsWith('@');
};

export const isValidBankAccount = (acc: string): boolean => {
  if (!acc) return false;
  const trimmed = acc.trim();
  // Indian bank account numbers are between 9 to 18 digits numeric
  const accRegex = /^\d{9,18}$/;
  if (!accRegex.test(trimmed)) return false;
  if (/^0+$/.test(trimmed)) return false; // Not all zeros
  return true;
};

export const isValidIfscCode = (ifsc: string): boolean => {
  if (!ifsc) return false;
  const trimmed = ifsc.trim().toUpperCase();
  // 11 characters: 4 alphabetic characters, 5th character '0', 6 alphanumeric characters
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(trimmed);
};

export function WithdrawalPage() {
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [userStats, setUserStats] = useState<MlmUser>(getCurrentUser());
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [isKycApproved, setIsKycApproved] = useState(false);
  const [userPan, setUserPan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', title?: string, text: string, details?: string[] } | null>(null);

  const loadStatsAndKyc = () => {
    const user = getCurrentUser();
    setUserStats(user);

    // Check KYC status
    const savedKycStr = localStorage.getItem(`kyc_data_${user.id}`);
    const savedKyc = user.kycDetails || (savedKycStr ? JSON.parse(savedKycStr) : null);
    
    let isApproved = false;
    let pan = user.panNumber || '';

    if (savedKyc) {
      try {
        const parsed = savedKyc;
        if (parsed.kycStatus === 'approved' || (parsed.formData?.panNumber && (parsed.formData?.accountNumber || parsed.formData?.upiId))) {
          isApproved = true;
        }
        if (parsed.formData?.panNumber) {
          pan = parsed.formData.panNumber;
        }
        // Auto-fill payout details from KYC if empty
        if (parsed.formData) {
          if (parsed.formData.upiId && !upiId) {
            setUpiId(parsed.formData.upiId);
          }
          if (parsed.formData.accountNumber && !bankAccount) {
            setBankAccount(parsed.formData.accountNumber);
          }
          if (parsed.formData.ifscCode && !ifscCode) {
            setIfscCode(parsed.formData.ifscCode);
          }
          if (parsed.formData.accountName && !accountHolderName) {
            setAccountHolderName(parsed.formData.accountName);
          }
          if (parsed.formData.bankName && !bankName) {
            setBankName(parsed.formData.bankName);
          }
          if (parsed.paymentMethod) {
            setMethod(parsed.paymentMethod);
          }
        }
      } catch (e) {
        // ignore
      }
    } else if (user.panNumber) {
      pan = user.panNumber;
    }

    if (!accountHolderName) {
      setAccountHolderName(user.name || '');
    }

    setUserPan(pan);
    const hasPanCard = Boolean(pan && pan.trim().length >= 10);
    const adminNoPanPermitted = user.commissionSettings?.withdrawalWithoutPanEnabled === true;
    const adminWithdrawalAllowed = user.commissionSettings?.allowWithdrawal !== false;

    setIsKycApproved((hasPanCard || adminNoPanPermitted) && adminWithdrawalAllowed);
  };

  useEffect(() => {
    loadStatsAndKyc();
    window.addEventListener('mlm_update', loadStatsAndKyc);
    window.addEventListener('current_user_change', loadStatsAndKyc);
    return () => {
      window.removeEventListener('mlm_update', loadStatsAndKyc);
      window.removeEventListener('current_user_change', loadStatsAndKyc);
    };
  }, []);

  const sysSettings = getSystemSettings();
  const currentDay = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = (currentDay === 0 || currentDay === 6) && !sysSettings.emergencyWeekendWithdrawals;
  const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay];

  const hasPanCard = Boolean(userPan && userPan.trim().length >= 10);
  const isAdminNoPanApproved = userStats?.commissionSettings?.withdrawalWithoutPanEnabled === true;
  const isWithdrawalAllowedByAdmin = userStats?.commissionSettings?.allowWithdrawal !== false;
  const isFreeOrInactive = Boolean(userStats?.isFreeId || userStats?.status !== 'Active' || userStats?.package?.toLowerCase().includes('free'));
  const isWithdrawalUnlocked = !isFreeOrInactive && (hasPanCard || isAdminNoPanApproved) && isWithdrawalAllowedByAdmin;

  const minW = sysSettings.minWithdrawal || 500;
  const maxW = sysSettings.maxWithdrawal || 50000;
  const totalDeductionPercent = sysSettings.adminDeductionPercent || 10;
  const tdsPercent = 5;
  const adminPercent = Math.max(0, totalDeductionPercent - tdsPercent);

  const isUpiValid = isValidUpiId(upiId);
  const isBankAccountValid = isValidBankAccount(bankAccount);
  const isIfscValid = isValidIfscCode(ifscCode);
  const isAccountHolderValid = accountHolderName.trim().length >= 2;
  const withdrawAmtNum = Number(amount);
  const isAmountValid = !isNaN(withdrawAmtNum) && withdrawAmtNum >= minW && withdrawAmtNum <= maxW && withdrawAmtNum <= (userStats?.availableBalance || 0);

  const isCurrentMethodValid = method === 'upi' 
    ? isUpiValid 
    : (isBankAccountValid && isIfscValid && isAccountHolderValid);

  const handlePasteUpi = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setUpiId(text.trim().toLowerCase());
          setTouched(prev => ({ ...prev, upi: true }));
          return;
        }
      }
    } catch (err) {
      console.warn('Direct clipboard read restricted:', err);
    }

    // Reliable fallback prompt if iframe or browser security blocks readText
    const manualPasted = window.prompt("Paste your UPI ID here (e.g., username@oksbi or 9876543210@paytm):", upiId);
    if (manualPasted !== null && manualPasted.trim()) {
      setUpiId(manualPasted.trim().toLowerCase());
      setTouched(prev => ({ ...prev, upi: true }));
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setToastMessage(null); // Reset previous message

  try {
    if (isFreeOrInactive) {
      setToastMessage({
        type: 'error',
        title: 'Withdrawal Locked',
        text: 'Your account is currently registered as a Free ID (Zero Commission). Please activate your account with package payment to enable withdrawals.'
      });
      return;
    }

    if (isWeekend) {
      setToastMessage({
        type: 'error',
        title: 'Weekend Restriction',
        text: 'Withdrawals are CLOSED on Saturday and Sunday! Requests are accepted from Monday to Friday only.'
      });
      return;
    }

    if (!isWithdrawalAllowedByAdmin) {
      setToastMessage({
        type: 'error',
        title: 'Withdrawal Blocked',
        text: 'Withdrawals have been paused for your account by Admin. Please contact support.'
      });
      return;
    }

    if (!hasPanCard && !isAdminNoPanApproved) {
      setToastMessage({
        type: 'error',
        title: 'PAN Card Required',
        text: 'According to Future Grow policy, if you do not have a PAN Card, withdrawal can only be initiated if Admin enables it. Please submit your PAN Card in KYC.'
      });
      return;
    }

    const withdrawAmt = Number(amount);
    
    if (isNaN(withdrawAmt) || withdrawAmt < minW) {
      setToastMessage({ type: 'error', text: `Minimum withdrawal amount is ₹${minW.toLocaleString('en-IN')}.` });
      return;
    }
    if (withdrawAmt > maxW) {
      setToastMessage({ type: 'error', text: `Maximum withdrawal limit is ₹${maxW.toLocaleString('en-IN')} per request.` });
      return;
    }
    if (!userStats || withdrawAmt > userStats.availableBalance) {
      setToastMessage({ type: 'error', text: "Insufficient available balance in your wallet." });
      return;
    }

    // Check if user already has a pending withdrawal
    const usersForCheck = getMlmUsers();
    const meCheck = usersForCheck.find(u => u.id === getCurrentUserId());
    const hasPendingWithdrawal = meCheck?.transactions?.some(t => t.type === 'Withdrawal' && t.status === 'Pending');
    
    if (hasPendingWithdrawal) {
       setToastMessage({ type: 'error', title: 'Action Not Allowed', text: "You already have a Pending Withdrawal request. Please wait for the admin to approve or reject it before submitting a new one." });
       return;
    }

    // STRICT UPI VALIDATION
    if (method === 'upi') {
      if (!upiId.trim()) {
        setToastMessage({ type: 'error', text: "UPI ID Required! Please enter your UPI ID." });
        return;
      }
      if (!isValidUpiId(upiId)) {
        setToastMessage({ type: 'error', text: "Invalid UPI ID Format! Please enter a valid UPI ID (e.g., username@oksbi)." });
        return;
      }
    }

    // STRICT BANK VALIDATION
    if (method === 'bank') {
      if (!accountHolderName.trim()) {
        setToastMessage({ type: 'error', text: "Account Holder Name Required!" });
        return;
      }
      if (!bankAccount.trim() || !isValidBankAccount(bankAccount)) {
        setToastMessage({ type: 'error', text: "Invalid Bank Account Number! Please enter 9 to 18 digits." });
        return;
      }
      if (!ifscCode.trim() || !isValidIfscCode(ifscCode)) {
        setToastMessage({ type: 'error', text: "Invalid IFSC Code! Please enter a valid 11-character IFSC code." });
        return;
      }
    }

    const tds = withdrawAmt * (tdsPercent / 100);
    const adminCharge = withdrawAmt * (adminPercent / 100);
    const netAmount = withdrawAmt - tds - adminCharge;

    const currentId = getCurrentUserId();
    const users = getMlmUsers();
    const me = users.find(u => u.id === currentId);
    if (me) {
       me.totalWithdrawn += withdrawAmt; // Deduct from available balance immediately
       me.availableBalance -= withdrawAmt;
       
       me.transactions.push({
         id: `W-${Date.now()}`,
         type: 'Withdrawal',
         amount: withdrawAmt,
         netAmount: netAmount,
         tds: tds,
         adminCharge: adminCharge,
         status: 'Pending',
         description: 'Withdrawal',
         date: new Date().toISOString(),
         withdrawalMethod: method,
         ...(method === 'upi' ? { upiId: upiId.trim() } : {}),
         ...(method === 'bank' ? { bankAccount: bankAccount.trim() } : {}),
         ...(method === 'bank' ? { ifscCode: ifscCode.trim().toUpperCase() } : {})
       });
       
       me.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
       localStorage.setItem('mlm_users', JSON.stringify(users));
       
       // CRITICAL: Push to Cloud immediately so all admin devices sync the deduction!
       const { pushMlmStateToSupabase } = await import('@/lib/mlmStore');
           pushMlmStateToSupabase('mlm_users', users);
       
       window.dispatchEvent(new Event('mlm_update'));
       setAmount('');
       setToastMessage({
         type: 'success',
         title: 'Withdrawal Request Submitted',
         text: 'Your request has been successfully processed and is pending approval.',
         details: [
           `Gross Amount: ₹${withdrawAmt.toLocaleString('en-IN')}`,
           `Deduction (${totalDeductionPercent}%): ₹${(tds + adminCharge).toLocaleString('en-IN')}`,
           `Net Payout: ₹${netAmount.toLocaleString('en-IN')}`,
           `Method: ${method === 'upi' ? 'UPI' : 'Bank Transfer'}`
         ]
       });
    }
  } finally {
    setIsSubmitting(false);
  }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">{isSubmitting ? 'Processing...' : 'Withdraw Funds'}</h2>
          <p className="text-gray-300 text-sm">Request payout from your available commission wallet</p>
        </div>
      </div>

      {/* Weekend Notice Banner */}
      {isWeekend && (
        <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-base font-semibold text-amber-300">
                Weekend Notice: Withdrawals Closed Today ({currentDayName})
              </h3>
              <p className="text-xs text-white leading-relaxed">
                As per system policy, withdrawals are processed <strong>Monday to Friday</strong> only. Saturday and Sunday are official payout holidays. The withdrawal window will reopen on Monday morning.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message Display */}
      {toastMessage && (
        <div className={`p-4 rounded-xl border flex flex-col gap-2 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
            : 'bg-red-950/60 border-red-500/50 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
        }`}>
          <div className="flex items-start gap-3">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              {toastMessage.title && <h4 className={`font-semibold text-sm ${toastMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{toastMessage.title}</h4>}
              <p className="text-sm mt-0.5 leading-snug">{toastMessage.text}</p>
              {toastMessage.details && toastMessage.details.length > 0 && (
                <ul className="mt-3 space-y-1.5 bg-black/30 p-3 rounded-lg border border-white/5">
                  {toastMessage.details.map((detail, idx) => (
                    <li key={idx} className="text-xs text-white/90 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/40 hover:text-white/80 p-1 rounded-md transition-colors hover:bg-white/10 shrink-0">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Free ID Banner */}
      {isFreeOrInactive && (
        <div className="bg-purple-950/50 border border-purple-500/50 rounded-2xl p-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6 text-purple-400" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-base font-semibold text-purple-300">
                🔒 Free ID Account: Withdrawal Locked (आईडी एक्टिवेशन आवश्यक है)
              </h3>
              <p className="text-xs text-purple-100 leading-relaxed">
                Your account is currently registered as a <strong>Free / Inactive ID (Zero Commission)</strong>. All your earnings & wallet balances are displayed, but <strong>withdrawals will only be unlocked once your account is activated with package payment by Admin</strong>.
              </p>
              <p className="text-xs text-amber-300 mt-1">
                ⚡ As soon as your ID is activated, you will be able to withdraw all your earnings directly to your UPI ID or Bank account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Blocked Banner */}
      {!isFreeOrInactive && !isWithdrawalAllowedByAdmin && (
        <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-base font-semibold text-red-300">
                Withdrawal Paused by Admin
              </h3>
              <p className="text-xs text-white leading-relaxed">
                Withdrawal access for this account has been temporarily placed on hold by Admin. Please contact system support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Banners: With PAN vs Admin Special Exemption vs Blocked */}
      {isWithdrawalAllowedByAdmin && (
        !hasPanCard && isAdminNoPanApproved ? (
          <div className="bg-cyan-950/40 border border-cyan-500/50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  Admin Special Permission Active
                  <span className="text-[10px] font-mono bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/40">
                    No PAN Required (Admin Approved)
                  </span>
                </p>
                <p className="text-xs text-cyan-300 mt-0.5">
                  Admin has enabled withdrawal for your ID without a PAN card. You can withdraw directly to UPI or Bank.
                </p>
              </div>
            </div>
          </div>
        ) : !hasPanCard ? (
          <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-semibold text-red-300">
                  PAN Card Required (Admin Permission Dependent)
                </h3>
                <p className="text-xs text-white leading-relaxed">
                  A PAN Card is not registered on your account. According to <strong>Future Grow policy</strong>, if you do not have a PAN Card, <strong>withdrawals will only be unlocked if Admin explicitly enables the withdrawal permission for your account</strong>.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <Link 
                    to="/user/kyc" 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#35B779] bg-emerald-950/60 border border-[#6F9DB5]/40 px-3 py-1.5 rounded-lg hover:bg-emerald-900/60 transition-colors"
                  >
                    Submit PAN in KYC Verification <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-xs text-gray-300">or contact Admin to request a No-PAN Exemption</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/30 border border-[#6F9DB5]/40 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#35B779] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  KYC Verified & Active
                  <span className="text-xs font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-700/40">
                    PAN: {userPan}
                  </span>
                </p>
                <p className="text-xs text-[#35B779]">Withdrawals are unlocked and enabled for this account.</p>
              </div>
            </div>
          </div>
        )
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#132C3C] p-6 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-2">Available Balance</p>
            <p className="text-3xl font-semibold text-white">₹{new Intl.NumberFormat('en-IN').format(userStats?.availableBalance || 0)}</p>
          </div>
          <div className="w-12 h-12 bg-[#6F9DB5]/20 rounded-full border border-[#6F9DB5]/30 flex items-center justify-center">
            <span className="text-[#35B779] text-3xl font-bold">₹</span>
          </div>
        </div>

        <div className="bg-[#132C3C] p-6 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-2">Total Withdrawn</p>
            <p className="text-3xl font-semibold text-gray-300">₹{new Intl.NumberFormat('en-IN').format(userStats?.totalWithdrawn || 0)}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-full border border-blue-500/30 flex items-center justify-center">
            <span className="text-blue-400 text-3xl font-bold">₹</span>
          </div>
        </div>
      </div>
      
      <div className="bg-[#132C3C] p-6 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm">
        <div className="mb-8 p-5 bg-[#071E2C] rounded-xl border-2 border-[#6F9DB5]/40 shadow-[0_0_10px_rgba(111,157,181,0.1)] hover:border-[#6F9DB5]/80 transition-all">
          <h3 className="text-sm font-semibold text-white mb-4 border-b border-[#28485A]/30 pb-2">Withdrawal Rules</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] font-medium text-[#8FA3AF] uppercase">Min Withdrawal (₹)</p>
              <p className="text-sm font-semibold text-gray-200 mt-1">500</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#8FA3AF] uppercase">Max Withdrawal (₹)</p>
              <p className="text-sm font-semibold text-gray-200 mt-1">50,000</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#8FA3AF] uppercase">TDS & Admin (%)</p>
              <p className="text-sm font-semibold text-gray-200 mt-1">10%</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#8FA3AF] uppercase">Withdrawal Days</p>
              <p className="text-sm font-semibold text-gray-200 mt-1">Mon - Fri</p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#28485A]/30 flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-medium text-emerald-300">Processing Time</p>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Once requested, your withdrawal amount will be successfully credited to your bank account within <strong>1 to 24 hours</strong>.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleWithdraw}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-200">Withdrawal Amount (₹)</label>
              <span className="text-xs text-gray-300">Min. ₹500</span>
            </div>
            <div className="relative">
              <Input 
                type="number" 
                placeholder="Enter amount to withdraw" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="text-lg py-6 pr-20" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setAmount(String(userStats?.availableBalance || 0))} 
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1B3343] hover:bg-[#28485A] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                MAX
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-200">Withdrawal Method</label>
            <div className="flex gap-4">
              <label className={`flex-1 border rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-colors ${method === 'upi' ? 'border-2 border-[#6F9DB5] bg-[#071E2C] shadow-[0_0_15px_rgba(111,157,181,0.2)]' : 'border-2 border-[#6F9DB5]/30 bg-[#132C3C] hover:border-[#6F9DB5]/80 hover:shadow-[0_0_15px_rgba(111,157,181,0.15)]'}`}>
                <input 
                  type="radio" 
                  name="method" 
                  value="upi" 
                  checked={method === 'upi'} 
                  onChange={() => setMethod('upi')} 
                  className="h-4 w-4 text-[#6F9DB5]" 
                />
                <span className="font-medium text-white">UPI</span>
              </label>
              <label className={`flex-1 border rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-colors ${method === 'bank' ? 'border-2 border-[#6F9DB5] bg-[#071E2C] shadow-[0_0_15px_rgba(111,157,181,0.2)]' : 'border-2 border-[#6F9DB5]/30 bg-[#132C3C] hover:border-[#6F9DB5]/80 hover:shadow-[0_0_15px_rgba(111,157,181,0.15)]'}`}>
                <input 
                  type="radio" 
                  name="method" 
                  value="bank" 
                  checked={method === 'bank'} 
                  onChange={() => setMethod('bank')} 
                  className="h-4 w-4 text-[#6F9DB5]" 
                />
                <span className="font-medium text-white">Bank Transfer</span>
              </label>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#28485A]/30">
            {method === 'upi' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-200 flex items-center gap-1.5">
                    Your UPI ID <span className="text-red-400">*</span>
                  </label>
                  {upiId.trim() && (
                    <span className={`text-xs font-medium flex items-center gap-1 ${isUpiValid ? 'text-[#35B779]' : 'text-red-400'}`}>
                      {isUpiValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {isUpiValid ? 'Valid UPI Format' : 'Invalid UPI Format'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    value={upiId} 
                    onChange={(e) => {
                      setUpiId(e.target.value.trim().toLowerCase());
                      setTouched({ ...touched, upi: true });
                    }} 
                    onBlur={() => setTouched({ ...touched, upi: true })}
                    placeholder="e.g., username@oksbi or 9876543210@paytm" 
                    className={`pr-24 font-mono text-sm transition-colors ${
                      touched.upi && upiId.trim() 
                        ? (isUpiValid ? 'border-[#6F9DB5]/80 focus:border-[#6F9DB5]' : 'border-red-500 focus:border-red-500 bg-red-950/20') 
                        : ''
                    }`}
                    required={method === 'upi'} 
                  />
                  <button 
                    type="button" 
                    onClick={handlePasteUpi} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 rounded-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                    title="Paste UPI ID from Clipboard"
                  >
                     <span>Paste</span>
                  </button>
                </div>
                {touched.upi && upiId.trim() && !isUpiValid && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Please enter a valid UPI ID (Format: <strong>username@handle</strong> e.g., <em>name@oksbi</em>, <em>9876543210@paytm</em>, <em>user@ybl</em>).</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 flex items-center gap-1.5">
                    Account Holder Name <span className="text-red-400">*</span>
                  </label>
                  <Input 
                    value={accountHolderName} 
                    onChange={(e) => {
                      setAccountHolderName(e.target.value);
                      setTouched({ ...touched, accountHolderName: true });
                    }} 
                    placeholder="Enter Account Holder Name" 
                    required={method === 'bank'} 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-200 flex items-center gap-1.5">
                      Bank Account Number <span className="text-red-400">*</span>
                    </label>
                    {bankAccount.trim() && (
                      <span className={`text-xs font-medium flex items-center gap-1 ${isBankAccountValid ? 'text-[#35B779]' : 'text-red-400'}`}>
                        {isBankAccountValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isBankAccountValid ? `${bankAccount.length} digits (Valid)` : `${bankAccount.length} digits (Min 9 required)`}
                      </span>
                    )}
                  </div>
                  <Input 
                    type="text"
                    inputMode="numeric"
                    value={bankAccount} 
                    onChange={(e) => {
                      // Allow numeric only, max 18 digits
                      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 18);
                      setBankAccount(cleaned);
                      setTouched({ ...touched, bankAccount: true });
                    }} 
                    onBlur={() => setTouched({ ...touched, bankAccount: true })}
                    placeholder="Enter 9 to 18 digits account number" 
                    className={`font-mono text-sm tracking-wider ${
                      touched.bankAccount && bankAccount.trim()
                        ? (isBankAccountValid ? 'border-[#6F9DB5]/80 focus:border-[#6F9DB5]' : 'border-red-500 focus:border-red-500 bg-red-950/20')
                        : ''
                    }`}
                    required={method === 'bank'} 
                  />
                  {touched.bankAccount && bankAccount.trim() && !isBankAccountValid && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Bank Account Number must be between 9 to 18 numeric digits.</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-200 flex items-center gap-1.5">
                      IFSC Code <span className="text-red-400">*</span>
                    </label>
                    {ifscCode.trim() && (
                      <span className={`text-xs font-medium flex items-center gap-1 ${isIfscValid ? 'text-[#35B779]' : 'text-red-400'}`}>
                        {isIfscValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isIfscValid ? 'Valid IFSC Code' : 'Invalid IFSC Format'}
                      </span>
                    )}
                  </div>
                  <Input 
                    value={ifscCode} 
                    onChange={(e) => {
                      // Allow alphanumeric only, auto-uppercase, max 11 chars
                      const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
                      setIfscCode(cleaned);
                      setTouched({ ...touched, ifscCode: true });
                    }} 
                    onBlur={() => setTouched({ ...touched, ifscCode: true })}
                    placeholder="e.g., SBIN0001234, HDFC0000123" 
                    className={`font-mono text-sm tracking-widest uppercase ${
                      touched.ifscCode && ifscCode.trim()
                        ? (isIfscValid ? 'border-[#6F9DB5]/80 focus:border-[#6F9DB5]' : 'border-red-500 focus:border-red-500 bg-red-950/20')
                        : ''
                    }`}
                    required={method === 'bank'} 
                  />
                  {touched.ifscCode && ifscCode.trim() && !isIfscValid && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>IFSC code must be in standard 11-character format (e.g., <strong>SBIN0001234</strong>, with 5th character '0').</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isWithdrawalUnlocked ? (
            <div className="space-y-3 mt-6">
              <Button 
                type="button" 
                disabled 
                className="w-full h-auto min-h-[3.5rem] whitespace-normal px-4 py-3 text-sm sm:text-base leading-snug bg-gray-800 text-gray-300 border border-gray-700 cursor-not-allowed opacity-80 shadow-md"
              >
                {isFreeOrInactive 
                  ? '🔒 Free ID Account - Activation Required to Withdraw'
                  : !isWithdrawalAllowedByAdmin 
                  ? '🔒 Withdrawals Paused by Admin'
                  : '🔒 Withdrawals Locked (PAN Required / Admin Approval Needed)'}
              </Button>
              <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-xl">
                <p className="text-center text-xs text-red-400 font-medium leading-relaxed">
                  {isFreeOrInactive 
                    ? 'Your account is currently registered as a Free ID. Please activate your account with package payment to enable withdrawals.'
                    : !isWithdrawalAllowedByAdmin
                    ? 'Your withdrawal access is currently on hold. Please contact Admin.'
                    : 'If you do not have a PAN Card, withdrawal will only unlock once Admin enables the exemption setting for your account.'}
                </p>
              </div>
            </div>
          ) : isWeekend ? (
            <div className="space-y-3 mt-6">
              <Button 
                type="button" 
                disabled 
                className="w-full h-auto min-h-[3.5rem] whitespace-normal px-4 py-3 text-sm sm:text-base leading-snug bg-amber-950/60 border border-amber-600/40 text-amber-300 cursor-not-allowed shadow-md"
              >
                🚫 Withdrawals Closed on {currentDayName} (Open Monday - Friday)
              </Button>
              <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl">
                <p className="text-center text-xs text-amber-400/80 font-medium leading-relaxed">
                  Payout requests can only be placed between Monday to Friday. Please request payout on Monday.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mt-6">
              <Button 
                type="submit" 
                disabled={!isCurrentMethodValid || !amount || withdrawAmtNum < 500 || withdrawAmtNum > (userStats?.availableBalance || 0)}
                className={`w-full h-auto min-h-[3.5rem] whitespace-normal px-4 py-3 text-sm sm:text-base font-semibold shadow-md transition-all ${
                  !isSubmitting && isCurrentMethodValid && amount && withdrawAmtNum >= 500 && withdrawAmtNum <= (userStats?.availableBalance || 0)
                    ? 'bg-[#35B779] hover:bg-[#2fa067] text-white cursor-pointer shadow-[0_0_15px_rgba(53,183,121,0.4)] hover:shadow-[0_0_20px_rgba(53,183,121,0.6)] border-2 border-[#35B779]'
                    : 'bg-gray-800 text-gray-300 border border-[#35576A] cursor-not-allowed opacity-75'
                }`}
              >
                {isCurrentMethodValid ? 'Submit Withdrawal Request' : (method === 'upi' ? '⚠️ Enter Valid UPI ID to Continue' : '⚠️ Enter Valid Bank Details to Continue')}
              </Button>

              {!isCurrentMethodValid && (
                <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl">
                  <p className="text-center text-xs text-amber-400/90 font-medium leading-relaxed">
                    {method === 'upi' 
                      ? '🔒 Withdrawal cannot be submitted until a valid UPI ID is entered.' 
                      : '🔒 Withdrawal cannot be submitted until valid Bank Account and IFSC details are entered.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
