const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

const oldImageBlock = `            <div className="relative group cursor-default mx-auto w-full max-w-xl mb-4 mt-2">
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

// Remove the small old image block
code = code.replace(oldImageBlock, "");

// Add the massive new image block below the CTA
const ctaBlock = `          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base bg-[#6F9DB5] hover:bg-[#86B4C9] text-white font-semibold h-14 px-8 rounded-xl shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>`;

const massiveImageBlock = `          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base bg-[#6F9DB5] hover:bg-[#86B4C9] text-white font-semibold h-14 px-8 rounded-xl shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          {/* Massive Corporate Headquarters Hero Image */}
          <div className="mt-16 md:mt-24 relative mx-auto w-full max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#35B779]/20 via-[#6F9DB5]/20 to-transparent rounded-[2rem] blur-3xl opacity-50"></div>
            <div className="relative rounded-[2rem] overflow-hidden border border-[#28485A]/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group transform transition-all duration-1000 hover:-translate-y-2">
              <img 
                src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2000&auto=format&fit=crop" 
                alt="Future Grow Corporate Headquarters" 
                className="w-full h-[300px] sm:h-[400px] md:h-[550px] object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C] via-[#071E2C]/30 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div className="text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35B779]/20 border border-[#35B779]/40 text-[#35B779] text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
                    <Star className="w-3.5 h-3.5" /> Corporate Headquarters
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-3 shadow-sm drop-shadow-2xl tracking-tight">Future Grow India</h3>
                  <p className="text-base md:text-xl text-gray-200 font-medium flex items-center gap-2 drop-shadow-lg">
                    <MapPin className="w-5 h-5 text-[#35B779]" /> Corporate Park, Gomti Nagar, Lucknow, UP – 226010
                  </p>
                </div>
                
                <div className="flex gap-4">
                   <div className="bg-[#071E2C]/80 backdrop-blur-md border border-[#28485A]/50 rounded-2xl p-4 md:p-5 text-center min-w-[100px] shadow-xl">
                     <p className="text-3xl font-bold text-white mb-1">24/7</p>
                     <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Support</p>
                   </div>
                   <div className="bg-[#071E2C]/80 backdrop-blur-md border border-[#28485A]/50 rounded-2xl p-4 md:p-5 text-center min-w-[100px] shadow-xl">
                     <p className="text-3xl font-bold text-[#35B779] mb-1">HQ</p>
                     <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Base</p>
                   </div>
                </div>
              </div>
            </div>
          </div>`;

code = code.replace(ctaBlock, massiveImageBlock);
fs.writeFileSync('src/pages/public/HomePage.tsx', code);
