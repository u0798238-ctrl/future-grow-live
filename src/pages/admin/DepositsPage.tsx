import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, Eye, X } from 'lucide-react';
import { getMlmUsers, MlmUser, activateUserAccount, rejectUserAccount } from '@/lib/mlmStore';
import { formatDateTime } from '@/lib/utils';

export function DepositsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [users, setUsers] = useState<MlmUser[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);
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
      if (newStatus === 'Approved') {
        activateUserAccount(userId);
      } else if (newStatus === 'Rejected') {
        rejectUserAccount(userId);
      }
      const { forceSyncUsers } = await import('@/lib/mlmStore');
      await forceSyncUsers();
      const allUsers = getMlmUsers();
      setUsers(allUsers);
      setSelectedDeposit(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allDeposits = users.flatMap(u => 
    (u.transactions || []).filter(tx => tx.type === 'Deposit').map(tx => ({
      userId: u.id,
      userName: u.name,
      screenshot: u.paymentProof,
      ...tx
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredDeposits = allDeposits.filter(d => {
    const matchesStatus = statusFilter === 'All' || (d.status || 'Pending') === statusFilter;
    const matchesSearch = d.userId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.utr && d.utr.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Deposit Requests</h2>
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
              placeholder="Search by User ID, Name, or UTR (HTX)..." 
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
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method & UTR/HTX</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredDeposits.map((deposit) => {
                const currentStatus = deposit.status || 'Pending';
                return (
                  <tr key={deposit.id} className="border-b border-[#28485A]/50 hover:bg-[#1B3343]/40 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#6F9DB5]">
                    <td className="px-6 py-4 font-mono text-xs">{deposit.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{deposit.userId}</div>
                      <div className="text-xs text-gray-300">{deposit.userName}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#35B779]">₹{deposit.amount}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-300 font-mono">HTX/UTR: <span className="text-white">{deposit.utr}</span></div>
                    </td>
                    <td className="px-6 py-4 text-xs text-white">
                      {formatDateTime(deposit.date)}
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
                        onClick={() => setSelectedDeposit(deposit)}
                        className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-[#071E2C] hover:bg-[#1B3343] text-[#8FA3AF] hover:text-white border border-[#28485A]/50 rounded text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View / Action
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredDeposits.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-300">No deposit requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Deposit Modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#28485A]/30 flex justify-between items-center bg-[#1B3343]/30">
              <h3 className="font-semibold text-white flex items-center gap-2">
                Deposit Details
              </h3>
              <button 
                onClick={() => setSelectedDeposit(null)} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/30">
                  <p className="text-[10px] text-gray-300 uppercase font-semibold mb-1">User ID</p>
                  <p className="text-sm text-white font-medium">{selectedDeposit.userId}</p>
                  <p className="text-xs text-gray-300">{selectedDeposit.userName}</p>
                </div>
                <div className="bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/30">
                  <p className="text-[10px] text-gray-300 uppercase font-semibold mb-1">Amount Requested</p>
                  <p className="text-lg text-[#35B779] font-semibold">₹{selectedDeposit.amount}</p>
                </div>
              </div>

              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#28485A]/30">
                <p className="text-[10px] text-gray-300 uppercase font-semibold mb-1">Transaction ID / UTR / HTX</p>
                <p className="text-base font-mono text-white break-all bg-[#1B3343]/20 p-2 rounded border border-[#28485A]/30">
                  {selectedDeposit.utr || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-300 uppercase font-semibold mb-2">Payment Screenshot</p>
                <div className="bg-[#071E2C] rounded-xl border border-[#28485A]/30 p-2 flex items-center justify-center min-h-[200px]">
                  {selectedDeposit.screenshot ? (
                    <img src={selectedDeposit.screenshot} alt="Payment Proof" className="max-w-full max-h-[300px] object-contain rounded" />
                  ) : (
                    <p className="text-sm text-gray-300">No screenshot provided.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#28485A]/30 bg-[#1B3343]/10 flex justify-end gap-3 shrink-0">
              {(!selectedDeposit.status || selectedDeposit.status === 'Pending') ? (
                <>
                  <button 
                    disabled={isSubmitting}
                    onClick={() => handleStatusChange(selectedDeposit.userId, selectedDeposit.id, 'Rejected')}
                    className="px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white text-sm font-semibold rounded-lg transition-colors border border-red-500/30"
                  >
                    {isSubmitting ? '...' : 'Reject Deposit'}
                  </button>
                  <button 
                    disabled={isSubmitting}
                    onClick={() => handleStatusChange(selectedDeposit.userId, selectedDeposit.id, 'Approved')}
                    className="px-6 py-2 bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                  >
                    {isSubmitting ? 'Processing...' : 'Approve & Add Funds'}
                  </button>
                </>
              ) : (
                <div className="w-full flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedDeposit.status === 'Approved' ? 'bg-emerald-900/30 text-[#35B779]' : 'bg-red-900/30 text-red-400'
                  }`}>
                    Status: {selectedDeposit.status}
                  </span>
                  <button 
                    onClick={() => setSelectedDeposit(null)}
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
