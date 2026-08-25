import React, { useState, useEffect } from 'react';
import { Package, Calendar, ShieldCheck, CheckCircle, Zap } from 'lucide-react';
import { getCurrentUser, MlmUser, getPackageForUser, getMlmPackages } from '@/lib/mlmStore';
import { formatDateTime } from '@/lib/utils';

export function MyPackagesPage() {
  const [currentUser, setCurrentUser] = useState<MlmUser>(getCurrentUser());

  const loadUser = () => {
    setCurrentUser(getCurrentUser());
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('mlm_update', loadUser);
    window.addEventListener('mlm_packages_update', loadUser);
    window.addEventListener('current_user_change', loadUser);
    return () => {
      window.removeEventListener('mlm_update', loadUser);
      window.removeEventListener('mlm_packages_update', loadUser);
      window.removeEventListener('current_user_change', loadUser);
    };
  }, []);

  const userPkg = getPackageForUser(currentUser);
  const pkgName = userPkg.name;
  const pkgPrice = `₹${userPkg.price.toLocaleString('en-IN')}`;
  const cappingAmount = `₹${userPkg.capping.toLocaleString('en-IN')}`;
  const pkgCapping = `${cappingAmount} / Day`;
  const joinedDateStr = currentUser.joined ? formatDateTime(currentUser.joined) : 'N/A';

  const purchaseHistory = [
    {
      id: `TXN-${currentUser.id}`,
      name: `${pkgName} Package`,
      price: currentUser.paymentAmount ? `₹${currentUser.paymentAmount.toLocaleString('en-IN')}` : pkgPrice,
      purchaseDate: joinedDateStr,
      capping: pkgCapping,
      status: currentUser.status === 'Active' ? 'Active' : 'Inactive'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">My Packages</h2>
        <p className="text-gray-300 text-sm">View your purchased plans, activation dates, and capping limits for {currentUser.id}.</p>
      </div>
      
      {/* Active Package Highlight */}
      <div className="bg-gradient-to-br from-[#1B3343] to-[#071E2C] rounded-2xl border border-[#28485A]/50 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Zap className="w-32 h-32 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                  currentUser.status === 'Active' 
                    ? 'bg-[#6F9DB5]/20 text-[#35B779] border-[#6F9DB5]/30' 
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  <CheckCircle className="w-3 h-3" /> {currentUser.status === 'Active' ? 'Active Plan' : currentUser.status}
                </span>
              </div>
              <h3 className="text-3xl font-semibold text-white mb-1">{pkgName} Package</h3>
              {currentUser.selectedProduct ? (
                <div className="flex items-center gap-2 my-2 bg-[#071E2C]/80 px-3 py-1.5 rounded-lg border border-[#28485A]/50 w-fit">
                  <span className="text-xs text-gray-300">Selected Product:</span>
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    {currentUser.selectedProduct.toLowerCase().includes('navy blue') && (
                      <span className="w-3 h-3 rounded-full bg-[#0A2540] border border-blue-400 inline-block" />
                    )}
                    {currentUser.selectedProduct.toLowerCase().includes('green') && (
                      <span className="w-3 h-3 rounded-full bg-[#059669] border border-emerald-300 inline-block" />
                    )}
                    {currentUser.selectedProduct}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 my-2 bg-[#071E2C]/80 px-3 py-1.5 rounded-lg border border-[#28485A]/50 w-fit">
                  <span className="text-xs text-gray-300">Selected Product:</span>
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#0A2540] border border-blue-400 inline-block" />
                    Suit Length & Pant (Navy Blue Colour)
                  </span>
                </div>
              )}
              <p className="text-white text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8FA3AF]" /> Activated on {joinedDateStr}
              </p>
           </div>
           <div className="bg-[#071E2C]/50 border border-[#28485A]/50 rounded-xl p-4 min-w-[200px]">
              <p className="inline-block bg-[#DDE2E5] text-black font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-2">Daily Capping Limit</p>
              <p className="text-2xl font-semibold text-yellow-400">{cappingAmount}</p>
              <p className="text-xs text-gray-300 mt-1">Maximum binary income per day</p>
           </div>
        </div>
      </div>

      {/* Purchase History */}
      <h3 className="text-lg font-semibold text-white mt-8 mb-4">Purchase History</h3>
      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-[#071E2C] text-xs uppercase font-medium text-[#8FA3AF]">
                <tr>
                  <th className="px-6 py-4">Package Details</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Daily Capping</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="">
                {purchaseHistory.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-[#28485A]/50 hover:bg-[#1B3343]/40 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#6F9DB5]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1B3343] flex items-center justify-center text-white">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-base">{pkg.name}</div>
                          {currentUser.selectedProduct && (
                            <div className="text-xs text-cyan-300 font-medium">Item: {currentUser.selectedProduct}</div>
                          )}
                          <div className="text-xs text-[#8FA3AF]">Txn: {pkg.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-300" />
                        <span>{pkg.purchaseDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#35B779]">
                      {pkg.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium text-white">{pkg.capping}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        pkg.status === 'Active' 
                          ? 'bg-emerald-900/30 text-[#35B779] border-emerald-800/50' 
                          : 'bg-gray-800 text-gray-300 border-[#35576A]'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
