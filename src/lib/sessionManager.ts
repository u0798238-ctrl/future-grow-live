import { pushMlmStateToSupabase } from './mlmStore';

export interface ActiveUserSession {
  userId: string;
  sessionToken: string;
  deviceId: string;
  deviceInfo: string;
  loggedInAt: number;
  lastHeartbeat: number;
}

export interface ActiveAdminSession {
  adminSessionToken: string;
  unlockedBy: string;
  deviceId: string;
  deviceInfo: string;
  unlockedAt: number;
  lastHeartbeat: number;
}

// Generate or retrieve persistent device ID for this browser
export const getDeviceId = (): string => {
  let id = localStorage.getItem('futuregrow_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    localStorage.setItem('futuregrow_device_id', id);
  }
  return id;
};

// Generate human-friendly device name (Mobile / Desktop / OS)
export const getDeviceInfo = (): string => {
  const ua = navigator.userAgent || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
  let os = 'Unknown Device';
  if (/Android/i.test(ua)) os = 'Android Mobile';
  else if (/iPhone/i.test(ua)) os = 'Apple iPhone';
  else if (/iPad/i.test(ua)) os = 'Apple iPad';
  else if (/Windows/i.test(ua)) os = 'Windows PC';
  else if (/Macintosh|Mac OS/i.test(ua)) os = 'MacBook / Mac';
  else if (/Linux/i.test(ua)) os = 'Linux PC';
  else if (isMobile) os = 'Mobile Device';
  else os = 'Desktop Browser';

  return os;
};

// ================= USER SESSION MANAGEMENT =================

export const getActiveUserSessions = (): Record<string, ActiveUserSession> => {
  try {
    const raw = localStorage.getItem('mlm_active_sessions');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // Ignore error
  }
  return {};
};

// Check if user is allowed to login on this device
export const checkCanUserLogin = (userId: string): { allowed: boolean; existingSession?: ActiveUserSession } => {
  const currentDeviceId = getDeviceId();
  const sessions = getActiveUserSessions();
  const normalizedId = userId.trim();
  const existing = sessions[normalizedId] || sessions[normalizedId.toUpperCase()] || sessions[normalizedId.toLowerCase()];

  if (!existing) {
    return { allowed: true };
  }

  // If already on the SAME device/browser, allow login
  if (existing.deviceId === currentDeviceId) {
    return { allowed: true };
  }

  // If currently active on ANOTHER device and hasn't logged out
  return {
    allowed: false,
    existingSession: existing,
  };
};

// Force reset / clear session by Admin or user
export const forceResetUserSession = (userId: string) => {
  const sessions = getActiveUserSessions();
  const normalizedId = userId.trim();
  
  delete sessions[normalizedId];
  delete sessions[normalizedId.toUpperCase()];
  delete sessions[normalizedId.toLowerCase()];

  localStorage.setItem('mlm_active_sessions', JSON.stringify(sessions));
  pushMlmStateToSupabase('mlm_active_sessions', sessions);
  window.dispatchEvent(new Event('mlm_session_update'));
};

export const createActiveUserSession = (userId: string): string => {
  const deviceId = getDeviceId();
  const deviceInfo = getDeviceInfo();
  const sessionToken = `usr_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  localStorage.setItem('my_user_session_token', sessionToken);

  const sessions = getActiveUserSessions();
  sessions[userId] = {
    userId,
    sessionToken,
    deviceId,
    deviceInfo,
    loggedInAt: Date.now(),
    lastHeartbeat: Date.now(),
  };

  localStorage.setItem('mlm_active_sessions', JSON.stringify(sessions));
  pushMlmStateToSupabase('mlm_active_sessions', sessions);
  window.dispatchEvent(new Event('mlm_session_update'));

  return sessionToken;
};

export const validateUserSession = (_userId: string): { valid: boolean; reason?: string; details?: ActiveUserSession } => {
  return { valid: true };
};

export const clearActiveUserSession = (userId: string) => {
  localStorage.removeItem('my_user_session_token');

  if (userId) {
    const sessions = getActiveUserSessions();
    const normalizedId = userId.trim();
    
    delete sessions[normalizedId];
    delete sessions[normalizedId.toUpperCase()];
    delete sessions[normalizedId.toLowerCase()];

    localStorage.setItem('mlm_active_sessions', JSON.stringify(sessions));
    pushMlmStateToSupabase('mlm_active_sessions', sessions);
    window.dispatchEvent(new Event('mlm_session_update'));
  }
};

// ================= ADMIN SESSION MANAGEMENT =================

export const getActiveAdminSession = (): ActiveAdminSession | null => {
  try {
    const raw = localStorage.getItem('mlm_active_admin_session');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // Ignore error
  }
  return null;
};

export const createActiveAdminSession = (unlockedBy: string = 'Root Admin (FGPL000001)'): string => {
  const deviceId = getDeviceId();
  const deviceInfo = getDeviceInfo();
  const adminSessionToken = `adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  sessionStorage.setItem('my_admin_session_token', adminSessionToken);
  localStorage.setItem('my_admin_session_token', adminSessionToken);

  const activeAdmin: ActiveAdminSession = {
    adminSessionToken,
    unlockedBy,
    deviceId,
    deviceInfo,
    unlockedAt: Date.now(),
    lastHeartbeat: Date.now(),
  };

  localStorage.setItem('mlm_active_admin_session', JSON.stringify(activeAdmin));
  pushMlmStateToSupabase('mlm_active_admin_session', activeAdmin);
  window.dispatchEvent(new Event('mlm_session_update'));

  return adminSessionToken;
};

export const validateAdminSession = (): { valid: boolean; reason?: string; details?: ActiveAdminSession } => {
  const localToken = sessionStorage.getItem('my_admin_session_token') || localStorage.getItem('my_admin_session_token');
  const globalAdmin = getActiveAdminSession();

  if (!globalAdmin || !globalAdmin.adminSessionToken) {
    if (localToken) return { valid: false, reason: 'Session expired or cleared.' };
    return { valid: false, reason: 'No active admin session.' };
  }

  if (localToken && localToken !== globalAdmin.adminSessionToken) {
    return { valid: false, reason: 'Admin panel accessed from another device. You have been logged out.', details: globalAdmin };
  }

  return { valid: true, details: globalAdmin };
};

export const clearActiveAdminSession = () => {
  sessionStorage.removeItem('my_admin_session_token');
  localStorage.removeItem('my_admin_session_token');
  sessionStorage.removeItem('admin_security_unlocked');

  localStorage.removeItem('mlm_active_admin_session');
  pushMlmStateToSupabase('mlm_active_admin_session', null);
  window.dispatchEvent(new Event('mlm_session_update'));
};
