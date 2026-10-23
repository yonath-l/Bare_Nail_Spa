import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Radio, KeyRound, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { useLoyalty } from '../../context/LoyaltyContext';

interface StampReceptionPadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StampReceptionPad: React.FC<StampReceptionPadProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { stampActiveCard, demoBypassCooldown, setDemoBypassCooldown } = useLoyalty();

  const [stampFeedback, setStampFeedback] = useState<string | null>(null);
  const [stampError, setStampError] = useState<string | null>(null);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [pressProgress, setPressProgress] = useState<number>(0);
  const [showStaffPinInput, setShowStaffPinInput] = useState<boolean>(false);
  const [staffPin, setStaffPin] = useState<string>('');

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Physical NFC Stamp Listener (URL Trigger)
  useEffect(() => {
    const stampKeyParam = searchParams.get('stamp_key');
    if (stampKeyParam) {
      // Immediately strip URL parameter to prevent replay or bookmarks
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      searchParams.delete('stamp_key');
      setSearchParams(searchParams, { replace: true });

      // Validate secret token
      const validTokens = [
        BRAND_CONFIG.loyaltyRules.nfcSecretToken,
        'ATELIER_NFC_STAMP',
        'ATELIER_STAMP_2026',
      ];
      if (validTokens.includes(stampKeyParam)) {
        const result = stampActiveCard('NFC_TAP', demoBypassCooldown);
        if (result.success) {
          setStampFeedback('✨ Physical NFC Stamp Verified! Atelier Visit Recorded.');
        } else {
          setStampError(result.reason || 'Failed to record NFC stamp.');
        }
      } else {
        setStampError('Invalid NFC Stamp signature key.');
      }
    }
  }, [searchParams, setSearchParams, stampActiveCard, demoBypassCooldown]);

  // 2. Physical Capacitive / 2-Finger Touch-Hold Stamp Zone
  const [touchType, setTouchType] = useState<'stamp' | 'two_finger'>('stamp');

  const startStampTouch = (e?: React.TouchEvent | React.MouseEvent) => {
    setStampError(null);
    setIsPressing(true);
    setPressProgress(0);

    const isTwoFinger = e && 'touches' in e && e.touches.length >= 2;
    setTouchType(isTwoFinger ? 'two_finger' : 'stamp');

    const startTime = Date.now();
    const duration = isTwoFinger ? 750 : 900; // 750ms for two-finger receptionist hold, 900ms for physical stamp

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setPressProgress(pct);
    }, 30);

    pressTimerRef.current = setTimeout(() => {
      setIsPressing(false);
      setPressProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

      const result = stampActiveCard('CAPACITIVE_STAMP', demoBypassCooldown);
      if (result.success) {
        setStampFeedback(
          isTwoFinger
            ? '✨ 2-Finger Receptionist Stamp Authenticated! Visit Recorded.'
            : '✨ Physical Capacitive Stamp Sealed! Atelier Visit Recorded.'
        );
      } else {
        setStampError(result.reason || 'Cooldown active or card cannot be stamped.');
      }
    }, duration);
  };

  const cancelStampTouch = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setIsPressing(false);
    setPressProgress(0);
  };

  // 3. Receptionist Staff PIN Override (PIN: 10115 - Malabe postal code)
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffPin === '10115' || staffPin === '2026') {
      const result = stampActiveCard('STAFF_POS_PIN', true);
      if (result.success) {
        setStampFeedback('✨ Staff Reception Override Applied!');
        setShowStaffPinInput(false);
        setStaffPin('');
      } else {
        setStampError(result.reason || 'Could not apply stamp.');
      }
    } else {
      setStampError('Incorrect Staff PIN.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-linen rounded-3xl p-6 sm:p-8 border border-champagne/40 shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-espresso/60 hover:text-espresso rounded-full hover:bg-rosewood/10 transition-colors"
          aria-label="Close Stamp Pad"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-champagne/20 border border-champagne/50 flex items-center justify-center mb-3">
            <Radio className="w-6 h-6 text-rosewood animate-pulse" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-espresso">
            Atelier Stamp Pad
          </h2>
          <p className="text-xs text-clay tracking-wide uppercase mt-1">
            NFC Tap or Physical Capacitive Stamp Target
          </p>
        </div>

        {/* Feedback / Error Alerts */}
        {stampFeedback && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{stampFeedback}</span>
          </div>
        )}

        {stampError && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{stampError}</span>
          </div>
        )}

        {/* Physical Capacitive Stamp Circular Target */}
        <div className="my-6 flex flex-col items-center">
          <div
            onMouseDown={startStampTouch}
            onMouseUp={cancelStampTouch}
            onMouseLeave={cancelStampTouch}
            onTouchStart={startStampTouch}
            onTouchEnd={cancelStampTouch}
            className={`relative w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 ${
              isPressing
                ? 'scale-95 bg-rosewood/20 border-rosewood shadow-luxury-elevated'
                : 'bg-linen-100 border-champagne hover:border-rosewood shadow-luxury-gold'
            }`}
          >
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="88"
                cy="88"
                r="82"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                className="text-champagne/30"
              />
              <circle
                cx="88"
                cy="88"
                r="82"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 82}
                strokeDashoffset={2 * Math.PI * 82 * (1 - pressProgress / 100)}
                strokeLinecap="round"
                className="text-rosewood transition-all duration-75"
              />
            </svg>

            {/* Target Inner Details */}
            <div className="flex flex-col items-center justify-center z-10 px-4 text-center">
              <Sparkles className={`w-8 h-8 mb-2 transition-transform ${isPressing ? 'scale-125 text-rosewood' : 'text-champagne'}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-espresso leading-tight">
                {isPressing ? 'Sealing Stamp...' : 'Press Salon Stamp Here'}
              </span>
              <span className="text-[9px] text-clay font-medium mt-1">
                (or hold for 1 sec)
              </span>
            </div>
          </div>

          <p className="text-[11px] text-espresso/60 mt-4 max-w-xs leading-relaxed">
            Receptionist: Press the physical conductive wax-seal stamp firmly against this screen, or tap the salon's NFC keychain.
          </p>
        </div>

        {/* Live Presentation Demo Button & Staff PIN Option */}
        <div className="pt-4 border-t border-rosewood/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => {
                const res = stampActiveCard('CAPACITIVE_STAMP', true);
                if (res.success) {
                  setStampFeedback('🎉 Quick Pitch Stamp Added! (Demo Bypass Active)');
                } else {
                  setStampError(res.reason || 'Error');
                }
              }}
              className="text-rosewood hover:text-rosewood-dark font-medium underline underline-offset-4"
            >
              ⚡ Instant Demo Stamp (1-Click)
            </button>

            <button
              onClick={() => setShowStaffPinInput(!showStaffPinInput)}
              className="text-clay hover:text-espresso flex items-center space-x-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Staff PIN</span>
            </button>
          </div>

          {/* Demo Bypass Cooldown Toggle */}
          <div className="flex items-center justify-between bg-linen-100 p-2.5 rounded-xl text-[11px] text-espresso/70">
            <span>Presentation Mode (Bypass 12h Cooldown):</span>
            <button
              onClick={() => setDemoBypassCooldown(!demoBypassCooldown)}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                demoBypassCooldown ? 'bg-champagne text-espresso' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {demoBypassCooldown ? 'BYPASS ON' : 'STRICT ON'}
            </button>
          </div>

          {/* Staff PIN Input */}
          {showStaffPinInput && (
            <form onSubmit={handlePinSubmit} className="pt-2 flex items-center space-x-2">
              <input
                type="password"
                maxLength={5}
                placeholder="Enter Staff PIN (10115)"
                value={staffPin}
                onChange={e => setStaffPin(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-rosewood/30 bg-white focus:outline-none focus:border-rosewood"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-espresso text-linen text-xs uppercase tracking-luxury rounded-xl shrink-0"
              >
                Verify
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
