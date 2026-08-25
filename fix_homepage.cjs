const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

code = code.replace(
  "<div className=\"inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B3343] border border-[#35576A] text-gray-300 text-xs font-medium uppercase tracking-widest mb-6 shadow-sm\">\n            <Star className=\"w-3.5 h-3.5 text-[#D99A4A]\" />\n            A New Opportunity for a Better Tomorrow\n          </div>",
  `<div className="flex flex-col items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B3343] border border-[#35576A] text-gray-300 text-xs font-medium uppercase tracking-widest shadow-sm">
              <Star className="w-3.5 h-3.5 text-[#D99A4A]" />
              A New Opportunity for a Better Tomorrow
            </div>
            
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6F9DB5]/20 to-[#35B779]/20 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#071E2C]/80 border border-[#6F9DB5]/30 backdrop-blur-md shadow-lg transition-transform hover:scale-105 duration-300">
                <div className="w-8 h-8 rounded-full bg-[#6F9DB5]/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#6F9DB5]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8FA3AF] mb-0.5">Corporate Head Office</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-200">Gomti Nagar, Lucknow, UP – 226010, India</p>
                </div>
              </div>
            </div>
          </div>`
);

fs.writeFileSync('src/pages/public/HomePage.tsx', code);
