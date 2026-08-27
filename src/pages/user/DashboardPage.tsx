import React, { useState, useEffect } from 'react';
import { Copy, Check, Users, Camera, Clock, AlertTriangle, XCircle, ShieldCheck, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser, MlmUser, getPackageForUser } from '@/lib/mlmStore';
import { copyTextToClipboard } from '@/lib/utils';

export function UserDashboardPage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [userStats, setUserStats] = useState<MlmUser>(getCurrentUser());

  const loadStats = () => {
    setUserStats(getCurrentUser());
  };

  useEffect(() => {
    loadStats();
    window.addEventListener('mlm_update', loadStats);
    window.addEventListener('current_user_change', loadStats);
    return () => {
      window.removeEventListener('mlm_update', loadStats);
      window.removeEventListener('current_user_change', loadStats);
    };
  }, []);

  const userPkg = getPackageForUser(userStats);
  const cappingAmount = userPkg.capping || (userPkg.price === 6699 ? 5000 : 10000);
  const maxDailyPairs = Math.floor(cappingAmount / (userPkg.binaryIncome || 1000));
  const sponsorCode = userStats?.id || "";

  const handleCopyCode = async () => {
    const ok = await copyTextToClipboard(sponsorCode);
    if (ok) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const isPending = userStats?.status !== 'Active' && userStats?.paymentStatus !== 'Rejected';
  const isRejected = userStats?.paymentStatus === 'Rejected';

  return (
    <div className="space-y-6">
      {/* Pending / Inactive / Rejected Account Alert Banner */}
      {isPending && (
        <div className="bg-amber-950/40 border-2 border-amber-500/60 rounded-2xl p-4 flex items-start gap-3 shadow-[0_0_15px_rgba(245,158,11,0.15)] text-amber-200">
          <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-sm">
            <h3 className="font-semibold text-amber-300 text-base flex items-center gap-2">
              Payment Under Verification (Pending Admin Approval)
            </h3>
            <p className="text-amber-200/90 text-xs mt-1 leading-relaxed">
              Aapki registration request aur payment proof Admin ko receive ho gaya hai. Admin UTR & Payment check karke aapki ID verify aur activate kar denge.
            </p>
            {userStats?.utrNumber && (
              <div className="mt-2 text-xs font-mono bg-amber-900/40 border border-amber-500/30 px-2.5 py-1 rounded inline-block">
                Submitted UTR: <strong className="text-amber-100">{userStats.utrNumber}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {isRejected && (
        <div className="bg-red-950/50 border-2 border-red-500/60 rounded-2xl p-4 flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-red-200">
          <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h3 className="font-semibold text-red-300 text-base">
              Payment Verification Rejected
            </h3>
            <p className="text-red-200/90 text-xs mt-1 leading-relaxed">
              Admin dwara aapka payment reject kar diya gaya hai. Kripya apna payment UTR check karein ya Security / Admin se sampark karein.
            </p>
          </div>
        </div>
      )}

      {/* User Info Header Card */}
      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link 
            to="/user/profile"
            className="relative group block cursor-pointer"
            title="Click to view/change profile photo"
          >
            {userStats?.avatar ? (
              <img 
                src={userStats.avatar} 
                alt="Profile" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#6F9DB5]/60 shadow-md shadow-[#071E2C] group-hover:opacity-90 transition-opacity" 
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#1B3343] border-2 border-[#6F9DB5]/40 flex items-center justify-center text-[#6F9DB5] font-bold text-2xl shadow-inner group-hover:border-[#6F9DB5] transition-colors">
                {userStats?.name ? userStats.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-[#1B3343] group-hover:bg-[#28485A] text-white p-1 rounded-full shadow border border-[#071E2C] transition-colors">
              <Camera className="w-3 h-3 text-[#6F9DB5]" />
            </div>
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">{userStats?.name || 'Member'}</h1>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                userStats?.status === 'Active' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {userStats?.status || 'Active'}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              ID: <span className="font-mono text-[#35B779] font-semibold">{userStats?.id}</span> • Package: <span className="text-white font-medium">{userStats?.isFreeId || userStats?.package?.toLowerCase().includes('free') ? 'ONLY Registration' : (userStats?.package || 'Premium (₹8,599)')}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto max-w-full">
          {/* Referral Code Box */}
          <div className="bg-[#071E2C] border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] rounded-xl px-3 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs w-full sm:w-auto flex-1 sm:flex-none max-w-full">
            <span className="text-gray-300 truncate">Referral Code: <strong className="text-white font-mono text-sm ml-1">{sponsorCode}</strong></span>
            <button 
              onClick={handleCopyCode} 
              className="text-[#6F9DB5] hover:text-white font-semibold transition-colors flex items-center gap-1 bg-[#1B3343]/60 hover:bg-[#1B3343] px-2.5 py-1 rounded-lg border border-[#28485A]/50 cursor-pointer shrink-0 ml-auto"
              title="Copy Referral Code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#35B779]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Top 6 Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex flex-col justify-between">
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-2">Available Balance</p>
            <p className="text-3xl font-semibold text-white mb-1">₹{new Intl.NumberFormat('en-IN').format(userStats?.availableBalance || 0)}</p>
          </div>
        </div>
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex flex-col justify-between">
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-2">Total Income</p>
            <p className="text-3xl font-semibold text-white mb-1">₹{new Intl.NumberFormat('en-IN').format(userStats?.totalIncome || 0)}</p>
          </div>
          <p className="text-xs text-[#35B779] font-medium">All time earnings</p>
        </div>
        {/* Matching Income Card */}
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-[#071E2C] text-gray-300 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-[#28485A]/50">
            Capping: ₹{cappingAmount.toLocaleString('en-IN')}/Day
          </div>
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-2">Matching Income</p>
            <p className="text-3xl font-semibold text-white mb-1">₹{new Intl.NumberFormat('en-IN').format(userStats?.matchingIncome || 0)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-[#35B779] font-medium">{userStats?.completedPairs || 0} Completed Pairs</p>
            <p className="text-[10px] text-purple-400 font-semibold">
              Max {maxDailyPairs} Pairs/Day (₹{cappingAmount.toLocaleString('en-IN')})
            </p>
            {(userStats?.flushedMatchingIncome || 0) > 0 && (
              <p className="text-[10px] text-amber-300 font-semibold">
                ⚡ ₹{userStats.flushedMatchingIncome.toLocaleString('en-IN')} excess flushed to Company
              </p>
            )}
          </div>
        </div>

        {/* Direct Referral Income Card */}
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-[#071E2C] text-gray-300 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-[#28485A]/50">
            Unlimited
          </div>
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-2">Direct Refferal Income</p>
            <p className="text-3xl font-semibold text-white mb-1">₹{new Intl.NumberFormat('en-IN').format(userStats?.directIncome || 0)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-[#35B779] font-medium">{userStats?.directJoins || 0} Direct Active Joins</p>
            <p className="text-[10px] text-purple-400 font-semibold">Direct Bonus Transferred</p>
          </div>
        </div>

        {/* Level Income Card */}
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="bg-[#071E2C] text-gray-300 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-[#28485A]/50">
              Unlimited
            </span>
          </div>
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-2">Level Income</p>
            <p className="text-3xl font-semibold text-white mb-1">
              ₹{new Intl.NumberFormat('en-IN').format(userStats?.levelIncome || 0)}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-[#35B779] font-medium">From 20 Matrix Levels</p>
            <p className="text-[10px] text-purple-400 font-semibold">No Capping Limit</p>
          </div>
        </div>
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-[#071E2C] text-gray-300 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-[#28485A]/30">COMING SOON</div>
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-2">Repurchase Income</p>
            <p className="text-3xl font-semibold text-gray-300 mb-1">₹0</p>
          </div>
          <p className="text-xs text-purple-400 font-semibold italic">Future feature</p>
        </div>
      </section>

      {/* Row 2 */}
      <section className="grid grid-cols-1 gap-6">
        <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#28485A]/30 pb-2">Team Summary</h3>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#071E2C] rounded-xl p-4 flex flex-col justify-center items-center text-center border border-[#28485A]/30">
              <p className="text-[10px] uppercase font-semibold text-gray-300 mb-1">Left Members</p>
              <p className="text-2xl font-semibold text-gray-200">{userStats?.leftMembers || 0}</p>
            </div>
            <div className="bg-[#071E2C] rounded-xl p-4 flex flex-col justify-center items-center text-center border border-[#28485A]/30">
              <p className="text-[10px] uppercase font-semibold text-gray-300 mb-1">Right Members</p>
              <p className="text-2xl font-semibold text-gray-200">{userStats?.rightMembers || 0}</p>
            </div>
            <div className="bg-[#071E2C] rounded-xl p-4 flex flex-col justify-center items-center text-center border border-[#28485A]/30">
              <span className="text-[10px] uppercase font-semibold text-gray-300 mb-1">Total Team</span>
              <span className="text-2xl font-semibold text-white">{(userStats?.leftMembers || 0) + (userStats?.rightMembers || 0)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
