import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Circle, Activity } from 'lucide-react';
import { INITIAL_LEVELS } from '../admin/LevelIncomePage';
import { getCurrentUser, MlmUser } from '@/lib/mlmStore';

export function UserLevelIncomePage() {
  const [levels, setLevels] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'levels' | 'history'>('levels');
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [userStats, setUserStats] = useState<MlmUser>(getCurrentUser());

  const loadStats = () => {
    setUserStats(getCurrentUser());
    const saved = localStorage.getItem('app_levels_v3');
    if (saved) {
      setLevels(JSON.parse(saved));
    } else {
      setLevels(INITIAL_LEVELS);
    }
    const savedStatus = localStorage.getItem('app_level_system_active');
    if (savedStatus !== null) {
      setIsSystemActive(JSON.parse(savedStatus));
    }
  };

  useEffect(() => {
    loadStats();
    window.addEventListener('mlm_update', loadStats);
    window.addEventListener('storage', loadStats);
    window.addEventListener('current_user_change', loadStats);
    return () => {
      window.removeEventListener('mlm_update', loadStats);
      window.removeEventListener('storage', loadStats);
      window.removeEventListener('current_user_change', loadStats);
    };
  }, []);

  // Compute completed levels on the fly
  const currentLeft = userStats?.leftMembers || 0;
  const currentRight = userStats?.rightMembers || 0;
  
  const completedLevels = levels.filter(lvl => 
    lvl.status === 'Active' && 
    lvl.leftId > 0 && 
    lvl.rightId > 0 && 
    currentLeft >= lvl.leftId && 
    currentRight >= lvl.rightId
  ).map(lvl => lvl.id);

  const formatDisplayNum = (val: number) => val === 0 ? '—' : new Intl.NumberFormat('en-IN').format(val);
  const formatCurrency = (val: number) => val === 0 ? '—' : `₹${new Intl.NumberFormat('en-IN').format(val)}`;

  if (!isSystemActive) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[#132C3C] rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
        <div className="w-16 h-16 bg-[#1B3343]/30 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
          <Trophy className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Level Income is Currently Disabled</h2>
        <p className="text-gray-300 max-w-md">
          The Level Income system is currently under maintenance or disabled by the administration. Please check back later.
        </p>
      </div>
    );

  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">My Level Income</h2>
          <p className="text-gray-300 text-sm mt-1">Track your binary matching progress and level rewards</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="bg-[#1B3343]/30 border border-emerald-500/40 px-4 py-2 rounded-lg text-center min-w-[120px]">
            <p className="text-xs text-gray-300 uppercase tracking-wider">Total Level Income</p>
            <p className="text-lg font-semibold text-emerald-400">{!userStats?.levelIncome ? '₹0' : `₹${new Intl.NumberFormat('en-IN').format(userStats.levelIncome)}`}</p>
          </div>
          <div className="bg-[#1B3343]/30 border border-emerald-500/40 px-4 py-2 rounded-lg text-center min-w-[120px]">
            <p className="text-xs text-gray-300 uppercase tracking-wider">Levels Completed</p>
            <p className="text-lg font-semibold text-emerald-300">{completedLevels.length} / 20</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#28485A]/30">
        <button
          onClick={() => setActiveTab('levels')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'levels' 
              ? 'border-emerald-400 text-emerald-300' 
              : 'border-transparent text-gray-300 hover:text-white'
          }`}
        >
          Level 1-20
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'history' 
              ? 'border-emerald-400 text-emerald-300' 
              : 'border-transparent text-gray-300 hover:text-white'
          }`}
        >
          Income History
        </button>
      </div>

      {activeTab === 'levels' && (

      <div className="bg-[#132C3C] rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-[#071E2C] text-xs uppercase font-medium text-[#8FA3AF]">
              <tr>
                <th className="px-6 py-4 text-right w-16">Level</th>
                <th className="px-6 py-4">Level Name</th>
                <th className="px-6 py-4 text-right">Required Left</th>
                <th className="px-6 py-4 text-right">Required Right</th>
                <th className="px-6 py-4 text-right">Target Income</th>
                <th className="px-6 py-4 text-right">Earned Income</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="">
              {levels.map((lvl) => {
                const isCompleted = completedLevels.includes(lvl.id);
                // Based on user request, income is 0 until complete
                const earnedIncome = isCompleted ? lvl.income : 0;
                
                return (
                  <tr 
                    key={lvl.id} 
                    className={`border-b border-[#28485A]/50 transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-emerald-950/20 border-l-4 border-l-emerald-400 hover:bg-emerald-950/30' 
                        : 'border-l-4 border-l-transparent hover:bg-[#1B3343]/40 hover:border-l-emerald-400'
                    }`}
                  >
                    <td className="px-6 py-4 text-right font-bold text-gray-200">
                      {lvl.level}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#1B3343]/50 text-emerald-400'}`}>
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isCompleted ? 'text-emerald-300 font-bold' : 'text-white'}`}>{lvl.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-200">
                      {formatDisplayNum(lvl.leftId)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-200">
                      {formatDisplayNum(lvl.rightId)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-300">
                      {formatCurrency(lvl.income)}
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold ${isCompleted ? 'text-emerald-400 font-bold text-base' : 'text-white'}`}>
                      {formatCurrency(earnedIncome)}
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-emerald-300 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-xs font-semibold shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Achieved</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-400 px-2.5 py-1 bg-[#071E2C] border border-[#28485A]/40 rounded-full text-xs font-medium">
                          <Circle className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-[#132C3C] rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 overflow-hidden">
          {completedLevels.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Income History</h3>
              <p className="text-gray-300">You haven't earned any Level Income yet. Build your team to achieve levels!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white">
                <thead className="bg-[#071E2C] text-xs uppercase font-medium text-[#8FA3AF]">
                  <tr>
                    <th className="px-6 py-4">Achieved Level</th>
                    <th className="px-6 py-4 text-right">Amount Earned</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="">
                  {completedLevels.map(levelId => {
                    const lvlData = levels.find(l => l.id === levelId);
                    if (!lvlData) return null;
                    return (
                      <tr key={`hist-${levelId}`} className="border-b border-[#28485A]/50 bg-emerald-950/15 hover:bg-emerald-950/25 transition-all duration-200 border-l-4 border-l-emerald-400">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">L{lvlData.level}</span>
                            <span className="font-semibold text-white">{lvlData.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-400 text-base">
                          {formatCurrency(lvlData.income)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Credited
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
