import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, serverTimestamp, collection, getDocs, deleteDoc } from 'firebase/firestore';

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

const SYNC_KEYS = [
  'mlm_users',
  'mlm_packages',
  'mlm_system_settings',
  'mlm_company_gifts',
  'mlm_awarded_gifts',
  'appointments',
  'mlm_active_sessions',
  'mlm_active_admin_session',
  'mlm_announcements',
  'system_broadcast'
];

let syncInitialized = false;

// Store a map of what we last received from Firestore, so we only push actual changes
const lastKnownUsers = new Map<string, string>();

export const startFirebaseSync = () => {
  if (syncInitialized) return;
  syncInitialized = true;
  console.log('Starting Firebase Firestore Realtime Sync...');

  // Clean up legacy single-document mlm_users so old deleted test users never reappear
  try {
    deleteDoc(doc(db, 'mlm_app_data', 'mlm_users')).catch(() => {});
  } catch (e) {
    // Ignore
  }

  SYNC_KEYS.forEach(key => {
    if (key === 'mlm_users') {
      const colRef = collection(db, 'mlm_users_collection');

      onSnapshot(colRef, (snapshot) => {
        if (snapshot.metadata.hasPendingWrites) return; // Prevent local echo loop

        const rawLocal = localStorage.getItem('mlm_users');
        let localUsers: any[] = rawLocal ? JSON.parse(rawLocal) : [];
        if (!Array.isArray(localUsers)) localUsers = [];
        
        let hasChanges = false;
        
        snapshot.docChanges().forEach((change) => {
          const user = change.doc.data();
          if (!user || !user.id) return;
          
          lastKnownUsers.set(user.id, JSON.stringify(user));
          
          if (change.type === 'added' || change.type === 'modified') {
            const idx = localUsers.findIndex(u => u.id === user.id);
            if (idx >= 0) {
                // Ensure we actually need to update
                if (JSON.stringify(localUsers[idx]) !== JSON.stringify(user)) {
                   localUsers[idx] = user;
                   hasChanges = true;
                }
            } else {
                localUsers.push(user);
                hasChanges = true;
            }
          } else if (change.type === 'removed') {
            const idx = localUsers.findIndex(u => u.id === user.id);
            if (idx >= 0) {
                localUsers.splice(idx, 1);
                hasChanges = true;
            }
            lastKnownUsers.delete(user.id);
          }
        });

        if (hasChanges) {
          localStorage.setItem('mlm_users', JSON.stringify(localUsers));
          window.dispatchEvent(new Event('mlm_update'));
          window.dispatchEvent(new Event('current_user_change'));
          window.dispatchEvent(new StorageEvent('storage', { key: 'mlm_users' }));
        }
      }, (error) => {
        console.warn(`Firebase sync error for ${key}:`, error);
      });
      return; // Skip normal document logic for mlm_users
    }

    const docRef = doc(db, 'mlm_app_data', key);
    onSnapshot(docRef, (snapshot) => {
      if (snapshot.metadata.hasPendingWrites) return;
      const data = snapshot.data();
      if (data && data.data !== undefined) {
        if (data.data === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(data.data));
        }
        
        if (key === 'system_broadcast') {
          // Automatic live reload or update for all active user tabs
          const broadcast = data.data;
          if (broadcast && broadcast.timestamp) {
            const lastBroadcast = localStorage.getItem('last_processed_broadcast');
            if (lastBroadcast !== String(broadcast.timestamp)) {
              localStorage.setItem('last_processed_broadcast', String(broadcast.timestamp));
              window.dispatchEvent(new Event('mlm_update'));
              window.dispatchEvent(new Event('mlm_packages_update'));
              window.dispatchEvent(new Event('mlm_settings_update'));
              window.dispatchEvent(new Event('current_user_change'));
              window.dispatchEvent(new Event('announcements_update'));
              window.dispatchEvent(new Event('storage'));
            }
          }
        } else if (key === 'mlm_announcements') {
          window.dispatchEvent(new CustomEvent('announcements_update', { detail: data.data }));
        } else if (key === 'appointments') {
          window.dispatchEvent(new CustomEvent('appointments_update', { detail: data.data }));
        } else if (key === 'mlm_packages') {
          window.dispatchEvent(new Event('mlm_packages_update'));
          window.dispatchEvent(new Event('mlm_update'));
        } else if (key === 'mlm_system_settings') {
          window.dispatchEvent(new Event('mlm_settings_update'));
          window.dispatchEvent(new Event('mlm_update'));
        } else if (key === 'mlm_active_sessions' || key === 'mlm_active_admin_session') {
          window.dispatchEvent(new Event('mlm_session_update'));
        } else {
          window.dispatchEvent(new Event('mlm_update'));
          window.dispatchEvent(new Event('current_user_change'));
        }
      }
    }, (error) => {
      console.warn(`Firebase sync error for ${key}:`, error);
    });
  });
};


// Helper to strip undefined values recursively
const stripUndefined = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(stripUndefined);
  const newObj = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = stripUndefined(obj[key]);
    }
  }
  return newObj;
};

export const pushMlmStateToFirebase = async (key: string, value: any): Promise<boolean> => {
  try {
    const cleanValue = stripUndefined(value);
    
    if (key === 'mlm_users' && Array.isArray(cleanValue)) {
       const colRef = collection(db, 'mlm_users_collection');

       const promises = [];
       
       for (const user of cleanValue) {
          if (!user || !user.id) continue;
          
          const userStr = JSON.stringify(user);
          // Only push to Firestore if the user actually changed compared to our last known DB state!
          // This entirely prevents the "User A overwrites User B" race condition.
          if (lastKnownUsers.get(user.id) !== userStr) {
             const userDoc = doc(colRef, user.id);
             promises.push(
               setDoc(userDoc, user).then(() => {
                  lastKnownUsers.set(user.id, userStr);
               })
             );
          }
       }
       
       if (promises.length > 0) {
          await Promise.all(promises);
       }
       return true;
    }

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

export const deleteUserFromCloud = async (userId: string) => {
   try {
      const colRef = collection(db, 'mlm_users_collection');
      await deleteDoc(doc(colRef, userId));
      lastKnownUsers.delete(userId);
      console.log('Successfully deleted user from cloud:', userId);
   } catch (e) {
      console.error('Failed to delete user from cloud:', e);
   }
};

export const broadcastSystemUpdate = async (message: string = 'System updated'): Promise<boolean> => {
  try {
    const docRef = doc(db, 'mlm_app_data', 'system_broadcast');
    await setDoc(docRef, {
      key_name: 'system_broadcast',
      data: {
        timestamp: Date.now(),
        message,
      },
      updated_at: serverTimestamp(),
    }, { merge: true });
    console.log('System broadcast sent successfully across all clients:', message);
    return true;
  } catch (e) {
    console.warn('System broadcast warning:', e);
    return false;
  }
};

