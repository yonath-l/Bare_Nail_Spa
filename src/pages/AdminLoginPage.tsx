import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brandConfig';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // SEO/Crawler Exclusion (Rule 7): Force noindex meta tag on admin routes
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
    }
    metaTag.content = 'noindex, nofollow';

    return () => {
      if (metaTag) metaTag.content = 'index, follow';
    };
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) {
      setIsLockedOut(false);
      return;
    }
    const timer = setInterval(() => {
      setLockoutSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  /**
   * Admin Authentication Check (Rule 5)
   * Client-side placeholder guard; server-side authentication required here in production.
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    // Default studio admin passphrase (can also be changed via settings)
    const validPassword = 'atelier2026';

    if (password === validPassword) {
      // Set session token
      localStorage.setItem('bare_admin_auth_token', `auth-tok-${Date.now()}`);
      navigate('/admin');
    } else {
      const nextCount = attemptCount + 1;
      setAttemptCount(nextCount);
      setPassword('');

      if (nextCount >= 3) {
        setIsLockedOut(true);
        setLockoutSeconds(30);
        setErrorMessage('Too many failed attempts. Login locked for 30 seconds for security.');
      } else {
        setErrorMessage(`Invalid studio passphrase. (${3 - nextCount} attempt(s) remaining)`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E2B4BD]/40 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#F7D6D0]/60 border border-[#E2B4BD] mx-auto flex items-center justify-center text-[#4A4A4A]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#4A4A4A]">
            Studio Reception POS & CMS
          </h1>
          <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            {BRAND_CONFIG.studioName} · Restricted Executive Portal
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1.5">
              Studio Passphrase
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                required
                disabled={isLockedOut}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isLockedOut ? `Locked for ${lockoutSeconds}s` : 'Enter studio passphrase'}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/50 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A] disabled:opacity-50"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Demo Access Passphrase: <span className="font-mono text-[#4A4A4A] font-semibold">atelier2026</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLockedOut}
            className="w-full py-3.5 rounded-full bg-[#4A4A4A] hover:bg-[#333333] text-white text-xs uppercase tracking-wider font-bold shadow-xs transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{isLockedOut ? `Locked (${lockoutSeconds}s)` : 'Unlock Atelier Terminal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-[#E2B4BD]/20">
          <a
            href="/"
            className="text-xs text-stone-500 hover:text-[#4A4A4A] hover:underline"
          >
            ← Return to Public Boutique
          </a>
        </div>

      </div>
    </div>
  );
};
