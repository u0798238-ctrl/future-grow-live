const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

const smallImageBlock = `            <div className="relative group cursor-default mx-auto w-full max-w-xl mb-4 mt-2">
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

// Restore small image block below the "New Opportunity" pill
code = code.replace(
  "              A New Opportunity for a Better Tomorrow\n            </div>\n            \n          </div>",
  "              A New Opportunity for a Better Tomorrow\n            </div>\n            \n" + smallImageBlock + "\n          </div>"
);

// Remove massive image block
const ctaStartIndex = code.indexOf('<div className="flex flex-col sm:flex-row gap-4 justify-center">');
const sectionEndIndex = code.indexOf('</section>', ctaStartIndex);

const ctaBlockOnly = `          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base bg-[#6F9DB5] hover:bg-[#86B4C9] text-white font-semibold h-14 px-8 rounded-xl shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      `;

code = code.substring(0, ctaStartIndex) + ctaBlockOnly + code.substring(sectionEndIndex);

fs.writeFileSync('src/pages/public/HomePage.tsx', code);
