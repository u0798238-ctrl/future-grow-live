import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { startFirebaseSync } from './lib/firebase';
import { startSupabaseSync } from './lib/supabase';

// Start real-time sync with Supabase and Firebase
startFirebaseSync();
startSupabaseSync();

// Cross-tab synchronization
window.addEventListener('storage', (e) => {
  if (e.key === 'mlm_users') {
    window.dispatchEvent(new Event('mlm_update'));
    window.dispatchEvent(new Event('current_user_change'));
  } else if (e.key === 'mlm_packages') {
    window.dispatchEvent(new Event('mlm_packages_update'));
    window.dispatchEvent(new Event('mlm_update'));
  } else if (e.key === 'mlm_system_settings') {
    window.dispatchEvent(new Event('mlm_settings_update'));
    window.dispatchEvent(new Event('mlm_update'));
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
