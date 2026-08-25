import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Target, Users, Sparkles, Globe2, Rocket, Sprout, Gem, Flame, Clock, Download, Smartphone, MessageCircle, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HomePage() {
  const [liveStats, setLiveStats] = useState({
    community: 133780,
    years: 2,
    months: 9,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Exact Launch Date calculation (to hit exactly ~2 years 9 months in Aug 2026)
    // We'll use Nov 18, 2023.
    const startMs = new Date('2023-11-18T00:00:00Z').getTime();
    const counterBaseDate = new Date('2026-08-18T00:00:00Z').getTime();
    const baseCommunity = 133780;
    const usersPerMs = 4.5 / (24 * 60 * 60 * 1000); // 4.5 users per day

    const updateStats = () => {
      const nowMs = Date.now();
      
      // Community Logic (Smooth continuous growth from base date)
      const msElapsedSinceBase = nowMs - counterBaseDate;
      const currentCommunity = baseCommunity + Math.floor(Math.max(0, msElapsedSinceBase) * usersPerMs);

      // Timer Logic
      const diffMs = Math.max(0, nowMs - startMs);
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.44);
      const days = Math.floor((totalDays % 365.25) % 30.44);
      
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setLiveStats({
        community: currentCommunity,
        years,
        months,
        days,
        hours,
        minutes,
        seconds
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-[#071E2C] min-h-screen text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071E2C] via-[#0E2535] to-[#132C3C] border-b border-[#28485A]">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#6F9DB5] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-[#6F9DB5] rounded-full blur-[100px] opacity-10"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B3343] border border-[#35576A] text-gray-300 text-xs font-medium uppercase tracking-widest shadow-sm">
              <Star className="w-3.5 h-3.5 text-[#D99A4A]" />
              A New Opportunity for a Better Tomorrow
            </div>
            
            <div className="relative group cursor-default mx-auto w-full max-w-xl mb-4 mt-2">
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
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 drop-shadow-sm">
            FUTURE GROW
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            A platform where people can focus on personal and business growth through products, training, networking, and leadership development.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base bg-[#6F9DB5] hover:bg-[#86B4C9] text-white font-semibold h-14 px-8 rounded-xl shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Article */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Our Purpose */}
          <div className="bg-[#132C3C]/50 rounded-3xl p-8 md:p-12 border border-[#8FA3AF]/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <h2 className="text-sm font-semibold tracking-widest text-gray-300 uppercase mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Our Purpose
              </h2>
              <p className="text-lg md:text-xl leading-relaxed text-gray-200 mb-6">
                Future Grow aims to create a new opportunity for people who have not yet been able to achieve the financial growth they dreamed of through traditional businesses or other companies.
              </p>
              <div className="p-6 bg-[#071E2C] rounded-xl border-l-4 border-[#8FA3AF]">
                <p className="text-lg text-white font-medium italic">
                  We believe that <span className="text-[#6F9DB5]">the right opportunity + proper guidance + consistent effort</span> can help individuals move forward and build a stronger future.
                </p>
              </div>
            </div>
          </div>

          {/* Grid Sections: Vision & Teamwork */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#132C3C]/50 rounded-3xl p-8 border border-[#8FA3AF]/30">
              <h2 className="text-sm font-semibold tracking-widest text-gray-300 uppercase mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Our Vision
              </h2>
              <h3 className="text-2xl font-semibold text-white mb-4 leading-tight">
                “To provide people with an opportunity to learn, grow and work toward building a better financial future.”
              </h3>
              <p className="text-gray-300">
                Everyone dreams of a better financial future. We provide the tools, the network, and the support to make it a reality.
              </p>
            </div>

            <div className="bg-[#132C3C]/50 rounded-3xl p-8 border border-[#8FA3AF]/30">
              <h2 className="text-sm font-semibold tracking-widest text-gray-300 uppercase mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Teamwork = Growth
              </h2>
              <p className="text-white font-medium mb-4">You can develop skills in:</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5]"></div> Business & Product Knowledge</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5]"></div> Digital & Online Marketing</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5]"></div> Team Building & Network Expansion</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5]"></div> Leadership & Communication</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5]"></div> Personal Development</li>
              </ul>
            </div>
          </div>

          {/* Life at Future Grow - Image Gallery */}
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
          </div>

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
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop" 
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

          {/* The Model */}
          <div className="text-center space-y-8 py-8 border-y border-[#8FA3AF]/30">
            <h2 className="text-2xl md:text-3xl font-semibold text-white uppercase tracking-wider">Future Grow Model</h2>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
              <div className="font-bold text-2xl text-gray-300">LEARN</div>
              <ArrowRight className="text-gray-600 hidden md:block" />
              <div className="font-bold text-2xl text-gray-300">WORK</div>
              <ArrowRight className="text-gray-600 hidden md:block" />
              <div className="font-bold text-2xl text-gray-300">BUILD</div>
              <ArrowRight className="text-gray-600 hidden md:block" />
              <div className="font-bold text-2xl text-[#6F9DB5]">GROW</div>
            </div>

            <p className="text-lg text-white max-w-2xl mx-auto">
              Build your knowledge. Develop your skills. Build your team. Work consistently toward your goals.
            </p>
          </div>

          {/* Our Vision Expansion */}
          <div className="bg-gradient-to-br from-[#1B3343]/20 to-[#071E2C] rounded-3xl p-8 md:p-12 border border-[#8FA3AF]/30">
            <div className="flex items-center gap-3 mb-6">
              <Globe2 className="w-8 h-8 text-gray-300" />
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">Our Vision</h2>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-200 mb-6 uppercase tracking-wider">
              Building a Stronger Future, Together
            </h3>
            <p className="text-lg text-white leading-relaxed mb-6">
              Future Grow’s vision is to become a trusted and growing platform that creates <strong className="text-[#6F9DB5] font-medium">long-term opportunities for people, families and communities</strong>.
            </p>
            <p className="text-lg text-white leading-relaxed">
              We believe the future belongs to those who <strong className="text-white font-medium">think bigger, learn continuously, work consistently and grow together</strong>.
            </p>
          </div>

          {/* Grid: Dream & Focus */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <div className="bg-[#132C3C]/50 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-[#8FA3AF]/30 flex flex-col justify-center">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
                <h2 className="text-lg md:text-xl font-semibold text-white uppercase tracking-wider">Our Bigger Dream</h2>
              </div>
              <p className="text-sm md:text-base text-white leading-relaxed mb-3 md:mb-4">
                In the coming years, we aim to <strong className="text-[#6F9DB5] font-medium">develop and expand Future Grow on a much larger scale</strong>, reaching more cities, more communities and more people.
              </p>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                Our goal is to build a strong ecosystem where people can learn new skills, discover business opportunities, develop leadership qualities and work together toward their financial goals.
              </p>
            </div>
            <div className="bg-[#132C3C]/50 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-[#8FA3AF]/30">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Sprout className="w-5 h-5 md:w-6 md:h-6 text-[#6F9DB5]" />
                <h2 className="text-lg md:text-xl font-semibold text-white uppercase tracking-wider">Our Future Focus</h2>
              </div>
              <div className="text-[11px] md:text-sm font-semibold tracking-widest text-gray-300 uppercase mb-4 md:mb-6 flex flex-wrap items-center gap-1.5 md:gap-2">
                Expand <ArrowRight className="w-3 h-3 md:w-4 md:h-4" /> Educate <ArrowRight className="w-3 h-3 md:w-4 md:h-4" /> Empower <ArrowRight className="w-3 h-3 md:w-4 md:h-4" /> Grow
              </div>
              <ul className="space-y-2.5 md:space-y-3 text-sm md:text-base text-gray-300">
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5] mt-1.5 md:mt-2 min-w-[6px]"></div>
                  <span className="leading-tight md:leading-normal">Build a strong and professional organization</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5] mt-1.5 md:mt-2 min-w-[6px]"></div>
                  <span className="leading-tight md:leading-normal">Expand our network across India and beyond</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5] mt-1.5 md:mt-2 min-w-[6px]"></div>
                  <span className="leading-tight md:leading-normal">Provide quality products and business education</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5] mt-1.5 md:mt-2 min-w-[6px]"></div>
                  <span className="leading-tight md:leading-normal">Develop thousands of capable leaders</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5] mt-1.5 md:mt-2 min-w-[6px]"></div>
                  <span className="leading-tight md:leading-normal">Create opportunities to grow through their efforts</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5] mt-1.5 md:mt-2 min-w-[6px]"></div>
                  <span className="leading-tight md:leading-normal">Build a long-term sustainable organization</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Our Belief */}
          <div className="bg-[#071E2C] rounded-3xl p-8 md:p-12 border-l-4 border-[#86B4C9] shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Gem className="w-40 h-40 text-[#6F9DB5]" />
             </div>
             <div className="relative z-10">
                <h2 className="text-sm font-semibold tracking-widest text-[#86B4C9] uppercase mb-4 flex items-center gap-2">
                  <Gem className="w-4 h-4" /> Our Belief
                </h2>
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6 leading-tight italic">
                  “When one person grows, it is success.<br />
                  When thousands grow together, it becomes a movement.”
                </h3>
                <p className="text-lg text-white">
                  Future Grow wants to create a future where <strong className="text-[#6F9DB5] font-medium">hard work, teamwork, knowledge and leadership</strong> can open new possibilities for people.
                </p>
             </div>
          </div>

          {/* Conclusion */}
          <div className="text-center pb-12 pt-8">
            <div className="flex justify-center mb-6">
               <Flame className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              FUTURE GROW
            </h2>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center text-lg md:text-xl font-semibold tracking-widest text-gray-300 uppercase mb-12">
              <span>Dream Big</span>
              <span className="hidden md:block w-2 h-2 rounded-full bg-[#6F9DB5]"></span>
              <span>Work Smart</span>
              <span className="hidden md:block w-2 h-2 rounded-full bg-[#6F9DB5]"></span>
              <span>Grow Together</span>
            </div>
            <div className="bg-[#1B3343]/20 border border-[#8FA3AF]/30 rounded-xl p-8 max-w-3xl mx-auto">
               <p className="text-xl text-gray-200 font-medium italic">
                 Our vision is not just to build a company.<br/>
                 Our vision is to build a strong community that grows together for years to come.
               </p>
            </div>
          </div>

        </div>
      </section>

      {/* Live Statistics Section Moved to Bottom */}
      <section className="bg-gradient-to-br from-[#0E2535] to-[#071E2C] border-y border-[#28485A] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#071E2C] opacity-50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 p-4 opacity-10">
           <Globe2 className="w-64 h-64 text-[#6F9DB5]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Our Growing Network</h2>
            <div className="w-24 h-1 bg-[#6F9DB5] mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col gap-10 max-w-5xl mx-auto w-full">
            
            {/* Community Counter */}
            <div className="bg-[#132C3C] rounded-2xl p-8 border-2 border-[#6F9DB5]/40 text-center shadow-[0_0_40px_rgba(111,157,181,0.15)] relative overflow-hidden group hover:border-[#6F9DB5] transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6F9DB5] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <Users className="w-8 h-8 text-[#6F9DB5]" />
                <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Live Community</h3>
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35B779] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-[#35B779]"></span>
                </span>
                <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#DDE2E5]">
                  {liveStats.community.toLocaleString('en-IN')}
                  <span className="text-[#6F9DB5] text-5xl ml-1">+</span>
                </div>
              </div>
              <div className="inline-block bg-[#1B3343] border border-[#28485A] px-6 py-2 rounded-full">
                <p className="text-sm text-[#35B779] font-semibold uppercase tracking-wider">Growing Daily Across The Nation</p>
              </div>
            </div>

            {/* Live Uptime Timer */}
            <div className="bg-[#132C3C] rounded-2xl p-8 border-2 border-[#28485A] text-center shadow-lg relative overflow-hidden group hover:border-[#6F9DB5]/60 transition-all duration-300">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D99A4A] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-8 h-8 text-[#D99A4A]" />
                <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Company Uptime</h3>
              </div>
              
              <div className="flex items-baseline justify-center gap-4 text-4xl md:text-5xl font-bold text-white mb-4">
                <div className="flex flex-col items-center">
                  <span className="text-[#D99A4A] leading-none">{liveStats.years}</span>
                  <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mt-2">Yrs</span>
                </div>
                <span className="text-[#8FA3AF] text-3xl font-light">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-[#D99A4A] leading-none">{liveStats.months}</span>
                  <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mt-2">Mos</span>
                </div>
                <span className="text-[#8FA3AF] text-3xl font-light">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-[#D99A4A] leading-none">{liveStats.days}</span>
                  <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mt-2">Days</span>
                </div>
              </div>
              
              <div className="text-2xl md:text-3xl font-mono text-white mt-2 font-semibold tracking-widest bg-[#0E2535] inline-block px-6 py-3 rounded-xl border border-[#28485A] shadow-inner mb-4">
                {String(liveStats.hours).padStart(2, '0')}<span className="text-[#6F9DB5]">:</span>{String(liveStats.minutes).padStart(2, '0')}<span className="text-[#6F9DB5]">:</span>{String(liveStats.seconds).padStart(2, '0')}
              </div>
              
              <div>
                <p className="text-sm text-gray-300 font-semibold uppercase tracking-wider">Successfully Running & Changing Lives</p>
              </div>
            </div>

            {/* WhatsApp Community Box */}
            <a 
              href="https://whatsapp.com/channel/0029VbCd2L6CsU9Z41Fhyg11" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gradient-to-br from-[#132C3C] to-[#0A1A24] rounded-2xl p-8 border-2 border-[#25D366]/40 text-center shadow-[0_0_40px_rgba(37,211,102,0.15)] relative overflow-hidden group hover:border-[#25D366] hover:-translate-y-1 transition-all duration-300 block"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#25D366] rounded-full blur-[90px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#25D366] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="flex items-center justify-center gap-2 mb-5 relative z-10">
                <MessageCircle className="w-8 h-8 text-[#25D366]" />
                <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Official WhatsApp Channel</h3>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-3 mb-8 relative z-10">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  Join Future Grow on WhatsApp
                </div>
                <p className="text-[#8FA3AF] max-w-lg mx-auto">
                  Stay updated with our latest news, exclusive announcements, and connect directly with the growing community in just one click!
                </p>
              </div>
              
              <div className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3.5 rounded-full font-bold transition-colors shadow-[0_4px_20px_rgba(37,211,102,0.4)] relative z-10 text-lg">
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Join WhatsApp Channel</span>
              </div>
            </a>

            {/* YouTube Channel Box */}
            <a 
              href="https://www.youtube.com/@FutureGrow-u7z" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gradient-to-br from-[#132C3C] to-[#0A1A24] rounded-2xl p-8 border-2 border-[#FF0000]/40 text-center shadow-[0_0_40px_rgba(255,0,0,0.15)] relative overflow-hidden group hover:border-[#FF0000] hover:-translate-y-1 transition-all duration-300 block"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF0000] rounded-full blur-[90px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF0000] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="flex items-center justify-center gap-2 mb-5 relative z-10">
                <Youtube className="w-8 h-8 text-[#FF0000]" />
                <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Official YouTube Channel</h3>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-3 mb-8 relative z-10">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  Subscribe to Future Grow
                </div>
                <p className="text-[#8FA3AF] max-w-lg mx-auto">
                  Watch our latest presentations, training videos, and community updates. Subscribe and hit the bell icon to never miss an update!
                </p>
              </div>
              
              <div className="inline-flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-[#cc0000] text-white px-8 py-3.5 rounded-full font-bold transition-colors shadow-[0_4px_20px_rgba(255,0,0,0.4)] relative z-10 text-lg">
                <Youtube className="w-5 h-5 fill-current" />
                <span>Subscribe on YouTube</span>
              </div>
            </a>
            
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-[#071E2C]">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-[#132C3C] rounded-xl p-6 border border-[#35576A]/50 text-xs text-gray-300 leading-relaxed text-center">
            <strong className="text-gray-300">Important:</strong> Future growth and income are not guaranteed. Results depend on individual effort, performance, business conditions and applicable company policies. Please understand the products, compensation plan, terms and applicable legal/tax requirements before participating. Your income, if any, depends on your performance, eligibility, sales/team activity and the applicable company plan and policies.
          </div>
        </div>
      </section>

    </div>
  );
}
