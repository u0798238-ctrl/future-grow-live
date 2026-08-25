import React from 'react';
import { Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="bg-[#071E2C] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[#132C3C] rounded-2xl p-8 md:p-12 border border-[#28485A]/30 shadow-xl">
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[#28485A]/30">
          <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">Privacy Policy</h1>
            <p className="text-sm text-[#8FA3AF] mt-1">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
            <p>
              When you register as a distributor on Future Grow, we collect personal information such as your name, mobile number, email address, date of birth, address, and PAN card number. We also collect bank account details for the purpose of processing payout withdrawals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To create and manage your distributor account.</li>
              <li>To process product orders and deliver them to your address.</li>
              <li>To calculate commissions, track your downline network, and process payouts.</li>
              <li>To communicate with you regarding updates, offers, and administrative notices.</li>
              <li>To comply with legal obligations, including tax reporting (TDS).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information against unauthorized access, alteration, or disclosure. However, no data transmission over the internet can be guaranteed to be 100% secure. You are responsible for keeping your login credentials confidential.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Sharing Your Information</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We may share necessary details with trusted service providers (such as payment gateways or delivery partners) solely for the purpose of operating our business. We may also disclose information if required by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Your Rights</h2>
            <p>
              You have the right to access, update, and correct your personal information in your profile dashboard. If you wish to close your account, please contact our support team. Note that certain data may be retained for accounting and legal purposes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
