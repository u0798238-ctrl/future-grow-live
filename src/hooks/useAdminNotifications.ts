import { useEffect, useRef } from 'react';
import { getMlmUsers } from '../lib/mlmStore';

const playDepositTone = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const playNote = (freq: number, time: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.5, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
      osc.stop(time + 0.5);
    };
    
    // Happy fast arpeggio (Cash in / Success)
    const now = ctx.currentTime;
    playNote(523.25, now);       // C5
    playNote(659.25, now + 0.1); // E5
    playNote(783.99, now + 0.2); // G5
    playNote(1046.50, now + 0.3);// C6
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

const playWithdrawalTone = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const playNote = (freq: number, time: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.4, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
      osc.stop(time + 0.8);
    };
    
    // Alert double chime (Action needed)
    const now = ctx.currentTime;
    playNote(440.00, now);       // A4
    playNote(659.25, now + 0.2); // E5
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

export const useAdminNotifications = (isAdmin: boolean) => {
  const previousCounts = useRef({ deposits: 0, withdrawals: 0 });
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isAdmin) return;

    const checkAndNotify = () => {
      const users = getMlmUsers();
      let pendingDeposits = 0;
      let pendingWithdrawals = 0;

      users.forEach(u => {
        if (u.transactions) {
          u.transactions.forEach(t => {
            if (t.type === 'Deposit' && t.status === 'Pending') {
              pendingDeposits++;
            }
            if (t.type === 'Withdrawal' && t.status === 'Pending') {
              pendingWithdrawals++;
            }
          });
        }
      });

      // Avoid playing on initial load
      if (!isInitialized.current) {
        previousCounts.current = { deposits: pendingDeposits, withdrawals: pendingWithdrawals };
        isInitialized.current = true;
        return;
      }

      const prev = previousCounts.current;

      if (pendingDeposits > prev.deposits) {
        playDepositTone();
      }
      
      if (pendingWithdrawals > prev.withdrawals) {
        playWithdrawalTone();
      }

      previousCounts.current = { deposits: pendingDeposits, withdrawals: pendingWithdrawals };
    };

    // Run once on mount to set initial counts
    checkAndNotify();

    window.addEventListener('mlm_update', checkAndNotify);
    return () => {
      window.removeEventListener('mlm_update', checkAndNotify);
    };
  }, [isAdmin]);
};
