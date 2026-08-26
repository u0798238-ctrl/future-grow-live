import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Award, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  RefreshCw, 
  Search, 
  Percent, 
  Building2, 
  CheckCircle2, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMlmUsers, MlmUser } from '@/lib/mlmStore';

export function AdminDashboardPage() {
  const [users, setUsers] = useState<MlmUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Active' | 'Inactive' | 'Capped'>('All');
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());

  const loadData = () => {
    const mlmUsers = getMlmUsers();
    setUsers(mlmUsers);
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('mlm_update', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('mlm_update', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // --- Aggregate Financial & Network Calculations ---
  const totalIds = users.length;
  const activeUsers = users.filter(u => u.status === 'Active');
  const activeIds = activeUsers.length;
  const inactiveIds = users.filter(u => u.status === 'Inactive').length;
  const blockedIds = users.filter(u => u.status === 'Blocked').length;

  // Total Business (Total money collected into system through package joins and approved deposits)
  let calculatedBusiness = 0;
  let totalApprovedDeposits = 0;
  let totalPendingDeposits = 0;
  let totalPendingDepositAmount = 0;

  users.forEach(u => {
    (u.transactions || []).forEach(tx => {
      if (tx.type === 'Deposit') {
        if (tx.status === 'Approved' || (!tx.status && u.status === 'Active')) {
          calculatedBusiness += tx.amount || 6699;
          totalApprovedDeposits++;
        } else if (tx.status === 'Pending') {
          totalPendingDeposits++;
          totalPendingDepositAmount += tx.amount || 6699;
        }
      }
    });
  });

  // System business strictly calculated from approved deposits
  const totalSystemBusiness = calculatedBusiness;

  // Commission distribution totals (excluding root company node from member distribution calculations)
  let totalDirectDistributed = 0;
  let totalMatchingDistributed = 0;
  let totalLevelDistributed = 0;
  let totalFlushedMatchingIncome = 0;
  let totalFlushedPairsCount = 0;
  let totalCustomBonusDistributed = 0;
  let totalWithdrawnAmount = 0;
  let totalAvailableInWallets = 0;
  let totalTdsCollected = 0;
  let totalAdminChargesCollected = 0;
  let pendingWithdrawalCount = 0;
  let pendingWithdrawalAmount = 0;

  users.forEach(u => {
    totalDirectDistributed += (u.directIncome || 0);
    totalMatchingDistributed += (u.matchingIncome || 0);
    totalLevelDistributed += (u.levelIncome || 0);
    totalFlushedMatchingIncome += (u.flushedMatchingIncome || 0);
    totalFlushedPairsCount += (u.flushedPairs || 0);
    totalWithdrawnAmount += (u.totalWithdrawn || 0);
    totalAvailableInWallets += (u.availableBalance || 0);

    if (u.commissionSettings?.customBonus) {
      totalCustomBonusDistributed += Number(u.commissionSettings.customBonus);
    }

    (u.transactions || []).forEach(tx => {
      if (tx.type === 'Withdrawal') {
        if (tx.status === 'Pending') {
          pendingWithdrawalCount++;
          pendingWithdrawalAmount += tx.amount || 0;
        } else if (tx.status === 'Approved') {
          totalTdsCollected += (tx.tds || ((tx.amount || 0) * 0.05));
          totalAdminChargesCollected += (tx.adminCharge || ((tx.amount || 0) * 0.05));
        }
      }
    });
  });

  const totalCommissionDistributed = totalDirectDistributed + totalMatchingDistributed + totalLevelDistributed + totalCustomBonusDistributed;
  const companyNetRetained = totalSystemBusiness - totalCommissionDistributed + totalFlushedMatchingIncome;
  const adminTotalProfit = companyNetRetained + totalTdsCollected + totalAdminChargesCollected;
  const distributionPercentage = totalSystemBusiness > 0 ? ((totalCommissionDistributed / totalSystemBusiness) * 100).toFixed(1) : '0.0';

  // Network left/right totals
  const rootUser = users.find(u => u.id === 'FGPL000001') || users[0];
  const totalLeftMembers = rootUser ? rootUser.leftMembers : Math.floor(activeIds / 2);
  const totalRightMembers = rootUser ? rootUser.rightMembers : Math.ceil(activeIds / 2);

  // Filtered members for breakdown ledger
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.panNumber && u.panNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'Active') return u.status === 'Active';
    if (filterType === 'Inactive') return u.status === 'Inactive' || u.status === 'Blocked';
    if (filterType === 'Capped') return (u.flushedMatchingIncome || 0) > 0 || (u.completedPairs || 0) >= 10;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Live Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2.5">
            Admin Master Dashboard
            <span className="text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-[#6F9DB5]/40 px-2.5 py-0.5 rounded-full">
              LIVE SYSTEM
            </span>
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Real-time company turnover, commission distribution ledger, and daily capping flush analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-[#8FA3AF] bg-[#071E2C] px-3.5 py-2 rounded-xl border border-[#28485A]/40 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Last Updated: <span className="text-white font-semibold">{lastRefreshed}</span>
          </div>
          <button 
            onClick={loadData}
            title="Refresh All Statistics"
            className="p-2 bg-[#071E2C] hover:bg-[#1B3343] text-white hover:text-white border border-[#28485A]/40 rounded-xl transition-all shadow-sm flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: High Level Business & User ID Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total System Business */}
        <div className="bg-gradient-to-br from-[#071E2C] to-[#1B3343]/40 p-5 rounded-2xl border border-cyan-500/30 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">Total System Business</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">₹{totalSystemBusiness.toLocaleString('en-IN')}</p>
            <p className="text-xs text-white mt-1">
              From <span className="text-cyan-300 font-semibold">{activeIds}</span> activated package deposits
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-cyan-500/20 flex justify-between text-[11px] text-gray-300">
            <span>Pending Deposits:</span>
            <span className="text-amber-300 font-semibold">{totalPendingDeposits} (₹{totalPendingDepositAmount.toLocaleString('en-IN')})</span>
          </div>
        </div>

        {/* 2. Total IDs & Network */}
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8FA3AF] uppercase tracking-wider">Total Registered IDs</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{totalIds.toLocaleString('en-IN')}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-[#6F9DB5]/40">
                {activeIds} Active
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-red-950/80 text-red-400 border border-red-500/40">
                {inactiveIds + blockedIds} Inactive
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#28485A]/30 flex justify-between text-[11px] text-gray-300">
            <span>Left: <strong className="text-white">{totalLeftMembers}</strong></span>
            <span>Right: <strong className="text-white">{totalRightMembers}</strong></span>
          </div>
        </div>

        {/* 3. Total Commission Distributed */}
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Total Commission Paid</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-300">₹{totalCommissionDistributed.toLocaleString('en-IN')}</p>
            <p className="text-xs text-white mt-1">
              Payout Ratio: <span className="text-emerald-400 font-semibold">{distributionPercentage}%</span> of total turnover
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#28485A]/30 flex justify-between text-[11px] text-gray-300">
            <span>Members Unclaimed Wallet:</span>
            <span className="text-[#35B779] font-semibold">₹{totalAvailableInWallets.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* 4. Total Flushed to Admin (Capping Hit) */}
        <div className="bg-gradient-to-br from-[#071E2C] to-purple-950/40 p-5 rounded-2xl border border-purple-500/30 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">Capping Overflow Flushed</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-300">₹{totalFlushedMatchingIncome.toLocaleString('en-IN')}</p>
            <p className="text-xs text-white mt-1">
              <span className="text-purple-300 font-semibold">{totalFlushedPairsCount} Pairs</span> flushed to Admin ID
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-500/20 flex justify-between text-[11px] text-gray-300">
            <span>Company Net Retained:</span>
            <span className="text-[#35B779] font-semibold">₹{companyNetRetained.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </section>

      {/* Hero Section: Admin Net Profit */}
      <section className="bg-gradient-to-r from-emerald-900/40 via-emerald-800/20 to-[#071E2C] border border-[#6F9DB5]/50 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20">
          <TrendingUp className="w-32 h-32 text-[#35B779]" />
        </div>
        <div className="relative z-10">
          <h3 className="text-sm font-semibold text-[#35B779] uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Total Admin Net Profit
          </h3>
          <p className="text-5xl font-bold text-white mb-4">
            ₹{adminTotalProfit.toLocaleString('en-IN')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-[#071E2C]/50 border border-[#6F9DB5]/30 rounded-xl p-4">
              <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Company Net Retained</p>
              <p className="text-xl font-semibold text-emerald-300">₹{companyNetRetained.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-gray-300 mt-1">Total Business - Commission Paid</p>
            </div>
            <div className="bg-[#071E2C]/50 border border-[#6F9DB5]/30 rounded-xl p-4">
              <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">TDS & Admin Charges</p>
              <p className="text-xl font-semibold text-emerald-300">₹{(totalTdsCollected + totalAdminChargesCollected).toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-gray-300 mt-1">Collected from Withdrawals</p>
            </div>
            <div className="bg-[#071E2C]/50 border border-[#6F9DB5]/30 rounded-xl p-4">
              <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Flushed Income (Capping)</p>
              <p className="text-xl font-semibold text-purple-300">₹{totalFlushedMatchingIncome.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-gray-300 mt-1">Included in Retained Profit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Row 2: 4 Dedicated Income Distribution Breakdown Cards (Direct, Matching, Capping Flush, Level) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Members Income Distribution Breakdown
          </h3>
          <span className="text-xs text-gray-300">Exact live payouts calculated across all registered members</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Direct Income Distributed */}
          <div className="bg-[#132C3C] p-5 rounded-2xl border border-[#6F9DB5]/40 hover:border-[#6F9DB5] transition-all shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#35B779] uppercase tracking-wider">Direct Referral Income</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-[#6F9DB5]/30">
                UNLIMITED
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">₹{totalDirectDistributed.toLocaleString('en-IN')}</p>
            <div className="mt-3 space-y-1.5 text-xs text-white bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/30">
              <div className="flex justify-between">
                <span className="text-gray-300">Rate per Direct:</span>
                <span className="font-semibold text-white">₹1,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Direct Joins:</span>
                <span className="font-semibold text-[#35B779]">{Math.round(totalDirectDistributed / 1500)} Directs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Daily Capping:</span>
                <span className="font-semibold text-emerald-300">None (Unlimited)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Matching Income Distributed */}
          <div className="bg-[#132C3C] p-5 rounded-2xl border border-cyan-500/40 hover:border-cyan-500 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Matching Pair Income</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                ₹10K CAPPING
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">₹{totalMatchingDistributed.toLocaleString('en-IN')}</p>
            <div className="mt-3 space-y-1.5 text-xs text-white bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/30">
              <div className="flex justify-between">
                <span className="text-gray-300">Rate per Pair (1:1):</span>
                <span className="font-semibold text-white">₹1,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Credited Pairs:</span>
                <span className="font-semibold text-cyan-400">{Math.round(totalMatchingDistributed / 1000)} Pairs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Daily Max Cap:</span>
                <span className="font-semibold text-cyan-300">10 Pairs (₹10,000)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Capping Flush (Retained by Admin) */}
          <div className="bg-[#132C3C] p-5 rounded-2xl border border-purple-500/40 hover:border-purple-500 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Flushed to Admin</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                FLUSH TO ADMIN
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">₹{totalFlushedMatchingIncome.toLocaleString('en-IN')}</p>
            <div className="mt-3 space-y-1.5 text-xs text-white bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/30">
              <div className="flex justify-between">
                <span className="text-gray-300">Flushed Pairs:</span>
                <span className="font-semibold text-purple-300">{totalFlushedPairsCount} Pairs (&gt; 10/day)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Company Saved:</span>
                <span className="font-semibold text-[#35B779]">₹{totalFlushedMatchingIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Beneficiary:</span>
                <span className="font-semibold text-purple-300">Admin</span>
              </div>
            </div>
          </div>

          {/* Card 4: Level Income Distributed */}
          <div className="bg-[#132C3C] p-5 rounded-2xl border border-emerald-500/40 hover:border-emerald-500 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Level Milestone Income</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                20 LEVELS
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">₹{totalLevelDistributed.toLocaleString('en-IN')}</p>
            <div className="mt-3 space-y-1.5 text-xs text-white bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/30">
              <div className="flex justify-between">
                <span className="text-gray-300">Level Structure:</span>
                <span className="font-semibold text-white">20 Matrix Levels</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Level Capping:</span>
                <span className="font-semibold text-emerald-300">None (Unlimited)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Level Payout:</span>
                <span className="font-semibold text-emerald-400">₹{totalLevelDistributed.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: Withdrawal & Banking Settlement Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#8FA3AF] uppercase tracking-wider mb-1">Total Payouts Withdrawn</p>
            <p className="text-2xl font-semibold text-white">₹{totalWithdrawnAmount.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-300 mt-1">Processed bank/UPI disbursements</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#132C3C] p-5 rounded-2xl border border-emerald-500/40 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1">Pending Withdrawals</p>
            <p className="text-2xl font-semibold text-emerald-300">{pendingWithdrawalCount} Requests</p>
            <p className="text-xs text-white mt-1">Amount: <strong>₹{pendingWithdrawalAmount.toLocaleString('en-IN')}</strong></p>
          </div>
          <Link 
            to="/admin/withdrawals" 
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            Review Requests
          </Link>
        </div>

        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#8FA3AF] uppercase tracking-wider mb-1">TDS & Admin Deductions</p>
            <p className="text-2xl font-semibold text-[#35B779]">₹{(totalTdsCollected + totalAdminChargesCollected).toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-300 mt-1">5% TDS (₹{totalTdsCollected}) + 5% Admin Charge</p>
          </div>
          <div className="w-12 h-12 bg-[#6F9DB5]/20 border border-[#6F9DB5]/30 rounded-xl flex items-center justify-center text-[#35B779]">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Row 4: Member Income Distribution Ledger & Search Filter */}
      <section className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#28485A]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Live Member Distribution & Capping Ledger
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              Individual earnings breakdown: Direct, Matching (up to 10 pairs), Level, and Flushed Capping per member
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter Tabs */}
            <div className="flex bg-[#071E2C] p-1 rounded-xl border border-[#28485A]/40 text-xs">
              {(['All', 'Active', 'Capped', 'Inactive'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    filterType === tab 
                      ? 'bg-[#1B3343] text-white font-semibold shadow-sm' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {tab === 'Capped' ? '⚡ Capped (Flushed)' : tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ID, Name, Mobile, PAN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-[#071E2C] border border-[#28485A]/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#071E2C] text-[11px] font-semibold text-[#8FA3AF] uppercase tracking-wider border-b border-[#28485A]/30">
              <tr>
                <th className="py-3 px-4">Member ID & Name</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Network (L / R)</th>
                <th className="py-3 px-3 text-right">Direct Inc. (₹)</th>
                <th className="py-3 px-3 text-right">Matching (₹)</th>
                <th className="py-3 px-3 text-right">Flushed (Capping)</th>
                <th className="py-3 px-3 text-right">Level Inc. (₹)</th>
                <th className="py-3 px-3 text-right">Total Earned (₹)</th>
                <th className="py-3 px-3 text-right">Withdrawn (₹)</th>
                <th className="py-3 px-3 text-right">Wallet Bal. (₹)</th>
                <th className="py-3 px-4 text-center">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#28485A]/20">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-300">
                    No members found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((member) => {
                  const hasHitCapping = (member.flushedMatchingIncome || 0) > 0 || (member.completedPairs || 0) >= 10;
                  const isRoot = member.id === 'FGPL000001';

                  return (
                    <tr key={member.id} className="border-b border-[#28485A]/50 hover:bg-[#1B3343]/40 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#6F9DB5]">
                      {/* ID & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-semibold text-white">{member.id}</span>
                              {isRoot && (
                                <span className="text-[9px] font-semibold bg-amber-950 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded">
                                  ROOT ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-gray-300 text-[11px] font-medium">{member.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                          member.status === 'Active'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-[#6F9DB5]/40'
                            : 'bg-red-950/80 text-red-400 border border-red-500/40'
                        }`}>
                          {member.status}
                        </span>
                      </td>

                      {/* Network L/R */}
                      <td className="py-3 px-3 text-center font-mono text-[11px]">
                        <span className="text-cyan-300 font-semibold">{member.leftMembers || 0}</span>
                        <span className="text-gray-300 mx-1">/</span>
                        <span className="text-cyan-300 font-semibold">{member.rightMembers || 0}</span>
                        <div className="text-[10px] text-gray-300">
                          {member.completedPairs || 0} Pairs
                        </div>
                      </td>

                      {/* Direct Income */}
                      <td className="py-3 px-3 text-right font-mono font-semibold text-[#35B779]">
                        ₹{(member.directIncome || 0).toLocaleString('en-IN')}
                        <div className="text-[10px] text-gray-300 font-normal">
                          {member.directJoins || 0} Directs
                        </div>
                      </td>

                      {/* Matching Income */}
                      <td className="py-3 px-3 text-right font-mono font-semibold text-cyan-300">
                        ₹{(member.matchingIncome || 0).toLocaleString('en-IN')}
                        <div className="text-[10px] text-gray-300 font-normal">
                          {Math.min(member.completedPairs || 0, 10)} Pairs Paid
                        </div>
                      </td>

                      {/* Flushed Capping Income */}
                      <td className="py-3 px-3 text-right font-mono">
                        {(member.flushedMatchingIncome || 0) > 0 ? (
                          <div>
                            <span className="font-semibold text-purple-400">₹{(member.flushedMatchingIncome || 0).toLocaleString('en-IN')}</span>
                            <div className="text-[10px] text-purple-300/80 font-normal">
                              +{member.flushedPairs} Pairs Flushed
                            </div>
                          </div>
                        ) : hasHitCapping ? (
                          <span className="text-amber-400 text-[10px] font-semibold">10/10 Capped</span>
                        ) : (
                          <span className="text-gray-300">₹0</span>
                        )}
                      </td>

                      {/* Level Income */}
                      <td className="py-3 px-3 text-right font-mono font-semibold text-amber-300">
                        ₹{(member.levelIncome || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Total Earned */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        ₹{(member.totalIncome || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Withdrawn */}
                      <td className="py-3 px-3 text-right font-mono text-gray-300">
                        ₹{(member.totalWithdrawn || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Wallet Balance */}
                      <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-300">
                        ₹{(member.availableBalance || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Control Button */}
                      <td className="py-3 px-4 text-center">
                        <Link
                          to="/admin/users"
                          className="px-2.5 py-1 bg-[#1B3343] hover:bg-[#28485A] text-white rounded-lg text-[11px] font-medium transition-colors inline-block"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
