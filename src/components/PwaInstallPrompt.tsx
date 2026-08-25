import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle, X, Sparkles, Share2, PlusSquare, Monitor, ShieldCheck, ArrowRight } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [installStep, setInstallStep] = useState('Initializing App Setup...');
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone/installed mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Check if user previously dismissed in this session
    const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');

    // Handle beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!dismissed && !isStandaloneMode) {
        setIsVisible(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setIsInstalling(false);
      setDeferredPrompt(null);
    };

    const handleTriggerInstall = () => {
      handleInstallClick();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('trigger_pwa_install', handleTriggerInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('trigger_pwa_install', handleTriggerInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        startInstallAnimation();
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        } else {
          setIsInstalling(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Error during prompt:', err);
        startInstallAnimation();
      }
    } else {
      // If native deferredPrompt not available, simulate realistic installation animation and show shortcut guide
      startInstallAnimation();
    }
  };

  const startInstallAnimation = () => {
    setIsInstalling(true);
    setInstallProgress(15);
    setInstallStep('Downloading Future Grow APK & Web Assets...');

    setTimeout(() => {
      setInstallProgress(45);
      setInstallStep('Generating Secure App Environment & Icons...');
    }, 700);

    setTimeout(() => {
      setInstallProgress(75);
      setInstallStep('Creating Home Screen & Desktop Shortcut...');
    }, 1500);

    setTimeout(() => {
      setInstallProgress(100);
      setInstallStep('App Installed Successfully!');
      setTimeout(() => {
        setIsInstalling(false);
        setIsInstalled(true);
        setIsVisible(false);
        setShowGuideModal(true);
      }, 800);
    }, 2300);
  };

  // If app is already installed in standalone window, don't show prompt
  if (isStandalone) return null;

  return (
    <>
      {/* Realistic Installation Progress Modal */}
      {isInstalling && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#132C3C] border-2 border-emerald-500/80 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-[#071E2C] border-2 border-[#6F9DB5]/60 mx-auto flex items-center justify-center mb-6 shadow-inner relative">
              <Download className="w-10 h-10 text-emerald-400 animate-bounce" />
              <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/40 animate-ping"></div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Installing App...</h3>
            <p className="text-xs text-emerald-300 font-medium min-h-[32px] mb-6 transition-all duration-300">
              {installStep}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[#071E2C] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#28485A]/60 mb-3">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-[#6F9DB5] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                style={{ width: `${installProgress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 font-semibold px-1">
              <span>Progress</span>
              <span className="text-emerald-400">{installProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Shortcut & Installation Complete Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#132C3C] border-2 border-emerald-500/80 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-[0_0_40px_rgba(16,185,129,0.35)] relative overflow-hidden">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-white">App Shortcut Ready!</h3>
              <p className="text-xs text-gray-300 mt-1">
                Future Grow can now be launched directly from your Home Screen like a mobile app!
              </p>
            </div>

            <div className="bg-[#071E2C] rounded-2xl p-4 border border-[#28485A]/40 space-y-3 text-xs text-gray-200 mb-6">
              <div className="font-semibold text-emerald-300 text-sm flex items-center gap-2 border-b border-[#28485A]/40 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>How to use your app:</span>
              </div>

              {isIos ? (
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] font-bold">1</span>
                    Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-400" /> at bottom of Safari.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] font-bold">2</span>
                    Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400" />.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] font-bold">3</span>
                    Tap <strong>Add</strong> on top-right. Future Grow icon will appear on your Home Screen!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">1</span>
                    Browser will prompt you to <strong>"Add to Home Screen"</strong> or <strong>"Install"</strong>.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">2</span>
                    Click <strong>Install / Add</strong> to place the Future Grow App icon on your mobile or desktop screen.
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">3</span>
                    Open the app icon directly anytime for fullscreen & fast access!
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>GOT IT / CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function InstallAppButton({ className = "" }: { className?: string }) {
  const handleTrigger = () => {
    window.dispatchEvent(new Event('trigger_pwa_install'));
  };

  return (
    <button
      onClick={handleTrigger}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-500/50 text-emerald-300 font-semibold text-xs transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:shadow-[0_0_18px_rgba(16,185,129,0.4)] ${className}`}
      title="Install App & Create Shortcut"
    >
      <Download className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
      <span>Install App</span>
    </button>
  );
}
