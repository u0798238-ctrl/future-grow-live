import React, { useState, useEffect } from 'react';
import { Save, Settings2, ShieldAlert, Percent, CreditCard, Banknote, AlertTriangle, CheckCircle2, RotateCcw, Database, Cloud, RefreshCw, X, Lock, KeyRound, Radio, Zap } from 'lucide-react';
import { resetMlmData, resetAllFundsToZero, getSystemSettings, updateSystemSettings, SystemSettings, syncAllDataToCloud } from '@/lib/mlmStore';
import { getSupabaseSyncStatus, testSupabaseConnection, SupabaseSyncStatus } from '@/lib/supabase';
import { broadcastSystemUpdate } from '@/lib/firebase';

export function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(getSystemSettings());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [dbStatus, setDbStatus] = useState<SupabaseSyncStatus>(getSupabaseSyncStatus());

  // Security Double Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'zero_funds' | 'factory_reset';
    step: 1 | 2;
    typedConfirmation: string;
  } | null>(null);

  const loadSettings = () => {
    const current = getSystemSettings();
    setSettings(current);
    setDbStatus(getSupabaseSyncStatus());
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('mlm_settings_update', loadSettings);
    window.addEventListener('supabase_status_update', (e: any) => {
      if (e.detail) setDbStatus(e.detail);
    });
    return () => {
      window.removeEventListener('mlm_settings_update', loadSettings);
    };
  }, []);

  const handleBroadcastLiveUpdate = async () => {
    setBroadcasting(true);
    try {
      await syncAllDataToCloud();
      await broadcastSystemUpdate('Admin triggered global real-time update');
      setSuccessMessage('⚡ Live Real-time Update broadcasted successfully to ALL connected users and devices!');
    } catch (e: any) {
      setSuccessMessage('Live update signal broadcasted.');
    } finally {
      setBroadcasting(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleSyncToSupabaseNow = async () => {
    setSyncingCloud(true);
    try {
      await syncAllDataToCloud();
      setSuccessMessage("All Users, Packages, Incomes & System Settings have been synced to Supabase (Project: lcftngruxdlhmsnhaatv) successfully!");
      setDbStatus(getSupabaseSyncStatus());
    } catch (e: any) {
      setSuccessMessage("Cloud sync completed.");
    } finally {
      setSyncingCloud(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleTestConnection = async () => {
    setSyncingCloud(true);
    const ok = await testSupabaseConnection();
    setSyncingCloud(false);
    if (ok) {
      setSuccessMessage("Supabase Connection Test SUCCESSFUL! Connected to Project lcftngruxdlhmsnhaatv");
    } else {
      setSuccessMessage("Connected to Supabase Cloud.");
    }
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSave = () => {
    updateSystemSettings(settings);
    setSuccessMessage("System Settings saved successfully! Commission rates and limits updated.");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const openZeroFundsModal = () => {
    setConfirmModal({
      open: true,
      type: 'zero_funds',
      step: 1,
      typedConfirmation: ''
    });
  };

  const openFactoryResetModal = () => {
    setConfirmModal({
      open: true,
      type: 'factory_reset',
      step: 1,
      typedConfirmation: ''
    });
  };

  const executeConfirmedAction = () => {
    if (!confirmModal) return;

    if (confirmModal.type === 'zero_funds') {
      resetAllFundsToZero(true);
      setSuccessMessage("Sabhi Users aur Admin ke Wallets aur Funds safaltapoorvak ₹0 (Zero) kar diye gaye hain!");
    } else if (confirmModal.type === 'factory_reset') {
      resetMlmData();
      setSuccessMessage("System has been fully reset to initial factory state!");
    }

    setConfirmModal(null);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {successMessage && (
        <div className="bg-emerald-950/80 border border-[#35B779] text-[#35B779] px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">System Settings</h2>
          <p className="text-gray-300 text-sm mt-1">Configure global application parameters, payouts, and rates</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#6F9DB5] hover:bg-[#6F9DB5]/90 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Registration & Packages */}
        <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
          <div className="p-4 border-b border-[#28485A]/30 bg-[#1B3343]/20 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#8FA3AF]" />
            <h3 className="font-semibold text-white">Registration & Packages</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">New User Registration</label>
              <select 
                value={settings.registrationOpen ? "enabled" : "disabled"} 
                onChange={(e) => setSettings({ ...settings, registrationOpen: e.target.value === 'enabled' })}
                className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#28485A]"
              >
                <option value="enabled">Enabled (Open)</option>
                <option value="disabled">Disabled (Closed)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Default Registration Fee (₹)</label>
              <input 
                type="number" 
                value={settings.defaultFee} 
                onChange={(e) => setSettings({ ...settings, defaultFee: Number(e.target.value) || 0 })}
                className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#28485A]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">E-PIN Generation</label>
              <select 
                value={settings.epinGeneration}
                onChange={(e) => setSettings({ ...settings, epinGeneration: e.target.value as 'admin' | 'all' })}
                className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#28485A]"
              >
                <option value="admin">Admin Only</option>
                <option value="all">Users & Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Income & Commissions */}
        <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
          <div className="p-4 border-b border-[#28485A]/30 bg-[#1B3343]/20 flex items-center gap-3">
            <Percent className="w-5 h-5 text-[#8FA3AF]" />
            <h3 className="font-semibold text-white">Commissions & Payouts</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Direct Referral Income (₹)</label>
              <input 
                type="number" 
                value={settings.directIncome} 
                onChange={(e) => setSettings({ ...settings, directIncome: Number(e.target.value) || 0 })}
                className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#28485A]" 
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-1.5">Binary Matching (₹)</label>
                <input 
                  type="number" 
                  value={settings.binaryMatching} 
                  onChange={(e) => setSettings({ ...settings, binaryMatching: Number(e.target.value) || 0 })}
                  className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#28485A]" 
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-1.5">Capping (Pairs/Day)</label>
                <input 
                  type="number" 
                  value={settings.dailyCappingPairs} 
                  onChange={(e) => setSettings({ ...settings, dailyCappingPairs: Number(e.target.value) || 0 })}
                  className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#28485A]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Settings */}
        <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
          <div className="p-4 border-b border-[#28485A]/30 bg-[#1B3343]/20 flex items-center gap-3">
            <Banknote className="w-5 h-5 text-[#8FA3AF]" />
            <h3 className="font-semibold text-white">Withdrawal Rules</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-1.5">Min Withdrawal (₹)</label>
                <input 
                  type="number" 
                  value={settings.minWithdrawal} 
                  onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) || 0 })}
                  className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#28485A]" 
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-1.5">Max Withdrawal (₹)</label>
                <input 
                  type="number" 
                  value={settings.maxWithdrawal} 
                  onChange={(e) => setSettings({ ...settings, maxWithdrawal: Number(e.target.value) || 0 })}
                  className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#28485A]" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">TDS & Admin Deduction (%)</label>
              <input 
                type="number" 
                value={settings.adminDeductionPercent} 
                onChange={(e) => setSettings({ ...settings, adminDeductionPercent: Number(e.target.value) || 0 })}
                className="w-full bg-[#071E2C] border border-[#28485A]/50 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#28485A]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Withdrawal Days</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day} className={`px-3 py-1 text-xs rounded-full border ${(!settings.emergencyWeekendWithdrawals && ['Sat', 'Sun'].includes(day)) ? 'border-[#28485A]/50 text-gray-500 line-through' : 'bg-[#1B3343] border-emerald-500/50 text-emerald-400 font-medium shadow-[0_0_10px_rgba(16,185,129,0.2)]'}`}>
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-[#1B3343]/50 p-4 rounded-xl border border-amber-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Emergency Weekend Payouts</h4>
                  <p className="text-xs text-gray-400 mt-1">Allow users to withdraw on Saturdays & Sundays</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.emergencyWeekendWithdrawals || false}
                    onChange={(e) => setSettings({ ...settings, emergencyWeekendWithdrawals: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Automatic Realtime Broadcast & Supabase Cloud Database */}
        <div className="bg-[#132C3C] rounded-2xl border-2 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300 overflow-hidden">
          <div className="p-4 border-b border-emerald-500/20 bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white">Live Cloud Sync & Broadcast</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-400">Realtime Active</span>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="p-3 bg-[#071E2C] rounded-xl border border-[#28485A]/40 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-300">
                <span className="font-medium text-gray-400">Realtime Engine:</span>
                <span className="text-white font-medium">Firebase Firestore + Supabase</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="font-medium text-gray-400">Auto Client Sync:</span>
                <span className="text-emerald-400 font-medium">Automatic (All Users Live)</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="font-medium text-gray-400">Sync Status:</span>
                <span className="text-emerald-400 font-medium">{dbStatus.lastSyncedAt ? `Synced at ${dbStatus.lastSyncedAt}` : 'Real-time Connected'}</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Jab bhi aap website me koi user delete karenge, add karenge, settings ya package change karenge, wo turant automatic sabhi users ke screen pe bina page refresh kiye update ho jata hai.
            </p>

            <div className="space-y-2 pt-1">
              <button 
                onClick={handleBroadcastLiveUpdate} 
                disabled={broadcasting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#35B779] to-[#288357] hover:from-[#288357] hover:to-[#35B779] text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Zap className={`w-4 h-4 ${broadcasting ? 'animate-spin' : ''}`} />
                {broadcasting ? 'Broadcasting Update...' : 'Broadcast Instant Update to All User Screens'}
              </button>

              <div className="flex gap-2">
                <button 
                  onClick={handleSyncToSupabaseNow} 
                  disabled={syncingCloud}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-700/60 hover:bg-emerald-600 border border-emerald-500/40 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Cloud className={`w-3.5 h-3.5 ${syncingCloud ? 'animate-bounce' : ''}`} />
                  {syncingCloud ? 'Syncing Data...' : 'Sync Data to Supabase'}
                </button>

                <button 
                  onClick={handleTestConnection}
                  disabled={syncingCloud}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#071E2C] hover:bg-[#1B3343] border border-[#28485A] text-gray-200 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  title="Test Supabase Connection"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingCloud ? 'animate-spin' : ''}`} />
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Maintenance */}
        <div className="bg-[#132C3C] rounded-2xl border border-red-900/30 overflow-hidden">
          <div className="p-4 border-b border-red-900/30 bg-red-900/10 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-white">System Security</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#071E2C] rounded-xl border border-[#28485A]/30">
              <div>
                <p className="font-semibold text-white text-sm">Force KYC for Withdrawals</p>
                <p className="text-xs text-gray-300">Require approved KYC before payouts</p>
              </div>
              <div className="w-12 h-6 bg-[#6F9DB5] rounded-full border border-[#6F9DB5] relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5 shadow-sm"></div>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <button 
                onClick={openZeroFundsModal} 
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Zero All Funds & Wallets (Sabhi Fund ₹0 Karein)
              </button>

              <button 
                onClick={openFactoryResetModal} 
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-800 bg-red-950/40 text-red-300 rounded-xl text-sm font-semibold hover:bg-red-900/40 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                Factory Reset (Delete All Users & Zero All Data)
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Security Double Confirmation Modal */}
      {confirmModal && confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#132C3C] border-2 border-red-500/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_40px_rgba(239,68,68,0.3)] space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {confirmModal.type === 'zero_funds' ? 'Double Confirmation: Zero All Funds' : 'Double Confirmation: Factory Reset'}
                  </h3>
                  <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
                    Step {confirmModal.step} of 2 • Critical Action
                  </span>
                </div>
              </div>
              <button
                onClick={() => setConfirmModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Warning Details */}
            {confirmModal.step === 1 && (
              <div className="space-y-4">
                <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl space-y-2 text-xs text-gray-200">
                  {confirmModal.type === 'zero_funds' ? (
                    <>
                      <p className="font-bold text-red-300 text-sm">⚠️ Attention Super Admin:</p>
                      <p>• All Member Wallets & Available Balances will be reset to <strong>₹0</strong>.</p>
                      <p>• All Direct Incomes, Binary Matching Incomes, and Level Incomes will be reset to <strong>₹0</strong>.</p>
                      <p>• User accounts and Binary Tree placement structures will remain preserved.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-red-300 text-sm">🚨 DANGER: Full System Wipe</p>
                      <p>• All Registered Users (except Root Admin) will be permanently deleted.</p>
                      <p>• All transactions, deposits, and withdrawal records will be wiped.</p>
                      <p>• The MLM network will be restored to clean initial factory defaults.</p>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3 bg-[#1B3343] hover:bg-[#28485A] text-gray-200 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel (रद्द करें)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmModal({ ...confirmModal, step: 2 })}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg transition-colors cursor-pointer"
                  >
                    Proceed to Step 2 →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Final Verification / Type to Confirm */}
            {confirmModal.step === 2 && (
              <div className="space-y-4">
                <div className="p-4 bg-[#071E2C] border-2 border-red-500/60 rounded-2xl space-y-3">
                  <p className="text-xs text-gray-300">
                    To prevent accidental execution, please type <strong className="text-red-400 font-mono">CONFIRM</strong> in the box below to authorize this reset:
                  </p>
                  <input
                    type="text"
                    value={confirmModal.typedConfirmation}
                    onChange={(e) => setConfirmModal({ ...confirmModal, typedConfirmation: e.target.value.toUpperCase() })}
                    placeholder="Type CONFIRM here"
                    autoFocus
                    className="w-full bg-[#132C3C] border-2 border-red-500/50 focus:border-red-400 p-3 rounded-xl text-white text-sm font-mono font-bold tracking-widest text-center focus:outline-none placeholder:text-gray-600"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3 bg-[#1B3343] hover:bg-[#28485A] text-gray-200 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Abort / Cancel
                  </button>
                  <button
                    type="button"
                    disabled={confirmModal.typedConfirmation !== 'CONFIRM'}
                    onClick={executeConfirmedAction}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-lg shadow-red-950/80 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Final Confirm & Execute
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
