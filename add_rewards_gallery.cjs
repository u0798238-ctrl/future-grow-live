const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

const anchor = `          </div>

          {/* The Model */}`;

const newGalleryBlock = `          </div>

          {/* Mega Events & Rewards - Image Gallery 2 */}
          <div className="pt-2 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              
              {/* Mega Seminars Image */}
              <div className="relative rounded-3xl overflow-hidden group shadow-xl h-[300px] border border-[#28485A]/40">
                <div className="absolute inset-0 bg-[#071E2C]/30 mix-blend-color z-10 transition-opacity duration-700 group-hover:opacity-0"></div>
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop" 
                  alt="Mega Seminars" 
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C] via-[#071E2C]/40 to-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 p-5 md:p-6 z-30">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3343]/80 border border-[#35B779]/30 text-[#35B779] text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-md">
                    <Users className="w-3 h-3" /> Community
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 shadow-sm drop-shadow-lg">Mega Seminars</h3>
                  <p className="text-sm text-gray-300 drop-shadow-md">Learn from top leaders in massive company events.</p>
                </div>
              </div>

              {/* Rewards & Recognition Image */}
              <div className="relative rounded-3xl overflow-hidden group shadow-xl h-[300px] border border-[#28485A]/40">
                <div className="absolute inset-0 bg-[#071E2C]/30 mix-blend-color z-10 transition-opacity duration-700 group-hover:opacity-0"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop" 
                  alt="Rewards & Recognition" 
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C] via-[#071E2C]/40 to-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 p-5 md:p-6 z-30">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3343]/80 border border-[#D99A4A]/30 text-[#D99A4A] text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-md">
                    <Star className="w-3 h-3" /> Recognition
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 shadow-sm drop-shadow-lg">Rewards & Awards</h3>
                  <p className="text-sm text-gray-300 drop-shadow-md">Celebrating top achievers on the grand stage.</p>
                </div>
              </div>

              {/* Financial Freedom / Dream Lifestyle Image */}
              <div className="relative rounded-3xl overflow-hidden group shadow-xl h-[300px] border border-[#28485A]/40">
                <div className="absolute inset-0 bg-[#071E2C]/40 mix-blend-color z-10 transition-opacity duration-700 group-hover:opacity-0"></div>
                <img 
                  src="https://images.unsplash.com/photo-1540960086884-a1599818817a?q=80&w=1000&auto=format&fit=crop" 
                  alt="Financial Freedom Lifestyle" 
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C] via-[#071E2C]/40 to-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 p-5 md:p-6 z-30">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3343]/80 border border-[#6F9DB5]/30 text-[#6F9DB5] text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-md">
                    <Sparkles className="w-3 h-3" /> Lifestyle
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 shadow-sm drop-shadow-lg">Financial Freedom</h3>
                  <p className="text-sm text-gray-300 drop-shadow-md">Unlock the luxury life of your dreams.</p>
                </div>
              </div>

            </div>
          </div>

          {/* The Model */}`;

code = code.replace(anchor, newGalleryBlock);
fs.writeFileSync('src/pages/public/HomePage.tsx', code);
