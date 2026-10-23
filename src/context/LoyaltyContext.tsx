import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LoyaltyCustomerProfile, LoyaltyReward, StampRecord } from '../types';
import { SalonDataService } from '../services/salonDataService';
import { BRAND_CONFIG } from '../config/brandConfig';
import { playMilestoneFanfare, playStampImpactSound, triggerHapticFeedback } from '../utils/dopamineEngine';

interface LoyaltyContextType {
  activePhone: string | null;
  profile: LoyaltyCustomerProfile | null;
  isLoading: boolean;
  demoBypassCooldown: boolean;
  setDemoBypassCooldown: (bypass: boolean) => void;
  celebration: {
    isOpen: boolean;
    reward: LoyaltyReward | null;
    stampNumber: number;
    isWelcomeBonus: boolean;
  } | null;
  closeCelebration: () => void;
  loginByPhone: (phone: string) => boolean;
  logoutDeviceMemory: () => void;
  registerNewMember: (phone: string, fullName: string, email?: string) => LoyaltyCustomerProfile;
  stampActiveCard: (method: StampRecord['method'], overrideCooldown?: boolean) => { success: boolean; reason?: string };
  refreshProfile: () => void;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export const LoyaltyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePhone, setActivePhoneState] = useState<string | null>(null);
  const [profile, setProfile] = useState<LoyaltyCustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoBypassCooldown, setDemoBypassCooldown] = useState<boolean>(true); // Enabled by default for pitch presentations
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    reward: LoyaltyReward | null;
    stampNumber: number;
    isWelcomeBonus: boolean;
  } | null>(null);

  const loadActiveProfile = useCallback(() => {
    const phone = SalonDataService.getActivePhone();
    setActivePhoneState(phone);
    if (phone) {
      const p = SalonDataService.getProfileByPhone(phone);
      setProfile(p);
    } else {
      setProfile(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadActiveProfile();

    const handleStorageChange = () => {
      loadActiveProfile();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadActiveProfile]);

  const loginByPhone = (phone: string): boolean => {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const found = SalonDataService.getProfileByPhone(cleanPhone);
    if (found) {
      SalonDataService.setActivePhone(cleanPhone);
      setActivePhoneState(cleanPhone);
      setProfile(found);
      return true;
    }
    return false;
  };

  const logoutDeviceMemory = () => {
    SalonDataService.clearActivePhone();
    setActivePhoneState(null);
    setProfile(null);
  };

  const registerNewMember = (phone: string, fullName: string, email?: string): LoyaltyCustomerProfile => {
    // Client-side validation: server-side validation required here in production
    const newProfile = SalonDataService.registerNewGuest(phone, fullName, email);
    setActivePhoneState(newProfile.phone);
    setProfile(newProfile);

    // Trigger celebration for Endowed Progress Stamp #1
    playStampImpactSound();
    triggerHapticFeedback('stamp');
    setCelebration({
      isOpen: true,
      reward: null,
      stampNumber: 1,
      isWelcomeBonus: true,
    });

    return newProfile;
  };

  const stampActiveCard = (
    method: StampRecord['method'],
    overrideCooldown = false
  ): { success: boolean; reason?: string } => {
    if (!profile) {
      return { success: false, reason: 'No active member profile found on this device.' };
    }

    // Cooldown check (Anti-cheat 12-hour limit unless bypassed)
    if (!demoBypassCooldown && !overrideCooldown && profile.lastStampedAt) {
      const lastStampTime = new Date(profile.lastStampedAt).getTime();
      const now = Date.now();
      const hoursSince = (now - lastStampTime) / (1000 * 60 * 60);
      if (hoursSince < BRAND_CONFIG.loyaltyRules.cooldownHours) {
        const remainingHours = Math.ceil(BRAND_CONFIG.loyaltyRules.cooldownHours - hoursSince);
        return {
          success: false,
          reason: `Security Cooldown: Atelier stamps are limited to 1 per visit. Please return in ${remainingHours} hour(s) or toggle Pitch Bypass.`,
        };
      }
    }

    try {
      const { profile: updated, newRewardUnlocked } = SalonDataService.addStamp(
        profile.phone,
        method,
        'STAFF-ATELIER-1',
        'In-Salon Checkout Stamp'
      );

      setProfile(updated);

      // Dopamine Sensory Audio & Haptic orchestration
      if (newRewardUnlocked) {
        playMilestoneFanfare();
        triggerHapticFeedback('milestone');
      } else {
        playStampImpactSound();
        triggerHapticFeedback('stamp');
      }

      setCelebration({
        isOpen: true,
        reward: newRewardUnlocked,
        stampNumber: updated.currentVisits,
        isWelcomeBonus: false,
      });

      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to stamp card';
      return { success: false, reason: errorMsg };
    }
  };

  const closeCelebration = () => {
    setCelebration(null);
  };

  const refreshProfile = () => {
    loadActiveProfile();
  };

  return (
    <LoyaltyContext.Provider
      value={{
        activePhone,
        profile,
        isLoading,
        demoBypassCooldown,
        setDemoBypassCooldown,
        celebration,
        closeCelebration,
        loginByPhone,
        logoutDeviceMemory,
        registerNewMember,
        stampActiveCard,
        refreshProfile,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};
