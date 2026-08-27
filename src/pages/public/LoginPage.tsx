import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Network, Eye, EyeOff, Globe, ArrowRight, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { getMlmUsers, setCurrentUserId } from '@/lib/mlmStore';
import { createActiveUserSession, checkCanUserLogin, createActiveAdminSession } from '@/lib/sessionManager';

export function LoginPage() {
  const navigate = useNavigate();
  const [userIdentifier, setUserIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // 2nd Step Security Verification for 1st ID (Admin / FGPL000001)
  const [isVerifyingAdminSecurity, setIsVerifyingAdminSecurity] = useState(false);
  const [adminSecurityPin, setAdminSecurityPin] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const rawIdentifier = userIdentifier.trim();
    const trimmed = rawIdentifier.toLowerCase();
    const rawUpper = rawIdentifier.toUpperCase();
    const cleanPassword = password.trim();

    if (!rawIdentifier || !cleanPassword) {
      setError('Please enter your registered Email or Username, and password.');
      return;
    }

    // Explicitly block any attempt to login using User IDs (e.g. FGPL000001, FGPL000002, etc.)
    if (rawUpper.startsWith('FGPL') || rawUpper.startsWith('FG')) {
      setError('Login with User ID is not allowed. Please enter your registered Email or Username.');
      return;
    }

    const users = getMlmUsers();

    // Find user strictly by Email or Username ONLY (Never by User ID)
    const found = users.find(u => {
      const uEmail = (u.email || '').trim().toLowerCase();
      const uUsername = (u.username || '').trim().toLowerCase();
      const isRootAdmin = u.id === 'FGPL000001' || uEmail === 'uyadav73938@gmail.com';

      // 1st ID (Root Admin) restricted strictly to its registered email (uyadav73938@gmail.com) or username (umesh)
      if (isRootAdmin) {
        return (uEmail === 'uyadav73938@gmail.com' && trimmed === 'uyadav73938@gmail.com') || 
               (uUsername && trimmed === uUsername) || 
               (trimmed === 'umesh');
      }

      // For all regular users: match strictly Email or Username ONLY
      return (uEmail && uEmail === trimmed) || 
             (uUsername && uUsername === trimmed);
    });

    if (found) {
      if (found.status === 'Blocked' || found.status === 'Deleted') {
        setError(found.status === 'Deleted' ? 'Account not found' : 'Your account has been blocked by the admin. Please contact support.');
        return;
      }

      const isFirstAdminId = found.id === 'FGPL000001' || found.email?.toLowerCase() === 'uyadav73938@gmail.com';

      let isPasswordCorrect = false;
      if (isFirstAdminId) {
        // 1st ID strictly requires Master Password: 7393862448 (123456 is NEVER allowed)
        isPasswordCorrect = cleanPassword === '7393862448';
      } else {
        // Regular members (2nd ID onwards)
        const savedUserPassword = localStorage.getItem(`user_password_${found.id}`) || '';
        const actualPassword = (found.password || savedUserPassword).trim();
        isPasswordCorrect = cleanPassword === actualPassword || cleanPassword === savedUserPassword.trim();
      }

      if (isPasswordCorrect) {
        // Strict Single Device Policy: Cannot login on another device if already active
        const canLogin = checkCanUserLogin(found.id);
        if (!canLogin.allowed) {
          setError('Unable to login. This account is currently active on another device. Please logout from that device first.');
          return;
        }

        // Check if this is the 1st ID / Admin Account
        if (isFirstAdminId) {
          // Trigger Step 2: 8-digit Master Security Passcode
          setIsVerifyingAdminSecurity(true);
          setError('');
          return;
        }

        // Regular Member Login (2nd ID onwards) - Instant direct login
        localStorage.removeItem('is_admin_session');
        localStorage.removeItem('admin_security_unlocked');
        sessionStorage.removeItem('admin_pin_verified');
        createActiveUserSession(found.id);
        setCurrentUserId(found.id);
        navigate('/user/dashboard');
        return;
      } else {
        setError('Incorrect password. Please verify and enter your correct password.');
        return;
      }
    }

    // Fallback for root user credentials on standard login (ONLY exact email uyadav73938@gmail.com)
    if (
      trimmed === 'uyadav73938@gmail.com' && 
      cleanPassword === '7393862448'
    ) {
      setIsVerifyingAdminSecurity(true);
      setError('');
      return;
    }

    setError('No account found with this Email or Username. Please verify your details or do registration for a new account.');
  };

  const handleAdminSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanPin = adminSecurityPin.trim();

    // Required Master Security Passcode: 77339933 (or backup master password)
    if (cleanPin === '77339933' || cleanPin === '7393862448') {
      localStorage.setItem('is_admin_session', 'true');
      localStorage.setItem('admin_security_unlocked', 'true');
      sessionStorage.setItem('admin_pin_verified', 'true');
      createActiveAdminSession('Root Admin (FGPL000001)');
      createActiveUserSession('FGPL000001');
      setCurrentUserId('FGPL000001');
      navigate('/user/dashboard');
    } else {
      setError('Invalid Security Key! Please enter the correct 8-digit security key.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#071E2C] py-12 px-4 sm:px-6 lg:px-8">
      {isVerifyingAdminSecurity ? (
        /* STEP 2: Root Admin 8-Digit Security Verification Screen */
        <Card className="w-full max-w-md border-2 border-emerald-500/60 bg-[#132C3C] shadow-[0_0_35px_rgba(16,185,129,0.25)] animate-in fade-in zoom-in-95 duration-200">
          <CardHeader className="space-y-2 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white tracking-wide">
              App Security Panel
            </CardTitle>
            <CardDescription className="text-xs text-gray-300 max-w-xs">
              Enter your 8-digit Security Key to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminSecuritySubmit} className="space-y-4">
              {error && (
                <div className="text-red-400 text-xs font-semibold text-center bg-red-500/10 py-2.5 px-3 rounded-lg border border-red-500/30">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5" htmlFor="adminSecurityPin">
                  <KeyRound className="w-3.5 h-3.5" />
                  Enter 8-Digit Security Key
                </label>
                <div className="relative">
                  <Input 
                    id="adminSecurityPin" 
                    type={showAdminPin ? "text" : "password"} 
                    value={adminSecurityPin} 
                    onChange={(e) => setAdminSecurityPin(e.target.value)} 
                    placeholder="••••••••" 
                    className="pr-10 text-center tracking-widest text-lg font-mono font-bold bg-[#071E2C] border-emerald-500/50 focus:border-emerald-400 text-emerald-300 placeholder:text-gray-500 placeholder:text-base"
                    autoFocus
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    title={showAdminPin ? "Hide code" : "Show code"}
                  >
                    {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-5 shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                Verify & Unlock App Portal
              </Button>

              <button
                type="button"
                onClick={() => {
                  setIsVerifyingAdminSecurity(false);
                  setAdminSecurityPin('');
                  setError('');
                }}
                className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-200 transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Account Login
              </button>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* STEP 1: Standard Account Login */
        <Card className="w-full max-w-md border-2 border-emerald-500/40 bg-[#132C3C] shadow-[0_0_25px_rgba(16,185,129,0.15)]">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-500/20 text-[#35B779] border border-emerald-500/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Network className="h-6 w-6 text-[#35B779]" />
            </div>
            <CardTitle className="text-2xl font-semibold text-center text-white">Login to Account</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Enter your credentials to access your portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="text-red-400 text-sm font-medium text-center bg-red-400/10 py-2.5 px-3 rounded-lg border border-red-400/30 space-y-2">
                  <div>{error}</div>
                  {error.includes('active on another device') && (
                    <button 
                      type="button"
                      onClick={async () => {
                        localStorage.removeItem('mlm_active_sessions');
                        localStorage.removeItem('mlm_active_admin_session');
                        const { pushMlmStateToSupabase } = await import('@/lib/mlmStore');
                        pushMlmStateToSupabase('mlm_active_sessions', {});
                        pushMlmStateToSupabase('mlm_active_admin_session', null);
                        setError('System cleared stuck sessions from cloud. Please try logging in again.');
                      }}
                      className="mt-2 w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md text-xs font-semibold transition-colors border border-red-500/30"
                    >
                      Emergency Unlock (Clear Stuck Sessions)
                    </button>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-200" htmlFor="userIdentifier">
                  Email or Username
                </label>
                <Input 
                  id="userIdentifier" 
                  type="text" 
                  value={userIdentifier} 
                  onChange={(e) => setUserIdentifier(e.target.value)} 
                  placeholder="Enter your registered email or username" 
                  required 
                  className="bg-[#071E2C] border-[#28485A]/60 focus:border-emerald-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none text-gray-200" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    {showPassword ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Show</>}
                  </button>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter your password" 
                    className="pr-10 bg-[#071E2C] border-[#28485A]/60 focus:border-emerald-500 text-white"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-5 shadow-lg shadow-emerald-950/40 cursor-pointer">
                Sign In to Dashboard
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-[#28485A]/30 pt-5 pb-6">
            <p className="text-center text-sm text-white">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#35B779] hover:text-emerald-300">
                Registration now
              </Link>
            </p>

            <div className="w-full mt-4 pt-4 border-t border-[#28485A]/40 text-center space-y-2.5">
              <p className="text-xs text-gray-300 font-medium">
                Want to explore the full website and business plan without logging in?
              </p>
              <Link
                to="/"
                className="w-full py-2.5 px-4 rounded-xl bg-[#081F2D] hover:bg-[#0E2F44] border border-[#28485A] hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Explore Full Website (Read as Guest)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-400 pt-1">
                <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  • Home Overview
                </Link>
                <Link to="/plan" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  • Business Plan
                </Link>
                <Link to="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  • About Company
                </Link>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  • Contact Us
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
