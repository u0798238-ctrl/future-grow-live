import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, serverTimestamp, collection } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "symbolic-operation-f3n78",
  appId: "1:849828158837:web:34694efeac8e1a28f3473c",
  apiKey: "AIzaSyDLasPVd8EWSDCwL_dhSY2W91jednrMQjg",
  authDomain: "symbolic-operation-f3n78.firebaseapp.com",
  storageBucket: "symbolic-operation-f3n78.firebasestorage.app",
  messagingSenderId: "849828158837"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-futuregrow-5bef356f-2a59-46f0-bf84-493197154398");

// Keys to sync
const SYNC_KEYS = [
  'mlm_users',
  'mlm_packages',
  'mlm_system_settings',
  'mlm_company_gifts',
  'mlm_awarded_gifts',
  'appointments',
  'mlm_active_sessions',
  'mlm_active_admin_session'
];

let syncInitialized = false;

export const startFirebaseSync = () => {
  if (syncInitialized) return;
  syncInitialized = true;

  console.log('Starting Firebase sync...');
  
  SYNC_KEYS.forEach(key => {
    const docRef = doc(db, 'mlm_app_data', key);
    onSnapshot(docRef, (snapshot) => {
      // Ignore local writes to prevent infinite loops / unnecessary UI renders
      if (snapshot.metadata.hasPendingWrites) return;
      
      const data = snapshot.data();
      if (data && data.data !== undefined) {
        if (data.data === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(data.data));
        }
        
        // Dispatch event for UI reactivity based on the key
        if (key === 'appointments') {
          window.dispatchEvent(new CustomEvent('appointments_update', { detail: data.data }));
        } else if (key === 'mlm_active_sessions' || key === 'mlm_active_admin_session') {
          window.dispatchEvent(new Event('mlm_session_update'));
        } else {
          window.dispatchEvent(new Event('mlm_update'));
        }
      }
    }, (error) => {
      console.warn(`Firebase sync error for ${key}:`, error);
    });
  });
};

export const pushMlmStateToFirebase = async (key: string, value: any): Promise<boolean> => {
  try {
    const docRef = doc(db, 'mlm_app_data', key);
    await setDoc(docRef, {
      key_name: key,
      data: value,
      updated_at: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err: any) {
    console.error(`Firebase background sync [${key}] failed:`, err);
    return false;
  }
};
