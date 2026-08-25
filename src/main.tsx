import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { startFirebaseSync } from './lib/firebase';
import { startSupabaseSync } from './lib/supabase';

// Start real-time sync with Supabase and Firebase
startFirebaseSync();
startSupabaseSync();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
