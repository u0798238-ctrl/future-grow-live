import React from 'react';
import { ShieldCheck, Target, Users, Zap, Briefcase, Award } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="bg-[#071E2C] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">About Future Grow</h1>
          <p className="text-lg md:text-xl text-[#8FA3AF] max-w-2xl mx-auto">
            We are a product-based direct selling company committed to providing high-quality lifestyle products and a revolutionary opportunity for financial independence.
          </p>
        </div>

        <div className="bg-[#132C3C] rounded-2xl p-8 border border-[#28485A]/30 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#35B779]" />
            Our Vision & Mission
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-[#35B779]">Vision</h3>
              <p className="leading-relaxed">
                To become a global leader in the direct selling industry by providing innovative, high-quality products that enhance everyday life, while empowering individuals to achieve their dreams through a sustainable and transparent business model.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-[#35B779]">Mission</h3>
              <p className="leading-relaxed">
                Our mission is to create a secure and thriving ecosystem where entrepreneurs can grow their wealth and skills. We focus on delivering excellent product value (like our premium Suiting & Shirting materials) and rewarding our network of distributors fairly and transparently.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#132C3C] rounded-2xl p-6 border border-[#28485A]/30 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">Quality Products</h3>
            <p className="text-sm">We deal in high-quality physical products ensuring genuine value for every purchase.</p>
          </div>
          
          <div className="bg-[#132C3C] rounded-2xl p-6 border border-[#28485A]/30 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#6F9DB5]/20 flex items-center justify-center text-[#35B779]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">Strong Community</h3>
            <p className="text-sm">A vast network of motivated individuals working together towards mutual growth and success.</p>
          </div>

          <div className="bg-[#132C3C] rounded-2xl p-6 border border-[#28485A]/30 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">Transparent System</h3>
            <p className="text-sm">Ethical business practices, instant payouts, and a secure platform you can trust.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
