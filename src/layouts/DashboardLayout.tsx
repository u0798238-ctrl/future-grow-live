import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';

import { Network, Menu, LogOut, LayoutDashboard, Users, Wallet, FileText, Settings, MessageSquare, Headset, User as UserIcon, GitMerge, ChevronDown, ArrowDownToLine, ArrowUpFromLine, ShieldCheck, Package as PackageIcon, Trophy, UserPlus, Shield, Download, Gift, Medal, Lock, KeyRound, Eye, EyeOff, AlertCircle , IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentUser, getMlmUsers, setCurrentUserId, getCurrentUserId, MlmUser, getPackageForUser, getSystemSettings } from '@/lib/mlmStore';
import { 
  clearActiveUserSession, 
  clearActiveAdminSession,
  validateAdminSession,
  createActiveAdminSession
} from '@/lib/sessionManager';
import { PwaInstallPrompt, InstallAppButton } from '@/components/PwaInstallPrompt';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export function DashboardLayout({ type }: { type: 'user' | 'admin' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<MlmUser | null>(getCurrentUser());
  const [allUsers, setAllUsers] = useState<MlmUser[]>(getMlmUsers());
  const location = useLocation();

  

  React.useLayoutEffect(() => {
    const main = document.getElementById('dashboard-main');
    if (main) {
      main.scrollTop = 0;
    }
  }, [location.pathname]);

  const navigate = useNavigate();

  // Admin Security Password Protection State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_session') === 'true' || localStorage.getItem('admin_security_unlocked') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Enable audio notifications for Admin
  useAdminNotifications(type === 'admin' && currentUser?.id === 'FGPL000001');

  const loadUserData = () => {
    const validId = getCurrentUserId();
    if (!validId) {
      // Force logout if user was deleted or localstorage is invalid
      localStorage.removeItem('is_admin_session');
      localStorage.removeItem('admin_security_unlocked');
      sessionStorage.removeItem('admin_pin_verified');
      localStorage.removeItem('current_user_id');
      navigate('/login');
      return;
    }

    const freshUser = getCurrentUser();
    if (freshUser && freshUser.status === 'Blocked') {
      // Force logout if blocked while logged in
      const currentId = localStorage.getItem('current_user_id') || freshUser.id;
      if (currentId) {
        clearActiveUserSession(currentId);
      }
      localStorage.removeItem('is_admin_session');
      localStorage.removeItem('admin_security_unlocked');
      sessionStorage.removeItem('admin_pin_verified');
      localStorage.removeItem('current_user_id');
      navigate('/login');
      alert('Your account has been blocked by the admin.');
      return;
    }

    // If current logged-in user is a regular member (not FGPL000001), ensure admin session flags are strictly cleared
    if (freshUser && freshUser.id !== 'FGPL000001') {
      localStorage.removeItem('is_admin_session');
      localStorage.removeItem('admin_security_unlocked');
      sessionStorage.removeItem('admin_pin_verified');
    }

    setCurrentUser(freshUser!);
    setAllUsers(getMlmUsers());
  };

  useEffect(() => {
    const validId = getCurrentUserId();
    const isAdminSession = localStorage.getItem('is_admin_session');
    
    // Auth Check: Redirect if no active valid session
    if (!validId) {
      localStorage.removeItem('current_user_id');
      navigate('/login');
      return;
    }
    
    // Admin Check: Require explicit admin session and 1st ID for admin routes
    if (type === 'admin' && (isAdminSession !== 'true' || validId !== 'FGPL000001')) {
      navigate('/user/dashboard', { replace: true });
      return;
    }

    const checkSessions = () => {
      // Validate Admin Session for concurrent logins
      if (type === 'admin') {
        const adminValidation = validateAdminSession();
        if (!adminValidation.valid) {
          // Another admin logged in elsewhere
          localStorage.removeItem('admin_security_unlocked');
          localStorage.removeItem('is_admin_session');
          setIsAdminUnlocked(false);
          // Removed disruptive alert
          navigate('/login');
        }
      }
    };

    loadUserData();
    checkSessions();

    window.addEventListener('mlm_update', loadUserData);
    window.addEventListener('mlm_packages_update', loadUserData);
    window.addEventListener('current_user_change', loadUserData);
    window.addEventListener('mlm_session_update', checkSessions);
    
    return () => {
      window.removeEventListener('mlm_update', loadUserData);
      window.removeEventListener('mlm_packages_update', loadUserData);
      window.removeEventListener('current_user_change', loadUserData);
      window.removeEventListener('mlm_session_update', checkSessions);
    };
  }, [navigate, type, isAdminUnlocked]);

  const handleAdminUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAdminAuthError('');
    setIsAuthenticating(true);

    const entered = adminPasswordInput.trim();
    const rootUser = getMlmUsers().find(u => u.id === 'FGPL000001') || currentUser;
    const userPass = rootUser?.password;

    // Allow Master Security Passcode (77339933), Master Password, or Admin Account Password
    const validPasswords = [
      '77339933',
      '7393862448',
      userPass
    ].filter(Boolean);

    setTimeout(() => {
      if (validPasswords.includes(entered) || entered === userPass) {
        localStorage.setItem('admin_security_unlocked', 'true');
        createActiveAdminSession('Root Admin (FGPL000001)');
        setIsAdminUnlocked(true);
        setAdminPasswordInput('');
        setAdminAuthError('');
      } else {
        setAdminAuthError('Invalid Admin Password. Please enter the correct admin password.');
      }
      setIsAuthenticating(false);
    }, 200);
  };

  const handleLockAdmin = () => {
    localStorage.removeItem('admin_security_unlocked');
    setIsAdminUnlocked(false);
    setAdminPasswordInput('');
    setAdminAuthError('');
  };

  const handleLogout = () => {
    const currentId = localStorage.getItem('current_user_id') || currentUser?.id;
    const isAdmin = localStorage.getItem('is_admin_session') === 'true';
    
    if (currentId) {
      clearActiveUserSession(currentId);
    }
    
    if (isAdmin) {
      clearActiveAdminSession();
    }
    
    localStorage.removeItem('is_admin_session');
    localStorage.removeItem('current_user_id');
    sessionStorage.removeItem('admin_pin_verified');
    localStorage.removeItem('admin_security_unlocked');
    navigate('/login');
  };

  const userRoutes: SidebarItem[] = [
    { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Wallet', path: '/user/wallet', icon: Wallet },
    { name: 'Withdrawal', path: '/user/withdrawal', icon: ArrowUpFromLine },
    { name: 'My Team', path: '/user/team', icon: Users },
    { name: 'Binary Tree', path: '/user/tree', icon: GitMerge },
    { name: 'Level Income', path: '/user/levels', icon: Medal },
    { name: 'My Packages', path: '/user/packages', icon: PackageIcon },
    { name: 'Referral Link', path: '/user/invite', icon: UserPlus },
    { name: 'Leaderboard', path: '/user/leaderboard', icon: Trophy },
    { name: 'KYC Verification', path: '/user/kyc', icon: ShieldCheck },
    { name: 'Customer Support', path: '/user/support', icon: Headset },
    { name: 'Profile', path: '/user/profile', icon: UserIcon },
  ];

  const adminRoutes: SidebarItem[] = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users List', path: '/admin/users', icon: Users },
    { name: 'Binary Tree', path: '/admin/tree', icon: GitMerge },
    { name: 'Packages', path: '/admin/packages', icon: PackageIcon },
    { name: 'Level Income', path: '/admin/levels', icon: Trophy },
    { name: 'Income Distribution', path: '/admin/income-distribution', icon: IndianRupee },
    { name: 'Deposits', path: '/admin/deposits', icon: Wallet },
    { name: 'Withdrawals', path: '/admin/withdrawals', icon: Wallet },
    { name: 'Level Settings', path: '/admin/settings', icon: Settings },
    { name: 'Support Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  ];

  const routes = type === 'user' ? userRoutes : adminRoutes;

  // Session check before rendering anything
  const currentSessionId = localStorage.getItem('current_user_id');
  const isAdminSession = localStorage.getItem('is_admin_session');
  const isRootAdmin = currentUser?.id === 'FGPL000001' && currentSessionId === 'FGPL000001';

  if (!currentUser || !currentSessionId) {
    return <Navigate to="/login" replace />;
  }

  // Strictly block and redirect any non-admin or unauthorized user attempting to access admin routes
  if (type === 'admin' && (!isRootAdmin || isAdminSession !== 'true')) {
    return <Navigate to="/user/dashboard" replace />;
  }

  const userPkg = getPackageForUser(currentUser);
  const packagePrice = currentUser.paymentAmount ? `₹${currentUser.paymentAmount.toLocaleString('en-IN')}` : `₹${userPkg.price.toLocaleString('en-IN')}`;
  const packageName = userPkg.name;

  // If user tries to open /admin/* without being the 1st ID (FGPL000001)
  if (type === 'admin' && !isRootAdmin) {
    return (
      <div className="min-h-screen bg-[#071E2C] flex items-center justify-center p-4">
        <div className="bg-[#132C3C] border border-red-500/40 rounded-2xl p-8 max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/40">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-white">Access Denied (Company 1st ID Only)</h2>
          <p className="text-xs text-white leading-relaxed">
            Admin Panel is strictly restricted to Company's <strong>1st Root ID (FGPL000001)</strong>. Other member IDs do not have permission to access the admin panel.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/user/dashboard')}
              className="w-full py-3 bg-[#1B3343] hover:bg-[#28485A] text-white font-semibold rounded-xl text-sm transition-all shadow-md"
            >
              Return to Member Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Security Password / PIN Verification Screen
  if (type === 'admin' && !isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-[#071E2C] flex items-center justify-center p-4">
        <div className="bg-[#132C3C] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_35px_rgba(53,183,121,0.25)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/40 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Admin Panel Protected</h2>
            <p className="text-xs text-gray-300">
              Please enter the <strong>Admin Security Password</strong> to access the Admin Control Panel.
            </p>
          </div>

          <form onSubmit={handleAdminUnlock} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center justify-between">
                <span>Admin Password / Security PIN</span>
                <span className="text-[10px] text-emerald-400 font-normal">Super Admin Only</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  required
                  className="w-full bg-[#071E2C] border-2 border-[#28485A]/60 focus:border-emerald-500 p-3.5 pr-11 rounded-xl text-white text-sm font-medium tracking-wide focus:outline-none transition-all placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showAdminPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {adminAuthError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{adminAuthError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating || !adminPasswordInput}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              {isAuthenticating ? 'Verifying Password...' : 'Unlock Admin Panel (एडमिन खोलें)'}
            </button>
          </form>

          <div className="pt-3 border-t border-[#28485A]/40 flex items-center justify-between text-xs">
            <button
              onClick={() => navigate('/user/dashboard')}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              ← Back to User Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full overflow-hidden bg-[#071E2C] flex font-sans text-white">
      {/* PWA Floating Install Prompt */}
      <PwaInstallPrompt />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-50 w-64 bg-[#132C3C] border-r border-[#28485A]/50 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-[#28485A]/30 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#1B3343] rounded-lg flex items-center justify-center text-white font-semibold">F</div>
            <span className="text-xl font-semibold tracking-tight text-white">Future Grow</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {routes.map((route) => {
            const isActive = location.pathname.startsWith(route.path);
            const Icon = route.icon;
            return (
              <Link
                key={route.name}
                to={route.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors",
                  isActive
                    ? "bg-[#1B3343]/30 text-[#8FA3AF]"
                    : "text-white hover:bg-[#071E2C]"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "opacity-100" : "opacity-70"
                  )}
                  aria-hidden="true"
                />
                {route.name}
              </Link>
            );
          })}
        </nav>
        {type === 'user' ? (
          <div className="p-4 border-t border-[#28485A]/30">
            <div className="bg-[#071E2C] text-white p-4 rounded-xl space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#8FA3AF] mb-1">Signup Package</p>
                <div className="flex items-center gap-2">
                  <PackageIcon className="w-4 h-4 text-[#35B779]" />
                  <p className="text-sm font-semibold">{packageName} ({packagePrice})</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#28485A]/30">
                <p className="text-[10px] uppercase tracking-wider text-[#8FA3AF] mb-2">Quick Links</p>
                <div className="flex flex-col gap-2">
                  {isRootAdmin && (
                    <Link to="/admin/dashboard" className="text-xs text-center py-1.5 px-3 bg-emerald-700/30 text-[#35B779] hover:bg-emerald-700/50 rounded border border-emerald-500/50 transition-colors flex items-center justify-center gap-1.5 font-medium">
                      <Shield className="w-3.5 h-3.5 text-[#35B779]" /> Security Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-xs text-center py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded border border-red-500/40 transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-[#28485A]/30 space-y-2">
            <Link
              to="/user/dashboard"
              className="w-full text-xs text-center py-2 px-3 bg-[#1B3343] hover:bg-[#28485A] rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-1.5 border border-[#28485A]/60"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" /> Go to User Dashboard
            </Link>
            <button
              onClick={handleLockAdmin}
              className="w-full text-xs text-center py-2 px-3 bg-amber-950/50 hover:bg-amber-900/60 rounded-lg text-amber-300 font-medium transition-colors flex items-center justify-center gap-1.5 border border-amber-500/40 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Lock Admin Panel
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#132C3C] border-b border-[#28485A]/50 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 text-[#8FA3AF] hover:text-white lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-xs font-medium text-[#8FA3AF]">
                {type === 'user' ? 'Viewing Account' : 'Logged in as'}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-base sm:text-lg font-semibold text-white">
                  {type === 'user' ? currentUser.name : 'Super Admin'}
                </p>
                {type === 'admin' && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                    FGPL000001
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
                        <InstallAppButton className="hidden sm:flex" />
            {type === 'admin' && (
              <>
                <Link
                  to="/user/dashboard"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3343] hover:bg-[#28485A] text-gray-200 border border-[#28485A]/60 rounded-xl text-xs font-semibold transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>User Dashboard</span>
                </Link>
                <button
                  onClick={handleLockAdmin}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-500/50 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  title="Lock Admin Panel with Password"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Lock</span> Panel
                </button>
              </>
            )}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleLogout}
                className="text-[#8FA3AF] hover:text-white flex items-center gap-1.5 text-xs sm:text-sm font-medium"
              >
                <LogOut className="h-4 sm:h-5 w-4 sm:w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <Link 
                to={`/${type}/profile`} 
                className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-emerald-500/60 overflow-hidden flex items-center justify-center text-white bg-[#28485A]/50 hover:border-emerald-400 transition-all cursor-pointer shadow-md"
                title="View Profile / Photo"
              >
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-300" />
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] p-4 sm:p-6 lg:p-8">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "absolute inset-0 z-40 bg-[#071E2C]/80 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
