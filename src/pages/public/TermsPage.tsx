import React from 'react';
import { FileText } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="bg-[#071E2C] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[#132C3C] rounded-2xl p-8 md:p-12 border border-[#28485A]/30 shadow-xl">
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[#28485A]/30">
          <div className="p-3 bg-[#6F9DB5]/20 rounded-lg text-[#35B779]">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">Terms & Conditions</h1>
            <p className="text-sm text-[#8FA3AF] mt-1">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
            <p>
              Welcome to Future Grow. By registering as an independent distributor or using our website, you agree to be bound by the following Terms and Conditions. Please read them carefully. Future Grow is a product-based direct selling business, and we do not guarantee any fixed income, investments, or returns without active product sales and network building.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Eligibility</h2>
            <p>
              To become a registered distributor, you must be at least 18 years of age and hold a valid PAN card and Bank Account in your name. Only one ID is permitted per PAN card.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Distributor Rights & Duties</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Distributors are independent contractors, not employees of Future Grow.</li>
              <li>Distributors must ethically promote the products (Suiting & Shirting, etc.) without making false income claims.</li>
              <li>Distributors are strictly prohibited from cross-sponsoring or soliciting members from other networks within the company.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Income & Payouts</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All payouts (Direct, Matching) are calculated based on successful product sales.</li>
              <li>Matching income is calculated on a 1:1 basis and is subject to a daily capping limit of ₹10,000.</li>
              <li>A standard deduction of 5% TDS and 5% Admin Charge will be applied to all withdrawal requests.</li>
              <li>KYC (PAN and Bank Details) must be approved by the admin before any withdrawal can be processed.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Termination</h2>
            <p>
              Future Grow reserves the right to suspend or terminate any distributor ID found violating these terms, engaging in fraudulent activities, or defaming the company. In such cases, all pending commissions will be forfeited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Amendments</h2>
            <p>
              The company reserves the right to modify the business plan, product prices, or these terms and conditions at any time without prior notice. Continued use of the platform constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
