import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, Eye, X, Copy, Check } from 'lucide-react';
import { getMlmUsers, MlmUser } from '@/lib/mlmStore';
import { copyTextToClipboard, formatDateTime } from '@/lib/utils';

export function WithdrawalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [users, setUsers] = useState<MlmUser[]>([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = () => setUsers(getMlmUsers());
    loadData();
    window.addEventListener('mlm_update', loadData);
    return () => window.removeEventListener('mlm_update', loadData);
  }, []);

  const handleStatusChange = async (userId: string, txId: string, newStatus: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
    let allUsers = getMlmUsers();
    const user = allUsers.find(u => u.id === userId);
    if (user) {
       const tx = user.transactions.find(t => t.id === txId);
       if (tx && tx.status === 'Pending') {
         tx.status = newStatus as any;
         
         // If rejected, refund the money to user's available balance
         if (newStatus === 'Rejected') {
            user.availableBalance += tx.amount;
            user.totalWithdrawn -= tx.amount;
         }
         
         localStorage.setItem('mlm_users', JSON.stringify(allUsers));
         
         const { pushMlmStateToSupabase } = await import('@/lib/mlmStore');
            pushMlmStateToSupabase('mlm_users', allUsers);


         
         window.dispatchEvent(new Event('mlm_update'));
         setUsers(allUsers);
         setSelectedWithdrawal(null);
       }
    }
    } finally {
       setIsSubmitting(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const allWithdrawals = users.flatMap(u => 
    (u.transactions || []).filter(tx => tx.type === 'Withdrawal').map(tx => ({
      userId: u.id,
      userName: u.name,
      ...tx
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredWithdrawals = allWithdrawals.filter(w => {
    const matchesStatus = statusFilter === 'All' || (w.status || 'Pending') === statusFilter;
    const matchesSearch = w.userId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Withdrawal Requests</h2>
      </div>

      <div className="flex gap-4">
        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
          <button 
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status 
                ? 'bg-[#1B3343] text-white border border-[#28485A]' 
                : 'bg-[#132C3C] text-gray-300 border border-[#28485A]/30 hover:bg-[#1B3343]/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-[#28485A]/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <input 
              type="text" 
              placeholder="Search by User ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#071E2C] border border-[#28485A]/50 rounded-lg text-sm text-white focus:outline-none focus:border-[#28485A] focus:ring-1 focus:ring-[#28485A]"
            />
            <Search className="w-4 h-4 text-gray-300 absolute left-3 top-2.5" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-[#071E2C] text-xs uppercase font-medium text-[#8FA3AF]">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Gross Amount</th>
                <th className="px-6 py-4">Deductions</th>
                <th className="px-6 py-4">Net Payout</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredWithdrawals.map((withdrawal) => {
                const currentStatus = withdrawal.status || 'Pending';
                return (
                  <tr key={withdrawal.id} className="border-b border-[#28485A]/50 hover:bg-[#1B3343]/40 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#6F9DB5]">
                    <td className="px-6 py-4 font-mono text-xs">{withdrawal.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{withdrawal.userId}</div>
                      <div className="text-xs text-gray-300">{withdrawal.userName}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">₹{withdrawal.amount}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-orange-400">TDS: ₹{withdrawal.tds || 0}</div>
                      <div className="text-xs text-orange-400">Admin: ₹{withdrawal.adminCharge || 0}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#35B779]">₹{withdrawal.netAmount || withdrawal.amount}</td>
                    <td className="px-6 py-4 text-xs text-white">
                      {formatDateTime(withdrawal.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                        currentStatus === 'Approved' ? 'bg-emerald-900/30 text-[#35B779] border border-emerald-800/50' : 
                        currentStatus === 'Rejected' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 
                        'bg-amber-900/30 text-amber-400 border border-amber-800/50'
                      }`}>
                        {currentStatus === 'Approved' && <CheckCircle className="w-3 h-3" />}
                        {currentStatus === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {currentStatus === 'Pending' && <Clock className="w-3 h-3" />}
                        {currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedWithdrawal(withdrawal)}
                        className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-[#071E2C] hover:bg-[#1B3343] text-[#8FA3AF] hover:text-white border border-[#28485A]/50 rounded text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View / Pay
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredWithdrawals.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-300">No withdrawal requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View/Pay Withdrawal Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#28485A]/30 flex justify-between items-center bg-[#1B3343]/30">
              <h3 className="font-semibold text-white flex items-center gap-2">
                Withdrawal Payment Details
              </h3>
              <button 
                onClick={() => setSelectedWithdrawal(null)} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/30 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-gray-300 uppercase font-semibold mb-1">User ID</p>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm text-white font-mono font-semibold">{selectedWithdrawal.userId}</p>
                      <button 
                        onClick={() => handleCopy(selectedWithdrawal.userId, 'userId')} 
                        className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${copiedKey === 'userId' ? 'bg-[#6F9DB5] text-white' : 'bg-[#1B3343]/50 hover:bg-[#1B3343] text-white hover:text-white'}`}
                        title="Copy User ID"
                      >
                        {copiedKey === 'userId' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedKey === 'userId' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 truncate">{selectedWithdrawal.userName}</p>
                </div>
                <div className="bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/30 border-l-4 border-l-[#6F9DB5] flex flex-col justify-between">
                  <p className="text-[10px] text-gray-300 uppercase font-semibold mb-1">Net Payout to Transfer</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xl text-[#35B779] font-semibold">
                      ₹{selectedWithdrawal.netAmount || selectedWithdrawal.amount}
                    </p>
                    <button 
                      onClick={() => handleCopy(String(selectedWithdrawal.netAmount || selectedWithdrawal.amount), 'amount')} 
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${copiedKey === 'amount' ? 'bg-[#6F9DB5] text-white' : 'bg-[#1B3343] hover:bg-[#28485A] text-white'}`}
                      title="Copy Amount"
                    >
                      {copiedKey === 'amount' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px] font-semibold">{copiedKey === 'amount' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#28485A]/30">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 border-b border-[#28485A]/30 pb-2">
                  Payment Destination ({selectedWithdrawal.withdrawalMethod === 'bank' ? 'Bank Transfer' : 'UPI'})
                </h4>
                
                {selectedWithdrawal.withdrawalMethod === 'upi' ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-gray-300 uppercase font-semibold mb-1">UPI ID</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={selectedWithdrawal.upiId || 'Not provided'}
                          className="text-sm font-mono text-white bg-[#1B3343]/20 px-3 py-2 rounded-lg border border-[#28485A]/30 flex-1 select-all cursor-text focus:outline-none focus:border-[#6F9DB5]"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        {selectedWithdrawal.upiId && (
                          <button 
                            onClick={() => handleCopy(selectedWithdrawal.upiId, 'upi')} 
                            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${copiedKey === 'upi' ? 'bg-[#6F9DB5] text-white' : 'bg-[#6F9DB5]/80 hover:bg-[#6F9DB5] text-white'}`}
                            title="Copy UPI ID"
                          >
                            {copiedKey === 'upi' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedKey === 'upi' ? 'Copied!' : 'Copy UPI'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-gray-300 uppercase font-semibold mb-1">Account Number</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={selectedWithdrawal.bankAccount || 'Not provided'}
                          className="text-sm font-mono text-white bg-[#1B3343]/20 px-3 py-2 rounded-lg border border-[#28485A]/30 flex-1 select-all cursor-text focus:outline-none focus:border-[#6F9DB5]"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        {selectedWithdrawal.bankAccount && (
                          <button 
                            onClick={() => handleCopy(selectedWithdrawal.bankAccount, 'bankAccount')} 
                            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${copiedKey === 'bankAccount' ? 'bg-[#6F9DB5] text-white' : 'bg-[#1B3343] hover:bg-[#28485A] text-white'}`}
                            title="Copy Account Number"
                          >
                            {copiedKey === 'bankAccount' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedKey === 'bankAccount' ? 'Copied!' : 'Copy Account'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-300 uppercase font-semibold mb-1">IFSC Code</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={selectedWithdrawal.ifscCode || 'Not provided'}
                          className="text-sm font-mono text-white bg-[#1B3343]/20 px-3 py-2 rounded-lg border border-[#28485A]/30 flex-1 uppercase select-all cursor-text focus:outline-none focus:border-[#6F9DB5]"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        {selectedWithdrawal.ifscCode && (
                          <button 
                            onClick={() => handleCopy(selectedWithdrawal.ifscCode, 'ifsc')} 
                            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${copiedKey === 'ifsc' ? 'bg-[#6F9DB5] text-white' : 'bg-[#1B3343] hover:bg-[#28485A] text-white'}`}
                            title="Copy IFSC"
                          >
                            {copiedKey === 'ifsc' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedKey === 'ifsc' ? 'Copied!' : 'Copy IFSC'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-[#28485A]/30 bg-[#1B3343]/10 flex justify-end gap-3 shrink-0">
              {(!selectedWithdrawal.status || selectedWithdrawal.status === 'Pending') ? (
                <>
                  <button 
                    onClick={() => handleStatusChange(selectedWithdrawal.userId, selectedWithdrawal.id, 'Rejected')}
                    className="px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white text-sm font-semibold rounded-lg transition-colors border border-red-500/30"
                  >
                    Reject & Refund
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedWithdrawal.userId, selectedWithdrawal.id, 'Approved')}
                    className="px-6 py-2 bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                  >
                    Mark as Paid
                  </button>
                </>
              ) : (
                <div className="w-full flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedWithdrawal.status === 'Approved' ? 'bg-emerald-900/30 text-[#35B779]' : 'bg-red-900/30 text-red-400'
                  }`}>
                    Status: {selectedWithdrawal.status}
                  </span>
                  <button 
                    onClick={() => setSelectedWithdrawal(null)}
                    className="px-4 py-2 bg-[#132C3C] hover:bg-[#1B3343] text-white text-sm font-medium rounded-lg transition-colors border border-[#28485A]/30"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
