import React from 'react';
import { RefreshCcw } from 'lucide-react';

export function RefundPage() {
  return (
    <div className="bg-[#071E2C] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[#132C3C] rounded-2xl p-8 md:p-12 border border-[#28485A]/30 shadow-xl">
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[#28485A]/30">
          <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
            <RefreshCcw className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">Refund & Cancellation Policy</h1>
            <p className="text-sm text-[#8FA3AF] mt-1">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Cancellation Policy</h2>
            <p>
              Once a package is purchased and a Distributor ID is activated, the transaction cannot be cancelled. Please ensure you have understood the business plan and product details before making a payment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Product Return & Refund</h2>
            <p>
              As a product-based direct selling entity, Future Grow offers a return policy in compliance with Direct Selling Guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Cooling-off Period:</strong> A newly registered distributor may return the product within 30 days from the date of joining/purchase, provided the product is unused, in marketable condition, and in its original packaging.</li>
              <li>Upon successful verification of the returned product, a full refund (minus any shipping or handling charges) will be initiated to the original payment method within 7-14 business days.</li>
              <li>If commissions have already been distributed to the upline based on the returned product's sale, those commissions will be clawed back or deducted from future payouts of the respective upline distributors.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Defective Products</h2>
            <p>
              If you receive a defective or damaged product (e.g., damaged Suiting & Shirting material), you must notify our customer support within 48 hours of delivery along with photographic evidence. We will arrange a free replacement of the defective product.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Process for Returns</h2>
            <p>
              To initiate a return, please contact our support team at uyadav73938@gmail.com with your User ID and Order details. Our team will guide you through the return shipping process.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
