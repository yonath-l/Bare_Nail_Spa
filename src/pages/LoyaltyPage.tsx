import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Crown,
  Smartphone,
  Calendar,
  Gift,
  Plus,
  LogOut,
  Radio,
  Flame,
  UserCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';
import { BRAND_CONFIG } from '../config/brandConfig';
import { LoyaltyCardGrid } from '../components/loyalty/LoyaltyCardGrid';
import { StampReceptionPad } from '../components/loyalty/StampReceptionPad';
import { CelebrationOverlay } from '../components/loyalty/CelebrationOverlay';
import { AddToHomeScreenGuide } from '../components/loyalty/AddToHomeScreenGuide';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const LoyaltyPage: React.FC = () => {
  const {
    profile,
    activePhone,
    loginByPhone,
    logoutDeviceMemory,
    registerNewMember,
    demoBypassCooldown,
    setDemoBypassCooldown,
  } = useLoyalty();

  // Modals
  const [isStampPadOpen, setIsStampPadOpen] = useState(false);
  const [isHomeScreenGuideOpen, setIsHomeScreenGuideOpen] = useState(false);

  // New Registration / Login Form
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const currentVisits = profile ? profile.currentVisits : 0;
  const totalStamps = BRAND_CONFIG.loyaltyRules.totalStamps;
  const progressPct = Math.min(100, Math.round((currentVisits / totalStamps) * 100));

  // Dynamic Psychological Urgency Prompt
  const getUrgencyPrompt = () => {
    if (!profile) return null;
    if (currentVisits === 4) {
      return {
        text: '🔥 YOU ARE 1 STAMP AWAY FROM 50% OFF PRIVILEGE!',
        color: 'from-amber-600 to-rosewood',
      };
    }
    if (currentVisits === 9) {
      return {
        text: '💎 YOU ARE 1 STAMP AWAY FROM 100% OFF (UP TO RS. 5,000) GRAND REWARD!',
        color: 'from-champagne to-rosewood',
      };
    }
    if (profile.activeRewards.some(r => !r.redeemed)) {
      return {
        text: '🎉 ACTIVE REWARD UNLOCKED: 50% OR 100% OFF READY TO REDEEM!',
        color: 'from-emerald-700 to-espresso',
      };
    }
    if (currentVisits < 5) {
      return {
        text: `✨ ${5 - currentVisits} visit(s) until your 50% OFF Privilege Voucher`,
        color: 'from-espresso to-cocoa',
      };
    }
    return {
      text: `✨ ${10 - currentVisits} visit(s) until your 100% OFF Privilege (Up to Rs. 5,000)`,
      color: 'from-espresso to-cocoa',
    };
  };

  const urgency = getUrgencyPrompt();

  /**
   * Handle Onboarding / Sign In (Rule 1)
   * Client-side validation: server-side validation required here in production.
   */
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanPhone = phoneInput.trim();
    if (!cleanPhone || cleanPhone.length < 9) {
      setAuthError('Please enter a valid phone number (e.g. 077 123 4567).');
      return;
    }

    if (isRegisterMode) {
      if (!nameInput.trim()) {
        setAuthError('Please enter your full name for your loyalty pass.');
        return;
      }
      registerNewMember(cleanPhone, nameInput, emailInput);
    } else {
      const success = loginByPhone(cleanPhone);
      if (!success) {
        // Auto-switch to register mode
        setIsRegisterMode(true);
        setAuthError('Phone not found. Please enter your name to unlock Stamp #1 Welcome Gift!');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Celebration Modal Overlay */}
      <CelebrationOverlay />

      {/* Interactive Physical / Touch Stamp Pad */}
      <StampReceptionPad
        isOpen={isStampPadOpen}
        onClose={() => setIsStampPadOpen(false)}
      />

      {/* Add To Home Screen Instructions */}
      <AddToHomeScreenGuide
        isOpen={isHomeScreenGuideOpen}
        onClose={() => setIsHomeScreenGuideOpen(false)}
      />

      {/* HEADER: VIP CLUB BRANDING */}
      <ScrollReveal direction="up">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-champagne/20 border border-champagne/40 px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wide-luxury text-rosewood font-bold animate-float-slow">
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span>Interactive NFC & Touch-Stamp Pass</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-espresso">
            The Bare <span className="italic text-rosewood">VIP Loyalty Pass</span>
          </h1>

          <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed font-light max-w-xl mx-auto">
            No passwords. No bulky plastic cards. Stamped physically on your smartphone glass at checkout via NFC tap or our capacitive salon stamp seal.
          </p>
        </div>
      </ScrollReveal>

      {/* ACTIVE CARD VIEW vs ONBOARDING VIEW */}
      {profile ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* TOP INTERACTIVE HERO CARD (Punchpass Style) */}
          <ScrollReveal direction="up" delayMs={50}>
            <div className="card-luxury relative rounded-3xl bg-gradient-to-br from-espresso via-cocoa to-espresso text-linen p-6 sm:p-10 border-2 border-champagne/50 hover:border-champagne shadow-2xl overflow-hidden">
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-champagne/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                
                {/* Card Meta Bar */}
                <div className="w-full flex items-center justify-between border-b border-linen/10 pb-4 text-xs">
                  <div className="flex items-center space-x-2 text-left">
                    <div className="w-10 h-10 rounded-full border border-champagne/40 overflow-hidden shrink-0 ring-2 ring-champagne/20">
                      <img src="/assets/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-linen leading-none">
                        {profile.fullName}
                      </h3>
                      <span className="text-[10px] font-mono text-champagne">
                        {profile.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="bg-champagne/20 text-champagne border border-champagne/40 text-[10px] uppercase tracking-luxury font-bold px-2.5 py-1 rounded-full">
                      VIP Member
                    </span>
                    <button
                      onClick={logoutDeviceMemory}
                      title="Switch Account / Log Out"
                      className="p-1.5 text-linen/60 hover:text-linen hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* CENTERPIECE SVG CIRCULAR PROGRESS RING */}
                <div className="relative w-52 h-52 flex items-center justify-center my-2">
                  <svg className="w-full h-full -rotate-90 pointer-events-none">
                    <circle
                      cx="104"
                      cy="104"
                      r="92"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-linen/10"
                    />
                    <circle
                      cx="104"
                      cy="104"
                      r="92"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 92}
                      strokeDashoffset={2 * Math.PI * 92 * (1 - progressPct / 100)}
                      strokeLinecap="round"
                      className="text-champagne transition-all duration-1000"
                    />
                  </svg>

                  {/* Center Content Inside Ring */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <Crown className="w-7 h-7 text-champagne mb-1 animate-pulse-soft" />
                    <span className="font-serif text-4xl sm:text-5xl font-bold text-linen leading-none">
                      {currentVisits}
                      <span className="text-xl sm:text-2xl text-linen/60 font-light">
                        /{totalStamps}
                      </span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wide-luxury text-champagne font-semibold mt-1">
                      Stamps Collected
                    </span>
                  </div>
                </div>

                {/* Psychological Urgency Banner */}
                {urgency && (
                  <div className={`w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r ${urgency.color} text-linen text-xs font-bold uppercase tracking-wider shadow-inner text-center`}>
                    {urgency.text}
                  </div>
                )}

                {/* PRIMARY INTERACTIVE TRIGGER: COLLECT STAMP AT COUNTER */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => setIsStampPadOpen(true)}
                    className="btn-sheen w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-champagne hover:bg-champagne-light text-espresso px-8 py-4 rounded-full text-xs uppercase tracking-luxury font-bold shadow-luxury-gold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Radio className="w-4 h-4 text-espresso animate-pulse" />
                    <span>Collect Stamp at Counter</span>
                  </button>

                  <Link
                    to="/book"
                    className="btn-sheen w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-linen/15 hover:bg-linen/25 text-linen border border-champagne/40 px-6 py-4 rounded-full text-xs uppercase tracking-luxury font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Calendar className="w-4 h-4 text-champagne" />
                    <span>Reserve Next Visit</span>
                  </Link>
                </div>

                {/* Device Memory Status & Save To Home Screen */}
                <div className="w-full pt-4 border-t border-linen/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-linen/60 gap-2">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved on this smartphone · Zero password required</span>
                  </div>

                  <button
                    onClick={() => setIsHomeScreenGuideOpen(true)}
                    className="text-champagne hover:text-champagne-light underline underline-offset-4 flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Add Pass to Home Screen</span>
                  </button>
                </div>

              </div>
            </div>
          </ScrollReveal>

          {/* 10-SLOT ATELIER CARD GRID */}
          <div className="p-6 sm:p-8 rounded-3xl bg-linen-100 border border-rosewood/15 shadow-luxury-subtle">
            <LoyaltyCardGrid currentVisits={currentVisits} totalStamps={totalStamps} />
          </div>

          {/* ACTIVE PRIVILEGE VOUCHERS LIST */}
          {profile.activeRewards.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-espresso text-linen border border-champagne/50 shadow-luxury-gold space-y-4">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-champagne" />
                <h3 className="font-serif text-xl font-bold text-linen">
                  Your Unlocked Privilege Vouchers
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.activeRewards.map(rew => (
                  <div
                    key={rew.id}
                    className="p-4 rounded-2xl bg-espresso-light border border-champagne/30 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-champagne font-bold">
                        Visit #{rew.milestoneVisit} Privilege
                      </span>
                      <h4 className="font-serif text-lg font-bold text-linen">
                        {rew.title}
                      </h4>
                      <p className="text-xs text-linen/70 mt-1">
                        Code: <strong className="font-mono text-champagne">{rew.voucherCode}</strong>
                      </p>
                    </div>

                    <Link
                      to="/book"
                      className="mt-3 w-full text-center py-2 rounded-xl bg-champagne text-espresso text-xs uppercase tracking-luxury font-bold hover:bg-champagne-light transition-colors"
                    >
                      Apply & Book Session
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIVE DEMO PRESENTATION CONTROLS (PITCH TOOLKIT) */}
          <div className="p-6 rounded-3xl bg-white/70 border border-rosewood/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-luxury text-clay font-bold flex items-center space-x-2">
                <Flame className="w-4 h-4 text-rosewood" />
                <span>Live Pitch Demo Switcher</span>
              </span>

              <span className="text-[10px] bg-linen-200 px-2.5 py-0.5 rounded-full text-espresso font-medium">
                Testing Device Memory
              </span>
            </div>

            <p className="text-xs text-espresso/70 leading-relaxed">
              Instantly toggle between pre-seeded patron profiles to demonstrate different dopamine reward thresholds to salon owners:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => loginByPhone('0771234567')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  profile.phone === '0771234567'
                    ? 'border-rosewood bg-linen-100 font-semibold'
                    : 'border-rosewood/15 bg-white hover:border-clay'
                }`}
              >
                <div className="font-medium text-espresso">Amaya Perera</div>
                <div className="text-[10px] text-rosewood">4/10 (1 stamp to 50% OFF)</div>
              </button>

              <button
                onClick={() => loginByPhone('0779876543')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  profile.phone === '0779876543'
                    ? 'border-rosewood bg-linen-100 font-semibold'
                    : 'border-rosewood/15 bg-white hover:border-clay'
                }`}
              >
                <div className="font-medium text-espresso">Dilshan Silva</div>
                <div className="text-[10px] text-rosewood">9/10 (1 stamp to Jackpot)</div>
              </button>

              <button
                onClick={() => loginByPhone('0715554321')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  profile.phone === '0715554321'
                    ? 'border-rosewood bg-linen-100 font-semibold'
                    : 'border-rosewood/15 bg-white hover:border-clay'
                }`}
              >
                <div className="font-medium text-espresso">Shenali Fernando</div>
                <div className="text-[10px] text-rosewood">5/10 (Active 50% Voucher)</div>
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* ONBOARDING & SIGNUP FORM (ENDOWED PROGRESS GIFT) */
        <div className="max-w-md mx-auto bg-linen-100 rounded-3xl p-8 border border-rosewood/20 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-champagne/20 border border-champagne/50 mx-auto flex items-center justify-center text-rosewood">
              <Gift className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-espresso">
              {isRegisterMode ? 'Unlock Your VIP Welcome Gift' : 'Open Your VIP Digital Pass'}
            </h2>
            <p className="text-xs text-espresso/70 leading-relaxed">
              {isRegisterMode
                ? 'Join today and receive Stamp #1 free immediately! You start only 4 visits away from 50% OFF.'
                : 'Enter your phone number to open your remembered digital card.'}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-luxury text-clay font-semibold block mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                placeholder="e.g. 077 123 4567"
                className="w-full text-xs px-4 py-3 rounded-2xl border border-rosewood/25 bg-white focus:outline-none focus:border-rosewood"
              />
            </div>

            {isRegisterMode && (
              <>
                <div>
                  <label className="text-xs uppercase tracking-luxury text-clay font-semibold block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="e.g. Amaya Perera"
                    className="w-full text-xs px-4 py-3 rounded-2xl border border-rosewood/25 bg-white focus:outline-none focus:border-rosewood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-clay font-semibold block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="e.g. amaya@example.lk"
                    className="w-full text-xs px-4 py-3 rounded-2xl border border-rosewood/25 bg-white focus:outline-none focus:border-rosewood"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-rosewood hover:bg-rosewood-dark text-white text-xs uppercase tracking-luxury font-bold shadow-luxury-subtle transition-all duration-300"
            >
              {isRegisterMode ? '✨ Claim Stamp #1 & Open Pass' : 'Look Up My Pass'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setAuthError(null);
              }}
              className="text-xs text-rosewood hover:underline"
            >
              {isRegisterMode
                ? 'Already a member? Look up phone instead'
                : 'First visit? Create new loyalty pass (Stamp #1 Free)'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
