import React, { useState, useEffect } from 'react';
import { getLocalContactMessages, updateContactMessageStatus, deleteContactMessageFromSupabase, ContactMessage } from '@/lib/supabase';
import { MessageSquare, Image as ImageIcon, ExternalLink, User, Mail, Calendar, CheckCircle, Clock, Trash2 } from 'lucide-react';

export function InquiriesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadMessages = () => {
    const data = getLocalContactMessages();
    setMessages(data);
  };

  useEffect(() => {
    loadMessages();
    window.addEventListener('contact_messages_update', loadMessages);
    return () => {
      window.removeEventListener('contact_messages_update', loadMessages);
    };
  }, []);

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteContactMessageFromSupabase(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id: string, status: 'Pending' | 'Resolved') => {
    await updateContactMessageStatus(id, status);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            Support Inquiries
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage user queries, tickets, and screenshots</p>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <img src={selectedImage} alt="Screenshot" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border-2 border-[#28485A]" />
            <p className="mt-4 text-white text-sm">Click anywhere to close</p>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="bg-[#132C3C] border border-[#28485A]/40 rounded-2xl p-12 text-center shadow-lg">
          <div className="w-16 h-16 bg-[#1B3343] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#28485A]/50">
            <MessageSquare className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white">No inquiries yet</h3>
          <p className="text-sm text-gray-400 mt-1">When users submit support requests, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-[#132C3C] border border-[#28485A]/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {msg.name}
                      {msg.status === 'Resolved' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> RESOLVED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {msg.email}</span>
                      {msg.userId && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> User ID: <strong className="text-white font-mono">{msg.userId}</strong></span>}
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-2">
                    {msg.status === 'Pending' ? (
                      <button 
                        onClick={() => handleStatusChange(msg.id, 'Resolved')}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange(msg.id, 'Pending')}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Reopen Ticket
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/50 border border-red-500/30 text-red-400 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      title="Delete Ticket"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>

                <div className="bg-[#071E2C] rounded-xl p-4 border border-[#28485A]/30 text-sm text-gray-300 whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>

              {msg.screenshot && (
                <div className="w-full md:w-48 shrink-0">
                  <p className="text-xs text-gray-400 font-semibold mb-2 flex items-center gap-1 uppercase tracking-wider">
                    <ImageIcon className="w-3.5 h-3.5" /> Attached Image
                  </p>
                  <div 
                    className="relative rounded-xl overflow-hidden border-2 border-[#28485A]/50 bg-[#071E2C] cursor-pointer group hover:border-emerald-500/50 transition-colors aspect-square md:aspect-auto md:h-32 w-full"
                    onClick={() => setSelectedImage(msg.screenshot || null)}
                  >
                    <img 
                      src={msg.screenshot} 
                      alt="User Attached Screenshot" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
