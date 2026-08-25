import React, { useState, useEffect } from 'react';
import { getCurrentUser, MlmUser, Transaction } from '@/lib/mlmStore';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Wallet, Activity, Gift, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDateTime } from '@/lib/utils';

export function WalletPage() {
  const [userStats, setUserStats] = useState<MlmUser>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'All' | 'Direct' | 'Matching' | 'Level' | 'Withdrawal'>('All');

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

  if (!userStats) return null;

  const transactions = userStats.transactions || [];
  
  const filteredTransactions = activeTab === 'All' 
    ? transactions 
    : transactions.filter(t => t.type === activeTab);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Direct': return <Activity className="w-5 h-5 text-blue-400" />;
      case 'Matching': return <DollarSign className="w-5 h-5 text-purple-400" />;
      case 'Level': return <Gift className="w-5 h-5 text-emerald-400" />;
      case 'Withdrawal': return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      default: return <ArrowDownLeft className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'Direct': return 'bg-blue-500/10 border-blue-500/30';
      case 'Matching': return 'bg-purple-500/10 border-purple-500/30';
      case 'Level': return 'bg-emerald-500/10 border-emerald-500/30';
      case 'Withdrawal': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Wallet & Ledger</h2>
          <p className="text-gray-300 text-sm mt-1">Track your earnings and transaction history</p>
        </div>
      </div>

      {/* Main Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#132C3C] p-6 rounded-2xl border border-[#6F9DB5]/50 shadow-sm flex items-center justify-between">
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-3 py-1 rounded-md text-xs uppercase tracking-wider mb-2">Available Balance</p>
            <p className="text-3xl lg:text-4xl font-semibold text-white">₹{new Intl.NumberFormat('en-IN').format(userStats.availableBalance || 0)}</p>
          </div>
          <div className="w-14 h-14 bg-[#1B3343]/50 rounded-full flex items-center justify-center shrink-0">
            <Wallet className="w-7 h-7 text-blue-400" />
          </div>
        </div>
        <div className="bg-[#132C3C] p-6 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-3 py-1 rounded-md text-xs uppercase tracking-wider mb-2">Total Income</p>
            <p className="text-3xl lg:text-4xl font-semibold text-white">₹{new Intl.NumberFormat('en-IN').format(userStats.totalIncome || 0)}</p>
          </div>
          <div className="w-14 h-14 bg-[#1B3343]/50 rounded-full flex items-center justify-center shrink-0">
            <DollarSign className="w-7 h-7 text-[#8FA3AF]" />
          </div>
        </div>
        <div className="bg-[#132C3C] p-6 rounded-2xl border border-red-500/50 shadow-sm flex items-center justify-between">
          <div>
            <p className="inline-block bg-[#DDE2E5] text-black font-bold px-3 py-1 rounded-md text-xs uppercase tracking-wider mb-2">Total Withdrawn</p>
            <p className="text-3xl lg:text-4xl font-semibold text-white">₹{new Intl.NumberFormat('en-IN').format(userStats.totalWithdrawn || 0)}</p>
          </div>
          <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-7 h-7 text-red-400" />
          </div>
        </div>
      </div>

      {/* Quick Stats with Capping Indicators with Green Frame */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Direct Referral Income */}
        <div className="bg-[#1B3343]/40 p-4 rounded-xl border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:border-emerald-400 hover:shadow-[0_0_22px_rgba(16,185,129,0.4)] transition-all duration-300 relative">
          <span className="absolute top-3 right-3 text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
            Unlimited
          </span>
          <p className="text-xs text-gray-300 uppercase font-medium">Direct Referral Income</p>
          <p className="text-xl font-semibold text-white mt-1">₹{new Intl.NumberFormat('en-IN').format(userStats.directIncome || 0)}</p>
          <p className="text-xs text-emerald-400 mt-1 font-medium">{userStats.directJoins} Directs (₹1,500 ea)</p>
        </div>

        {/* Matching Income */}
        <div className="bg-[#1B3343]/40 p-4 rounded-xl border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:border-emerald-400 hover:shadow-[0_0_22px_rgba(16,185,129,0.4)] transition-all duration-300 relative">
          <span className="absolute top-3 right-3 text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
            Capping: ₹10k/Day
          </span>
          <p className="text-xs text-gray-300 uppercase font-medium">Matching Income</p>
          <p className="text-xl font-semibold text-white mt-1">₹{new Intl.NumberFormat('en-IN').format(userStats.matchingIncome || 0)}</p>
          <p className="text-xs text-emerald-400 mt-1 font-medium">
            {userStats.completedPairs} Pairs (Max 10 / ₹10,000 Day)
          </p>
        </div>

        {/* Level Income */}
        <div className="bg-[#1B3343]/40 p-4 rounded-xl border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:border-emerald-400 hover:shadow-[0_0_22px_rgba(16,185,129,0.4)] transition-all duration-300 relative">
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <span className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
              Unlimited
            </span>
          </div>
          <p className="text-xs text-gray-300 uppercase font-medium">Level Income</p>
          <p className="text-xl font-semibold text-white mt-1">
            ₹{new Intl.NumberFormat('en-IN').format(userStats.levelIncome || 0)}
          </p>
          <p className="text-xs text-emerald-400 mt-1 font-medium">From 20 Levels Matrix</p>
        </div>
      </div>

      {/* Ledger History */}
      <Card className="bg-[#132C3C] border-[#28485A]/50">
        <div className="border-b border-[#28485A]/30">
          <div className="flex overflow-x-auto">
            {['All', 'Direct', 'Matching', 'Level', 'Withdrawal'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab} Transactions
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F9DB5]" />
                )}
              </button>
            ))}
          </div>
        </div>
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-300">
              No {activeTab !== 'All' ? activeTab : ''} transactions found
            </div>
          ) : (
            <div className="divide-y divide-[#28485A]/20">
              {filteredTransactions.map((tx, idx) => (
                <div 
                  key={`${tx.id}-${idx}`} 
                  className="p-4 sm:p-6 flex items-center justify-between transition-colors hover:bg-[#1B3343]/20"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${getBg(tx.type)}`}>
                      {tx.type === 'Level' ? <Trophy className="w-5 h-5 text-amber-400" /> : getIcon(tx.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{tx.description}</p>
                        {tx.type === 'Level' && (
                          <span className="text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded uppercase tracking-wider">
                            Level Reward
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${getBg(tx.type)}`}>
                          {tx.type}
                        </span>
                        <span className="text-xs text-gray-300">
                          {formatDateTime(tx.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${tx.type === 'Withdrawal' ? 'text-red-400' : 'text-white'}`}>
                      {tx.type === 'Withdrawal' ? '-' : '+'}₹{new Intl.NumberFormat('en-IN').format(tx.amount)}
                    </p>
                    {tx.type === 'Withdrawal' && (
                      <div className="flex flex-col items-end gap-1 mt-1">
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${tx.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' : tx.status === 'Approved' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-400'}`}>
                          {tx.status || 'Pending'}
                        </span>
                        {tx.netAmount && (
                          <span className="text-[10px] text-gray-300">
                            Net: ₹{tx.netAmount} (-10% TDS/Admin)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
