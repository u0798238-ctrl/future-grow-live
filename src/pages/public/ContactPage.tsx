import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Database, Sparkles, MessageSquare, Image, Upload , Copy, Check } from 'lucide-react';
import { saveContactMessageToSupabase } from '@/lib/supabase';

export function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const [messageData, setMessageData] = useState({
    name: '',
    email: '',
    userId: '',
    message: '',
    screenshot: '',
  });
  
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMessageData({ ...messageData, screenshot: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  const [isSubmittingMsg, setIsSubmittingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingMsg(true);

    try {
      await saveContactMessageToSupabase({
        name: messageData.name.trim(),
        email: messageData.email.trim(),
        userId: messageData.userId.trim() || undefined,
        message: messageData.message.trim(),
        screenshot: messageData.screenshot || undefined,
      });
      setMsgSuccess(true);
      setMessageData({ name: '', email: '', userId: '', message: '', screenshot: '' });
      setTimeout(() => setMsgSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingMsg(false);
    }
  };

  return (
    <div className="bg-[#071E2C] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" /> 24/7 Dedicated Help & Support
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm md:text-base text-gray-300">
            Have questions about packages, earnings, withdrawals, or binary trees? Reach out to our dedicated support team.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Office & Support Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#132C3C] rounded-2xl p-6 border border-[#28485A]/40 shadow-lg space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" /> Future Grow Support
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#071E2C]/80 border border-[#28485A]/30">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Us</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm font-medium text-white">uyadav73938@gmail.com</p>
                      <button 
                        onClick={() => handleCopy('uyadav73938@gmail.com', 'email')}
                        className="text-gray-400 hover:text-emerald-400 transition-colors"
                        title="Copy Email"
                        type="button"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">24/7 dedicated support inbox</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#071E2C]/80 border border-[#28485A]/30">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Help Desk</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        WhatsApp Only
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-semibold text-white font-mono">+91 6393018079</p>
                      <button 
                        onClick={() => handleCopy('+91 6393018079', 'phone')}
                        className="text-gray-400 hover:text-emerald-400 transition-colors p-1"
                        title="Copy Phone Number"
                        type="button"
                      >
                        {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href="https://wa.me/916393018079?text=Hello%20Future%20Grow%20Support%2C%20I%20need%20assistance."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-sm shrink-0 ml-auto"
                      >
                        Chat on WhatsApp
                      </a>
                    </div>
                    <p className="text-xs text-amber-300/90 font-medium mt-1">
                      💬 No Calls — WhatsApp Messages Only
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Mon - Sat (10:00 AM - 6:00 PM)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#071E2C]/80 border border-[#28485A]/30">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Head Office</h3>
                    <p className="text-xs text-gray-300 leading-relaxed mt-1">
                      <strong>Future Grow Private Limited</strong><br />
                      Corporate Park, Gomti Nagar, Lucknow, Uttar Pradesh – 226010, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#132C3C] rounded-2xl p-6 sm:p-8 border border-[#28485A]/40 shadow-xl">
              <div className="flex items-center justify-between mb-6 border-b border-[#28485A]/40 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-emerald-400" /> Send an Inquiry
                  </h2>
                  <p className="text-xs text-gray-300 mt-1">
                    Our support team will get back to you within 24 hours.
                  </p>
                </div>
              </div>

              {msgSuccess && (
                <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-xl p-4 mb-4 flex items-center gap-3 text-emerald-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Your message has been sent successfully! Our support team will get in touch.</span>
                </div>
              )}

              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={messageData.name}
                      onChange={(e) => setMessageData({ ...messageData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-[#071E2C] border border-[#28485A]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      User ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={messageData.userId}
                      onChange={(e) => setMessageData({ ...messageData, userId: e.target.value })}
                      placeholder="FGPL..."
                      className="w-full bg-[#071E2C] border border-[#28485A]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={messageData.email}
                    onChange={(e) => setMessageData({ ...messageData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-[#071E2C] border border-[#28485A]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={messageData.message}
                    onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                    placeholder="How can our team help you?"
                    className="w-full bg-[#071E2C] border border-[#28485A]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Attach Screenshot (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label 
                      htmlFor="screenshot-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#28485A]/80 rounded-xl bg-[#071E2C]/50 hover:bg-[#071E2C] hover:border-emerald-500/50 transition-colors cursor-pointer group"
                    >
                      {messageData.screenshot ? (
                        <div className="relative w-full h-full p-2">
                          <img 
                            src={messageData.screenshot} 
                            alt="Screenshot Preview" 
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <span className="text-white text-xs font-medium flex items-center gap-1"><Upload className="w-4 h-4"/> Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-gray-400 group-hover:text-emerald-400 transition-colors">
                          <Image className="w-8 h-8" />
                          <span className="text-sm font-medium">Click to upload screenshot</span>
                          <span className="text-xs text-gray-500">JPG, PNG up to 5MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingMsg}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md disabled:opacity-50 mt-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingMsg ? 'Sending message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
