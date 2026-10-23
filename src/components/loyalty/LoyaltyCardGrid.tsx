import React from 'react';
import { Crown, Sparkles, Check, Gift } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface LoyaltyCardGridProps {
  currentVisits: number;
  totalStamps?: number;
}

export const LoyaltyCardGrid: React.FC<LoyaltyCardGridProps> = ({
  currentVisits,
  totalStamps = BRAND_CONFIG.loyaltyRules.totalStamps,
}) => {
  const slots = Array.from({ length: totalStamps }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-luxury text-espresso font-medium flex items-center space-x-2">
          <span>Official Atelier Stamp Card</span>
          <span className="text-[10px] text-clay font-normal">
            ({currentVisits}/{totalStamps} Visited)
          </span>
        </h3>
        <span className="text-[11px] text-rosewood font-medium">
          Cycle 1 · VIP Status
        </span>
      </div>

      {/* 10-Slot Atelier Grid (2 rows of 5) */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5">
        {slots.map(slotNum => {
          const isStamped = slotNum <= currentVisits;
          const isMilestone1 = slotNum === BRAND_CONFIG.loyaltyRules.milestone1Visit; // Slot 5
          const isMilestone2 = slotNum === totalStamps; // Slot 10
          const isNextTarget = slotNum === currentVisits + 1;

          return (
            <div
              key={slotNum}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all duration-300 border ${
                isStamped
                  ? isMilestone1
                    ? 'bg-gradient-to-br from-champagne-light via-champagne to-champagne-dark text-espresso border-champagne shadow-luxury-gold'
                    : isMilestone2
                    ? 'bg-gradient-to-br from-rosewood via-espresso to-cocoa text-linen border-champagne shadow-luxury-elevated'
                    : 'bg-linen-100 text-rosewood border-rosewood/30 shadow-sm'
                  : isNextTarget
                  ? 'bg-white border-dashed border-2 border-clay text-clay animate-pulse'
                  : 'bg-white/60 border-rosewood/15 text-espresso/30'
              }`}
            >
              {/* Slot Badge */}
              <span className="absolute top-1 left-1.5 text-[9px] font-semibold tracking-tighter opacity-70">
                #{slotNum}
              </span>

              {/* Icon Content */}
              {isStamped ? (
                <div className="flex flex-col items-center justify-center">
                  {isMilestone1 ? (
                    <Crown className="w-5 h-5 text-espresso animate-bounce" />
                  ) : isMilestone2 ? (
                    <Sparkles className="w-5 h-5 text-champagne animate-pulse" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-rosewood text-white flex items-center justify-center shadow-inner">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                  <span className="text-[9px] uppercase font-bold tracking-tight mt-1 text-center leading-none">
                    {isMilestone1 ? '50% OFF' : isMilestone2 ? 'FREE SET' : 'Stamped'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  {isMilestone1 ? (
                    <>
                      <Crown className="w-5 h-5 text-champagne/80 mb-0.5" />
                      <span className="text-[8px] font-bold tracking-tight text-clay uppercase">
                        50% OFF
                      </span>
                    </>
                  ) : isMilestone2 ? (
                    <>
                      <Gift className="w-5 h-5 text-rosewood/80 mb-0.5" />
                      <span className="text-[8px] font-bold tracking-tight text-rosewood uppercase">
                        Rs. 5,000
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 rounded-full border border-dashed border-espresso/30 flex items-center justify-center mb-0.5">
                        <span className="text-[9px] font-serif">{slotNum}</span>
                      </div>
                      <span className="text-[8px] uppercase tracking-wider text-espresso/40">
                        Visit
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Milestone Legend */}
      <div className="mt-4 pt-3 border-t border-rosewood/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-espresso/70">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-champagne"></span>
          <span>Visit 5: <strong>50% OFF Privilege</strong></span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rosewood"></span>
          <span>Visit 10: <strong>100% OFF Privilege (up to Rs. 5,000)</strong></span>
        </div>
      </div>
    </div>
  );
};
