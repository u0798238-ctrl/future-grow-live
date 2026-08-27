import React, { useState, useEffect } from 'react';
import { Search, IndianRupee, ArrowDownCircle, Trophy, Network, User } from 'lucide-react';
import { getMlmUsers, MlmUser, Transaction } from '@/lib/mlmStore';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface EnrichedTransaction extends Transaction {
  receiverId: string;
  receiverName: string;
}

export function IncomeDistributionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);

  useEffect(() => {
    const loadData = () => {
      const users = getMlmUsers();
      let allTx: EnrichedTransaction[] = [];
      
      users.forEach(u => {
        const incomeTxs = u.transactions.filter(t => 
          t.type === 'Direct' || t.type === 'Matching' || t.type === 'Level'
        );
        
        incomeTxs.forEach(t => {
            // Ignore custom bonuses that are marked as Direct for now, or keep them
            if (t.amount > 0) {
                allTx.push({
                    ...t,
                    receiverId: u.id,
                    receiverName: u.name
                });
            }
        });
      });
      
      // Sort by date, newest first
      allTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setTransactions(allTx);
    };
    
    loadData();
    window.addEventListener('mlm_update', loadData);
    return () => window.removeEventListener('mlm_update', loadData);
  }, []);

  const filteredTx = transactions.filter(tx => {
    const matchesSearch = 
      tx.receiverId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filterType === 'All' ? true : tx.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getIconForType = (type: string) => {
    switch (type) {
        case 'Direct': return <User className="w-4 h-4 text-emerald-400" />;
        case 'Matching': return <Network className="w-4 h-4 text-blue-400" />;
        case 'Level': return <Trophy className="w-4 h-4 text-purple-400" />;
        default: return <IndianRupee className="w-4 h-4 text-white" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
        case 'Direct': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
        case 'Matching': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
        case 'Level': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Income Distribution</h1>
          <p className="text-[#8FA3AF] mt-1 text-sm sm:text-base">
            Track all direct, matching, and level income distributions.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#132C3C] p-4 rounded-xl border border-[#1B3343] flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8FA3AF]" />
          <input
            type="text"
            placeholder="Search by ID, Name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#071E2C] border border-[#1B3343] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-[#8FA3AF] focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {['All', 'Direct', 'Matching', 'Level'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all border",
                filterType === type
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-[#071E2C] text-[#8FA3AF] border-[#1B3343] hover:bg-[#1B3343]/50"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#132C3C] rounded-xl border border-[#1B3343] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1B3343] bg-[#071E2C]/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider">Receiver</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider">Income Source</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider">Income Type</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B3343]">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#8FA3AF]">
                    <div className="flex flex-col items-center justify-center">
                      <IndianRupee className="w-12 h-12 mb-3 opacity-20" />
                      <p>No income distributions found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx, idx) => (
                  <tr key={`${tx.id}-${idx}`} className="hover:bg-[#071E2C]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#8FA3AF]">{formatDateTime(tx.date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                          <span className="text-emerald-400 font-bold text-xs">
                            {tx.receiverName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{tx.receiverName}</div>
                          <div className="text-xs text-[#8FA3AF] font-mono">{tx.receiverId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{tx.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                        getBadgeColor(tx.type)
                      )}>
                        {getIconForType(tx.type)}
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-semibold text-emerald-400">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
