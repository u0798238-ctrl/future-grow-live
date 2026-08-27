import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Search, Calendar, User, Package, IndianRupee, Phone } from 'lucide-react';
import { getMlmUsers, getCurrentUserId, MlmUser, getPackageForUser } from '@/lib/mlmStore';
import { formatDateTime } from '@/lib/utils';

export function MyTeamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState<MlmUser[]>([]);
  const currentUserId = getCurrentUserId();

  const loadTeam = () => {
    const users = getMlmUsers();
    const meId = getCurrentUserId();
    // Find all users where the sponsorId matches my ID
    const myDirects = users.filter(u => u.sponsorId === meId);
    setTeamMembers(myDirects);
  };

  useEffect(() => {
    loadTeam();
    window.addEventListener('mlm_update', loadTeam);
    window.addEventListener('current_user_change', loadTeam);
    window.addEventListener('mlm_packages_update', loadTeam);
    return () => {
      window.removeEventListener('mlm_update', loadTeam);
      window.removeEventListener('current_user_change', loadTeam);
      window.removeEventListener('mlm_packages_update', loadTeam);
    };
  }, []);

  const filteredTeam = teamMembers.filter(member => 
    member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.package && member.package.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalDirects = teamMembers.length;
  const activeDirects = teamMembers.filter(m => m.status === 'Active').length;
  const inactiveDirects = totalDirects - activeDirects;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">My Direct Team</h2>
        <p className="text-gray-300 text-sm">View and manage the members who joined directly under your referral code, their package details, and activation amounts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm mb-1">Total Directs</p>
            <h3 className="text-2xl font-semibold text-white">{totalDirects}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm mb-1">Active Directs</p>
            <h3 className="text-2xl font-semibold text-[#35B779]">{activeDirects}</h3>
          </div>
          <div className="w-12 h-12 bg-[#6F9DB5]/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-[#35B779]" />
          </div>
        </div>

        <div className="bg-[#132C3C] p-5 rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm mb-1">Inactive Directs</p>
            <h3 className="text-2xl font-semibold text-red-400">{inactiveDirects}</h3>
          </div>
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-[#28485A]/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-white">Direct Referrals</h3>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-300" />
            </div>
            <input
              type="text"
              placeholder="Search by Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#28485A] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-[#071E2C] text-xs uppercase font-medium text-[#8FA3AF]">
              <tr>
                <th className="px-5 py-4">User Details</th>
                <th className="px-5 py-4">Position</th>
                <th className="px-5 py-4">Join Date & Time</th>
                <th className="px-5 py-4">ID Amount</th>
                <th className="px-5 py-4">Selected Package & Product</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredTeam.length > 0 ? (
                filteredTeam.map((member) => {
                  const isOnlyReg = member.isFreeId || member.package?.toLowerCase().includes('free') || member.package?.toLowerCase().includes('only registration') || member.paymentAmount === 0;
                  const pkg = getPackageForUser(member);
                  const isBasic = member.package?.toLowerCase().includes('basic') || member.paymentAmount === 6699;
                  const idAmount = isOnlyReg ? 0 : (member.paymentAmount || pkg.price || 6699);
                  const selectedProd = isOnlyReg ? 'ONLY Registration' : (member.selectedProduct || (isBasic ? 'Suit Length (Single Piece)' : 'Suit Length & Pant'));
                  
                  return (
                    <tr key={member.id} className="border-b border-[#28485A]/50 hover:bg-[#1B3343]/40 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#6F9DB5]">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1B3343] border border-[#28485A] flex items-center justify-center text-white">
                            <User className="w-4 h-4 text-blue-300" />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{member.name}</div>
                            <div className="text-xs text-[#8FA3AF] font-mono">{member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${member.position === 'Left' ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50' : 'bg-orange-900/40 text-orange-300 border border-orange-700/50'}`}>
                          {member.position}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-200">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDateTime(member.joined)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-sm ${
                          isOnlyReg 
                            ? 'bg-purple-950/50 text-purple-200 border-purple-400/40' 
                            : 'bg-[#071E2C] text-[#35B779] border-[#28485A]/60'
                        }`}>
                          <IndianRupee className="w-3.5 h-3.5" />
                          <span>{idAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shadow-sm ${
                              isOnlyReg 
                                ? 'bg-purple-950/70 text-purple-200 border-purple-400/50' 
                                : isBasic 
                                ? 'bg-[#6F9DB5]/20 text-[#6F9DB5] border border-[#6F9DB5]/40' 
                                : 'bg-[#35B779]/20 text-[#35B779] border border-[#35B779]/40'
                            }`}>
                              {isOnlyReg ? 'ONLY Registration' : (pkg.name || (isBasic ? 'Basic' : 'Premium'))}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 flex items-center gap-1">
                            <Package className="w-3 h-3 text-[#8FA3AF]" />
                            <span>{selectedProd}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          member.status === 'Active' 
                            ? 'bg-emerald-900/30 text-[#35B779] border-emerald-800/50' 
                            : 'bg-red-900/30 text-red-400 border-red-800/50'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-300">
                    No direct referrals found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
