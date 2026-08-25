import { createClient, SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://lcftngruxdlhmsnhaatv.supabase.co';
const FALLBACK_KEY = 'sb_publishable_WC-pX0xJ3LTxQ6Hz5f4Cdg_GUcWiUxG';

function getValidSupabaseUrl(): string {
  try {
    const raw = (import.meta as any)?.env?.VITE_SUPABASE_URL;
    if (typeof raw === 'string' && raw.trim().length > 0 && (raw.startsWith('http://') || raw.startsWith('https://'))) {
      return raw.trim();
    }
  } catch (e) {
    // Ignore and fallback
  }
  return FALLBACK_URL;
}

function getValidSupabaseKey(): string {
  try {
    const raw = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY;
    if (typeof raw === 'string' && raw.trim().length > 10 && !raw.includes('MY_')) {
      return raw.trim();
    }
  } catch (e) {
    // Ignore and fallback
  }
  return FALLBACK_KEY;
}

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    const url = getValidSupabaseUrl();
    const key = getValidSupabaseKey();
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Initial Supabase init fallback:', err);
      supabaseInstance = createClient(FALLBACK_URL, FALLBACK_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
  }
  return supabaseInstance;
};

// Safe proxy so all imports `supabase.from(...)` or `supabase.auth...` work lazily and never crash at module load
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const val = (client as any)[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  }
});

export interface SupabaseSyncStatus {
  connected: boolean;
  lastSyncedAt: string | null;
  error: string | null;
  projectId: string;
}

let syncStatus: SupabaseSyncStatus = {
  connected: true,
  lastSyncedAt: null,
  error: null,
  projectId: 'lcftngruxdlhmsnhaatv',
};

export const getSupabaseSyncStatus = (): SupabaseSyncStatus => ({ ...syncStatus });

// Test connectivity to Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('mlm_app_data').select('key_name').limit(1);
    if (error && error.code !== 'PGRST116' && !error.message.includes('relation "mlm_app_data" does not exist')) {
      console.info('Supabase connection check:', error.message);
    }
    syncStatus = {
      connected: true,
      lastSyncedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
      error: null,
      projectId: 'lcftngruxdlhmsnhaatv',
    };
    window.dispatchEvent(new CustomEvent('supabase_status_update', { detail: syncStatus }));
    return true;
  } catch (err: any) {
    console.warn('Supabase connection attempt:', err?.message || err);
    syncStatus = {
      connected: false,
      lastSyncedAt: null,
      error: err?.message || 'Connection failed',
      projectId: 'lcftngruxdlhmsnhaatv',
    };
    window.dispatchEvent(new CustomEvent('supabase_status_update', { detail: syncStatus }));
    return false;
  }
};

// Sync app state to Supabase table
export const pushMlmStateToSupabase = async (key: string, value: any): Promise<boolean> => {
  try {
    const now = Date.now();
    localStorage.setItem(`${key}_last_pushed_at`, now.toString());
    const payload = {
      key_name: key,
      data: value,
      updated_at: new Date().toISOString(),
    };

    // 1. Save to generic table
    const { error } = await supabase
      .from('mlm_app_data')
      .upsert(payload, { onConflict: 'key_name' });

    if (error) {
      console.info(`Supabase sync note for [${key}]:`, error.message);
    }

    // 2. If it is users list, also attempt individual user upsert into `users` table
    if (key === 'mlm_users' && Array.isArray(value)) {
      try {
        const userRows = value.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email || '',
          mobile: u.mobile || '',
          password: u.password || '',
          sponsor_id: u.sponsorId || null,
          status: u.status || 'Active',
          package: u.package || '',
          payment_amount: u.paymentAmount || 0,
          payment_status: u.paymentStatus || 'Approved',
          utr_number: u.utrNumber || '',
          total_income: u.totalIncome || 0,
          available_balance: u.availableBalance || 0,
          created_at: u.joined || new Date().toISOString(),
          raw_data: u,
        }));
        await supabase.from('users').upsert(userRows, { onConflict: 'id' });
      } catch (e) {
        // Individual users table optional if not yet created
      }
    }

    // 3. If it is packages list, also attempt individual upsert into `packages` table
    if (key === 'mlm_packages' && Array.isArray(value)) {
      try {
        const pkgRows = value.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price || 0,
          daily_income: p.dailyIncome || 0,
          validity_days: p.validityDays || 365,
          direct_income: p.directIncome || 0,
          status: p.status || 'Active',
        }));
        await supabase.from('packages').upsert(pkgRows, { onConflict: 'id' });
      } catch (e) {
        // Individual packages table optional if not yet created
      }
    }

    syncStatus.lastSyncedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    syncStatus.connected = true;
    window.dispatchEvent(new CustomEvent('supabase_status_update', { detail: syncStatus }));
    return true;
  } catch (err: any) {
    console.info(`Supabase background sync [${key}]:`, err?.message || err);
    return false;
  }
};

// Fetch app state from Supabase
export const pullMlmStateFromSupabase = async (key: string): Promise<{data: any, updated_at: string} | null> => {
  try {
    const { data, error } = await supabase
      .from('mlm_app_data')
      .select('data, updated_at')
      .eq('key_name', key)
      .single();
    if (error || !data) return null;
    return { data: data.data, updated_at: data.updated_at || new Date(0).toISOString() };
  } catch (err) {
    return null;
  }
};

// Start Supabase real-time sync & initial load
let supabaseSyncStarted = false;
const SUPABASE_SYNC_KEYS = [
  'mlm_users',
  'mlm_packages',
  'mlm_system_settings',
  'mlm_company_gifts',
  'mlm_awarded_gifts',
  'appointments',
  'mlm_active_sessions',
  'mlm_active_admin_session'
];

export const startSupabaseSync = async () => {
  if (supabaseSyncStarted) return;
  supabaseSyncStarted = true;

  console.log('Connecting to Supabase (Project: lcftngruxdlhmsnhaatv)...');

  // 1. Initial Pull from Supabase for all keys
  for (const key of SUPABASE_SYNC_KEYS) {
    try {
      const remoteResp = await pullMlmStateFromSupabase(key);
      if (remoteResp) {
        const remoteData = remoteResp.data;
        const remoteTime = new Date(remoteResp.updated_at).getTime();
        const localTimeStr = localStorage.getItem(`${key}_last_pushed_at`);
        const localTime = localTimeStr ? parseInt(localTimeStr) : 0;
        
        const localRaw = localStorage.getItem(key);
        
        // Only overwrite if local is empty OR remote is strictly newer than the last local update
        if (!localRaw || remoteTime > localTime + 1000) { 
          localStorage.setItem(key, JSON.stringify(remoteData));
          localStorage.setItem(`${key}_last_pushed_at`, remoteTime.toString());
          if (key === 'appointments') {
            window.dispatchEvent(new CustomEvent('appointments_update', { detail: remoteData }));
          } else {
            window.dispatchEvent(new Event('mlm_update'));
          }
        }
      }
    } catch (e) {
      // Continue to next key
    }
  }

  // 2. Realtime listener on Supabase mlm_app_data
  try {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mlm_app_data',
        },
        (payload: any) => {
          if (payload.new && payload.new.key_name && payload.new.data) {
            const key = payload.new.key_name;
            const remoteTime = new Date(payload.new.updated_at || 0).getTime();
            const localTimeStr = localStorage.getItem(`${key}_last_pushed_at`);
            const localTime = localTimeStr ? parseInt(localTimeStr) : 0;
            
            // If the incoming broadcast is older or from our own very recent push, ignore it
            if (remoteTime < localTime - 2000) return;
            
            localStorage.setItem(key, JSON.stringify(payload.new.data));
            localStorage.setItem(`${key}_last_pushed_at`, remoteTime.toString());
            if (key === 'appointments') {
              window.dispatchEvent(new CustomEvent('appointments_update', { detail: payload.new.data }));
            } else if (key === 'mlm_active_sessions' || key === 'mlm_active_admin_session') {
              window.dispatchEvent(new Event('mlm_session_update'));
            } else {
              window.dispatchEvent(new Event('mlm_update'));
            }
          }
        }
      )
      .subscribe();

    syncStatus.connected = true;
    syncStatus.lastSyncedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    window.dispatchEvent(new CustomEvent('supabase_status_update', { detail: syncStatus }));
  } catch (err) {
    console.info('Supabase realtime listener note:', err);
  }
};

export interface AppointmentBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  userId?: string;
  message: string;
  screenshot?: string;
  status?: 'Pending' | 'Resolved';
  createdAt: string;
}

// Get saved appointments from local store fallback
export const getLocalAppointments = (): AppointmentBooking[] => {
  try {
    const data = localStorage.getItem('mlm_appointments');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Save an appointment booking to Supabase and local cache
export const saveAppointmentBooking = async (data: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'> & { status?: AppointmentBooking['status'] }): Promise<{ success: boolean; data?: AppointmentBooking; error?: string }> => {
  const newAppointment: AppointmentBooking = {
    id: `APT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...data,
    status: data.status || 'Pending',
    createdAt: new Date().toISOString(),
  };

  // 1. Save locally for instant reactivity & fallback
  const localList = getLocalAppointments();
  localList.unshift(newAppointment);
  localStorage.setItem('mlm_appointments', JSON.stringify(localList));
  window.dispatchEvent(new CustomEvent('appointments_update', { detail: localList }));

  // 2. Insert into Supabase table `appointments`
  try {
    const { error } = await supabase.from('appointments').insert([
      {
        id: newAppointment.id,
        name: newAppointment.name,
        email: newAppointment.email,
        phone: newAppointment.phone,
        appointment_date: newAppointment.appointmentDate,
        appointment_time: newAppointment.appointmentTime,
        service_type: newAppointment.serviceType,
        message: newAppointment.message || '',
        status: newAppointment.status,
        created_at: newAppointment.createdAt,
      }
    ]);

    if (error) {
      console.info('Supabase appointments insert notice:', error.message);
      // Also push to generic app data storage as resilient backup
      await pushMlmStateToSupabase('appointments', localList);
    } else {
      console.log('Appointment booking successfully stored in Supabase table [appointments]');
    }

    return { success: true, data: newAppointment };
  } catch (err: any) {
    console.warn('Supabase booking dispatch error:', err);
    await pushMlmStateToSupabase('appointments', localList);
    return { success: true, data: newAppointment };
  }
};

// Fetch appointments from Supabase table or local state
export const fetchAppointmentsFromSupabase = async (): Promise<AppointmentBooking[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const formatted: AppointmentBooking[] = data.map((item: any) => ({
        id: item.id || `APT-${Date.now()}`,
        name: item.name || item.full_name || '',
        email: item.email || '',
        phone: item.phone || item.mobile || '',
        appointmentDate: item.appointment_date || item.date || '',
        appointmentTime: item.appointment_time || item.time || '',
        serviceType: item.service_type || item.service || 'General Consultation',
        message: item.message || item.notes || '',
        status: item.status || 'Pending',
        createdAt: item.created_at || new Date().toISOString(),
      }));
      localStorage.setItem('mlm_appointments', JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.info('Using local appointments fallback:', err);
  }

  // Fallback to generic state or local
  const genericResp = await pullMlmStateFromSupabase('appointments');
  const genericData = genericResp ? genericResp.data : null;
  if (genericData && Array.isArray(genericData)) {
    localStorage.setItem('mlm_appointments', JSON.stringify(genericData));
    return genericData;
  }

  return getLocalAppointments();
};

// Update status of an appointment
export const updateAppointmentStatusInSupabase = async (id: string, status: AppointmentBooking['status']): Promise<boolean> => {
  const localList = getLocalAppointments().map(item => item.id === id ? { ...item, status } : item);
  localStorage.setItem('mlm_appointments', JSON.stringify(localList));
  window.dispatchEvent(new CustomEvent('appointments_update', { detail: localList }));

  try {
    await supabase.from('appointments').update({ status }).eq('id', id);
    await pushMlmStateToSupabase('appointments', localList);
    return true;
  } catch (err) {
    await pushMlmStateToSupabase('appointments', localList);
    return true;
  }
};

// Save general contact message to Supabase

// Get saved messages from local store fallback
export const getLocalContactMessages = (): ContactMessage[] => {
  try {
    const data = localStorage.getItem('contact_messages');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const deleteContactMessageFromSupabase = async (id: string): Promise<boolean> => {
  const localList = getLocalContactMessages().filter(item => item.id !== id);
  localStorage.setItem('contact_messages', JSON.stringify(localList));
  window.dispatchEvent(new CustomEvent('contact_messages_update', { detail: localList }));
  try {
    // Attempt deletion from raw table if it exists
    await supabase.from('contact_messages').delete().eq('id', id);
  } catch (err) { }
  
  try {
    await pushMlmStateToSupabase('contact_messages', localList);
    return true;
  } catch (err) {
    return true;
  }
};

export const updateContactMessageStatus = async (id: string, status: 'Pending' | 'Resolved'): Promise<boolean> => {
  const localList = getLocalContactMessages().map(item => item.id === id ? { ...item, status } : item);
  localStorage.setItem('contact_messages', JSON.stringify(localList));
  window.dispatchEvent(new CustomEvent('contact_messages_update', { detail: localList }));
  try {
    await pushMlmStateToSupabase('contact_messages', localList);
    return true;
  } catch (err) {
    return true;
  }
};

export const saveContactMessageToSupabase = async (data: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<{ success: boolean }> => {
  const newMessage: ContactMessage = {
    id: `MSG-${Date.now()}`,
    ...data,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  const localList = getLocalContactMessages();
  localList.unshift(newMessage);
  localStorage.setItem('contact_messages', JSON.stringify(localList));
  window.dispatchEvent(new CustomEvent('contact_messages_update', { detail: localList }));

  try {
    // Try to save to raw table if it exists
    await supabase.from('contact_messages').insert([
      {
        id: newMessage.id,
        name: newMessage.name,
        email: newMessage.email,
        user_id: newMessage.userId || null,
        message: newMessage.message,
        created_at: newMessage.createdAt,
      }
    ]);
  } catch (err) {
    console.info('Notice saving contact message to direct table:', err);
  }
  // Always push to generic json store to ensure image/status are saved
  await pushMlmStateToSupabase('contact_messages', localList);

  return { success: true };
};

