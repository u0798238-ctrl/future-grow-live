const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

const oldCode = `<div className="relative group cursor-default">
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
            </div>`;

const newCode = `<div className="relative group cursor-default mx-auto w-full max-w-xl mb-4 mt-2">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6F9DB5]/30 to-[#35B779]/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-700"></div>
              <div className="relative rounded-2xl overflow-hidden border border-[#28485A]/50 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                  alt="Future Grow Corporate Head Office" 
                  className="w-full h-36 md:h-48 object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C] via-[#071E2C]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-left flex items-end justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-0.5 shadow-sm drop-shadow-lg">Corporate Head Office</h3>
                    <p className="text-xs md:text-sm text-gray-200 font-medium flex items-center gap-1.5 drop-shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-[#35B779]" /> Gomti Nagar, Lucknow, UP – 226010, India
                    </p>
                  </div>
                </div>
              </div>
            </div>`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/pages/public/HomePage.tsx', code);
