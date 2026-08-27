import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Zap, 
  Award, 
  ArrowUpRight, 
  CheckCircle, 
  DollarSign, 
  Flame, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { getLeaderboardData, getCurrentUser, MlmUser, LeaderboardRank } from '@/lib/mlmStore';

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRank[]>([]);
  const [currentUser, setCurrentUser] = useState<MlmUser>(getCurrentUser());
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    const data = getLeaderboardData();
    setLeaderboard(data);
    setCurrentUser(getCurrentUser());
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('mlm_update', loadData);
    window.addEventListener('current_user_change', loadData);
    window.addEventListener('mlm_packages_update', loadData);

    // Auto polling every 10 seconds for real-time live synchronization
    const interval = setInterval(loadData, 10000);

    return () => {
      window.removeEventListener('mlm_update', loadData);
      window.removeEventListener('current_user_change', loadData);
      window.removeEventListener('mlm_packages_update', loadData);
      clearInterval(interval);
    };
  }, []);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  const myRankInfo = leaderboard.find(l => l.userId === currentUser?.id);

  const filteredList = leaderboard.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.package.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 p-6 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64 text-[#6F9DB5]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> Live Income Leaderboard
              </span>
              <span className="inline-flex items-center gap-1 bg-[#1B3343] text-[#35B779] border border-[#28485A]/50 text-xs font-medium px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#35B779] animate-ping inline-block" /> Real-Time Auto Sync
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              Top Earners & Champions
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              The member who earns the highest total income will automatically hold <strong className="text-[#35B779]">Rank #1</strong>. Rankings are calculated in real-time based on live network earnings!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 bg-[#071E2C] hover:bg-[#1B3343] border border-[#28485A]/50 px-4 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white transition-all shadow-sm"
              title="Refresh Ranks"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#6F9DB5]" />
              <span>Synced at: {lastRefreshed}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Current User Standing Card */}
      {myRankInfo && (
        <div className="bg-[#132C3C] border-2 border-[#6F9DB5]/40 rounded-2xl p-4 md:p-5 shadow-[0_0_15px_rgba(111,157,181,0.15)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shrink-0 ${
              myRankInfo.rank === 1 ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-gray-950 ring-4 ring-amber-400/40' :
              myRankInfo.rank === 2 ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-gray-950 ring-4 ring-slate-300/40' :
              myRankInfo.rank === 3 ? 'bg-gradient-to-tr from-amber-600 to-yellow-800 text-white ring-4 ring-amber-600/40' :
              'bg-[#071E2C] text-[#6F9DB5] border-2 border-[#28485A]'
            }`}>
              {myRankInfo.rank === 1 ? <Crown className="w-7 h-7" /> : `#${myRankInfo.rank}`}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Your Live Standing: Rank #{myRankInfo.rank}</h3>
                <span className="text-[10px] bg-[#071E2C] text-gray-300 border border-[#28485A]/50 px-2 py-0.5 rounded-full font-bold uppercase">
                  {myRankInfo.badge} Level
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Total Earned Income: <strong className="text-[#35B779] font-semibold text-sm">₹{myRankInfo.totalIncome.toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#071E2C] border border-[#28485A]/50 text-gray-300 text-xs font-semibold">
              <TrendingUp className="w-4 h-4 text-[#35B779]" />
              <span>Earn more to climb higher!</span>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* RANK 2 - Silver */}
        {top2 && (
          <div className="order-2 md:order-1 bg-[#132C3C] rounded-2xl border-2 border-slate-400/60 p-5 shadow-[0_0_15px_rgba(148,163,184,0.15)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-slate-300/20 text-slate-200 border border-slate-300/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              🥈 Rank #2
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-400 text-gray-900 flex items-center justify-center font-extrabold text-lg mb-3 shadow-md">
                <Medal className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">{top2.name}</h4>
              <p className="text-xs text-slate-300 font-mono">{top2.userId}</p>
              <div className="mt-4 pt-3 border-t border-[#28485A]/40 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">Total Income:</span>
                  <span className="text-[#35B779] font-bold text-base">₹{top2.totalIncome.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RANK 1 - Gold Champion */}
        {top1 && (
          <div className="order-1 md:order-2 bg-[#132C3C] rounded-2xl border-2 border-amber-400 p-6 shadow-[0_0_25px_rgba(251,191,36,0.25)] flex flex-col justify-between relative overflow-hidden transform md:-translate-y-2">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
            <div className="absolute top-3 right-3 bg-amber-400/20 text-amber-300 border border-amber-400/60 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> 👑 NO. 1 CHAMPION
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  {top1.avatar ? (
                    <img 
                      src={top1.avatar} 
                      alt={top1.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-gray-950 flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                      <Crown className="w-9 h-9 text-gray-950" />
                    </div>
                  )}
                </div>
              </div>
              <div className="inline-block bg-amber-400/20 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded border border-amber-400/40 mb-1">
                👑 Highest Income Earner
              </div>
              <h4 className="text-2xl font-black text-white">{top1.name}</h4>
              <p className="text-xs text-amber-200/90 font-mono">{top1.userId} • {top1.package}</p>
              <div className="mt-4 pt-3 border-t border-[#28485A]/40 space-y-2 bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/40">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Total Income:</span>
                  <span className="text-xl font-extrabold text-[#35B779]">₹{top1.totalIncome.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RANK 3 - Bronze */}
        {top3 && (
          <div className="order-3 bg-[#132C3C] rounded-2xl border-2 border-amber-700/60 p-5 shadow-[0_0_15px_rgba(217,119,6,0.15)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-amber-700/20 text-amber-400 border border-amber-700/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              🥉 Rank #3
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-800 text-white flex items-center justify-center font-extrabold text-lg mb-3 shadow-md">
                <Medal className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">{top3.name}</h4>
              <p className="text-xs text-amber-200/80 font-mono">{top3.userId}</p>
              <div className="mt-4 pt-3 border-t border-[#28485A]/40 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">Total Income:</span>
                  <span className="text-[#35B779] font-bold text-base">₹{top3.totalIncome.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Real-Time Rankings Table */}
      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
        <div className="p-5 border-b border-[#28485A]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#35B779]" /> Complete Performance Leaderboard
            </h3>
            <p className="text-xs text-gray-300">All registered users ranked in real-time by total earned income.</p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search user, ID or package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#071E2C] border border-[#28485A]/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6F9DB5]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-[#071E2C] text-xs uppercase font-semibold text-[#8FA3AF] border-b border-[#28485A]/40">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Leader / User</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Total Earned</th>
                <th className="px-6 py-4 text-right">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#28485A]/30">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-xs">
                    No leaderboard records found matching your search.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isCurrent = item.userId === currentUser?.id;

                  return (
                    <tr 
                      key={item.userId}
                      className={`transition-colors ${
                        isCurrent 
                          ? 'bg-[#1B3343]/70 font-medium' 
                          : 'hover:bg-[#1B3343]/40'
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {item.rank === 1 ? (
                            <span className="w-8 h-8 rounded-xl bg-amber-400 text-gray-950 font-black text-sm flex items-center justify-center shadow-sm">
                              👑 1
                            </span>
                          ) : item.rank === 2 ? (
                            <span className="w-8 h-8 rounded-xl bg-slate-300 text-gray-950 font-bold text-sm flex items-center justify-center shadow-sm">
                              🥈 2
                            </span>
                          ) : item.rank === 3 ? (
                            <span className="w-8 h-8 rounded-xl bg-amber-700 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                              🥉 3
                            </span>
                          ) : (
                            <span className="w-8 h-8 rounded-xl bg-[#071E2C] border border-[#28485A] text-gray-300 font-semibold text-xs flex items-center justify-center">
                              #{item.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* User Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          {item.avatar ? (
                            <img 
                              src={item.avatar} 
                              alt={item.name} 
                              className="w-9 h-9 rounded-full object-cover border-2 border-[#6F9DB5]/60 shadow-sm shrink-0" 
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#071E2C] border border-[#28485A] flex items-center justify-center font-bold text-white text-xs shrink-0">
                              {item.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {item.name}
                              {isCurrent && (
                                <span className="bg-[#35B779]/20 text-[#35B779] border border-[#35B779]/40 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-300 font-mono">{item.userId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Package Column */}
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          item.isFreeId || item.package.toLowerCase().includes('only registration') || item.package.toLowerCase().includes('free')
                            ? 'bg-purple-900/40 text-purple-300 border-purple-500/40'
                            : item.package.toLowerCase().includes('premium')
                            ? 'bg-[#35B779]/15 text-[#35B779] border-[#35B779]/40'
                            : 'bg-[#6F9DB5]/15 text-[#6F9DB5] border-[#6F9DB5]/40'
                        }`}>
                          {item.isFreeId || item.package.toLowerCase().includes('free') ? 'ONLY Registration' : item.package}
                        </span>
                      </td>

                      {/* Total Earned Column */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-base text-[#35B779]">
                          ₹{item.totalIncome.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-gray-300">
                          Auto Computed
                        </div>
                      </td>

                      {/* Standing Status */}
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          item.rank === 1
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-sm'
                            : item.rank <= 3
                            ? 'bg-[#6F9DB5]/20 text-[#6F9DB5] border-[#6F9DB5]/40'
                            : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          {item.rank === 1 ? 'No. 1 Rank' : `Top ${item.rank <= 10 ? '10' : '50'}`}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
