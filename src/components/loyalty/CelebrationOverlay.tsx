import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Crown, Gift, Calendar, ArrowRight, X } from 'lucide-react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { ConfettiShower } from '../common/ConfettiShower';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const CelebrationOverlay: React.FC = () => {
  const { celebration, closeCelebration } = useLoyalty();
  const navigate = useNavigate();

  if (!celebration || !celebration.isOpen) return null;

  const { reward, stampNumber, isWelcomeBonus } = celebration;
  const isMilestone1 = stampNumber === BRAND_CONFIG.loyaltyRules.milestone1Visit;
  const isMilestone2 = stampNumber === BRAND_CONFIG.loyaltyRules.totalStamps;

  const handleBookWithReward = () => {
    closeCelebration();
    navigate('/book');
  };

  return (
    <>
      {/* High-Performance Canvas Confetti Shower */}
      <ConfettiShower />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/85 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-lg bg-linen rounded-3xl p-8 border-2 border-champagne shadow-2xl text-center overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-champagne/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rosewood/30 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={closeCelebration}
            className="absolute top-4 right-4 p-2 text-espresso/60 hover:text-espresso rounded-full hover:bg-rosewood/10 transition-colors"
            aria-label="Close Celebration"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-champagne-light via-champagne to-rosewood p-1 shadow-luxury-gold mb-5 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-espresso flex items-center justify-center">
              {reward ? (
                isMilestone1 ? (
                  <Crown className="w-10 h-10 text-champagne animate-bounce" />
                ) : (
                  <Gift className="w-10 h-10 text-champagne animate-pulse" />
                )
              ) : isWelcomeBonus ? (
                <Sparkles className="w-10 h-10 text-champagne" />
              ) : (
                <Sparkles className="w-9 h-9 text-champagne" />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl font-semibold text-espresso">
            {reward
              ? '✨ VIP Privilege Unlocked!'
              : isWelcomeBonus
              ? '🎉 Welcome Gift Granted!'
              : '✨ Atelier Visit Stamped!'}
          </h2>

          {/* Stamp Number Counter */}
          <div className="inline-flex items-center space-x-2 my-3 px-4 py-1.5 rounded-full bg-rosewood/10 border border-rosewood/25 text-rosewood text-xs uppercase tracking-luxury font-bold">
            <span>Visit Stamp #{stampNumber} of 10 Recorded</span>
          </div>

          {/* Dynamic Content */}
          {reward ? (
            <div className="my-5 p-5 rounded-2xl bg-espresso text-linen border border-champagne/50 shadow-luxury-gold space-y-3">
              <span className="text-[11px] uppercase tracking-wide-luxury text-champagne font-bold">
                Exclusive Milestone Reward
              </span>
              <h3 className="font-serif text-2xl font-bold text-linen">
                {reward.title}
              </h3>
              <p className="text-xs text-linen/75">
                Voucher Code:{' '}
                <strong className="text-champagne font-mono tracking-wider">
                  {reward.voucherCode}
                </strong>
              </p>
              <p className="text-[11px] text-linen/60">
                (This reward is automatically applied when you reserve your next session using your phone number).
              </p>
            </div>
          ) : isWelcomeBonus ? (
            <div className="my-5 p-4 rounded-2xl bg-champagne/15 border border-champagne/40 text-espresso text-xs leading-relaxed">
              <p className="font-medium text-rosewood mb-1">
                Endowed Progress Advantage Active:
              </p>
              <p>
                We have pre-stamped <strong>Visit #1</strong> for you! You are now only <strong>4 visits away</strong> from your <strong>50% OFF Privilege Voucher</strong>.
              </p>
            </div>
          ) : (
            <div className="my-5 p-4 rounded-2xl bg-linen-100 border border-rosewood/15 text-espresso text-xs leading-relaxed">
              <p className="text-espresso/80">
                {stampNumber < 5
                  ? `Only ${5 - stampNumber} more visit(s) until your 50% OFF Privilege Reward!`
                  : `Only ${10 - stampNumber} more visit(s) until your 100% OFF Grand Jackpot Reward!`}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleBookWithReward}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-rosewood hover:bg-rosewood-dark text-white px-6 py-3 rounded-full text-xs uppercase tracking-luxury font-medium shadow-luxury-subtle transition-all duration-300"
            >
              <Calendar className="w-4 h-4 text-champagne" />
              <span>{reward ? 'Book With My Reward' : 'Schedule Next Session'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={closeCelebration}
              className="w-full sm:w-auto px-5 py-3 rounded-full border border-rosewood/30 text-espresso hover:bg-rosewood/10 text-xs uppercase tracking-luxury font-medium transition-colors"
            >
              View Pass
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
