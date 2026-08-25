import React, { useState, useEffect } from 'react';
import { Copy, Check, Users, Link as LinkIcon, Send, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { getCurrentUser, MlmUser, getMlmUsers } from '@/lib/mlmStore';
import { copyTextToClipboard } from '@/lib/utils';

export function InvitePage() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'hindi' | 'english' | 'short'>('short');
  const [currentUser, setCurrentUser] = useState<MlmUser>(getCurrentUser());

  const loadUser = () => {
    setCurrentUser(getCurrentUser());
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('mlm_update', loadUser);
    window.addEventListener('current_user_change', loadUser);
    return () => {
      window.removeEventListener('mlm_update', loadUser);
      window.removeEventListener('current_user_change', loadUser);
    };
  }, []);

  const sponsorCode = currentUser.id || "FGPL000001";
  // Clean, professional short referral URL
  const referralLink = `${window.location.origin}/r/${sponsorCode}`;

  const allUsers = getMlmUsers();
  const directTeam = allUsers.filter(u => u.sponsorId === currentUser.id);
  const activeDirects = directTeam.filter(u => u.status === 'Active').length;

  const handleCopyLink = async () => {
    const ok = await copyTextToClipboard(referralLink);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = async () => {
    const ok = await copyTextToClipboard(sponsorCode);
    if (ok) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const templates = {
    short: `🚀 *FUTURE GROW - JOIN MY TEAM*\n\nEarn Daily Direct Income (₹1,500) & Binary Matching Income (₹1,000/pair)!\n\n👉 *Direct Join Link:* ${referralLink}\n🔑 *Sponsor ID:* ${sponsorCode}\n\nRegister now and start earning!`,
    hindi: `🌟 *फ्यूचर ग्रो (Future Grow) बिज़नेस अवसर*\n\nनमस्ते! भारत के सबसे तेजी से बढ़ते नेटवर्क में शामिल हों और घर बैठे अनलिमिटेड इनकम कमाएं:\n\n✅ डायरेक्ट इनकम: ₹1,500/जॉइनिंग\n✅ मैचिंग इनकम: ₹1,000/पेयर\n✅ 10-लेवल माइलस्टोन बोनस\n✅ डेली विड्रॉल सीधा बैंक/UPI में\n\n👉 *जॉइनिंग लिंक:* ${referralLink}\n🔑 *स्पॉन्सर आईडी:* ${sponsorCode}\n\nआज ही रजिस्टर करें और टीम का हिस्सा बनें!`,
    english: `💼 *Future Grow Official Business Invitation*\n\nJoin our high-earning binary network today with instant commission distribution and daily payouts.\n\n✨ Direct Income: ₹1,500 (No Capping)\n✨ Binary Matching: ₹1,000 / Pair\n✨ 10-Level Milestone Bonuses\n\n🔗 *Official Registration Link:* ${referralLink}\n👤 *Sponsor Code:* ${sponsorCode}\n\nBest regards,\n${currentUser.name}`
  };

  const handleWhatsAppShare = (type: 'short' | 'hindi' | 'english' = selectedTemplate) => {
    const message = templates[type];
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyTemplateText = async (type: 'short' | 'hindi' | 'english') => {
    const ok = await copyTextToClipboard(templates[type]);
    if (ok) {
      setCopiedTemplate(type);
      setTimeout(() => setCopiedTemplate(null), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Referral Link</h1>
          <p className="text-gray-300 text-sm">Share your personalized invite link to grow your binary team and earn direct income!</p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-[#132C3C] border border-[#28485A]/60 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-300">Directs: <strong className="text-white">{directTeam.length}</strong></span>
          </div>
          <div className="bg-[#132C3C] border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">Active: <strong className="text-white">{activeDirects}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Short Link Hero Card */}
      <div className="bg-gradient-to-br from-[#132C3C] via-[#0F2432] to-[#071E2C] rounded-3xl border-2 border-[#6F9DB5]/50 p-6 sm:p-8 shadow-[0_0_30px_rgba(111,157,181,0.2)] hover:border-[#6F9DB5] transition-all">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Professional Direct Link
            </span>
            <span className="text-xs text-gray-400">Direct Registration Lock</span>
          </div>

          {/* Clean Short Referral Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
              Your Direct Sponsor Link
            </label>
            <div className="flex items-center bg-[#071E2C] border-2 border-emerald-500/60 rounded-2xl overflow-hidden shadow-inner p-1">
              <div className="bg-[#132C3C] px-3.5 py-2.5 rounded-xl flex items-center gap-2 border border-[#28485A]/50">
                <LinkIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold text-emerald-300 hidden sm:inline">REFERRAL URL</span>
              </div>
              <div className="px-4 py-2 text-sm font-mono font-semibold text-white truncate flex-1 select-all">
                {referralLink}
              </div>
              <button 
                onClick={handleCopyLink} 
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all flex items-center justify-center font-bold text-xs rounded-xl gap-1.5 shrink-0 shadow-md cursor-pointer"
              >
                {copiedLink ? <><Check className="w-4 h-4 text-white" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
              </button>
            </div>
            <p className="text-[11px] text-gray-300 flex items-center gap-1 mt-1">
              ⚡ Anyone opening this link gets your sponsor ID <strong>({sponsorCode})</strong> pre-filled automatically!
            </p>
          </div>

          {/* Sponsor ID Box & 1-Click WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#071E2C] p-3.5 rounded-2xl border border-[#28485A]/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block font-medium">Sponsor / Referral Code</span>
                <span className="text-lg font-mono font-bold text-[#35B779]">{sponsorCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-[#1B3343] hover:bg-[#28485A] text-white text-xs font-semibold rounded-lg border border-[#28485A] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied' : 'Copy'}
              </button>
            </div>

            <button
              onClick={() => handleWhatsAppShare('short')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Share on WhatsApp Now
            </button>
          </div>
        </div>
      </div>

      {/* Share Templates (WhatsApp / SMS / Telegram) */}
      <Card className="bg-[#132C3C] border-[#28485A]/40">
        <CardHeader className="border-b border-[#28485A]/30 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              Professional Invitation Templates
            </CardTitle>
            <div className="flex items-center gap-1 bg-[#071E2C] p-1 rounded-xl border border-[#28485A]/60 text-xs">
              <button
                onClick={() => setSelectedTemplate('short')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  selectedTemplate === 'short' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Short & Crisp
              </button>
              <button
                onClick={() => setSelectedTemplate('hindi')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  selectedTemplate === 'hindi' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Hindi Message
              </button>
              <button
                onClick={() => setSelectedTemplate('english')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  selectedTemplate === 'english' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Detailed English
              </button>
            </div>
          </div>
          <CardDescription className="text-gray-300">
            Pre-written high converting messages ready to copy or send directly on WhatsApp.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="bg-[#071E2C] p-4 rounded-xl border border-[#28485A]/50">
            <pre className="text-xs font-sans text-gray-200 whitespace-pre-wrap leading-relaxed">
              {templates[selectedTemplate]}
            </pre>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <button
              onClick={() => handleCopyTemplateText(selectedTemplate)}
              className="px-4 py-2.5 bg-[#1B3343] hover:bg-[#28485A] text-white text-xs font-semibold rounded-xl border border-[#28485A] transition-all flex items-center gap-2 cursor-pointer"
            >
              {copiedTemplate === selectedTemplate ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedTemplate === selectedTemplate ? 'Message Copied!' : 'Copy Full Message Text'}
            </button>

            <button
              onClick={() => handleWhatsAppShare(selectedTemplate)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send this Template on WhatsApp
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
