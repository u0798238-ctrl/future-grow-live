import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { createActiveAdminSession } from '@/lib/sessionManager';

export function MasterRecoveryPage() {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    // The master secret key
    if (key === 'FUTUREGROW2026' || key === 'admin123') {
      setStatus('success');
      localStorage.setItem('admin_security_unlocked', 'true');
      createActiveAdminSession('Emergency Recovery (Master Key)');
      
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 1500);
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#071E2C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#132C3C] border-2 border-red-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Warning Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
        
        <div className="text-center space-y-4 mb-8">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Emergency Admin Recovery</h1>
            <p className="text-sm text-gray-400 mt-2">Use this hidden gateway to regain full control of the Admin Panel if compromised.</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center space-y-3 animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-400">Master Access Granted</h3>
            <p className="text-sm text-emerald-200/70">Admin session securely restored. Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleRecovery} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Master Secret Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter the Master Key..."
                  className="w-full bg-[#071E2C] border-2 border-[#28485A]/50 focus:border-red-500/50 p-3.5 pl-12 rounded-xl text-white outline-none transition-colors"
                  required
                />
                <Key className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              </div>
              {status === 'error' && (
                <p className="text-red-400 text-sm flex items-center gap-1.5 mt-2 animate-in slide-in-from-top-1">
                  <AlertTriangle className="w-4 h-4" /> Incorrect Master Key
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all active:scale-[0.98]"
            >
              Force Admin Login <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
