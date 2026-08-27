import React from 'react';
import { 
  Heart, 
  GraduationCap, 
  Home as HomeIcon, 
  Gift, 
  Activity, 
  Sparkles, 
  HandHeart, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2,
  Users,
  MessageCircle
} from 'lucide-react';

export function ThePeopleSupportPage() {
  const whatsappChannelUrl = 'https://whatsapp.com/channel/0029VbDu1N3Fy72FI9e3fz0j';

  return (
    <div className="bg-[#071E2C] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Main Header / Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#35B779] text-sm sm:text-base font-semibold">
            <HandHeart className="w-5 h-5" />
            सामाजिक सरोकार एवं सेवा संकल्प
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide flex items-center justify-center gap-3 flex-wrap drop-shadow-md">
            <span>🌱</span>
            <span>THE PEOPLE SUPPORT</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#35B779]">
            हर जरूरतमंद के साथ, हर कदम पर सहयोग
          </p>
          <div className="w-24 h-1.5 bg-[#35B779] mx-auto rounded-full mt-2"></div>
        </div>

        {/* 5% Contribution Intro Card */}
        <div className="bg-gradient-to-br from-[#132C3C] to-[#1B3343] rounded-2xl p-6 sm:p-10 border border-[#35B779]/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-5 relative z-10">
            <div className="inline-block px-3.5 py-1 rounded-md bg-[#35B779]/20 text-[#35B779] font-semibold text-xs sm:text-sm border border-[#35B779]/40 uppercase tracking-wider">
              5% सामाजिक सेवा संकल्प
            </div>
            
            <p className="text-lg sm:text-xl text-gray-100 font-medium leading-relaxed">
              <span className="text-[#35B779] font-bold">Future Grow</span> अपने सभी लोगों के साथ यह संकल्प साझा करता है कि कंपनी अपनी क्षमता और निर्धारित व्यवस्था के अनुसार <span className="text-white font-bold underline decoration-[#35B779] underline-offset-4">कंपनी के 5% हिस्से को जरूरतमंद लोगों की सहायता और सामाजिक सेवा के कार्यों में लगाने का प्रयास करेगी।</span>
            </p>

            <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
              हमारा उद्देश्य केवल व्यवसाय करना नहीं, बल्कि समाज के उन लोगों के साथ खड़ा होना है जिन्हें हमारी सहायता की आवश्यकता है। <span className="text-white font-semibold">जो हमारे सामर्थ्य में होगा, उसे ईमानदारी और सेवा भावना के साथ करने का प्रयास करेंगे।</span>
            </p>

            <p className="text-base sm:text-lg text-[#8FA3AF] leading-relaxed">
              इसी सोच के साथ <span className="text-[#35B779] font-semibold">The People Support</span> के माध्यम से जरूरतमंद लोगों के लिए विभिन्न प्रकार की सहायता का प्रयास किया जाएगा।
            </p>
          </div>
        </div>

        {/* Support Categories / Key Pillars */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              सहयोग के प्रमुख क्षेत्र
            </h2>
            <p className="text-sm sm:text-base text-[#8FA3AF]">समाज के प्रत्येक वर्ग तक राहत और मदद पहुँचाने का हमारा प्रयास</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Pillar 1: Education */}
            <div className="bg-[#132C3C] rounded-2xl p-6 sm:p-7 border border-[#28485A]/50 hover:border-[#35B779]/60 transition-all duration-200 shadow-md group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 group-hover:text-[#35B779] transition-colors">
                    <span>🎓</span>
                    <span>शिक्षा के लिए सहयोग</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                    गरीबी के कारण कोई बच्चा शिक्षा से वंचित न रहे, इसके लिए जरूरतमंद बच्चों की पढ़ाई, किताबें, कॉपी, स्कूल सामग्री और अन्य आवश्यक शैक्षणिक जरूरतों में सहयोग करने का प्रयास किया जाएगा।
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2: Needy Families */}
            <div className="bg-[#132C3C] rounded-2xl p-6 sm:p-7 border border-[#28485A]/50 hover:border-[#35B779]/60 transition-all duration-200 shadow-md group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                  <HomeIcon className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 group-hover:text-[#35B779] transition-colors">
                    <span>🏠</span>
                    <span>गरीब एवं जरूरतमंद परिवारों की सहायता</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                    आर्थिक रूप से कमजोर परिवारों को उनकी वास्तविक जरूरत के अनुसार भोजन, कपड़े, आवश्यक सामान और अन्य सामाजिक सहायता उपलब्ध कराने का प्रयास किया जाएगा।
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3: Marriage Support */}
            <div className="bg-[#132C3C] rounded-2xl p-6 sm:p-7 border border-[#28485A]/50 hover:border-[#35B779]/60 transition-all duration-200 shadow-md group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 shadow-inner">
                  <Gift className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 group-hover:text-[#35B779] transition-colors">
                    <span>👰</span>
                    <span>गरीब परिवारों में शादी के लिए सहयोग</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                    आर्थिक रूप से कमजोर परिवारों में शादी जैसी महत्वपूर्ण जरूरतों के समय, संस्था की क्षमता और उपलब्ध संसाधनों के अनुसार सहयोग करने का प्रयास किया जाएगा।
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 4: Medical & Health */}
            <div className="bg-[#132C3C] rounded-2xl p-6 sm:p-7 border border-[#28485A]/50 hover:border-[#35B779]/60 transition-all duration-200 shadow-md group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
                  <Activity className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 group-hover:text-[#35B779] transition-colors">
                    <span>🏥</span>
                    <span>बीमारी और स्वास्थ्य के समय सहायता</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                    यदि किसी जरूरतमंद व्यक्ति की तबीयत खराब होती है और आर्थिक परेशानी के कारण इलाज में कठिनाई आती है, तो उसकी स्थिति और उपलब्ध संसाधनों के अनुसार स्वास्थ्य एवं चिकित्सा सहायता देने का प्रयास किया जाएगा।
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Vision & Pledge Section */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Vision */}
          <div className="bg-[#132C3C] rounded-2xl p-6 sm:p-8 border border-[#28485A]/50 shadow-lg space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 text-rose-400">
              <Heart className="w-6 h-6 fill-rose-500/20 text-rose-400" />
              हमारा Vision
            </h3>
            <p className="text-base sm:text-lg text-gray-100 leading-relaxed">
              <span className="font-bold text-[#35B779]">Future Grow</span> का सपना है कि आने वाले समय में कोई भी व्यक्ति केवल गरीबी या आर्थिक मजबूरी के कारण अपने जीवन की मूलभूत जरूरतों से वंचित न रहे।
            </p>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              हम जानते हैं कि हर जरूरत को अकेले पूरा करना संभव नहीं है, लेकिन हमारा विश्वास है कि <span className="text-[#35B779] font-bold">एक छोटा प्रयास भी किसी के जीवन में बड़ा बदलाव ला सकता है।</span>
            </p>
          </div>

          {/* Pledge */}
          <div className="bg-[#132C3C] rounded-2xl p-6 sm:p-8 border border-[#28485A]/50 shadow-lg space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 text-amber-400">
              <Sparkles className="w-6 h-6 text-amber-400" />
              हमारा संकल्प
            </h3>
            <blockquote className="border-l-4 border-[#35B779] pl-4 py-1 text-sm sm:text-base italic text-gray-200 space-y-2">
              <p>“जो हमारे सामर्थ्य में होगा, हम वह करने का पूरा प्रयास करेंगे।”</p>
              <p>“जिसे हमारी जरूरत होगी, उसके साथ खड़े होने का प्रयास करेंगे।”</p>
              <p className="text-[#35B779] font-bold not-italic pt-1 text-base sm:text-lg">
                “हमारा लक्ष्य है—व्यवसाय के साथ मानवता, सेवा और समाज के प्रति जिम्मेदारी।”
              </p>
            </blockquote>
          </div>

        </div>

        {/* Voluntary Join / Support Callout with WhatsApp Link */}
        <div className="bg-gradient-to-r from-[#1B3343] via-[#132C3C] to-[#1B3343] rounded-2xl p-6 sm:p-10 border border-emerald-500/40 shadow-xl space-y-6 text-center relative overflow-hidden">
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs sm:text-sm border border-emerald-500/40">
              <span>🌱</span> THE PEOPLE SUPPORT
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              The People Support के साथ जुड़ें एवं सहयोग करें
            </h2>
            
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
              अगर कोई व्यक्ति <strong className="text-white font-bold">The People Support</strong> के साथ जुड़कर जरूरतमंद लोगों की मदद करना चाहता है, तो वह अपनी इच्छा से सहयोग कर सकता है।
            </p>

            {/* Voluntary Notice Box */}
            <div className="bg-[#071E2C]/90 rounded-xl p-4 sm:p-5 border border-emerald-500/40 text-emerald-200 text-sm sm:text-base font-semibold flex items-center justify-center gap-3 shadow-inner">
              <CheckCircle2 className="w-5 h-5 text-[#35B779] shrink-0" />
              <span>सहयोग करना पूरी तरह स्वैच्छिक है। किसी भी व्यक्ति पर किसी प्रकार का दबाव या जबरदस्ती नहीं होगी।</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base sm:text-lg shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Join The People Support (WhatsApp)</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>

          <div className="pt-4 border-t border-[#28485A]/50 text-sm sm:text-base text-gray-300 italic font-medium">
            “जो हमारे सामर्थ्य में होगा, हम करेंगे और जिसे हमारी जरूरत होगी, उसके साथ खड़े होने का प्रयास करेंगे।”
          </div>

          <div className="text-xs sm:text-sm font-bold text-[#35B779] tracking-widest uppercase">
            Together for a Better Future
          </div>
        </div>

      </div>
    </div>
  );
}
