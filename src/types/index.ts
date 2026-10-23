export type CurrencyCode = 'LKR' | 'USD';

export interface BrandConfig {
  studioName: string;
  tagline: string;
  editorialSubhead: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  whatsapp: string;
  instagramHandle: string;
  googleBusinessName: string;
  currency: {
    code: CurrencyCode;
    symbol: string;
    format: (amount: number) => string;
  };
  palette: {
    clayRose: string;
    rosewood: string;
    champagne: string;
    sageMist: string;
    boneLinen: string;
    espressoInk: string;
    cocoaNight: string;
  };
  loyaltyRules: {
    totalStamps: number;
    welcomeGiftEnabled: boolean;
    milestone1Visit: number;
    milestone1DiscountPct: number;
    milestone1Title: string;
    milestone2Visit: number;
    milestone2DiscountPct: number;
    milestone2MaxCapLKR: number;
    milestone2Title: string;
    nfcSecretToken: string;
    cooldownHours: number;
  };
  operatingHours: {
    days: string;
    hours: string;
    closedOnHolidays: boolean;
  };
}

export type TreatmentCategory =
  | 'Manicures'
  | 'Hand Massage'
  | 'Pedicures'
  | 'Foot Massage'
  | 'Acrylic Extensions'
  | 'Gel Extensions'
  | 'Nail Services'
  | "Men's Services"
  | "Kid's Services"
  | 'Add-ons';

export interface Service {
  id: string;
  title: string;
  category: TreatmentCategory;
  durationMinutes: number;
  priceLKR: number;
  description: string;
  formulaHighlights: string[];
  recommendedSpecialists?: string[];
  popular?: boolean;
  isAddon?: boolean;
  imageUrl?: string;
}

export interface StaffSpecialist {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  specialties: TreatmentCategory[];
  rating: number;
  reviewCount: number;
  experienceYears: number;
  active?: boolean;
}

export interface StampRecord {
  id: string;
  stampNumber: number;
  timestamp: string;
  method: 'NFC_TAP' | 'CAPACITIVE_STAMP' | 'STAFF_POS_PIN' | 'WELCOME_GIFT' | 'PAPER_CARD_MIGRATION';
  verifiedByStaffId?: string;
  notes?: string;
}

export interface LoyaltyReward {
  id: string;
  milestoneVisit: number;
  title: string;
  discountPercentage: number;
  maxCapLKR?: number;
  unlockedAt: string;
  redeemed: boolean;
  redeemedAt?: string;
  redeemedBookingId?: string;
  voucherCode: string;
}

export interface LoyaltyCustomerProfile {
  phone: string;
  fullName: string;
  email?: string;
  registeredAt: string;
  currentVisits: number;
  totalHistoricalVisits: number;
  stamps: StampRecord[];
  activeRewards: LoyaltyReward[];
  lastStampedAt?: string;
  preferredArtisanTea?: string;
  silentSessionPreference?: boolean;
  notes?: string;
}

export type TeaRitual = 
  | 'Ceylon Silver Tips with Osmanthus'
  | 'Warm Jasmine Lemongrass Infusion'
  | 'Roasted Genmaicha with Brown Rice'
  | 'Chilled White Peach & Elderflower'
  | 'Artisan Still Mineral Water';

export type BlockReasonCategory =
  | 'Personal Leave / Sick Leave'
  | 'Atelier Deep Cleaning & Autoclave Sterilization'
  | 'Emergency Maintenance'
  | 'Team Training & Masterclass'
  | 'Lunch / Rest Break'
  | 'Private VIP Buyout'
  | 'Other';

export interface BlockedTimeSlot {
  id: string;
  specialistId: string; // specialist ID or 'ALL'
  specialistName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "11:00 AM" or "01:00 PM"
  endTime: string; // e.g. "02:30 PM" or "03:00 PM"
  reasonCategory: BlockReasonCategory;
  specificDetails: string;
  createdAt: string;
  createdBy?: string;
}

export interface BookingRequest {
  id: string;
  createdAt: string;
  status: 'PENDING_HOLD' | 'CONFIRMED' | 'IN_SESSION' | 'COMPLETED' | 'CANCELLED';
  specialistId: string;
  specialistName: string;
  serviceIds: string[];
  services: Service[];
  date: string;
  timeSlot: string;
  totalDurationMinutes: number;
  originalPriceLKR: number;
  discountAppliedLKR: number;
  finalPriceLKR: number;
  appliedRewardId?: string;
  isWalkIn?: boolean;
  declineReason?: string;
  staffNotes?: string;
  rescheduledHistory?: Array<{
    previousDate: string;
    previousTimeSlot: string;
    previousSpecialistName: string;
    rescheduledAt: string;
    reason?: string;
  }>;
  guest: {
    fullName: string;
    phone: string;
    email?: string;
    preferredTea: TeaRitual;
    silentSession: boolean;
    moodboardUrl?: string;
    specialNotes?: string;
  };
  holdExpiresAt?: string;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  source: 'Google Verified Review' | 'Boutique Atelier Guest';
  reviewText: string;
  treatmentName: string;
  avatarUrl?: string;
}

export interface MediaReel {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  posterUrl: string;
  viewsDisplay: string;
  durationDisplay: string;
  treatmentPriceLKR: number;
  serviceId?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: TreatmentCategory | string;
  imageUrl: string;
  artisanName: string;
  treatmentDuration: string;
  priceLKR: number;
  formula: {
    chemicalBase: string;
    pigmentCode: string;
    apexStrengthRating: string;
    wearLongevity: string;
    cureTime: string;
  };
  tags: string[];
}
