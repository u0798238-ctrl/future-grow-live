import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Users, Shield, ArrowRight, CheckCircle2, GraduationCap, HeartPulse, ShieldCheck, Flame, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMlmPackages, MlmPackage, getPackagePriceBreakdown } from '@/lib/mlmStore';

export function PlanPage() {
  const [packages, setPackages] = useState<MlmPackage[]>(getMlmPackages());

  const loadPackagesData = () => {
    setPackages(getMlmPackages());
  };

  useEffect(() => {
    loadPackagesData();
    window.addEventListener('mlm_packages_update', loadPackagesData);
    return () => {
      window.removeEventListener('mlm_packages_update', loadPackagesData);
    };
  }, []);
  return (
    <div className="bg-[#071E2C] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
            Future Grow Private Limited Company
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#8FA3AF]">
            को JOIN करने का क्या फायदा है?
          </h2>
          <div className="inline-flex items-center gap-4 text-[#35B779] font-semibold text-lg md:text-xl px-6 py-3 bg-[#1B3343]/30 rounded-full border border-[#6F9DB5]/30 uppercase tracking-widest flex-wrap justify-center">
            <span>JOIN KARO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#28485A]"></span>
            <span>BADHO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#28485A]"></span>
            <span>SURAKSHIT RAHO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#28485A]"></span>
            <span>BHAVISHYA SAWARO</span>
          </div>
        </div>

        {/* Package & Income Plan */}
        <div className="bg-gradient-to-br from-[#1B3343]/20 to-[#132C3C] rounded-3xl p-8 md:p-12 border border-[#28485A]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 opacity-5">
            <Flame className="w-96 h-96 text-[#6F9DB5]" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
              <Trophy className="text-[#35B779] w-8 h-8" />
              Available Joining Packages & Incomes
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {packages.map((pkg, idx) => {
                const breakdown = getPackagePriceBreakdown(pkg.price);
                const isPremium = pkg.name.toLowerCase().includes('premium') || idx === 0;

                const defaultChoices = !isPremium ? [
                  { name: 'Suit Length (navy blue Colour - Single Set)', comingSoon: false },
                  { name: 'Pant (navy blue Colour - Single Set)', comingSoon: false },
                  { name: 'Healthcare & Wellness Package', comingSoon: true }
                ] : [
                  { name: 'Suit Length & Pant (Green Colour)', comingSoon: false },
                  { name: 'Suit Length & Pant (Navy Blue Colour)', comingSoon: false },
                ];

                const productList = pkg.productChoices && pkg.productChoices.length > 0
                  ? pkg.productChoices.map(c => ({
                      name: c,
                      comingSoon: c.toLowerCase().includes('healthcare') || c.toLowerCase().includes('wellness')
                    }))
                  : defaultChoices;

                return (
                  <div 
                    key={pkg.id} 
                    className={`bg-[#071E2C]/70 rounded-2xl p-5 md:p-6 border relative ${
                      isPremium ? 'border-[#35B779]/40' : 'border-[#6F9DB5]/40'
                    }`}
                  >
                    <div className={`inline-block px-2.5 py-0.5 font-bold text-[11px] rounded-full uppercase mb-2 ${
                      isPremium ? 'bg-[#35B779]/20 text-[#35B779]' : 'bg-[#6F9DB5]/20 text-[#6F9DB5]'
                    }`}>
                      {isPremium ? '★ ' : ''}{pkg.name} Package
                    </div>
                    <div className={`text-2xl md:text-3xl font-bold mb-3 ${isPremium ? 'text-[#35B779]' : 'text-[#6F9DB5]'}`}>
                      ₹{breakdown.totalPayable.toLocaleString('en-IN')}
                    </div>
                    <div className="space-y-1.5 text-xs font-medium text-white">
                      <div className="flex justify-between border-b border-[#28485A]/20 pb-1.5">
                        <span className="text-gray-300">Package Amount (Base):</span>
                        <span className="text-white">₹{breakdown.baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#28485A]/20 pb-1.5">
                        <span className="text-gray-300">GST:</span>
                        <span className="text-white">₹{breakdown.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className={`flex justify-between font-semibold pt-1.5 text-sm ${
                        isPremium ? 'text-[#35B779]' : 'text-[#6F9DB5]'
                      }`}>
                        <span>Total Payable:</span>
                        <span>₹{breakdown.totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-[#28485A]/40">
                      <div className="bg-[#132C3C] p-1.5 sm:p-2 rounded-xl border border-[#28485A]/40 text-center flex flex-col justify-center">
                        <p className="text-[8px] sm:text-[9px] text-gray-300 uppercase">Direct</p>
                        <p className="text-[10px] sm:text-sm font-bold text-white break-words">₹{pkg.directIncome.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-[#132C3C] p-1.5 sm:p-2 rounded-xl border border-[#28485A]/40 text-center flex flex-col justify-center">
                        <p className="text-[8px] sm:text-[9px] text-gray-300 uppercase">Matching</p>
                        <p className="text-[10px] sm:text-sm font-bold text-white break-words">₹{pkg.binaryIncome.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-[#132C3C] p-1.5 sm:p-2 rounded-xl border border-purple-500/30 text-center flex flex-col justify-center overflow-hidden">
                        <p className="text-[8px] sm:text-[9px] text-purple-300 uppercase">Capping</p>
                        <p className="text-[10px] sm:text-sm font-bold text-purple-300 break-words">₹{pkg.capping.toLocaleString('en-IN')}/D</p>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-[#28485A]/30">
                      <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Product Choices:</p>
                      <ul className="text-[11px] text-gray-300 space-y-1">
                        {productList.map(p => (
                          <li key={p.name} className={`flex items-center justify-between gap-1.5 ${p.comingSoon ? 'bg-[#132C3C] px-2 py-0.5 rounded border border-[#28485A]/40' : ''}`}>
                            <span className="flex items-center gap-1.5">
                              <span className={isPremium ? 'text-[#35B779]' : 'text-[#6F9DB5]'}>✓</span>
                              <span className={p.comingSoon ? 'text-gray-300' : 'text-gray-200'}>{p.name}</span>
                            </span>
                            {p.comingSoon && (
                              <span className="text-[8px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1 py-0.2 rounded uppercase">Coming Soon</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Level Complete Benefits */}
        <div className="space-y-8 pt-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest">
              Level Complete Benefits
            </h2>
            <div className="w-24 h-1 bg-[#6F9DB5] mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Level 2 */}
            <div className="bg-[#132C3C] rounded-2xl p-8 border border-[#6F9DB5]/30 relative overflow-hidden group hover:border-[#6F9DB5] transition-colors flex flex-col justify-between">
              <div>
                <div className="absolute top-0 right-0 bg-[#1B3343] text-gray-200 text-xs font-semibold px-4 py-2 rounded-bl-xl border-b border-l border-[#28485A]/50">
                  2 LEVEL
                </div>
                <h3 className="text-2xl font-semibold text-white mb-6">2 Level Complete</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <HeartPulse className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-300 text-sm">दुर्घटना होने पर आपको मिलेगा:</p>
                      <p className="text-xl font-bold text-white mt-0.5">₹50,000 Security</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 5 */}
            <div className="bg-[#132C3C] rounded-2xl p-8 border border-[#6F9DB5]/40 relative overflow-hidden group hover:border-[#6F9DB5] transition-colors flex flex-col justify-between">
              <div>
                <div className="absolute top-0 right-0 bg-[#1B3343] text-gray-200 text-xs font-semibold px-4 py-2 rounded-bl-xl border-b border-l border-[#28485A]/50">
                  5 LEVEL
                </div>
                <h3 className="text-2xl font-semibold text-white mb-6">5 Level Complete</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <HeartPulse className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-300 text-sm">दुर्घटना होने पर आपको मिलेगा:</p>
                      <p className="text-xl font-bold text-white mt-0.5">₹1,00,000 Security</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 10 */}
            <div className="bg-[#132C3C] rounded-2xl p-8 border border-blue-500/30 relative overflow-hidden group hover:border-blue-500 transition-colors flex flex-col justify-between">
              <div>
                <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 text-xs font-semibold px-4 py-2 rounded-bl-xl border-b border-l border-blue-500/30">
                  10 LEVEL
                </div>
                <div className="flex items-center gap-1.5 mb-6">
                  <h3 className="text-2xl font-semibold text-white">10 Level Complete</h3>
                  <span className="text-amber-400 text-2xl font-bold leading-none">*</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <HeartPulse className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-300 text-sm">दुर्घटना होने पर आपको मिलेगा:</p>
                      <p className="text-xl font-bold text-white mt-0.5">₹2,50,000 Security</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pt-2 border-t border-[#28485A]/30">
                    <GraduationCap className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-300 text-sm">Education Benefit:</p>
                      <p className="text-base font-semibold text-white mt-0.5">1 बच्चे के लिए 12th तक Education Free</p>
                      <p className="text-xs text-emerald-400 font-semibold mt-1">
                        (Government School Me)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 15 */}
            <div className="bg-[#132C3C] rounded-2xl p-8 border border-purple-500/30 relative overflow-hidden group hover:border-purple-500 transition-colors flex flex-col justify-between">
              <div>
                <div className="absolute top-0 right-0 bg-purple-500/20 text-purple-300 text-xs font-semibold px-4 py-2 rounded-bl-xl border-b border-l border-purple-500/30">
                  15 LEVEL
                </div>
                <div className="flex items-center gap-1.5 mb-6">
                  <h3 className="text-2xl font-semibold text-white">15 Level Complete</h3>
                  <span className="text-amber-400 text-2xl font-bold leading-none">*</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <HeartPulse className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-300 text-sm">दुर्घटना होने पर आपको मिलेगा:</p>
                      <p className="text-xl font-bold text-white mt-0.5">₹5,00,000 Security</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pt-2 border-t border-[#28485A]/30">
                    <IndianRupee className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-300 text-sm">Monthly Salary:</p>
                      <p className="text-xl font-bold text-white mt-0.5">₹10,000 Per Month</p>
                      <p className="text-xs text-gray-300 mt-0.5">1 Pust के लिए</p>
                      <p className="text-xs text-[#8FA3AF] mt-0.5">(Pure Yake Pust)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 20 */}
            <div className="bg-[#132C3C] rounded-2xl p-8 border border-orange-500/30 relative overflow-hidden group hover:border-orange-500 transition-colors flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div>
                <div className="absolute top-0 right-0 bg-orange-500/20 text-orange-300 text-xs font-semibold px-4 py-2 rounded-bl-xl border-b border-l border-orange-500/30">
                  20 LEVEL
                </div>
                <div className="flex items-center gap-1.5 mb-6">
                  <h3 className="text-2xl font-semibold text-white">20 Level Complete</h3>
                  <span className="text-amber-400 text-2xl font-bold leading-none">*</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <HeartPulse className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-300 text-sm">दुर्घटना होने पर आपको मिलेगा:</p>
                      <p className="text-xl font-bold text-white mt-0.5">₹15,00,000 Security</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pt-2 border-t border-[#28485A]/30">
                    <IndianRupee className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-300 text-sm">Monthly Salary:</p>
                      <p className="text-xl font-bold text-white mt-0.5">₹20,000 Per Month</p>
                      <p className="text-xs text-gray-300 mt-0.5">1 Pust के लिए</p>
                      <p className="text-xs text-[#8FA3AF] mt-0.5">(Pure Yake Pust)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Income Highlight */}
        <div className="bg-gradient-to-r from-[#1B3343] via-[#132C3C] to-[#1B3343] rounded-3xl p-6 sm:p-10 text-center border border-[#6F9DB5]/40 shadow-lg mt-12 overflow-hidden mx-auto">
          <p className="text-[#8FA3AF] font-semibold tracking-widest uppercase mb-4 text-xs sm:text-sm md:text-base">
            Total Level Income (1 to 20 Level)
          </p>
          <div className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 break-words w-full px-2">
            ₹1,57,28,64,000
          </div>
        </div>

        {/* Footer CTAs & Slogans */}
        <div className="text-center space-y-10 py-12">
          <Link to="/register" className="inline-block py-5 px-12 bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white text-2xl font-bold rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1">
            JOIN NOW
          </Link>
          
          <div className="space-y-4 text-xl md:text-2xl font-semibold text-white">
            <p className="text-white">A Better Future, A Better Life</p>
            <p className="text-[#35B779]">सुरक्षा आपकी जिम्मेदारी हमारी</p>
            <p className="text-[#8FA3AF]">Work Today | Earn Tomorrow</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold text-[#8FA3AF] uppercase tracking-wider pt-8 border-t border-[#28485A]/30">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6F9DB5]" />
              No Risk
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6F9DB5]" />
              100% Transparent
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6F9DB5]" />
              Unlimited Income
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6F9DB5]" />
              Limitless Growth
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6F9DB5]" />
              Life Change
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6F9DB5]" />
              Financial Freedom
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6F9DB5]" />
              Secure Your Family
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6F9DB5]" />
              Secure Your Future
            </div>
          </div>

          <p className="text-xs text-gray-300 pt-8 max-w-3xl mx-auto">
            सभी Security, Salary, Education और Income benefits कंपनी के नियम एवं पात्रता शर्तों के अधीन होंगे।
          </p>
        </div>

      </div>
    </div>
  );
}
