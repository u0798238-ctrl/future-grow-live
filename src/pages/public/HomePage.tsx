import React, { useState, useEffect } from 'react';
import { 
  Star, MapPin, ArrowRight, Sparkles, Target, Users, Globe, 
  Rocket, Sprout, Gem, Flame, Clock, MessageCircle, Youtube,
  Building2, TrendingUp, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const calculateUptime = () => {
  // Configured company start date (producing ~2 yrs, 9 mos, 11 days, and ticking live)
  const startDate = new Date("2023-11-14T00:00:00");
  const now = new Date();
  
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return { years, months, days, timeString: `${hours} : ${minutes} : ${seconds}` };
};

const calculateCommunityCount = () => {
  // Base count of 1,33,815 with automatic 10 new members incremented daily
  const baseDate = new Date("2026-08-25T00:00:00");
  const baseCount = 133815;
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - baseDate.getTime());
  
  // 10 members added across each 24-hour day (86,400,000 ms)
  const additionalMembers = Math.floor((diffMs / 86400000) * 10);
  const total = baseCount + additionalMembers;
  return total.toLocaleString('en-IN');
};

export function HomePage() {
  const [uptime, setUptime] = useState(calculateUptime());
  const [communityCount, setCommunityCount] = useState(calculateCommunityCount());

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(calculateUptime());
      setCommunityCount(calculateCommunityCount());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#051520] flex flex-col font-sans overflow-x-hidden text-gray-200">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* HERO SECTION */}
        <div className="flex justify-center mb-6">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#112738] border border-[#1C3A50] text-gray-300 text-[10px] font-medium tracking-wider uppercase">
             <Star className="w-3 h-3 text-[#D99A4A]" />
             A New Opportunity For A Better Tomorrow
           </div>
        </div>

        {/* Corporate Head Office Image */}
        <div className="relative rounded-2xl overflow-hidden border border-[#1C3A50] shadow-lg mb-8">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Corporate Head Office" 
            className="w-full h-40 md:h-56 object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051520] via-[#051520]/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Corporate Head Office</h3>
            <p className="text-xs md:text-sm text-gray-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#35B779]" /> Gomti Nagar, Lucknow, UP – 226010, India
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            FUTURE GROW
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            A platform where people can focus on personal and business growth through products, training, networking, and leadership development.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/register">
              <Button className="bg-[#6F9DB5] hover:bg-[#5C8A9F] text-white font-medium px-6 py-2.5 rounded-lg h-auto text-base shadow-[0_0_15px_rgba(111,157,181,0.2)]">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-[#1C3A50] to-transparent"></div>

        {/* OUR PURPOSE */}
        <div className="bg-[#0B1E2D] rounded-2xl p-6 md:p-8 border border-[#1C3A50] relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5">
            <Target className="w-64 h-64" />
          </div>
          <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gray-400" /> OUR PURPOSE
          </h2>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-6 relative z-10">
            Future Grow aims to create a new opportunity for people who have not yet been able to achieve the financial growth they dreamed of through traditional businesses or other companies.
          </p>
          <div className="p-5 bg-[#081824] rounded-lg border-l-4 border-[#6F9DB5] relative z-10">
            <p className="text-base md:text-lg text-gray-300 italic">
              <span className="font-semibold text-white">We believe that</span> <span className="text-[#6F9DB5]">the right opportunity + proper guidance + consistent effort</span> <span className="font-semibold text-white">can help individuals move forward and build a stronger future.</span>
            </p>
          </div>
        </div>

        {/* OUR VISION (First) */}
        <div className="bg-[#0B1E2D] rounded-2xl p-6 md:p-8 border border-[#1C3A50]">
          <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" /> OUR VISION
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
            “To provide people with an opportunity to learn, grow and work toward building a better financial future.”
          </h3>
          <p className="text-gray-300 text-base md:text-lg">
            Everyone dreams of a better financial future. We provide the tools, the network, and the support to make it a reality.
          </p>
        </div>

        {/* TEAMWORK = GROWTH */}
        <div className="bg-[#0B1E2D] rounded-2xl p-6 md:p-8 border border-[#1C3A50]">
          <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" /> TEAMWORK = GROWTH
          </h2>
          <p className="text-white font-medium mb-4 text-base md:text-lg">You can develop skills in:</p>
          <ul className="space-y-4">
            {[
              "Business & Product Knowledge",
              "Digital & Online Marketing",
              "Team Building & Network Expansion",
              "Leadership & Communication",
              "Personal Development"
            ].map((skill, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 text-base">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5]"></div>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-[#1C3A50] to-transparent"></div>

        {/* LIFE AT FUTURE GROW */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#112738] border border-[#1C3A50] text-[#6F9DB5] text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" /> EXCLUSIVE CULTURE
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider uppercase">
            LIFE AT FUTURE GROW
          </h2>
        </div>

        <div className="space-y-6">
          {/* Card 1: Corporate Meetings */}
          <div className="relative rounded-2xl overflow-hidden border border-[#1C3A50] hover:border-[#6F9DB5]/60 transition-all duration-300 aspect-[16/9] md:aspect-[21/9] shadow-xl group">
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
              alt="Corporate Meetings" 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051520] via-[#051520]/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#112738]/90 backdrop-blur border border-[#6F9DB5]/40 text-[10px] font-bold text-[#6F9DB5] uppercase tracking-wider rounded-md mb-3 shadow-md">
                <Target className="w-3 h-3" /> LEADERSHIP & VISION
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Corporate Meetings</h3>
              <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">Collaborating with the best minds to drive innovation and support our growing network.</p>
            </div>
          </div>

          {/* Card 2: Premium Workspaces */}
          <div className="relative rounded-2xl overflow-hidden border border-[#1C3A50] hover:border-[#35B779]/60 transition-all duration-300 aspect-[16/9] md:aspect-[21/9] shadow-xl group">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
              alt="Premium Workspaces" 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051520] via-[#051520]/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#112738]/90 backdrop-blur border border-[#35B779]/40 text-[10px] font-bold text-[#35B779] uppercase tracking-wider rounded-md mb-3 shadow-md">
                <Building2 className="w-3 h-3" /> MODERN WORKSPACE
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Premium Workspaces</h3>
              <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">Professional and inspiring environment designed for our visionary leaders.</p>
            </div>
          </div>

          {/* Card 3: Achieving Success */}
          <div className="relative rounded-2xl overflow-hidden border border-[#1C3A50] hover:border-[#4CC9F0]/60 transition-all duration-300 aspect-[16/9] md:aspect-[21/9] shadow-xl group">
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop" 
              alt="Achieving Success" 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051520] via-[#051520]/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#112738]/90 backdrop-blur border border-[#4CC9F0]/40 text-[10px] font-bold text-[#4CC9F0] uppercase tracking-wider rounded-md mb-3 shadow-md">
                <TrendingUp className="w-3 h-3" /> GROWTH & MILESTONES
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Achieving Success</h3>
              <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">Reaching financial milestones, breaking barriers, and living the dream together.</p>
            </div>
          </div>

          {/* Card 4: Mega Seminars */}
          <div className="relative rounded-2xl overflow-hidden border border-[#1C3A50] hover:border-[#35B779]/60 transition-all duration-300 aspect-[16/9] md:aspect-[21/9] shadow-xl group">
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" 
              alt="Mega Seminars" 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051520] via-[#051520]/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#112738]/90 backdrop-blur border border-[#35B779]/40 text-[10px] font-bold text-[#35B779] uppercase tracking-wider rounded-md mb-3 shadow-md">
                <Users className="w-3 h-3" /> COMMUNITY & EVENTS
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Mega Seminars</h3>
              <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">Learn from top industry leaders in massive national company conventions.</p>
            </div>
          </div>

          {/* Card 5: Rewards & Awards */}
          <div className="relative rounded-2xl overflow-hidden border border-[#1C3A50] hover:border-[#D99A4A]/60 transition-all duration-300 aspect-[16/9] md:aspect-[21/9] shadow-xl group">
            <img 
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop" 
              alt="Rewards & Awards" 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051520] via-[#051520]/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#112738]/90 backdrop-blur border border-[#D99A4A]/40 text-[10px] font-bold text-[#D99A4A] uppercase tracking-wider rounded-md mb-3 shadow-md">
                <Award className="w-3 h-3" /> RECOGNITION & HONORS
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Rewards & Awards</h3>
              <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">Celebrating top achievers and life-changing milestones on the grand stage.</p>
            </div>
          </div>
        </div>

        <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-[#1C3A50] to-transparent"></div>

        {/* FUTURE GROW MODEL */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase mb-10">
            FUTURE GROW MODEL
          </h2>
          <div className="space-y-6 mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#8FA3AF]">LEARN</h3>
            <h3 className="text-2xl md:text-3xl font-bold text-[#8FA3AF]">WORK</h3>
            <h3 className="text-2xl md:text-3xl font-bold text-[#8FA3AF]">BUILD</h3>
            <h3 className="text-2xl md:text-3xl font-bold text-[#6F9DB5]">GROW</h3>
          </div>
          <p className="text-gray-200 text-base md:text-lg max-w-2xl mx-auto">
            Build your knowledge. Develop your skills. Build your team. Work consistently toward your goals.
          </p>
        </div>

        <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-[#1C3A50] to-transparent"></div>

        {/* OUR VISION (Building stronger future) */}
        <div className="bg-[#0B1E2D] rounded-2xl p-6 md:p-8 border border-[#1C3A50]">
          <h2 className="text-xs font-bold tracking-widest text-white uppercase mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-white" /> OUR VISION
          </h2>
          <h3 className="text-lg md:text-xl font-bold text-white uppercase mb-6">BUILDING A STRONGER FUTURE, TOGETHER</h3>
          <p className="text-gray-300 mb-6 text-base md:text-lg leading-relaxed">
            Future Grow's vision is to become a trusted and growing platform that creates <span className="text-[#6F9DB5]">long-term opportunities for people, families and communities</span>.
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            We believe the future belongs to those who <span className="text-white font-semibold">think bigger, learn continuously, work consistently and grow together.</span>
          </p>
        </div>

        {/* OUR BIGGER DREAM */}
        <div className="bg-[#0B1E2D] rounded-2xl p-6 md:p-8 border border-[#1C3A50]">
          <h2 className="text-xs font-bold tracking-widest text-white uppercase mb-6 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-white" /> OUR BIGGER DREAM
          </h2>
          <p className="text-gray-300 mb-6 text-base md:text-lg leading-relaxed">
            In the coming years, we aim to <span className="text-[#6F9DB5]">develop and expand Future Grow on a much larger scale</span>, reaching more cities, more communities and more people.
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Our goal is to build a strong ecosystem where people can learn new skills, discover business opportunities, develop leadership qualities and work together toward their financial goals.
          </p>
        </div>

        {/* OUR FUTURE FOCUS */}
        <div className="bg-[#0B1E2D] rounded-2xl p-6 md:p-8 border border-[#1C3A50]">
          <h2 className="text-xs font-bold tracking-widest text-white uppercase mb-6 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-white" /> OUR FUTURE FOCUS
          </h2>
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-gray-400 uppercase mb-8 flex-wrap">
            <span>EXPAND</span> <ArrowRight className="w-3 h-3" />
            <span>EDUCATE</span> <ArrowRight className="w-3 h-3" />
            <span>EMPOWER</span> <ArrowRight className="w-3 h-3" />
            <span>GROW</span>
          </div>
          <ul className="space-y-4">
            {[
              "Build a strong and professional organization",
              "Expand our network across India and beyond",
              "Provide quality products and business education",
              "Develop thousands of capable leaders",
              "Create opportunities to grow through their efforts",
              "Build a long-term sustainable organization"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 text-base">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6F9DB5]"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* OUR BELIEF */}
        <div className="bg-[#0B1E2D] rounded-2xl p-6 md:p-10 border-l-4 border-[#35B779] border-t border-r border-b border-t-[#1C3A50] border-r-[#1C3A50] border-b-[#1C3A50] relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5 -mr-4 -mb-4">
             <Gem className="w-48 h-48" />
          </div>
          <h2 className="text-xs font-bold tracking-widest text-[#8FA3AF] uppercase mb-6 flex items-center gap-2 relative z-10">
            <Gem className="w-4 h-4 text-[#8FA3AF]" /> OUR BELIEF
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-white italic leading-tight mb-8 relative z-10">
            “When one person grows, it is success. When thousands grow together, it becomes a movement.”
          </h3>
          <p className="text-gray-300 text-lg relative z-10">
            Future Grow wants to create a future where <span className="text-[#6F9DB5]">hard work, teamwork, knowledge and leadership</span> can open new possibilities for people.
          </p>
        </div>

        <div className="flex justify-center my-16">
          <Flame className="w-10 h-10 text-gray-400" />
        </div>

        {/* FUTURE GROW */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest uppercase mb-8">
            FUTURE GROW
          </h2>
          <div className="space-y-6 mb-10">
            <h3 className="text-base md:text-lg font-bold tracking-widest text-[#8FA3AF]">DREAM BIG</h3>
            <h3 className="text-base md:text-lg font-bold tracking-widest text-[#8FA3AF]">WORK SMART</h3>
            <h3 className="text-base md:text-lg font-bold tracking-widest text-[#8FA3AF]">GROW TOGETHER</h3>
          </div>
        </div>
        
        <div className="bg-[#0B1E2D] rounded-2xl p-6 md:p-8 border border-[#1C3A50] text-center">
           <p className="text-gray-300 italic font-medium text-lg md:text-xl leading-relaxed">
             Our vision is not just to build a company.<br/>
             Our vision is to build a strong community that grows together for years to come.
           </p>
        </div>

        <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-[#1C3A50] to-transparent"></div>

        {/* Our Growing Network */}
        <div className="text-center mb-10 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Globe className="w-80 h-80" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Growing Network</h2>
          <div className="w-20 h-1 bg-[#35B779] mx-auto rounded-full mb-10"></div>
          
          <div className="bg-[#0B1E2D] rounded-2xl p-8 md:p-12 border border-[#1C3A50] relative z-10 shadow-xl">
             <div className="flex items-center justify-center gap-2 text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">
               <Users className="w-5 h-5" /> LIVE COMMUNITY
             </div>
             <div className="flex items-center justify-center gap-3 mb-6">
               <div className="w-4 h-4 rounded-full bg-[#35B779] animate-pulse shadow-[0_0_10px_rgba(53,183,121,0.6)]"></div>
               <h3 className="text-6xl md:text-7xl font-bold text-white tracking-tight">{communityCount}<span className="text-[#6F9DB5]">+</span></h3>
             </div>
             <div className="inline-block px-5 py-2 bg-[#112738] border border-[#1C3A50] text-xs font-bold text-[#35B779] uppercase tracking-wider rounded-full shadow-inner">
               GROWING DAILY ACROSS THE NATION
             </div>
          </div>
        </div>

        {/* COMPANY UPTIME */}
        <div className="bg-[#0B1E2D] rounded-2xl p-8 md:p-12 border border-[#1C3A50] text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 text-sm font-bold tracking-widest text-gray-400 uppercase mb-8">
            <Clock className="w-5 h-5" /> COMPANY UPTIME
          </div>
          
          <div className="flex items-center justify-center gap-6 md:gap-8 mb-8">
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-bold text-[#D99A4A] drop-shadow-md">{uptime.years}</span>
              <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Yrs</span>
            </div>
            <span className="text-3xl md:text-4xl font-bold text-[#D99A4A]/50 pb-6">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-bold text-[#D99A4A] drop-shadow-md">{uptime.months}</span>
              <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Mos</span>
            </div>
            <span className="text-3xl md:text-4xl font-bold text-[#D99A4A]/50 pb-6">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-bold text-[#D99A4A] drop-shadow-md">{uptime.days}</span>
              <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Days</span>
            </div>
          </div>
          
          <div className="inline-block px-8 py-3 bg-[#081824] border border-[#1C3A50] rounded-xl mb-8 shadow-inner">
            <span className="text-3xl md:text-4xl font-mono text-[#8FA3AF] tracking-[0.2em]">{uptime.timeString}</span>
          </div>
          
          <div className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest">
            SUCCESSFULLY RUNNING & CHANGING LIVES
          </div>
        </div>

        {/* Join WhatsApp Channel */}
        <div className="bg-[#0B1E2D] rounded-2xl p-8 md:p-12 border border-[#35B779]/30 text-center relative overflow-hidden shadow-xl mt-12">
          <div className="absolute inset-0 bg-gradient-to-b from-[#35B779]/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 text-sm font-bold tracking-widest text-[#35B779] uppercase mb-6">
              <MessageCircle className="w-5 h-5" /> OFFICIAL WHATSAPP CHANNEL
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Future Grow on WhatsApp</h2>
            <p className="text-base md:text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Stay updated with our latest news, exclusive announcements, and connect directly with the growing community in just one click!
            </p>
            <a href="https://whatsapp.com/channel/0029VbCd2L6CsU9Z41Fhyg11" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#35B779] hover:bg-[#2A9D66] text-white font-bold rounded-full shadow-[0_0_30px_rgba(53,183,121,0.3)] transition-all text-lg">
              <MessageCircle className="w-6 h-6 fill-current" /> Join WhatsApp Channel
            </a>
          </div>
        </div>

        {/* Subscribe YouTube */}
        <div className="bg-[#0B1E2D] rounded-2xl p-8 md:p-12 border border-red-500/30 text-center relative overflow-hidden shadow-xl mt-6">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 text-sm font-bold tracking-widest text-red-500 uppercase mb-6">
              <Youtube className="w-5 h-5" /> OFFICIAL YOUTUBE CHANNEL
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Subscribe to Future Grow</h2>
            <p className="text-base md:text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Watch our latest presentations, training videos, and community updates. Subscribe and hit the bell icon to never miss an update!
            </p>
            <a href="https://youtube.com/@futuregrow-u7z?si=qXt2vgz9WNtDRpac" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all text-lg">
              <Youtube className="w-6 h-6 fill-current" /> Subscribe on YouTube
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#112738] rounded-xl p-6 md:p-8 text-center border border-[#1C3A50] mt-12 mb-8">
          <p className="text-sm text-gray-400 leading-relaxed font-light">
            <strong className="text-white font-medium">Important:</strong> Future growth and income are not guaranteed. Results depend on individual effort, performance, business conditions and applicable company policies. Please understand the products, compensation plan, terms and applicable legal/tax requirements before participating. Your income, if any, depends on your performance, eligibility, sales/team activity and the applicable company plan and policies.
          </p>
        </div>

      </div>
    </div>
  );
}

