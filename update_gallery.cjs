const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

const oldGallery = `          {/* Life at Future Grow - Image Gallery */}
          <div className="pt-8 pb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white uppercase tracking-wider text-center mb-10">Life at Future Grow</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[500px]">
              
              {/* Large Image (Meeting) */}
              <div className="md:col-span-8 relative rounded-3xl overflow-hidden group shadow-2xl h-[300px] md:h-full">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop" 
                  alt="Corporate Team Meeting" 
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C]/90 via-[#071E2C]/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3343]/80 border border-[#8FA3AF]/30 text-white text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
                    Leadership & Vision
                  </div>
                  <h3 className="text-xl md:text-3xl font-bold text-white mb-2 shadow-sm">Corporate Team Meetings</h3>
                  <p className="text-sm md:text-base text-gray-300 max-w-md">Collaborating with the best minds to drive innovation and support our growing network.</p>
                </div>
              </div>

              {/* Smaller Images Stack (Car/Lifestyle & Working) */}
              <div className="md:col-span-4 flex flex-col gap-4 md:gap-6 h-full">
                
                {/* Working Image */}
                <div className="relative rounded-3xl overflow-hidden group shadow-xl h-[250px] md:h-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" 
                    alt="Team Working" 
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C]/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 shadow-sm">Training & Growth</h3>
                    <p className="text-xs md:text-sm text-gray-300">Continuous skill development in our modern workspaces.</p>
                  </div>
                </div>

                {/* Car/Success Image */}
                <div className="relative rounded-3xl overflow-hidden group shadow-xl h-[250px] md:h-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1000&auto=format&fit=crop" 
                    alt="Corporate Success" 
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C]/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 shadow-sm">Achieving Success</h3>
                    <p className="text-xs md:text-sm text-gray-300">Reaching financial milestones and living the dream.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>`;

const newGallery = `          {/* Life at Future Grow - Image Gallery */}
          <div className="pt-8 pb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white uppercase tracking-wider text-center mb-10">Life at Future Grow</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[500px]">
              
              {/* Large Image (Meeting) */}
              <div className="md:col-span-8 relative rounded-3xl overflow-hidden group shadow-2xl h-[300px] md:h-full border border-[#28485A]/40">
                <div className="absolute inset-0 bg-[#071E2C]/20 mix-blend-color z-10 transition-opacity duration-700 group-hover:opacity-0"></div>
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop" 
                  alt="Corporate Team Meeting" 
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C] via-[#071E2C]/40 to-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 z-30">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3343]/80 border border-[#6F9DB5]/30 text-[#6F9DB5] text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
                    Leadership & Vision
                  </div>
                  <h3 className="text-xl md:text-3xl font-bold text-white mb-2 shadow-sm drop-shadow-lg">Corporate Meetings</h3>
                  <p className="text-sm md:text-base text-gray-300 max-w-md drop-shadow-md">Collaborating with the best minds to drive innovation and support our growing network.</p>
                </div>
              </div>

              {/* Smaller Images Stack (Car/Lifestyle & Working) */}
              <div className="md:col-span-4 flex flex-col gap-4 md:gap-6 h-full">
                
                {/* Working Image */}
                <div className="relative rounded-3xl overflow-hidden group shadow-xl h-[250px] md:h-1/2 border border-[#28485A]/40">
                  <div className="absolute inset-0 bg-[#071E2C]/30 mix-blend-color z-10 transition-opacity duration-700 group-hover:opacity-0"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" 
                    alt="Corporate Office" 
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C] via-[#071E2C]/40 to-transparent z-20"></div>
                  <div className="absolute bottom-0 left-0 p-5 md:p-6 z-30">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 shadow-sm drop-shadow-lg">Premium Workspaces</h3>
                    <p className="text-xs md:text-sm text-gray-300 drop-shadow-md">Professional environment for our leaders.</p>
                  </div>
                </div>

                {/* Car/Success Image */}
                <div className="relative rounded-3xl overflow-hidden group shadow-xl h-[250px] md:h-1/2 border border-[#28485A]/40">
                  <div className="absolute inset-0 bg-[#071E2C]/40 mix-blend-color z-10 transition-opacity duration-700 group-hover:opacity-0"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1000&auto=format&fit=crop" 
                    alt="Luxury Car Success" 
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C] via-[#071E2C]/40 to-transparent z-20"></div>
                  <div className="absolute bottom-0 left-0 p-5 md:p-6 z-30">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 shadow-sm drop-shadow-lg">Achieving Success</h3>
                    <p className="text-xs md:text-sm text-gray-300 drop-shadow-md">Reaching financial milestones and living the dream.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>`;

code = code.replace(oldGallery, newGallery);
fs.writeFileSync('src/pages/public/HomePage.tsx', code);
