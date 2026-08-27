import React from 'react';
import { 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Users, 
  ShieldCheck, 
  Clock, 
  Heart, 
  Sparkles, 
  Flame, 
  AlertCircle,
  ArrowRight,
  HandHeart,
  IndianRupee,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  const benefits = [
    {
      icon: <Zap className="w-7 h-7 text-amber-400" />,
      badge: "1. ⚡ Fast Withdrawal",
      badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      title: "Fast Withdrawal",
      desc: "Eligible members can access fast and instant withdrawals. Once standard verification is complete, payouts can be credited directly to your bank account within 24 hours as per company policy."
    },
    {
      icon: <CheckCircle2 className="w-7 h-7 text-emerald-400" />,
      badge: "2. 🚫 No Unnecessary Conditions",
      badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      title: "Simple & Transparent Rules",
      desc: "A clean, straightforward system designed to avoid complex hurdles like unnecessary 2:1 ratios, ensuring honest and transparent operations under our standard withdrawal guidelines."
    },
    {
      icon: <IndianRupee className="w-7 h-7 text-[#35B779]" />,
      badge: "3. 💰 Enhanced Income Opportunity",
      badgeColor: "bg-[#35B779]/15 text-[#35B779] border-[#35B779]/30",
      title: "High-Earning Potential",
      desc: "Future Grow provides rewarding opportunities based on your dedication, team leadership, and performance. Consistent effort and strategic planning can unlock steady, scalable earnings."
    },
    {
      icon: <TrendingUp className="w-7 h-7 text-blue-400" />,
      badge: "4. 📈 Future Growth",
      badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      title: "Massive Long-Term Growth",
      desc: "Small beginnings today lay the foundation for substantial long-term growth. The stronger your team network expands, the greater your prospects to scale new financial heights."
    },
    {
      icon: <Users className="w-7 h-7 text-purple-400" />,
      badge: "5. 🤝 Direct Income",
      badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      title: "Direct Referral Benefits",
      desc: "Earn substantial direct income benefits on personal recommendations (e.g., up to ₹1,500 on eligible direct referrals subject to terms and active plan criteria)."
    },
    {
      icon: <Layers className="w-7 h-7 text-cyan-400" />,
      badge: "6. 💎 Matching & Level Income",
      badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      title: "Matching & Multi-Level Earnings",
      desc: "Unlock matching bonuses and structured level payouts as your team grows. Your earnings expand beyond individual efforts into compound team performance."
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-rose-400" />,
      badge: "7. 🛡️ Family & Future Security",
      badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      title: "Support for You & Your Family",
      desc: "More than an income platform: Future Grow works to provide accidental assistance, educational backing, family aid, and vital community welfare for eligible members."
    },
    {
      icon: <Clock className="w-7 h-7 text-indigo-400" />,
      badge: "8. ⏰ Time Freedom & Financial Growth",
      badgeColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      title: "Time Freedom & Independence",
      desc: "Build a resilient team and establish true autonomy over your daily schedule. Attain financial independence backed by continuous performance and dedicated teamwork."
    },
    {
      icon: <Award className="w-7 h-7 text-yellow-400" />,
      badge: "9. 🏆 Reward & Recognition",
      badgeColor: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
      title: "Honoring Effort & Excellence",
      desc: "For leaders working with honesty and determination, Future Grow recognizes excellence with prestigious ranks, physical milestone gifts, tours, and company awards."
    }
  ];

  return (
    <div className="bg-[#071E2C] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Main Title & Hero Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#35B779] text-xs sm:text-sm font-semibold">
            <span>🌱</span> Future Grow & The People Support
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide leading-tight">
              Future Grow Private Limited Company
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#35B779] leading-tight">
              को JOIN करने का क्या फायदा है?
            </h2>
          </div>

          <p className="text-lg sm:text-2xl font-semibold text-gray-200">
            आज की मेहनत, बेहतर कल की ओर
          </p>
          <div className="w-24 h-1 bg-[#35B779] mx-auto rounded-full mt-2"></div>
        </div>

        {/* Intro Card */}
        <div className="bg-gradient-to-br from-[#132C3C] to-[#1B3343] rounded-2xl p-6 sm:p-8 border border-[#28485A]/50 shadow-lg space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <p className="text-base sm:text-lg text-gray-200 font-normal leading-relaxed">
            हर व्यक्ति के अंदर आगे बढ़ने की क्षमता होती है। कई लोग दूसरी कंपनियों या नेटवर्क में काम करने के बाद भी अपनी मेहनत के अनुसार सफलता हासिल नहीं कर पाते। <span className="text-[#35B779] font-medium">Future Grow ऐसे लोगों के लिए एक नया अवसर बन सकता है</span>, जहाँ सही दिशा, मेहनत और लगन के साथ अपनी skills, team और network को विकसित करके आगे बढ़ने का प्रयास किया जा सकता है।
          </p>

          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            हमारा उद्देश्य है कि हर व्यक्ति को अपनी मेहनत और क्षमता के अनुसार आगे बढ़ने का अवसर मिले और वह अपने तथा अपने परिवार के बेहतर भविष्य की दिशा में कदम बढ़ा सके।
          </p>
        </div>

        {/* 9 Highlights / Key Benefits Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-2">
              <span>💪</span> Future Grow Key Advantages
            </h2>
            <p className="text-sm sm:text-base text-[#8FA3AF] max-w-2xl mx-auto">
              Transparency, financial security, and cutting-edge systems empowering your journey to success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((item, index) => (
              <div 
                key={index}
                className="bg-[#132C3C] rounded-2xl p-6 border border-[#28485A]/40 hover:border-[#35B779]/60 transition-all duration-200 shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#071E2C] border border-[#28485A] flex items-center justify-center shadow-inner">
                      {item.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#35B779] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-[#132C3C] rounded-2xl p-6 sm:p-8 border border-[#35B779]/30 shadow-lg text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-medium text-xs border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            हमारा विजन एवं उद्देश्य
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-hindi-heading text-white">
            🌟 हमारा Vision
          </h2>
          
          <p className="text-sm sm:text-base text-gray-200 max-w-3xl mx-auto leading-relaxed font-normal">
            हमारा सपना है कि <span className="text-[#35B779] font-medium">Future Grow एक मजबूत और भरोसेमंद organization के रूप में अपनी पहचान बनाए</span> और अधिक से अधिक लोगों को आगे बढ़ने का अवसर मिले।
          </p>

          <div className="bg-[#071E2C]/80 rounded-xl p-4 border border-[#28485A] max-w-2xl mx-auto">
            <p className="text-base sm:text-lg font-hindi-heading text-white italic">
              “मेहनत आपकी, दिशा Future Grow की — सफलता की राह आपकी अपनी।”
            </p>
          </div>
        </div>

        {/* The People Support Section */}
        <div className="bg-[#132C3C] rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#28485A]/50 pb-4">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-medium uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                सामाजिक उत्तरदायित्व
              </div>
              <h2 className="text-2xl sm:text-3xl font-hindi-heading text-white flex items-center gap-2">
                <span>❤️</span> The People Support
              </h2>
            </div>
            <Link 
              to="/the-people-support"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium shadow transition-all"
            >
              <span>The People Support पेज देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
            Future Grow की सामाजिक सोच के तहत <span className="font-medium text-white">The People Support</span> के माध्यम से जरूरतमंद लोगों की सहायता करने का प्रयास किया जाएगा।
          </p>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
            बच्चों की <span className="text-white font-medium">Education</span>, जरूरतमंद लोगों की <span className="text-white font-medium">Health</span>, भोजन, कपड़े, शादी और अन्य आवश्यक जरूरतों में सहयोग करने की दिशा में कार्य किया जाएगा।
          </p>
        </div>

        {/* Motivation Message / संदेश */}
        <div className="bg-gradient-to-br from-[#1B3343] to-[#071E2C] rounded-2xl p-6 sm:p-8 border border-[#35B779]/30 shadow-lg text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/15 text-orange-300 font-medium text-xs border border-orange-500/30">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            🔥 हमारा संदेश
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white leading-snug font-hindi-heading">
            अगर पहले कहीं सफलता नहीं मिली, तो कोशिश करना बंद मत कीजिए।
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Future Grow से जुड़िए, सीखिए, मेहनत कीजिए, अपनी Team बनाइए और अपने बेहतर भविष्य की दिशा में आगे बढ़ने का प्रयास कीजिए।
          </p>

          <div className="pt-3 border-t border-[#28485A]/50">
            <div className="text-lg sm:text-xl font-semibold text-[#35B779] tracking-normal">
              Future Grow × The People Support
            </div>
            <div className="text-xs font-normal text-gray-400 tracking-wider uppercase mt-1">
              Growth • Opportunity • Humanity • Support • Security
            </div>
          </div>
        </div>

        {/* Official Disclaimer / महत्वपूर्ण सूचना */}
        <div className="bg-[#071E2C] rounded-xl p-5 border border-amber-500/25 shadow space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-medium text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>महत्वपूर्ण सूचना एवं अस्वीकरण (Disclaimer)</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-normal">
            सभी income, withdrawal, rewards और support benefits कंपनी की आधिकारिक योजना, पात्रता, verification, policy तथा terms & conditions के अधीन होंगे। ₹1,500 Direct Income, ₹1,000 Matching Income अथवा 24-hour withdrawal जैसे उदाहरण/दावे तभी लागू माने जाएँ जब वे कंपनी की आधिकारिक योजना में स्पष्ट रूप से उपलब्ध हों। किसी भी income या benefit को guaranteed अथवा निश्चित न समझें।
          </p>
        </div>

      </div>
    </div>
  );
}

