import React, { useState } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pushMlmStateToFirebase } from '@/lib/firebase';
import { pullMlmStateFromSupabase } from '@/lib/supabase';

interface RefreshButtonProps {
  className?: string;
  variant?: 'header' | 'button' | 'icon-only' | 'floating';
  showLabel?: boolean;
}

export function RefreshButton({ className, variant = 'header', showLabel = true }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isRefreshing) return;
    setIsRefreshing(true);
    setJustRefreshed(false);

    try {
      // 1. Try pulling fresh data from cloud database (Supabase & Firebase)
      try {
        const usersCloud = await pullMlmStateFromSupabase('mlm_users');
        if (usersCloud && usersCloud.data && Array.isArray(usersCloud.data)) {
          localStorage.setItem('mlm_users', JSON.stringify(usersCloud.data));
        }
      } catch (err) {
        // Fallback
      }

      // 2. Dispatch all real-time events to all pages & layouts
      window.dispatchEvent(new Event('mlm_update'));
      window.dispatchEvent(new Event('mlm_packages_update'));
      window.dispatchEvent(new Event('mlm_settings_update'));
      window.dispatchEvent(new Event('current_user_change'));
      window.dispatchEvent(new Event('announcements_update'));
      window.dispatchEvent(new Event('mlm_gifts_update'));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new StorageEvent('storage', { key: 'mlm_users' }));

      // Small delay for tactile feedback
      await new Promise(res => setTimeout(res, 600));

      setJustRefreshed(true);
      setTimeout(() => setJustRefreshed(false), 2000);
    } catch (e) {
      console.warn('Refresh note:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        id="floating-refresh-btn"
        className={cn(
          "fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-full bg-[#132C3C] hover:bg-[#1B3343] text-emerald-400 border border-emerald-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md",
          isRefreshing && "opacity-80",
          className
        )}
        title="Click to refresh website data"
        aria-label="Refresh website"
      >
        <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin text-emerald-300", justRefreshed && "text-emerald-400")} />
        {showLabel && (
          <span className="text-xs font-semibold text-white hidden sm:inline">
            {isRefreshing ? 'Refreshing...' : justRefreshed ? 'Updated!' : 'Refresh'}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        id="icon-refresh-btn"
        className={cn(
          "p-2 rounded-xl text-gray-300 hover:text-emerald-300 hover:bg-[#1B3343] transition-all flex items-center justify-center cursor-pointer border border-transparent hover:border-[#28485A]/50",
          isRefreshing && "text-emerald-400",
          className
        )}
        title="Refresh website & sync data (रिफ्रेश करें)"
        aria-label="Refresh website"
      >
        <RefreshCw className={cn("w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-500", isRefreshing && "animate-spin text-emerald-400")} />
      </button>
    );
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      id="header-refresh-btn"
      className={cn(
        "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border",
        justRefreshed 
          ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
          : "bg-[#1B3343]/70 hover:bg-[#1B3343] border-[#28485A]/70 text-gray-200 hover:text-white hover:border-emerald-500/40",
        isRefreshing && "opacity-75",
        className
      )}
      title="Click to Refresh website data (रिफ्रेश करें)"
      aria-label="Refresh website"
    >
      {justRefreshed ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <RefreshCw className={cn("w-3.5 h-3.5 text-emerald-400 transition-transform duration-500", isRefreshing && "animate-spin")} />
      )}
      {showLabel && (
        <span className="hidden xs:inline text-[11px] sm:text-xs">
          {isRefreshing ? 'Refreshing...' : justRefreshed ? 'Updated!' : 'Refresh'}
        </span>
      )}
    </button>
  );
}
