import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingRequest, Service, StaffSpecialist, TeaRitual } from '../types';
import { DEFAULT_SERVICES, DEFAULT_SPECIALISTS, SalonDataService } from '../services/salonDataService';
import { BRAND_CONFIG } from '../config/brandConfig';

interface BookingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedSpecialist: StaffSpecialist | null;
  isFirstAvailableSpecialist: boolean;
  setSelectedSpecialist: (specialist: StaffSpecialist | null, isFirstAvailable?: boolean) => void;
  selectedServices: Service[];
  toggleService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
  holdSecondsRemaining: number;
  isHoldExpired: boolean;
  guestFullName: string;
  setGuestFullName: (name: string) => void;
  guestPhone: string;
  setGuestPhone: (phone: string) => void;
  guestEmail: string;
  setGuestEmail: (email: string) => void;
  preferredTea: TeaRitual;
  setPreferredTea: (tea: TeaRitual) => void;
  silentSession: boolean;
  setSilentSession: (silent: boolean) => void;
  specialNotes: string;
  setSpecialNotes: (notes: string) => void;
  moodboardFileName: string | null;
  setMoodboardFile: (name: string | null) => void;
  availableLoyaltyDiscountPct: number;
  appliedRewardId: string | null;
  calculatedOriginalPrice: number;
  calculatedDiscount: number;
  calculatedFinalPrice: number;
  calculatedTotalMinutes: number;
  confirmBooking: () => BookingRequest;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSpecialist, setSelectedSpecialistState] = useState<StaffSpecialist | null>(null);
  const [isFirstAvailableSpecialist, setIsFirstAvailableSpecialist] = useState<boolean>(true);
  const [selectedServices, setSelectedServices] = useState<Service[]>([DEFAULT_SERVICES[0]]);
  
  // Tomorrow's date default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');

  // 7-minute temporary hold countdown (420 seconds)
  const [holdSecondsRemaining, setHoldSecondsRemaining] = useState<number>(420);
  const [isHoldExpired, setIsHoldExpired] = useState<boolean>(false);

  // Guest dossier state
  const [guestFullName, setGuestFullName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [preferredTea, setPreferredTea] = useState<TeaRitual>('Ceylon Silver Tips with Osmanthus');
  const [silentSession, setSilentSession] = useState<boolean>(false);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [moodboardFileName, setMoodboardFile] = useState<string | null>(null);

  // Auto-fill from active device memory if available
  useEffect(() => {
    const savedPhone = SalonDataService.getActivePhone();
    if (savedPhone) {
      const profile = SalonDataService.getProfileByPhone(savedPhone);
      if (profile) {
        setGuestPhone(profile.phone);
        setGuestFullName(profile.fullName);
        if (profile.email) setGuestEmail(profile.email);
        if (profile.preferredArtisanTea) setPreferredTea(profile.preferredArtisanTea as TeaRitual);
        if (typeof profile.silentSessionPreference === 'boolean') {
          setSilentSession(profile.silentSessionPreference);
        }
      }
    }
  }, []);

  // 7-minute hold timer countdown active on Step 3 & 4
  useEffect(() => {
    if (currentStep < 3) {
      setHoldSecondsRemaining(420);
      setIsHoldExpired(false);
      return;
    }

    const timer = setInterval(() => {
      setHoldSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsHoldExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, selectedTimeSlot, selectedDate]);

  const setSelectedSpecialist = (specialist: StaffSpecialist | null, isFirstAvailable = false) => {
    setSelectedSpecialistState(specialist);
    setIsFirstAvailableSpecialist(isFirstAvailable);
  };

  const toggleService = (service: Service) => {
    setSelectedServices(prev => {
      const exists = prev.some(s => s.id === service.id);
      if (exists) {
        if (prev.length <= 1) return prev; // At least one service required
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(s => s.id !== serviceId);
    });
  };

  // Check Loyalty Reward eligibility for guestPhone
  let availableLoyaltyDiscountPct = 0;
  let appliedRewardId: string | null = null;
  let maxCapLKR: number | undefined = undefined;

  const currentProfile = guestPhone ? SalonDataService.getProfileByPhone(guestPhone) : null;
  if (currentProfile) {
    const unredeemedReward = currentProfile.activeRewards.find(r => !r.redeemed);
    if (unredeemedReward) {
      availableLoyaltyDiscountPct = unredeemedReward.discountPercentage;
      appliedRewardId = unredeemedReward.id;
      maxCapLKR = unredeemedReward.maxCapLKR;
    }
  }

  // Calculations
  const calculatedOriginalPrice = selectedServices.reduce((sum, s) => sum + s.priceLKR, 0);
  const calculatedTotalMinutes = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  let rawDiscount = (calculatedOriginalPrice * availableLoyaltyDiscountPct) / 100;
  if (maxCapLKR && rawDiscount > maxCapLKR) {
    rawDiscount = maxCapLKR;
  }
  const calculatedDiscount = Math.round(rawDiscount);
  const calculatedFinalPrice = Math.max(0, calculatedOriginalPrice - calculatedDiscount);

  const confirmBooking = (): BookingRequest => {
    // Client-side validation: server-side validation required here in production
    const assignedSpecialist = selectedSpecialist || DEFAULT_SPECIALISTS[0];

    const booking = SalonDataService.createBooking({
      specialistId: assignedSpecialist.id,
      specialistName: isFirstAvailableSpecialist ? `First Available (${assignedSpecialist.name})` : assignedSpecialist.name,
      serviceIds: selectedServices.map(s => s.id),
      services: selectedServices,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      totalDurationMinutes: calculatedTotalMinutes,
      originalPriceLKR: calculatedOriginalPrice,
      discountAppliedLKR: calculatedDiscount,
      finalPriceLKR: calculatedFinalPrice,
      appliedRewardId: appliedRewardId || undefined,
      guest: {
        fullName: guestFullName.trim() || 'Valued Guest',
        phone: guestPhone.trim(),
        email: guestEmail.trim() || undefined,
        preferredTea,
        silentSession,
        moodboardUrl: moodboardFileName ? `/uploads/${moodboardFileName}` : undefined,
        specialNotes: specialNotes.trim() || undefined,
      },
    });

    return booking;
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedSpecialistState(null);
    setIsFirstAvailableSpecialist(true);
    setSelectedServices([DEFAULT_SERVICES[0]]);
    setHoldSecondsRemaining(420);
    setIsHoldExpired(false);
  };

  return (
    <BookingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        selectedSpecialist,
        isFirstAvailableSpecialist,
        setSelectedSpecialist,
        selectedServices,
        toggleService,
        removeService,
        selectedDate,
        setSelectedDate,
        selectedTimeSlot,
        setSelectedTimeSlot,
        holdSecondsRemaining,
        isHoldExpired,
        guestFullName,
        setGuestFullName,
        guestPhone,
        setGuestPhone,
        guestEmail,
        setGuestEmail,
        preferredTea,
        setPreferredTea,
        silentSession,
        setSilentSession,
        specialNotes,
        setSpecialNotes,
        moodboardFileName,
        setMoodboardFile,
        availableLoyaltyDiscountPct,
        appliedRewardId,
        calculatedOriginalPrice,
        calculatedDiscount,
        calculatedFinalPrice,
        calculatedTotalMinutes,
        confirmBooking,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
