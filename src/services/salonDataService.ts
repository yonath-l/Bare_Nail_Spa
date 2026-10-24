import { asset } from '../utils/assetHelper';
/**
 * Dual-Mode Salon Data Service & State Management
 * Default: Client Pitch/Demo Mode with localStorage & multi-tab storage events
 * Production: Adapters for Supabase (PostgreSQL + Realtime) & Twilio/Notify.lk SMS
 *
 * Security & Arch Rules Enforced:
 * 1. Form validation: Client-side present; server-side validation required here in production.
 * 2. No unsanitized rendering: Text is handled as plain data.
 * 3. No debug console.logs of user data or tokens.
 * 4. Pinned TODOs with date 2026-10-21 for production backend integration.
 */

import {
  BookingRequest,
  CustomerReview,
  GalleryItem,
  LoyaltyCustomerProfile,
  LoyaltyReward,
  MediaReel,
  Service,
  StaffSpecialist,
  StampRecord,
  BlockedTimeSlot,
  BlockReasonCategory,
} from '../types';
import { BRAND_CONFIG } from '../config/brandConfig';

const STORAGE_KEYS = {
  ACTIVE_PHONE: 'bare_active_customer_phone',
  PROFILES: 'bare_loyalty_profiles',
  BOOKINGS: 'bare_salon_bookings',
  BLOCKED_TIMES: 'bare_salon_blocked_times',
  SMS_OUTBOX: 'bare_sms_outbox',
  CUSTOM_RULES: 'bare_custom_loyalty_rules',
  ADMIN_TOKEN: 'bare_admin_auth_token',
  SERVICES: 'bare_salon_services',
  SPECIALISTS: 'bare_salon_specialists',
  REVIEWS: 'bare_salon_reviews',
  GALLERY: 'bare_salon_gallery',
  MEDIA_REELS: 'bare_salon_media_reels',
};

// Default Services Menu (Exact official rates from Bare Nail Spa Price List)
export const DEFAULT_SERVICES: Service[] = [
  // 1. MANICURES
  {
    id: 'srv-m-1',
    title: 'Express Manicure (Normal Color)',
    category: 'Manicures',
    durationMinutes: 45,
    priceLKR: 3000,
    description: 'Shaping, soaking, cleaning, cuticle trimming, scrub, and lotion.',
    formulaHighlights: ['Precision Shaping', 'Soaking & Cleansing', 'Cuticle Trimming', 'Aromatic Scrub & Lotion', 'Normal Color'],
  },
  {
    id: 'srv-m-2',
    title: 'Express Manicure (Gel Color)',
    category: 'Manicures',
    durationMinutes: 45,
    priceLKR: 5000,
    description: 'Shaping, soaking, cleaning, cuticle trimming, scrub, and long-wear gel color application.',
    formulaHighlights: ['Precision Shaping', 'Cuticle Trimming', 'Aromatic Scrub', 'UV/LED Gel Color'],
    popular: true,
  },
  {
    id: 'srv-m-3',
    title: 'Signature Manicure (Normal Color)',
    category: 'Manicures',
    durationMinutes: 60,
    priceLKR: 4000,
    description: 'Shaping, soaking, cleaning, cuticle trimming, scrub, steaming, 10 min massage, saffron pack, and lotion.',
    formulaHighlights: ['Warm Steaming', '10 Min Hand Massage', 'Nourishing Saffron Pack', 'Lotion Hydration', 'Normal Color'],
  },
  {
    id: 'srv-m-4',
    title: 'Signature Manicure (Gel Color)',
    category: 'Manicures',
    durationMinutes: 60,
    priceLKR: 6000,
    description: 'Shaping, soaking, cleaning, cuticle trimming, scrub, steaming, 10 min massage, saffron pack, and long-wear gel color.',
    formulaHighlights: ['Warm Steaming', '10 Min Hand Massage', 'Nourishing Saffron Pack', 'UV/LED Gel Color'],
    popular: true,
  },
  {
    id: 'srv-m-5',
    title: 'Spa Manicure (Normal Color)',
    category: 'Manicures',
    durationMinutes: 75,
    priceLKR: 5000,
    description: 'Shaping, soaking, cleaning, steaming, cuticle trimming, gold scrub, 20 min massage, gold pack, and lotion.',
    formulaHighlights: ['Warm Steaming', 'Luxe Gold Scrub', '20 Min Hand Massage', 'Radiant Gold Pack', 'Normal Color'],
  },
  {
    id: 'srv-m-6',
    title: 'Spa Manicure (Gel Color)',
    category: 'Manicures',
    durationMinutes: 75,
    priceLKR: 7000,
    description: 'Shaping, soaking, cleaning, steaming, cuticle trimming, gold scrub, 20 min massage, gold pack, and mirror-shine gel color.',
    formulaHighlights: ['Warm Steaming', 'Luxe Gold Scrub', '20 Min Hand Massage', 'Radiant Gold Pack', 'UV/LED Gel Color'],
    popular: true,
  },

  // 2. HAND MASSAGE
  {
    id: 'srv-hm-1',
    title: 'Hand Massage (30 Mins)',
    category: 'Hand Massage',
    durationMinutes: 30,
    priceLKR: 3000,
    description: 'Therapeutic and relaxing 30-minute hand and lower arm massage relieving tension and improving circulation.',
    formulaHighlights: ['30 Min Massage', 'Essential Oils', 'Tension Relief'],
  },
  {
    id: 'srv-hm-2',
    title: 'Hand Massage (45 Mins)',
    category: 'Hand Massage',
    durationMinutes: 45,
    priceLKR: 4400,
    description: 'Deep restorative 45-minute hand and arm massage with targeted acupressure and intensive hydration.',
    formulaHighlights: ['45 Min Deep Massage', 'Botanical Balm', 'Acupressure Circulation'],
  },

  // 3. PEDICURES
  {
    id: 'srv-p-1',
    title: 'Express Pedicure (Normal Color)',
    category: 'Pedicures',
    durationMinutes: 45,
    priceLKR: 3500,
    description: 'Shaping, soaking, cleaning, cuticle trimming, scrub, and lotion.',
    formulaHighlights: ['Foot Soak', 'Precision Shaping', 'Cuticle Trimming', 'Exfoliating Scrub', 'Normal Color'],
  },
  {
    id: 'srv-p-2',
    title: 'Express Pedicure (Gel Color)',
    category: 'Pedicures',
    durationMinutes: 45,
    priceLKR: 5500,
    description: 'Shaping, soaking, cleaning, cuticle trimming, scrub, and durable gel color application.',
    formulaHighlights: ['Foot Soak', 'Cuticle Trimming', 'Exfoliating Scrub', 'UV/LED Gel Color'],
    popular: true,
  },
  {
    id: 'srv-p-3',
    title: 'Signature Pedicure (Normal Color)',
    category: 'Pedicures',
    durationMinutes: 60,
    priceLKR: 4500,
    description: 'Shaping, soaking, cleaning, cuticle trimming, scrub, steaming, 10 min massage, saffron pack, and lotion.',
    formulaHighlights: ['Warm Steaming', '10 Min Foot Massage', 'Saffron Foot Pack', 'Lotion Hydration', 'Normal Color'],
  },
  {
    id: 'srv-p-4',
    title: 'Signature Pedicure (Gel Color)',
    category: 'Pedicures',
    durationMinutes: 60,
    priceLKR: 6500,
    description: 'Shaping, soaking, cleaning, cuticle trimming, scrub, steaming, 10 min massage, saffron pack, and gel color.',
    formulaHighlights: ['Warm Steaming', '10 Min Foot Massage', 'Saffron Foot Pack', 'UV/LED Gel Color'],
    popular: true,
  },
  {
    id: 'srv-p-5',
    title: 'Spa Pedicure (Normal Color)',
    category: 'Pedicures',
    durationMinutes: 75,
    priceLKR: 5500,
    description: 'Shaping, soaking, cleaning, steaming, cuticle trimming, gold scrub, 20 min massage, gold pack, and lotion.',
    formulaHighlights: ['Warm Steaming', 'Luxe Gold Foot Scrub', '20 Min Foot Massage', 'Gold Pack Hydration', 'Normal Color'],
  },
  {
    id: 'srv-p-6',
    title: 'Spa Pedicure (Gel Color)',
    category: 'Pedicures',
    durationMinutes: 75,
    priceLKR: 7500,
    description: 'Shaping, soaking, cleaning, steaming, cuticle trimming, gold scrub, 20 min massage, gold pack, and gel color.',
    formulaHighlights: ['Warm Steaming', 'Luxe Gold Foot Scrub', '20 Min Foot Massage', 'Gold Pack Hydration', 'UV/LED Gel Color'],
    popular: true,
  },

  // 4. FOOT MASSAGE
  {
    id: 'srv-fm-1',
    title: 'Foot Massage (30 Mins)',
    category: 'Foot Massage',
    durationMinutes: 30,
    priceLKR: 3500,
    description: 'Revitalizing 30-minute therapeutic foot massage alleviating fatigue and restoring natural vitality.',
    formulaHighlights: ['30 Min Foot Massage', 'Calming Botanical Oils', 'Arch & Heel Relief'],
  },
  {
    id: 'srv-fm-2',
    title: 'Foot Massage (45 Mins)',
    category: 'Foot Massage',
    durationMinutes: 45,
    priceLKR: 5100,
    description: 'Comprehensive 45-minute deep tissue foot and calf massage with reflexology pressure points.',
    formulaHighlights: ['45 Min Intensive Massage', 'Calf & Ankle Release', 'Reflexology Stimulation'],
  },

  // 5. ACRYLIC EXTENSIONS
  {
    id: 'srv-ae-1',
    title: 'Acrylic Extensions (Gel Color)',
    category: 'Acrylic Extensions',
    durationMinutes: 90,
    priceLKR: 7000,
    description: 'Full set sculpted acrylic nail extensions tailored to desired length and shape, finished with gel color.',
    formulaHighlights: ['Durable Polymer Matrix', 'Custom Apex Shaping', 'High-Gloss Gel Finish'],
    popular: true,
  },
  {
    id: 'srv-ae-2',
    title: 'Acrylic Extensions (Gel French)',
    category: 'Acrylic Extensions',
    durationMinutes: 105,
    priceLKR: 7500,
    description: 'Full sculpted acrylic extensions featuring crisp, hand-painted classic French smile lines in gel.',
    formulaHighlights: ['Hand-Painted Smile Lines', 'Custom Nail Length', 'Classic French Elegance'],
  },
  {
    id: 'srv-ae-3',
    title: 'Acrylic on Natural Nails',
    category: 'Acrylic Extensions',
    durationMinutes: 60,
    priceLKR: 5500,
    description: 'Reinforcing acrylic overlay sculpted directly onto your natural nails for breakage prevention.',
    formulaHighlights: ['Natural Nail Overlay', 'Apex Reinforcement', 'Anti-Breakage Shield'],
  },
  {
    id: 'srv-ae-4',
    title: 'Acrylic Refill (Gel Color)',
    category: 'Acrylic Extensions',
    durationMinutes: 60,
    priceLKR: 5500,
    description: 'Maintenance fill for acrylic regrowth with rebalancing and fresh gel color application.',
    formulaHighlights: ['Regrowth Gap Infill', 'Apex Rebalancing', 'Fresh Gel Coat'],
  },
  {
    id: 'srv-ae-5',
    title: 'Acrylic Refill (Gel French)',
    category: 'Acrylic Extensions',
    durationMinutes: 75,
    priceLKR: 6000,
    description: 'Acrylic infill maintenance with rebalancing and fresh hand-painted gel French tips.',
    formulaHighlights: ['Refill Maintenance', 'French Line Redefinition', 'Long-Lasting Seal'],
  },
  {
    id: 'srv-ae-6',
    title: 'Acrylic Extensions (One Nail)',
    category: 'Acrylic Extensions',
    durationMinutes: 15,
    priceLKR: 750,
    description: 'Single nail acrylic extension repair or replacement.',
    formulaHighlights: ['Single Nail Fix', 'Seamless Blend', 'Quick Restoration'],
  },

  // 6. GEL EXTENSIONS
  {
    id: 'srv-ge-1',
    title: 'Gel Extensions (Gel Color)',
    category: 'Gel Extensions',
    durationMinutes: 90,
    priceLKR: 8000,
    description: 'Full sculpted hard gel extensions sculpted on forms, finished with premium UV/LED gel color.',
    formulaHighlights: ['Crystal-Clear Hard Gel', 'Flexible Glass Feel', 'Chip-Free Longevity'],
    popular: true,
  },
  {
    id: 'srv-ge-2',
    title: 'Gel Extensions (Gel French)',
    category: 'Gel Extensions',
    durationMinutes: 105,
    priceLKR: 8500,
    description: 'Sculpted hard gel extensions with precision hand-painted French smile lines.',
    formulaHighlights: ['Precision Smile Lines', 'Lightweight Structure', 'Haute European French'],
  },
  {
    id: 'srv-ge-3',
    title: 'Gel on Natural Nails',
    category: 'Gel Extensions',
    durationMinutes: 60,
    priceLKR: 6500,
    description: 'Protective hard gel structured overlay sculpted over natural nails for high strength.',
    formulaHighlights: ['Natural Nail Shield', 'Hard Gel Formula', 'Zero Peeling'],
  },
  {
    id: 'srv-ge-4',
    title: 'Gel Refill (Gel Color)',
    category: 'Gel Extensions',
    durationMinutes: 60,
    priceLKR: 6500,
    description: 'Hard gel regrowth maintenance with structural rebalancing and fresh gel color.',
    formulaHighlights: ['Structural Rebalance', 'Infill Detailing', 'Fresh Gel Cure'],
  },
  {
    id: 'srv-ge-5',
    title: 'Gel Refill (Gel French)',
    category: 'Gel Extensions',
    durationMinutes: 75,
    priceLKR: 7000,
    description: 'Hard gel regrowth maintenance with rebalancing and fresh hand-painted French tips.',
    formulaHighlights: ['Regrowth Maintenance', 'Hand-Painted Tips', 'Mirror Shine Seal'],
  },
  {
    id: 'srv-ge-6',
    title: 'Gel Extensions (One Nail)',
    category: 'Gel Extensions',
    durationMinutes: 15,
    priceLKR: 850,
    description: 'Single nail sculpted hard gel repair or replacement.',
    formulaHighlights: ['Single Nail Sculpt', 'Zero Damage Repair', 'Flawless Contour'],
  },
  {
    id: 'srv-ge-7',
    title: 'Gel X Full Set',
    category: 'Gel Extensions',
    durationMinutes: 75,
    priceLKR: 7000,
    description: 'Full set of soft gel Gel-X extensions applied seamlessly with soak-off gel adhesive.',
    formulaHighlights: ['Full Cover Soft Gel', 'Fast Gentle Application', 'Natural Curve & Feel'],
    popular: true,
  },
  {
    id: 'srv-ge-8',
    title: 'BIAB on Natural Nails',
    category: 'Gel Extensions',
    durationMinutes: 75,
    priceLKR: 8000,
    description: 'Builder In A Bottle structured overlay reinforcing natural apex and supporting nail growth.',
    formulaHighlights: ['Builder In A Bottle', 'Apex Reinforcement', 'Promotes Natural Growth'],
    popular: true,
  },
  {
    id: 'srv-ge-9',
    title: 'BIAB Refill',
    category: 'Gel Extensions',
    durationMinutes: 60,
    priceLKR: 7000,
    description: 'BIAB regrowth infill, apex rebalance, and fresh protective high-gloss seal.',
    formulaHighlights: ['Apex Correction', 'Infill Seamless Blend', 'High Flexibility'],
  },
  {
    id: 'srv-ge-10',
    title: 'Dipping Nails',
    category: 'Gel Extensions',
    durationMinutes: 60,
    priceLKR: 6500,
    description: 'Vitamin-infused dipping powder overlay providing durable natural strength without UV curing.',
    formulaHighlights: ['Vitamin Enriched', 'No UV Light Required', 'Crack-Resistant Armor'],
  },

  // 7. NAIL SERVICES
  {
    id: 'srv-ns-1',
    title: 'Normal Color Application',
    category: 'Nail Services',
    durationMinutes: 20,
    priceLKR: 1500,
    description: 'Classic nail polish application with high-pigment breathable lacquer.',
    formulaHighlights: ['Classic Enamel', 'Rapid Dry Topcoat', 'Even Pigment'],
  },
  {
    id: 'srv-ns-2',
    title: 'Normal Color Application (with Shaping, Buffing, Cuticle Oil)',
    category: 'Nail Services',
    durationMinutes: 30,
    priceLKR: 1800,
    description: 'Normal color application complete with precision edge shaping, surface buffing, and nourishing cuticle oil.',
    formulaHighlights: ['Precision Shaping', 'Micro-Buffing', 'Nourishing Cuticle Oil', 'Normal Lacquer'],
  },
  {
    id: 'srv-ns-3',
    title: 'Gel Color Application',
    category: 'Nail Services',
    durationMinutes: 30,
    priceLKR: 2500,
    description: 'UV/LED cured gel color application with mirror shine and chip-resistant wear.',
    formulaHighlights: ['Dual LED Cure', 'High-Gloss Topcoat', '14+ Day Wear'],
    popular: true,
  },
  {
    id: 'srv-ns-4',
    title: 'Gel Color Application (with Shaping, Buffing, Cuticle Oil)',
    category: 'Nail Services',
    durationMinutes: 40,
    priceLKR: 2800,
    description: 'Gel color application including nail contour shaping, surface buffing, and organic cuticle oil hydration.',
    formulaHighlights: ['Nail Shaping', 'Gentle Buffing', 'Cuticle Nourishment', 'UV/LED Gel Color'],
    popular: true,
  },
  {
    id: 'srv-ns-5',
    title: 'Gel French Application',
    category: 'Nail Services',
    durationMinutes: 35,
    priceLKR: 3000,
    description: 'Classic French manicure gel application with crisp white or colored smile lines.',
    formulaHighlights: ['Crisp Smile Lines', 'UV/LED Gel Seal', 'Timeless Elegance'],
  },
  {
    id: 'srv-ns-6',
    title: 'Gel French Application (with Shaping, Buffing, Cuticle Oil)',
    category: 'Nail Services',
    durationMinutes: 45,
    priceLKR: 3300,
    description: 'Gel French application with detailed nail shaping, buffer shine prep, and cuticle oil treatment.',
    formulaHighlights: ['French Detailing', 'Nail Edge Shaping', 'Buffing Prep', 'Cuticle Oil'],
  },
  {
    id: 'srv-ns-7',
    title: 'Temporary Set (Gel Color)',
    category: 'Nail Services',
    durationMinutes: 45,
    priceLKR: 5000,
    description: 'Full temporary nail tip set finished with vibrant gel polish.',
    formulaHighlights: ['Temporary Tips Set', 'Occasion Ready', 'Gel Polish Finish'],
  },
  {
    id: 'srv-ns-8',
    title: 'Temporary Set (Gel French)',
    category: 'Nail Services',
    durationMinutes: 55,
    priceLKR: 5500,
    description: 'Full temporary tip set styled with classic hand-painted gel French tips.',
    formulaHighlights: ['Temporary Tips Set', 'Classic French Tips', 'Event Ready'],
  },
  {
    id: 'srv-ns-9',
    title: 'Temporary (One Nail)',
    category: 'Nail Services',
    durationMinutes: 10,
    priceLKR: 300,
    description: 'Single temporary nail tip application or repair.',
    formulaHighlights: ['Single Tip Fix', 'Quick Replacement'],
  },
  {
    id: 'srv-ns-10',
    title: 'Gel Color Removal',
    category: 'Nail Services',
    durationMinutes: 20,
    priceLKR: 1000,
    description: 'Gentle soak-off gel polish removal preserving natural nail keratin integrity.',
    formulaHighlights: ['Gentle Acetone Wrap', 'Nail Bed Preservation', 'Conditioning Finish'],
  },
  {
    id: 'srv-ns-11',
    title: 'Acrylic Extension Soak Off',
    category: 'Nail Services',
    durationMinutes: 30,
    priceLKR: 1500,
    description: 'Professional acrylic soak-off removal followed by gentle buffing and nail conditioning.',
    formulaHighlights: ['Safe Acrylic Dissolution', 'Zero Mechanical Scraping', 'Hydration Prep'],
  },
  {
    id: 'srv-ns-12',
    title: 'BIAB Removal',
    category: 'Nail Services',
    durationMinutes: 30,
    priceLKR: 2500,
    description: 'Careful e-file and soak removal of structured builder gel with nourishing treatment.',
    formulaHighlights: ['Specialized BIAB Soak', 'Keratin Protection', 'Surface Smoothing'],
  },
  {
    id: 'srv-ns-13',
    title: 'Gel X Removal',
    category: 'Nail Services',
    durationMinutes: 25,
    priceLKR: 2000,
    description: 'Safe soak-off removal of Gel-X soft gel extensions.',
    formulaHighlights: ['Full Soak-Off', 'Gentle Removal', 'Natural Nail Care'],
  },
  {
    id: 'srv-ns-14',
    title: 'Dipping Soak Off',
    category: 'Nail Services',
    durationMinutes: 25,
    priceLKR: 2000,
    description: 'Thorough soak-off removal of dipping powder overlay.',
    formulaHighlights: ['Powder Dissolution', 'Cuticle Hydration', 'Buffing Finish'],
  },

  // 8. MEN'S SERVICES
  {
    id: 'srv-ms-1',
    title: "Cut and File (Men's)",
    category: "Men's Services",
    durationMinutes: 20,
    priceLKR: 1500,
    description: 'Clean, masculine grooming: precision nail trimming, shaping, and buffing.',
    formulaHighlights: ['Nail Clipping', 'Precision Edge File', 'Matte Buffing'],
  },
  {
    id: 'srv-ms-2',
    title: "Express Manicure (Men's)",
    category: "Men's Services",
    durationMinutes: 35,
    priceLKR: 3500,
    description: 'Warm water soak, nail shaping, cuticle cleanup, scrub, and light matte lotion.',
    formulaHighlights: ['Cuticle Neatening', 'Gentle Hand Scrub', 'Hydrating Lotion'],
  },
  {
    id: 'srv-ms-3',
    title: "Signature Manicure (Men's)",
    category: "Men's Services",
    durationMinutes: 50,
    priceLKR: 4500,
    description: 'Detailed grooming with warm steam, saffron treatment pack, scrub, and relaxing 10-min massage.',
    formulaHighlights: ['Warm Steaming', 'Saffron Treatment Pack', '10 Min Massage'],
  },
  {
    id: 'srv-ms-4',
    title: "Spa Manicure (Men's)",
    category: "Men's Services",
    durationMinutes: 65,
    priceLKR: 5500,
    description: 'Deluxe hand ritual with gold scrub, gold mask pack, warm steam, and 20-min massage.',
    formulaHighlights: ['Luxe Gold Scrub', '20 Min Hand Massage', 'Gold Mask Pack'],
  },
  {
    id: 'srv-ms-5',
    title: "Express Pedicure (Men's)",
    category: "Men's Services",
    durationMinutes: 40,
    priceLKR: 4000,
    description: 'Revitalizing foot soak, nail shaping, cuticle neatening, scrub, and hydrating lotion.',
    formulaHighlights: ['Foot Soak', 'Callus Softening', 'Moisturizing Cream'],
  },
  {
    id: 'srv-ms-6',
    title: "Signature Pedicure (Men's)",
    category: "Men's Services",
    durationMinutes: 55,
    priceLKR: 5000,
    description: 'Foot soak, steam, saffron foot pack, exfoliating scrub, and relaxing 10-min foot massage.',
    formulaHighlights: ['Warm Steaming', 'Saffron Foot Pack', '10 Min Foot Massage'],
  },
  {
    id: 'srv-ms-7',
    title: "Spa Pedicure (Men's)",
    category: "Men's Services",
    durationMinutes: 70,
    priceLKR: 6000,
    description: 'Comprehensive foot care featuring gold scrub, gold foot pack, steam, and 20-min massage.',
    formulaHighlights: ['Gold Scrub & Pack', 'Steam Detox', '20 Min Deep Massage'],
  },

  // 9. KID'S SERVICES
  {
    id: 'srv-ks-1',
    title: "Normal Color Application (Kid's)",
    category: "Kid's Services",
    durationMinutes: 15,
    priceLKR: 1200,
    description: 'Delicate, non-toxic water-permeable normal polish in playful shades.',
    formulaHighlights: ['Non-Toxic Polish', 'Gentle Application', 'Playful Shades'],
  },
  {
    id: 'srv-ks-2',
    title: "Gel Color Application (Kid's)",
    category: "Kid's Services",
    durationMinutes: 25,
    priceLKR: 2200,
    description: 'Gentle, fast-curing gel polish application with smooth edges and glossy shine.',
    formulaHighlights: ['Low-Heat LED Cure', 'Smooth Edges', 'Longer Lasting'],
  },
  {
    id: 'srv-ks-3',
    title: "Kid's Manicure",
    category: "Kid's Services",
    durationMinutes: 30,
    priceLKR: 2500,
    description: 'Mini-manicure with soft nail trim, gentle cuticle care, light lotion, and nail styling.',
    formulaHighlights: ['Gentle Nail Shaping', 'Light Hand Lotion', 'Careful Touch'],
  },
  {
    id: 'srv-ks-4',
    title: "Kid's Pedicure",
    category: "Kid's Services",
    durationMinutes: 35,
    priceLKR: 3000,
    description: 'Warm bubble foot soak, mini-pedicure, gentle shaping, and hydrating fruit lotion.',
    formulaHighlights: ['Warm Bubble Soak', 'Gentle Foot Care', 'Hydrating Lotion'],
  },
  {
    id: 'srv-ks-5',
    title: "Cut and File (Kid's)",
    category: "Kid's Services",
    durationMinutes: 15,
    priceLKR: 1500,
    description: 'Quick, safe trimming and soft filing for tidy, neat nails.',
    formulaHighlights: ['Safe Trim', 'Soft Emery Board', 'Smooth Edges'],
  },

  // ADD-ONS
  {
    id: 'srv-ao-1',
    title: 'Hand Mask',
    category: 'Add-ons',
    durationMinutes: 15,
    priceLKR: 1000,
    isAddon: true,
    description: 'Intensive moisture-infusing hand mask treatment for velvety soft hands.',
    formulaHighlights: ['Deep Hydration', 'Velvet Softness'],
  },
  {
    id: 'srv-ao-2',
    title: 'Hand Pack',
    category: 'Add-ons',
    durationMinutes: 10,
    priceLKR: 500,
    isAddon: true,
    description: 'Nourishing herbal hand pack to restore essential skin vitamins.',
    formulaHighlights: ['Vitamin Nourishment', 'Fast Recovery'],
  },
  {
    id: 'srv-ao-3',
    title: 'Paraffin Treatment (Hands / Feet)',
    category: 'Add-ons',
    durationMinutes: 20,
    priceLKR: 2500,
    isAddon: true,
    description: 'Warm therapeutic paraffin wax dip locking in thermal moisture for dry hands or feet.',
    formulaHighlights: ['Thermal Heat Therapy', 'Deep Cuticle Recovery'],
  },
  {
    id: 'srv-ao-4',
    title: 'Disposable Manicure Set',
    category: 'Add-ons',
    durationMinutes: 0,
    priceLKR: 500,
    isAddon: true,
    description: 'Single-use personal sterilized nail file, buffer, and cuticle tool set.',
    formulaHighlights: ['100% Single-Use Hygiene', 'Sealed Pack'],
  },
  {
    id: 'srv-ao-5',
    title: 'Jelly Pedicure Soak',
    category: 'Add-ons',
    durationMinutes: 15,
    priceLKR: 1500,
    isAddon: true,
    description: 'Relaxing dense gelatinous sensory foot bath that retains soothing heat.',
    formulaHighlights: ['Heat-Lock Jelly Soak', 'Callus Softening'],
  },
  {
    id: 'srv-ao-6',
    title: 'Foot Mask',
    category: 'Add-ons',
    durationMinutes: 15,
    priceLKR: 1000,
    isAddon: true,
    description: 'Deep hydrating foot mask treatment for silky soft soles.',
    formulaHighlights: ['Deep Dermal Hydration', 'Soothing Botanicals'],
  },
  {
    id: 'srv-ao-7',
    title: 'Foot Pack',
    category: 'Add-ons',
    durationMinutes: 10,
    priceLKR: 500,
    isAddon: true,
    description: 'Revitalizing herbal pack relieving tired feet.',
    formulaHighlights: ['Herbal Nutrients', 'Skin Revitalization'],
  },
  {
    id: 'srv-ao-8',
    title: 'Heel Mask',
    category: 'Add-ons',
    durationMinutes: 15,
    priceLKR: 1000,
    isAddon: true,
    description: 'Specialized intensive cracked heel restorative therapy.',
    formulaHighlights: ['AHA Cracked Heel Balm', 'Deep Repair'],
  },
  {
    id: 'srv-ao-9',
    title: 'Chrome per Nail',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 200,
    isAddon: true,
    description: 'Ultra-reflective glazed donut or mirror chrome pigment buffed over gel.',
    formulaHighlights: ['Mirror Chrome', 'High Reflection'],
  },
  {
    id: 'srv-ao-10',
    title: 'Marble per Nail',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 300,
    isAddon: true,
    description: 'Artisan hand-bloomed semi-precious quartz marble swirl.',
    formulaHighlights: ['Hand-Bloomed Veining', 'Quartz Depth'],
  },
  {
    id: 'srv-ao-11',
    title: 'Velvet Sheer per Nail',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 200,
    isAddon: true,
    description: 'Soft-focus luminous velvet shimmer finish.',
    formulaHighlights: ['Velvet Shimmer', 'Silk Texture'],
  },
  {
    id: 'srv-ao-12',
    title: 'Cat Eye per Nail',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 200,
    isAddon: true,
    description: 'Multi-angle magnetic cat-eye light beam effect.',
    formulaHighlights: ['Neodymium Magnet Effect', 'Dynamic Shimmer'],
  },
  {
    id: 'srv-ao-13',
    title: 'Per Stone',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 30,
    isAddon: true,
    description: 'Individual Swarovski crystal or luxury nail gem placement.',
    formulaHighlights: ['Swarovski Crystal', 'Precision Placement'],
  },
  {
    id: 'srv-ao-14',
    title: 'Basic Free Hand Design',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 200,
    isAddon: true,
    description: 'Minimalist hand-painted lines, micro-dots, or geometric accents.',
    formulaHighlights: ['Fine-Liner Art', 'Custom Accents'],
  },
  {
    id: 'srv-ao-15',
    title: 'Ombre per Nail',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 200,
    isAddon: true,
    description: 'Seamless dual-shade baby-boomer or colored gradient fade.',
    formulaHighlights: ['Airbrush/Sponge Blend', 'Soft Gradient'],
  },
  {
    id: 'srv-ao-16',
    title: 'Glitter Design per Nail',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 200,
    isAddon: true,
    description: 'Encapsulated fine glitter fade or solid glitter accent.',
    formulaHighlights: ['Encapsulated Flakes', 'Multi-Facet Sparkle'],
  },
  {
    id: 'srv-ao-17',
    title: 'Foil Design per Nail',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 300,
    isAddon: true,
    description: 'Artisanal 24k gold, rose-gold, or platinum leaf foil flakes.',
    formulaHighlights: ['Metallic Leaf Foil', 'Organic Placement'],
  },
  {
    id: 'srv-ao-18',
    title: 'Non Yellowing Coat per Hand',
    category: 'Add-ons',
    durationMinutes: 5,
    priceLKR: 500,
    isAddon: true,
    description: 'High-grade UV inhibitor topcoat preventing sun discoloration.',
    formulaHighlights: ['Anti-Yellowing UV Shield', 'Color Lock'],
  },
  {
    id: 'srv-ao-19',
    title: '3D Nail Art',
    category: 'Add-ons',
    durationMinutes: 10,
    priceLKR: 500,
    isAddon: true,
    description: 'Sculpted 3D acrylic/gel flowers, molten chrome ribbons, or charms.',
    formulaHighlights: ['Sculpted 3D Texture', 'Artisan Detailing'],
  },
];

// Resident Specialists
export const DEFAULT_SPECIALISTS: StaffSpecialist[] = [
  {
    id: 'staff-1',
    name: 'Dinithi Jayasinghe',
    title: 'Lead Nail Sculptor & E-File Master',
    bio: 'Certified Russian E-file master with 7+ years of European salon experience specializing in deep cuticle detailing and architectural apex building.',
    photoUrl: asset('assets/about-interior-1.jpg'),
    specialties: ['Manicures', 'Gel Extensions', 'Nail Services'],
    rating: 4.98,
    reviewCount: 284,
    experienceYears: 7,
  },
  {
    id: 'staff-2',
    name: 'Kavindi Perera',
    title: 'Japanese Hard Gel Virtuoso',
    bio: 'Trained in Tokyo hard gel sculpting techniques, renowned for featherweight extensions and crystal-clear glassy finish.',
    photoUrl: asset('assets/about-interior-2.jpg'),
    specialties: ['Acrylic Extensions', 'Gel Extensions', 'Add-ons'],
    rating: 4.96,
    reviewCount: 219,
    experienceYears: 5,
  },
  {
    id: 'staff-3',
    name: 'Sachini Wickramasinghe',
    title: 'Clinical Podiatry & Pedicure Specialist',
    bio: 'Dedicated to medical-grade foot wellness, autoclave sterilization protocols, and soothing botanical reflexology massages.',
    photoUrl: asset('assets/store-interior.webp'),
    specialties: ['Pedicures', 'Foot Massage', 'Hand Massage'],
    rating: 5.0,
    reviewCount: 312,
    experienceYears: 6,
  },
  {
    id: 'staff-4',
    name: 'Tharushi Alwis',
    title: 'Haute Nail Artist & Crystal Atelier Lead',
    bio: 'Creates bespoke runway micro-paintings, 3D chrome textures, and minimalist luxury accents favored by Colombo editorial models.',
    photoUrl: asset('assets/atelier-decor-1.jpg'),
    specialties: ['Nail Services', 'Manicures', 'Add-ons'],
    rating: 4.95,
    reviewCount: 198,
    experienceYears: 4,
  },
];

// Gallery Runway Exhibition (Featuring Bare Nail Spa Real Patron Photography from Visuals/Gallery)
export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: '3D Chrome Silver Sculpted Butterfly & French',
    category: 'Add-ons',
    imageUrl: asset('assets/gallery/gallery-1.webp'),
    artisanName: 'Tharushi Alwis',
    treatmentDuration: '90 min',
    priceLKR: 8500,
    formula: {
      chemicalBase: '7-Free Hard Resin & Sculpting Polymer',
      pigmentCode: 'Optic White Smile Line + Mirror Chrome Silver 01',
      apexStrengthRating: 'Architectural Curve 9/10',
      wearLongevity: '4+ Weeks Zero-Lift',
      cureTime: '60s Dual-Wavelength LED',
    },
    tags: ['3D Chrome', 'Butterfly', 'French', 'Client Favorite'],
  },
  {
    id: 'gal-2',
    title: 'Liquid 3D Molten Gold Frame on Glazed Sheer Nude',
    category: 'Add-ons',
    imageUrl: asset('assets/gallery/gallery-2.webp'),
    artisanName: 'Tharushi Alwis',
    treatmentDuration: '85 min',
    priceLKR: 8200,
    formula: {
      chemicalBase: 'Oligomer Cross-link BIAB #02 Alabaster Blush',
      pigmentCode: '24K Liquid Mirror Gold Gel + Pearl Powder',
      apexStrengthRating: 'Smooth Low Apex 8.5/10',
      wearLongevity: '4 Weeks Crystal Retention',
      cureTime: '45s LED',
    },
    tags: ['Molten Gold', '3D Frame', 'Glazed Nude'],
  },
  {
    id: 'gal-3',
    title: 'Iridescent Pearl Chrome over Almond BIAB',
    category: 'Gel Extensions',
    imageUrl: asset('assets/gallery/gallery-3.jpg'),
    artisanName: 'Dinithi Jayasinghe',
    treatmentDuration: '75 min',
    priceLKR: 6800,
    formula: {
      chemicalBase: 'Reinforced Self-Leveling BIAB Apex Matrix',
      pigmentCode: 'Bone Linen 101 + High-Reflect Pearl Chrome',
      apexStrengthRating: 'Structural C-Curve 9/10',
      wearLongevity: '4+ Weeks Lift-Free',
      cureTime: '60s Dual LED',
    },
    tags: ['Pearl Chrome', 'BIAB', 'Almond Shape'],
  },
  {
    id: 'gal-4',
    title: 'Deep Crimson & 24K Hand-Painted Gold Starbursts',
    category: 'Add-ons',
    imageUrl: asset('assets/gallery/gallery-4.jpg'),
    artisanName: 'Tharushi Alwis',
    treatmentDuration: '90 min',
    priceLKR: 8900,
    formula: {
      chemicalBase: 'High-Adhesion Soak-Off Hybrid Gel',
      pigmentCode: 'Crimson Wine #7A1F2D + 24K Foil Dust + Micro Pearl',
      apexStrengthRating: 'Reinforced Center Stress-Line',
      wearLongevity: '4 Weeks High Gloss',
      cureTime: '60s LED',
    },
    tags: ['Crimson Red', 'Gold Starburst', 'French Tip Inlay'],
  },
  {
    id: 'gal-5',
    title: 'Clay Rose Russian Manicure with Micro Dot Inlay',
    category: 'Manicures',
    imageUrl: asset('assets/gallery/gallery-5.jpg'),
    artisanName: 'Dinithi Jayasinghe',
    treatmentDuration: '60 min',
    priceLKR: 5400,
    formula: {
      chemicalBase: 'Dry E-File Cuticle Prep & Keratin Sealant',
      pigmentCode: 'Clay Rose #B87A6E + Ivory Dot Inlay Accent',
      apexStrengthRating: 'Natural Flush Silhouette',
      wearLongevity: '3-4 Weeks Pristine Clean',
      cureTime: '30s LED',
    },
    tags: ['Clay Rose', 'Russian E-file', 'Dot Accent'],
  },
  {
    id: 'gal-6',
    title: 'Deep Rosewood Wine High-Gloss Russian Set',
    category: 'Manicures',
    imageUrl: asset('assets/gallery/gallery-6.jpg'),
    artisanName: 'Dinithi Jayasinghe',
    treatmentDuration: '60 min',
    priceLKR: 5200,
    formula: {
      chemicalBase: 'Medical-Grade E-File Diamond Buffer',
      pigmentCode: 'Rosewood #9A5C52 Deep Merlot',
      apexStrengthRating: 'Natural Nail Guard',
      wearLongevity: '4 Weeks Chip-Free',
      cureTime: '30s LED',
    },
    tags: ['Rosewood', 'Russian Manicure', 'High Gloss'],
  },
  {
    id: 'gal-7',
    title: 'Frosted Snowflake Pale Blue on Artisan BIAB',
    category: 'Gel Extensions',
    imageUrl: asset('assets/gallery/gallery-7.jpg'),
    artisanName: 'Kavindi Perera',
    treatmentDuration: '75 min',
    priceLKR: 7200,
    formula: {
      chemicalBase: 'Breathable Oligomer Strengthening Base',
      pigmentCode: 'Frosted Glacier Blue #A8C4D8 + Hand-Lined Snowflake',
      apexStrengthRating: 'Architectural Curve 8/10',
      wearLongevity: '4 Weeks Regrowth Guard',
      cureTime: '60s LED',
    },
    tags: ['Snowflake', 'Glacier Blue', 'BIAB'],
  },
  {
    id: 'gal-8',
    title: 'Espresso Plum & Festive Micro-Artisan Accent',
    category: 'Add-ons',
    imageUrl: asset('assets/gallery/gallery-8.jpg'),
    artisanName: 'Tharushi Alwis',
    treatmentDuration: '70 min',
    priceLKR: 6500,
    formula: {
      chemicalBase: '7-Free Hard Resin',
      pigmentCode: 'Espresso Ink #2F2522 + Sheer Pink Blush + Micro Character',
      apexStrengthRating: 'Natural Contour',
      wearLongevity: '4 Weeks Zero Discoloration',
      cureTime: '60s Dual LED',
    },
    tags: ['Espresso Plum', 'Micro Art', 'Seasonal'],
  },
  {
    id: 'gal-9',
    title: 'Warm Champagne Dust Micro-French Shimmer',
    category: 'Gel Extensions',
    imageUrl: asset('assets/gallery/gallery-9.jpg'),
    artisanName: 'Dinithi Jayasinghe',
    treatmentDuration: '70 min',
    priceLKR: 6200,
    formula: {
      chemicalBase: 'Flexible Apex BIAB Resin',
      pigmentCode: 'Champagne Shimmer #C9A66B 0.05mm Glitter',
      apexStrengthRating: 'Architectural Curve 8/10',
      wearLongevity: '4 Weeks Scratch Resistant',
      cureTime: '60s Dual LED',
    },
    tags: ['Champagne', 'BIAB', 'Micro French'],
  },
  {
    id: 'gal-10',
    title: 'Rosewood Gradient Blush & Rose Quartz Veins',
    category: 'Add-ons',
    imageUrl: asset('assets/gallery/gallery-10.jpg'),
    artisanName: 'Tharushi Alwis',
    treatmentDuration: '85 min',
    priceLKR: 7900,
    formula: {
      chemicalBase: 'Low-Viscosity Blending Gel',
      pigmentCode: 'Rosewood #9A5C52 + Milky Quartz Layering',
      apexStrengthRating: 'Smooth Low Apex',
      wearLongevity: '4+ Weeks Zero-Lift',
      cureTime: '45s LED',
    },
    tags: ['Rose Quartz', 'Rosewood', 'Artistry'],
  },
  {
    id: 'gal-11',
    title: 'Sage Mist Minimalist Line & Negative Space',
    category: 'Manicures',
    imageUrl: asset('assets/gallery/gallery-11.jpg'),
    artisanName: 'Kavindi Perera',
    treatmentDuration: '65 min',
    priceLKR: 5400,
    formula: {
      chemicalBase: '7-Free Hypoallergenic Hard Resin',
      pigmentCode: 'Sage Mist #A9B8A3 Precision Liner',
      apexStrengthRating: 'Natural Flush Silhouette',
      wearLongevity: '3-4 Weeks Clean Wear',
      cureTime: '30s LED',
    },
    tags: ['Sage Mist', 'Minimalist', 'Negative Space'],
  },
  {
    id: 'gal-12',
    title: 'Japanese Crystal Clear Almond Extensions',
    category: 'Gel Extensions',
    imageUrl: asset('assets/gallery/gallery-12.jpg'),
    artisanName: 'Kavindi Perera',
    treatmentDuration: '100 min',
    priceLKR: 11800,
    formula: {
      chemicalBase: 'Non-Yellowing Pure Glass Oligomer',
      pigmentCode: 'Optic Clear 100% Transparency',
      apexStrengthRating: 'Structural C-Curve 9.5/10',
      wearLongevity: '5 Weeks Guaranteed',
      cureTime: '90s UV/LED',
    },
    tags: ['Glass Gel', 'Almond Extensions', 'Tokyo Technique'],
  },
];

// Video Reels
export const DEFAULT_REELS: MediaReel[] = [
  {
    id: 'reel-1',
    title: 'Why Malabe Girlies Choose Bare Nail Spa Atelier',
    category: 'Salon Atmosphere',
    videoUrl: asset('assets/reel-1.mp4'),
    posterUrl: asset('assets/reel-1-poster.jpg'),
    viewsDisplay: '18.4K',
    durationDisplay: '1:17',
    treatmentPriceLKR: 4500,
    serviceId: 'srv-1',
  },
  {
    id: 'reel-2',
    title: 'POV: Your Luxury Monthly Pamper Ritual at Bare',
    category: 'Guest Experience',
    videoUrl: asset('assets/reel-2.mp4'),
    posterUrl: asset('assets/reel-2-poster.jpg'),
    viewsDisplay: '24.1K',
    durationDisplay: '0:45',
    treatmentPriceLKR: 6800,
    serviceId: 'srv-2',
  },
  {
    id: 'reel-3',
    title: 'Time-Stamped Russian E-File Cuticle Detailing',
    category: 'Artisan Technique',
    videoUrl: asset('assets/reel-3.mp4'),
    posterUrl: asset('assets/reel-3-poster.jpg'),
    viewsDisplay: '36.9K',
    durationDisplay: '0:35',
    treatmentPriceLKR: 4500,
    serviceId: 'srv-1',
  },
  {
    id: 'reel-4',
    title: 'Matching Rosewood Hands & Feet Gel Ritual',
    category: 'Signature Set',
    videoUrl: asset('assets/reel-4.mp4'),
    posterUrl: asset('assets/reel-4-poster.jpg'),
    viewsDisplay: '15.2K',
    durationDisplay: '0:06',
    treatmentPriceLKR: 8500,
    serviceId: 'srv-8',
  },
  {
    id: 'reel-5',
    title: 'BIAB Apex Natural Reinforcement Transformation',
    category: 'Gel Extensions',
    videoUrl: asset('assets/reel-5.mp4'),
    posterUrl: asset('assets/reel-5-poster.jpg'),
    viewsDisplay: '19.8K',
    durationDisplay: '0:30',
    treatmentPriceLKR: 8000,
    serviceId: 'srv-2',
  },
  {
    id: 'reel-6',
    title: 'Velvet Cat-Eye & Molten Gold Hand Detailing',
    category: 'Add-ons',
    videoUrl: asset('assets/reel-6.mp4'),
    posterUrl: asset('assets/reel-6-poster.jpg'),
    viewsDisplay: '28.3K',
    durationDisplay: '0:25',
    treatmentPriceLKR: 6500,
    serviceId: 'srv-5c',
  },
  {
    id: 'reel-7',
    title: 'Clinical Podiatry & Foot Spa Reflexology',
    category: 'Pedicures',
    videoUrl: asset('assets/reel-7.mp4'),
    posterUrl: asset('assets/reel-7-poster.jpg'),
    viewsDisplay: '14.6K',
    durationDisplay: '0:28',
    treatmentPriceLKR: 7800,
    serviceId: 'srv-4',
  },
];

// Verified Google Reviews
export const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    authorName: 'Dinali Goonatillake',
    rating: 5,
    date: '3 months ago',
    source: 'Google Verified Review',
    reviewText: "I had a wonderful visit to Bare Nail Spa! I went in to get a manicure and French nails on my natural nails, along with getting a few problematic nails fixed. A huge shoutout to Ridmi! She is exceptionally knowledgeable, experienced, and skilled at her craft. She took great care in fixing my nails and executed the French design flawlessly with amazing precision. You can tell she really knows what she's doing and has had plenty of practice. My nails look clean, elegant, and beautifully restored. Highly recommend Bare Nail Spa—and definitely ask for Ridmi!",
    treatmentName: 'Natural French Manicure & Restoration',
  },
  {
    id: 'rev-2',
    authorName: 'Chanumi Nehansa',
    rating: 5,
    date: '2 weeks ago',
    source: 'Google Verified Review',
    reviewText: "This was my first time getting my nails done and I'm so glad I chose Bare Nail Spa. I was a little nervous at first since I was completely new to the process but the staff was really nice, friendly and caring. I got a Gelex done in Milky white colour. It looks really pretty! I highly recommend Bare Nails Spa!! Loved the experience!!",
    treatmentName: 'Gel-X Extensions in Milky White',
  },
  {
    id: 'rev-3',
    authorName: 'Gayani Wijesundara',
    rating: 5,
    date: '2 weeks ago',
    source: 'Google Verified Review',
    reviewText: "Absolutely beautiful 💖 Gel on natural nails + cat's eye by Zainub. Tip - asked not to make nails look bulky.",
    treatmentName: "Gel on Natural Nails + Cat's Eye",
  },
  {
    id: 'rev-4',
    authorName: 'Sehansa Thevinduni',
    rating: 5,
    date: '3 weeks ago',
    source: 'Google Verified Review',
    reviewText: "I found this nail saloon yesterday and i was in a big hurry to get myself presson nails. The replies are instant and fast. The service provided was extraordinary.Theres nothing wrong to say about anything. Shoutout to Rashini and Zainab for making my first nail appointment unforgettable.",
    treatmentName: 'Express Press-On Nails Service',
  },
  {
    id: 'rev-5',
    authorName: 'Uresha Gunarathne',
    rating: 5,
    date: '1 month ago',
    source: 'Google Verified Review',
    reviewText: "I’m extremely happy with my experience at Bare Nails Salon. I shared a reference image of the nail design I wanted, and they brought it to life beautifully and exactly as I had envisioned. The attention to detail and finishing were exceptional. The team was professional, friendly, and made sure everything was perfect. Highly recommend Bare Nails Salon for anyone looking for beautiful, elegant nails! 🤍",
    treatmentName: 'Bespoke Reference Nail Art',
  },
  {
    id: 'rev-6',
    authorName: 'Carlene De Fry',
    rating: 5,
    date: '1 month ago',
    source: 'Google Verified Review',
    reviewText: "Amazing service! They slotted me in on short notice, they were upfront about what could and couldn't be achieved within the time frame I had, the technician was attentive and conversational, she was patient and followed instruction well! A 5 star experience for sure! I may not be a nail tech but I certainly am very aware of great work!",
    treatmentName: 'Polish Removal & Precision Nail Painting',
  },
  {
    id: 'rev-7',
    authorName: 'Nethnilu Nadeesha',
    rating: 5,
    date: '1 month ago',
    source: 'Google Verified Review',
    reviewText: "I visited Bare Nail Spa to get my nails done for the first time in my life, and honestly, they exceeded my expectations! 💅 ✨ I would definitely recommend this nail spa to anyone. From the moment I walked in, all the staff were so welcoming and friendly, and I really appreciated the little touches like the refreshments they offered. A special thank you to Rashani, who did an amazing job with both my nails and pedicure. She was able to recreate my inspiration perfectly, and I couldn't be happier with how they turned out! 🥹 💕 As someone who had never had their nails professionally done before, the whole experience was so comfortable, relaxing, and enjoyable. Thank you, Bare Nail Spa, for making my first nail experience such a lovely one! 🤍 ✨",
    treatmentName: 'Nail Extensions & Pedicure Ritual',
  },
];

// Pre-seeded Demo Profiles
const SEED_PROFILES: Record<string, LoyaltyCustomerProfile> = {
  '0771234567': {
    phone: '0771234567',
    fullName: 'Amaya Perera',
    email: 'amaya.perera@example.lk',
    registeredAt: '2026-08-14T10:30:00Z',
    currentVisits: 4, // 1 stamp away from 50% OFF!
    totalHistoricalVisits: 4,
    stamps: [
      { id: 'st-1', stampNumber: 1, timestamp: '2026-08-14T10:30:00Z', method: 'WELCOME_GIFT' },
      { id: 'st-2', stampNumber: 2, timestamp: '2026-09-02T14:15:00Z', method: 'NFC_TAP' },
      { id: 'st-3', stampNumber: 3, timestamp: '2026-09-24T11:00:00Z', method: 'CAPACITIVE_STAMP' },
      { id: 'st-4', stampNumber: 4, timestamp: '2026-10-10T16:45:00Z', method: 'STAFF_POS_PIN' },
    ],
    activeRewards: [],
    lastStampedAt: '2026-10-10T16:45:00Z',
    preferredArtisanTea: 'Ceylon Silver Tips with Osmanthus',
    silentSessionPreference: false,
    notes: 'Prefers natural almond shapes with BIAB nude bases.',
  },
  '0779876543': {
    phone: '0779876543',
    fullName: 'Dilshan Silva',
    email: 'dilshan.silva@example.lk',
    registeredAt: '2026-05-10T09:00:00Z',
    currentVisits: 9, // 1 stamp away from 100% OFF (Visit 10 Grand Jackpot)!
    totalHistoricalVisits: 9,
    stamps: [
      { id: 'st-1', stampNumber: 1, timestamp: '2026-05-10T09:00:00Z', method: 'WELCOME_GIFT' },
      { id: 'st-2', stampNumber: 2, timestamp: '2026-05-28T11:00:00Z', method: 'NFC_TAP' },
      { id: 'st-3', stampNumber: 3, timestamp: '2026-06-15T15:20:00Z', method: 'NFC_TAP' },
      { id: 'st-4', stampNumber: 4, timestamp: '2026-07-04T14:00:00Z', method: 'CAPACITIVE_STAMP' },
      { id: 'st-5', stampNumber: 5, timestamp: '2026-07-25T16:00:00Z', method: 'STAFF_POS_PIN' },
      { id: 'st-6', stampNumber: 6, timestamp: '2026-08-18T10:00:00Z', method: 'NFC_TAP' },
      { id: 'st-7', stampNumber: 7, timestamp: '2026-09-08T12:00:00Z', method: 'CAPACITIVE_STAMP' },
      { id: 'st-8', stampNumber: 8, timestamp: '2026-09-29T15:30:00Z', method: 'NFC_TAP' },
      { id: 'st-9', stampNumber: 9, timestamp: '2026-10-18T17:00:00Z', method: 'NFC_TAP' },
    ],
    activeRewards: [],
    lastStampedAt: '2026-10-18T17:00:00Z',
    preferredArtisanTea: 'Roasted Genmaicha with Brown Rice',
    silentSessionPreference: true,
    notes: 'Gentle cuticle treatment, loves tea ritual.',
  },
  '0715554321': {
    phone: '0715554321',
    fullName: 'Shenali Fernando',
    email: 'shenali.f@example.lk',
    registeredAt: '2026-07-01T14:00:00Z',
    currentVisits: 5, // At Visit 5 with ACTIVE 50% OFF Privilege Voucher!
    totalHistoricalVisits: 5,
    stamps: [
      { id: 'st-1', stampNumber: 1, timestamp: '2026-07-01T14:00:00Z', method: 'WELCOME_GIFT' },
      { id: 'st-2', stampNumber: 2, timestamp: '2026-07-22T10:30:00Z', method: 'NFC_TAP' },
      { id: 'st-3', stampNumber: 3, timestamp: '2026-08-12T15:00:00Z', method: 'CAPACITIVE_STAMP' },
      { id: 'st-4', stampNumber: 4, timestamp: '2026-09-05T11:00:00Z', method: 'NFC_TAP' },
      { id: 'st-5', stampNumber: 5, timestamp: '2026-09-28T16:00:00Z', method: 'NFC_TAP' },
    ],
    activeRewards: [
      {
        id: 'rew-50-pct-shenali',
        milestoneVisit: 5,
        title: '50% OFF Privilege Voucher',
        discountPercentage: 50,
        unlockedAt: '2026-09-28T16:00:00Z',
        redeemed: false,
        voucherCode: 'BARE-VIP-50-SHENALI',
      },
    ],
    lastStampedAt: '2026-09-28T16:00:00Z',
    preferredArtisanTea: 'Ceylon Silver Tips with Osmanthus',
    silentSessionPreference: true,
    notes: 'Medical-grade enthusiast, loves dry pedicure.',
  },
};

// Date Helpers for Live Simulation
export const getTodayStr = (): string => new Date().toISOString().split('T')[0];
export const getTomorrowStr = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

// Blocked Times Pre-seeded
export const SEED_BLOCKED_TIMES: BlockedTimeSlot[] = [
  {
    id: 'blk-1',
    specialistId: 'ALL',
    specialistName: 'All Technicians (Atelier Facility Block)',
    date: getTodayStr(),
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    reasonCategory: 'Atelier Deep Cleaning & Autoclave Sterilization',
    specificDetails: 'Hospital-grade autoclave cycle for e-file diamond bits and cleanroom air sanitization.',
    createdAt: new Date().toISOString(),
    createdBy: 'Atelier Floor Manager',
  },
  {
    id: 'blk-2',
    specialistId: 'staff-4',
    specialistName: 'Tharushi Alwis',
    date: getTodayStr(),
    startTime: '04:30 PM',
    endTime: '06:00 PM',
    reasonCategory: 'Team Training & Masterclass',
    specificDetails: 'Masterclass demo: 3D chrome liquid metal contouring and micro-crystallization technique.',
    createdAt: new Date().toISOString(),
    createdBy: 'Lead Educator',
  },
];

// Inbound Bookings Pre-seeded (Including Pending Inbound Booking Requests)
export const SEED_BOOKINGS: BookingRequest[] = [
  // 1. Pending Inbound Request: Shenali Fernando
  {
    id: 'BK-8903',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'PENDING_HOLD',
    specialistId: 'staff-2',
    specialistName: 'Kavindi Perera',
    serviceIds: ['srv-p-4'],
    services: [DEFAULT_SERVICES[13]], // Signature Pedicure (Gel Color)
    date: getTomorrowStr(),
    timeSlot: '02:30 PM',
    totalDurationMinutes: 60,
    originalPriceLKR: 6500,
    discountAppliedLKR: 3250,
    finalPriceLKR: 3250,
    appliedRewardId: 'rew-50-pct-shenali',
    guest: {
      fullName: 'Shenali Fernando',
      phone: '0715554321',
      email: 'shenali.f@example.lk',
      preferredTea: 'Ceylon Silver Tips with Osmanthus',
      silentSession: true,
      specialNotes: 'Redeeming 50% VIP privilege voucher. Please prepare hot osmanthus tea in advance.',
    },
  },
  // 2. Pending Inbound Request: Oshadi Ranasinghe
  {
    id: 'BK-8905',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'PENDING_HOLD',
    specialistId: 'staff-1',
    specialistName: 'Dinithi Jayasinghe',
    serviceIds: ['srv-m-6', 'srv-ao-19'],
    services: [DEFAULT_SERVICES[5], DEFAULT_SERVICES[43]], // Spa Manicure (Gel Color) + 3D Nail Art
    date: getTodayStr(),
    timeSlot: '04:00 PM',
    totalDurationMinutes: 85,
    originalPriceLKR: 7500,
    discountAppliedLKR: 0,
    finalPriceLKR: 7500,
    guest: {
      fullName: 'Oshadi Ranasinghe',
      phone: '0783344556',
      email: 'oshadi.r@gmail.com',
      preferredTea: 'Warm Jasmine Lemongrass Infusion',
      silentSession: false,
      moodboardUrl: asset('assets/gallery/gallery-1.webp'),
      specialNotes: 'Attending wedding this weekend. Requesting French ombré with sculpted pearl chrome butterfly accents.',
    },
  },
  // 3. Pending Inbound Request: Kaveesha De Silva
  {
    id: 'BK-8906',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    status: 'PENDING_HOLD',
    specialistId: 'staff-4',
    specialistName: 'First Available (Tharushi Alwis)',
    serviceIds: ['srv-ae-2'],
    services: [DEFAULT_SERVICES[19]], // Acrylic Extensions (Gel French)
    date: getTomorrowStr(),
    timeSlot: '11:00 AM',
    totalDurationMinutes: 105,
    originalPriceLKR: 7500,
    discountAppliedLKR: 0,
    finalPriceLKR: 7500,
    guest: {
      fullName: 'Kaveesha De Silva',
      phone: '0761122334',
      email: 'kaveesha.ds@yahoo.com',
      preferredTea: 'Chilled White Peach & Elderflower',
      silentSession: false,
      specialNotes: 'First time getting acrylic extensions! Extra gentle care with dry e-file cuticles please.',
    },
  },
  // 4. Pending Inbound Request: Ruwani Jayawardena
  {
    id: 'BK-8907',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: 'PENDING_HOLD',
    specialistId: 'staff-3',
    specialistName: 'Sachini Wickramasinghe',
    serviceIds: ['srv-p-6', 'srv-fm-1'],
    services: [DEFAULT_SERVICES[15], DEFAULT_SERVICES[16]], // Spa Pedicure (Gel Color) + Foot Massage (30 Mins)
    date: getTodayStr(),
    timeSlot: '05:30 PM',
    totalDurationMinutes: 105,
    originalPriceLKR: 11000,
    discountAppliedLKR: 0,
    finalPriceLKR: 11000,
    guest: {
      fullName: 'Ruwani Jayawardena',
      phone: '0729988776',
      preferredTea: 'Roasted Genmaicha with Brown Rice',
      silentSession: true,
      specialNotes: 'Tired feet from walking. Long relaxing massage wanted.',
    },
  },
  // 5. Confirmed Active: Amaya Perera
  {
    id: 'BK-8902',
    createdAt: '2026-10-21T09:15:00Z',
    status: 'CONFIRMED',
    specialistId: 'staff-1',
    specialistName: 'Dinithi Jayasinghe',
    serviceIds: ['srv-m-4', 'srv-ao-15'],
    services: [DEFAULT_SERVICES[3], DEFAULT_SERVICES[39]], // Signature Manicure (Gel Color) + Ombre
    date: getTodayStr(),
    timeSlot: '11:00 AM',
    totalDurationMinutes: 65,
    originalPriceLKR: 6200,
    discountAppliedLKR: 0,
    finalPriceLKR: 6200,
    guest: {
      fullName: 'Amaya Perera',
      phone: '0771234567',
      email: 'amaya.perera@example.lk',
      preferredTea: 'Ceylon Silver Tips with Osmanthus',
      silentSession: false,
      specialNotes: 'Almond shaped apex BIAB overlay',
    },
  },
  // 6. Confirmed Active: Nirmani Bandara
  {
    id: 'BK-8904',
    createdAt: '2026-10-21T11:30:00Z',
    status: 'CONFIRMED',
    specialistId: 'staff-3',
    specialistName: 'Sachini Wickramasinghe',
    serviceIds: ['srv-p-3'],
    services: [DEFAULT_SERVICES[12]], // Signature Pedicure (Normal Color)
    date: getTodayStr(),
    timeSlot: '02:30 PM',
    totalDurationMinutes: 60,
    originalPriceLKR: 4500,
    discountAppliedLKR: 0,
    finalPriceLKR: 4500,
    guest: {
      fullName: 'Nirmani Bandara',
      phone: '0774433221',
      preferredTea: 'Warm Jasmine Lemongrass Infusion',
      silentSession: false,
      specialNotes: 'Deep saffron foot mask pack preference.',
    },
  },
  // 7. Walk-In Booking in Session: Hansani Fernando
  {
    id: 'WK-8901',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'IN_SESSION',
    isWalkIn: true,
    specialistId: 'staff-1',
    specialistName: 'Dinithi Jayasinghe',
    serviceIds: ['srv-m-2'],
    services: [DEFAULT_SERVICES[1]], // Express Manicure (Gel Color)
    date: getTodayStr(),
    timeSlot: '10:00 AM',
    totalDurationMinutes: 45,
    originalPriceLKR: 5000,
    discountAppliedLKR: 0,
    finalPriceLKR: 5000,
    staffNotes: 'Walk-in guest, seated at Station 1 with Russian prep in progress.',
    guest: {
      fullName: 'Hansani Fernando',
      phone: '0714455667',
      preferredTea: 'Artisan Still Mineral Water',
      silentSession: false,
    },
  },
  // 8. Completed Session: Chathuri Karunaratne
  {
    id: 'BK-8898',
    createdAt: '2026-10-21T08:00:00Z',
    status: 'COMPLETED',
    specialistId: 'staff-2',
    specialistName: 'Kavindi Perera',
    serviceIds: ['srv-ae-1'],
    services: [DEFAULT_SERVICES[18]], // Acrylic Extensions (Gel Color)
    date: getTodayStr(),
    timeSlot: '09:00 AM',
    totalDurationMinutes: 90,
    originalPriceLKR: 7000,
    discountAppliedLKR: 0,
    finalPriceLKR: 7000,
    guest: {
      fullName: 'Chathuri Karunaratne',
      phone: '0778899001',
      preferredTea: 'Ceylon Silver Tips with Osmanthus',
      silentSession: false,
    },
  },
];

export class SalonDataService {
  /**
   * Device Memory: Active Customer Phone
   */
  static getActivePhone(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PHONE) || '0771234567'; // Default to Amaya for live demo preview
  }

  static setActivePhone(phone: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PHONE, phone.trim());
    window.dispatchEvent(new Event('storage'));
  }

  static clearActivePhone(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PHONE);
    window.dispatchEvent(new Event('storage'));
  }

  /**
   * Loyalty Profiles
   */
  static getAllProfiles(): Record<string, LoyaltyCustomerProfile> {
    if (typeof window === 'undefined') return SEED_PROFILES;
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(SEED_PROFILES));
      return SEED_PROFILES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_PROFILES;
    }
  }

  static getProfileByPhone(phone: string): LoyaltyCustomerProfile | null {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const profiles = this.getAllProfiles();
    return profiles[cleanPhone] || null;
  }

  static saveProfile(profile: LoyaltyCustomerProfile): void {
    if (typeof window === 'undefined') return;
    const profiles = this.getAllProfiles();
    profiles[profile.phone.trim()] = profile;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    // Trigger multi-tab and reactive updates
    window.dispatchEvent(new Event('storage'));
  }

  /**
   * Register New Guest with Endowed Progress (Stamp #1 Welcome Bonus)
   * Client-side validation is performed; server-side validation required here in production.
   */
  static registerNewGuest(phone: string, fullName: string, email?: string): LoyaltyCustomerProfile {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const existing = this.getProfileByPhone(cleanPhone);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const stamps: StampRecord[] = [];

    // Endowed Progress Welcome Gift
    if (BRAND_CONFIG.loyaltyRules.welcomeGiftEnabled) {
      stamps.push({
        id: `st-welcome-${Date.now()}`,
        stampNumber: 1,
        timestamp: now,
        method: 'WELCOME_GIFT',
        notes: 'Endowed Progress Welcome Gift upon enrollment',
      });
    }

    const newProfile: LoyaltyCustomerProfile = {
      phone: cleanPhone,
      fullName: fullName.trim(),
      email: email?.trim(),
      registeredAt: now,
      currentVisits: stamps.length,
      totalHistoricalVisits: stamps.length,
      stamps,
      activeRewards: [],
      lastStampedAt: stamps.length > 0 ? now : undefined,
    };

    this.saveProfile(newProfile);
    this.setActivePhone(cleanPhone);
    return newProfile;
  }

  /**
   * Add a Stamp to an existing profile with reward unlocks
   */
  static addStamp(
    phone: string,
    method: StampRecord['method'],
    verifiedByStaffId?: string,
    notes?: string
  ): { profile: LoyaltyCustomerProfile; newRewardUnlocked: LoyaltyReward | null } {
    const profile = this.getProfileByPhone(phone);
    if (!profile) {
      throw new Error('Guest profile not found');
    }

    const nextVisit = profile.currentVisits + 1;
    const now = new Date().toISOString();

    const newStamp: StampRecord = {
      id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      stampNumber: nextVisit,
      timestamp: now,
      method,
      verifiedByStaffId,
      notes,
    };

    profile.stamps.push(newStamp);
    profile.currentVisits = nextVisit;
    profile.totalHistoricalVisits += 1;
    profile.lastStampedAt = now;

    let newRewardUnlocked: LoyaltyReward | null = null;

    // Check Milestone 1 (Visit 5 = 50% OFF)
    if (nextVisit === BRAND_CONFIG.loyaltyRules.milestone1Visit) {
      newRewardUnlocked = {
        id: `rew-50-${Date.now()}`,
        milestoneVisit: BRAND_CONFIG.loyaltyRules.milestone1Visit,
        title: BRAND_CONFIG.loyaltyRules.milestone1Title,
        discountPercentage: BRAND_CONFIG.loyaltyRules.milestone1DiscountPct,
        unlockedAt: now,
        redeemed: false,
        voucherCode: `BARE-50-${phone.slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      };
      profile.activeRewards.push(newRewardUnlocked);
    }

    // Check Milestone 2 (Visit 10 = 100% OFF up to 5,000 LKR)
    if (nextVisit === BRAND_CONFIG.loyaltyRules.totalStamps) {
      newRewardUnlocked = {
        id: `rew-100-${Date.now()}`,
        milestoneVisit: BRAND_CONFIG.loyaltyRules.totalStamps,
        title: BRAND_CONFIG.loyaltyRules.milestone2Title,
        discountPercentage: BRAND_CONFIG.loyaltyRules.milestone2DiscountPct,
        maxCapLKR: BRAND_CONFIG.loyaltyRules.milestone2MaxCapLKR,
        unlockedAt: now,
        redeemed: false,
        voucherCode: `BARE-100-${phone.slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      };
      profile.activeRewards.push(newRewardUnlocked);
    }

    this.saveProfile(profile);

    // Record automated SMS notification in outbox
    this.recordOutboxMessage(
      phone,
      `Bare Nail Spa: Stamp #${nextVisit}/10 recorded! ${
        newRewardUnlocked
          ? `🎉 Congratulations! You unlocked: ${newRewardUnlocked.title}. Voucher code: ${newRewardUnlocked.voucherCode}`
          : `Only ${BRAND_CONFIG.loyaltyRules.milestone1Visit - nextVisit > 0 ? BRAND_CONFIG.loyaltyRules.milestone1Visit - nextVisit : BRAND_CONFIG.loyaltyRules.totalStamps - nextVisit} visits left until your next privilege reward.`
      }`
    );

    return { profile, newRewardUnlocked };
  }

  /**
   * Revoke / Remove the most recently added stamp from a customer profile (Accidental stamp reversal)
   */
  static removeLastStamp(
    phone: string,
    reason: string = 'Cashier accidental stamp revocation'
  ): { profile: LoyaltyCustomerProfile; revokedRewardTitle?: string } {
    const profile = this.getProfileByPhone(phone);
    if (!profile) {
      throw new Error('Guest profile not found for phone ' + phone);
    }
    if (profile.currentVisits <= 0 || profile.stamps.length === 0) {
      throw new Error(`${profile.fullName} currently has 0 stamps. No stamps to revoke.`);
    }

    const previousVisits = profile.currentVisits;
    profile.stamps.pop();
    profile.currentVisits = Math.max(0, profile.currentVisits - 1);
    if (profile.totalHistoricalVisits > 0) {
      profile.totalHistoricalVisits -= 1;
    }

    let revokedRewardTitle: string | undefined;
    // If a reward was unlocked at previousVisits (milestone 1 or milestone 2), rollback that unredeemed reward
    if (previousVisits === BRAND_CONFIG.loyaltyRules.milestone1Visit) {
      const idx = profile.activeRewards.findIndex(
        r => r.milestoneVisit === BRAND_CONFIG.loyaltyRules.milestone1Visit && !r.redeemed
      );
      if (idx !== -1) {
        revokedRewardTitle = profile.activeRewards[idx].title;
        profile.activeRewards.splice(idx, 1);
      }
    } else if (previousVisits === BRAND_CONFIG.loyaltyRules.totalStamps) {
      const idx = profile.activeRewards.findIndex(
        r => r.milestoneVisit === BRAND_CONFIG.loyaltyRules.totalStamps && !r.redeemed
      );
      if (idx !== -1) {
        revokedRewardTitle = profile.activeRewards[idx].title;
        profile.activeRewards.splice(idx, 1);
      }
    }

    this.saveProfile(profile);

    // Record reversal in outbox
    this.recordOutboxMessage(
      phone,
      `Bare Nail Spa: An accidental stamp was reversed on your VIP pass (${reason}). Your current balance is ${profile.currentVisits}/10 visits.`
    );

    return { profile, revokedRewardTitle };
  }

  /**
   * Paper Card Migration (Sets guest starting stamps from physical card)
   */
  static migratePaperCard(
    phone: string,
    fullName: string,
    verifiedStampCount: number,
    staffNotes: string
  ): LoyaltyCustomerProfile {
    let profile = this.getProfileByPhone(phone);
    if (!profile) {
      profile = this.registerNewGuest(phone, fullName);
    }

    const now = new Date().toISOString();
    profile.currentVisits = verifiedStampCount;
    profile.totalHistoricalVisits = Math.max(profile.totalHistoricalVisits, verifiedStampCount);
    profile.notes = `${profile.notes ? profile.notes + ' | ' : ''}Migrated paper card (${verifiedStampCount} stamps): ${staffNotes}`;

    // Unlock rewards if migrated beyond milestones
    if (verifiedStampCount >= 5 && !profile.activeRewards.some(r => r.milestoneVisit === 5)) {
      profile.activeRewards.push({
        id: `rew-50-migrated-${Date.now()}`,
        milestoneVisit: 5,
        title: BRAND_CONFIG.loyaltyRules.milestone1Title,
        discountPercentage: 50,
        unlockedAt: now,
        redeemed: false,
        voucherCode: `BARE-MIGRATE-50-${phone.slice(-4)}`,
      });
    }

    this.saveProfile(profile);
    return profile;
  }

  /**
   * Blocked Working Time Slots Management
   */
  static getBlockedTimes(): BlockedTimeSlot[] {
    if (typeof window === 'undefined') return SEED_BLOCKED_TIMES;
    const stored = localStorage.getItem(STORAGE_KEYS.BLOCKED_TIMES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_TIMES, JSON.stringify(SEED_BLOCKED_TIMES));
      return SEED_BLOCKED_TIMES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_BLOCKED_TIMES;
    }
  }

  static addBlockedTime(slot: Omit<BlockedTimeSlot, 'id' | 'createdAt'>): BlockedTimeSlot {
    const fullSlot: BlockedTimeSlot = {
      ...slot,
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    const slots = this.getBlockedTimes();
    slots.unshift(fullSlot);
    localStorage.setItem(STORAGE_KEYS.BLOCKED_TIMES, JSON.stringify(slots));
    window.dispatchEvent(new Event('storage'));
    return fullSlot;
  }

  static removeBlockedTime(id: string): void {
    const slots = this.getBlockedTimes().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.BLOCKED_TIMES, JSON.stringify(slots));
    window.dispatchEvent(new Event('storage'));
  }

  /**
   * Bookings Management
   */
  static getBookings(): BookingRequest[] {
    if (typeof window === 'undefined') return SEED_BOOKINGS;
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    try {
      const parsed: BookingRequest[] = JSON.parse(stored);
      // Ensure pending requests are available for demo evaluation if none exist
      const hasPending = parsed.some(b => b.status === 'PENDING_HOLD');
      if (!hasPending) {
        const seedPending = SEED_BOOKINGS.filter(b => b.status === 'PENDING_HOLD');
        const merged = [...seedPending, ...parsed];
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      return SEED_BOOKINGS;
    }
  }

  /**
   * Public Online Booking Ingestion: defaults to PENDING_HOLD for admin confirmation
   */
  static createBooking(booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>): BookingRequest {
    const fullBooking: BookingRequest = {
      ...booking,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING_HOLD',
    };

    const bookings = this.getBookings();
    bookings.unshift(fullBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new Event('storage'));

    // Automatically associate / update guest phone memory
    this.setActivePhone(booking.guest.phone);

    // Automated Inbound Acknowledgement SMS
    this.recordOutboxMessage(
      booking.guest.phone,
      `Bare Nail Spa: Inbound reservation request #${fullBooking.id} received for ${booking.guest.fullName} on ${booking.date} at ${booking.timeSlot} with ${booking.specialistName}. Our concierge desk is reviewing technician availability and will confirm shortly.`
    );

    return fullBooking;
  }

  /**
   * Manual Walk-In Booking Dispatch: created directly by Admin as confirmed or in-session
   */
  static createWalkInBooking(walkInData: {
    guestFullName: string;
    guestPhone: string;
    guestEmail?: string;
    specialistId: string;
    specialistName: string;
    services: Service[];
    date: string;
    timeSlot: string;
    preferredTea?: string;
    silentSession?: boolean;
    staffNotes?: string;
    startImmediately?: boolean;
  }): BookingRequest {
    const totalMinutes = walkInData.services.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalPrice = walkInData.services.reduce((sum, s) => sum + s.priceLKR, 0);

    const fullBooking: BookingRequest = {
      id: `WK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: walkInData.startImmediately ? 'IN_SESSION' : 'CONFIRMED',
      isWalkIn: true,
      specialistId: walkInData.specialistId,
      specialistName: walkInData.specialistName,
      serviceIds: walkInData.services.map(s => s.id),
      services: walkInData.services,
      date: walkInData.date,
      timeSlot: walkInData.timeSlot,
      totalDurationMinutes: totalMinutes,
      originalPriceLKR: totalPrice,
      discountAppliedLKR: 0,
      finalPriceLKR: totalPrice,
      staffNotes: walkInData.staffNotes,
      guest: {
        fullName: walkInData.guestFullName.trim(),
        phone: walkInData.guestPhone.trim(),
        email: walkInData.guestEmail?.trim(),
        preferredTea: (walkInData.preferredTea || 'Ceylon Silver Tips with Osmanthus') as any,
        silentSession: Boolean(walkInData.silentSession),
        specialNotes: walkInData.staffNotes ? `Walk-in Guest: ${walkInData.staffNotes}` : 'Walk-in Client',
      },
    };

    const bookings = this.getBookings();
    bookings.unshift(fullBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new Event('storage'));

    this.setActivePhone(walkInData.guestPhone);

    this.recordOutboxMessage(
      walkInData.guestPhone,
      `Bare Nail Spa: Walk-in appointment registered #${fullBooking.id} for ${fullBooking.guest.fullName} with ${fullBooking.specialistName}. Estimated duration: ${totalMinutes} mins. Total: ${BRAND_CONFIG.currency.format(totalPrice)}. Enjoy your bespoke ritual.`
    );

    return fullBooking;
  }

  /**
   * Admin Action 1: Confirm Pending Inbound Booking Request
   */
  static confirmBooking(bookingId: string, staffNotes?: string): void {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    target.status = 'CONFIRMED';
    if (staffNotes) {
      target.staffNotes = target.staffNotes ? `${target.staffNotes} | ${staffNotes}` : staffNotes;
    }

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new Event('storage'));

    this.recordOutboxMessage(
      target.guest.phone,
      `Bare Nail Spa: 🎉 Your reservation #${target.id} is CONFIRMED! We await you on ${target.date} at ${target.timeSlot} with ${target.specialistName}. Ritual: ${target.services.map(s => s.title).join(', ')}. Tea ritual "${target.guest.preferredTea}" will be prepared fresh.`
    );
  }

  /**
   * Admin Action 2: Re-schedule Inbound Booking Request
   */
  static rescheduleBooking(
    bookingId: string,
    newDate: string,
    newTimeSlot: string,
    newSpecialistId?: string,
    newSpecialistName?: string,
    reason?: string,
    notifyGuest = true
  ): void {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    if (!target.rescheduledHistory) {
      target.rescheduledHistory = [];
    }

    target.rescheduledHistory.push({
      previousDate: target.date,
      previousTimeSlot: target.timeSlot,
      previousSpecialistName: target.specialistName,
      rescheduledAt: new Date().toISOString(),
      reason,
    });

    target.date = newDate;
    target.timeSlot = newTimeSlot;
    if (newSpecialistId && newSpecialistName) {
      target.specialistId = newSpecialistId;
      target.specialistName = newSpecialistName;
    }
    target.status = 'CONFIRMED';

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new Event('storage'));

    if (notifyGuest) {
      this.recordOutboxMessage(
        target.guest.phone,
        `Bare Nail Spa: Your appointment #${target.id} has been rescheduled to ${newDate} at ${newTimeSlot} with ${target.specialistName}.${reason ? ` (Note: ${reason})` : ''} Total: ${BRAND_CONFIG.currency.format(target.finalPriceLKR)}. Please reply if this new time suits you.`
      );
    }
  }

  /**
   * Admin Action 3: Decline Inbound Booking Request
   */
  static declineBooking(
    bookingId: string,
    reason: string,
    staffNotes?: string,
    notifyGuest = true
  ): void {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    target.status = 'CANCELLED';
    target.declineReason = reason;
    if (staffNotes) {
      target.staffNotes = staffNotes;
    }

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new Event('storage'));

    if (notifyGuest) {
      this.recordOutboxMessage(
        target.guest.phone,
        `Bare Nail Spa: Dear ${target.guest.fullName}, we regret to inform you that we cannot accommodate booking request #${target.id} for ${target.date} at ${target.timeSlot}. Reason: ${reason}. Would you like our concierge to assist with an alternative time? Reply to chat.`
      );
    }
  }

  /**
   * Dispatch: Start Session
   */
  static startSession(bookingId: string): void {
    this.updateBookingStatus(bookingId, 'IN_SESSION');
  }

  /**
   * General Status Update
   */
  static updateBookingStatus(bookingId: string, status: BookingRequest['status']): void {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      target.status = status;
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      window.dispatchEvent(new Event('storage'));
    }
  }

  /**
   * Full Demo State Reset
   */
  static reseedDemoData(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.BLOCKED_TIMES, JSON.stringify(SEED_BLOCKED_TIMES));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(SEED_PROFILES));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    localStorage.setItem(STORAGE_KEYS.SPECIALISTS, JSON.stringify(DEFAULT_SPECIALISTS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
    localStorage.setItem(STORAGE_KEYS.MEDIA_REELS, JSON.stringify(DEFAULT_REELS));
    window.dispatchEvent(new Event('storage'));
  }

  // ==========================================
  // DIGITAL CMS: SERVICES CATALOG CRUD
  // ==========================================
  static getServices(): Service[] {
    if (typeof window === 'undefined') return DEFAULT_SERVICES;
    const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
      return DEFAULT_SERVICES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SERVICES;
    }
  }

  static saveServices(services: Service[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    window.dispatchEvent(new Event('storage'));
  }

  static createService(data: Omit<Service, 'id'>): Service {
    const services = this.getServices();
    const newService: Service = {
      ...data,
      id: `srv-custom-${Date.now()}`,
    };
    services.unshift(newService);
    this.saveServices(services);
    return newService;
  }

  static updateService(updated: Service): void {
    const services = this.getServices();
    const idx = services.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      services[idx] = updated;
      this.saveServices(services);
    }
  }

  static deleteService(id: string): void {
    const services = this.getServices();
    const filtered = services.filter(s => s.id !== id);
    this.saveServices(filtered);
  }

  // ==========================================
  // DIGITAL CMS: STAFF DIRECTORY & QUALIFIED CATEGORIES CRUD
  // ==========================================
  static getSpecialists(): StaffSpecialist[] {
    if (typeof window === 'undefined') return DEFAULT_SPECIALISTS;
    const stored = localStorage.getItem(STORAGE_KEYS.SPECIALISTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.SPECIALISTS, JSON.stringify(DEFAULT_SPECIALISTS));
      return DEFAULT_SPECIALISTS;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return DEFAULT_SPECIALISTS;
    } catch {
      return DEFAULT_SPECIALISTS;
    }
  }

  static saveSpecialists(specialists: StaffSpecialist[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SPECIALISTS, JSON.stringify(specialists));
    window.dispatchEvent(new Event('storage'));
  }

  static createSpecialist(data: Omit<StaffSpecialist, 'id'>): StaffSpecialist {
    const specialists = this.getSpecialists();
    const newStaff: StaffSpecialist = {
      ...data,
      id: `staff-${Date.now()}`,
      active: data.active !== undefined ? data.active : true,
    };
    specialists.push(newStaff);
    this.saveSpecialists(specialists);
    return newStaff;
  }

  static updateSpecialist(updated: StaffSpecialist): void {
    const specialists = this.getSpecialists();
    const idx = specialists.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      specialists[idx] = updated;
      this.saveSpecialists(specialists);
    }
  }

  static deleteSpecialist(id: string): void {
    const specialists = this.getSpecialists();
    const filtered = specialists.filter(s => s.id !== id);
    this.saveSpecialists(filtered);
  }

  // ==========================================
  // DIGITAL CMS: GOOGLE REVIEWS CRUD
  // ==========================================
  static getReviews(): CustomerReview[] {
    if (typeof window === 'undefined') return DEFAULT_REVIEWS;
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
      return DEFAULT_REVIEWS;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  }

  static saveReviews(reviews: CustomerReview[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new Event('storage'));
  }

  static createReview(data: Omit<CustomerReview, 'id'>): CustomerReview {
    const reviews = this.getReviews();
    const newReview: CustomerReview = {
      ...data,
      id: `rev-${Date.now()}`,
    };
    reviews.unshift(newReview);
    this.saveReviews(reviews);
    return newReview;
  }

  static updateReview(updated: CustomerReview): void {
    const reviews = this.getReviews();
    const idx = reviews.findIndex(r => r.id === updated.id);
    if (idx !== -1) {
      reviews[idx] = updated;
      this.saveReviews(reviews);
    }
  }

  static deleteReview(id: string): void {
    const reviews = this.getReviews();
    const filtered = reviews.filter(r => r.id !== id);
    this.saveReviews(filtered);
  }

  // ==========================================
  // DIGITAL CMS: GALLERY RUNWAY EXHIBITION CRUD
  // ==========================================
  static getGallery(): GalleryItem[] {
    if (typeof window === 'undefined') return DEFAULT_GALLERY;
    const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
      return DEFAULT_GALLERY;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return DEFAULT_GALLERY;
    } catch {
      return DEFAULT_GALLERY;
    }
  }

  static saveGallery(items: GalleryItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
  }

  static createGalleryItem(data: Omit<GalleryItem, 'id'>): GalleryItem {
    const gallery = this.getGallery();
    const newItem: GalleryItem = {
      ...data,
      id: `gal-${Date.now()}`,
    };
    gallery.unshift(newItem);
    this.saveGallery(gallery);
    return newItem;
  }

  static updateGalleryItem(updated: GalleryItem): void {
    const gallery = this.getGallery();
    const idx = gallery.findIndex(g => g.id === updated.id);
    if (idx !== -1) {
      gallery[idx] = updated;
      this.saveGallery(gallery);
    }
  }

  static deleteGalleryItem(id: string): void {
    const gallery = this.getGallery();
    const filtered = gallery.filter(g => g.id !== id);
    this.saveGallery(filtered);
  }

  // ==========================================
  // DIGITAL CMS: BARE MEDIA SHOWCASE CRUD
  // ==========================================
  static getMediaReels(): MediaReel[] {
    if (typeof window === 'undefined') return DEFAULT_REELS;
    const stored = localStorage.getItem(STORAGE_KEYS.MEDIA_REELS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.MEDIA_REELS, JSON.stringify(DEFAULT_REELS));
      return DEFAULT_REELS;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return DEFAULT_REELS;
    } catch {
      return DEFAULT_REELS;
    }
  }

  static saveMediaReels(reels: MediaReel[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MEDIA_REELS, JSON.stringify(reels));
    window.dispatchEvent(new Event('storage'));
  }

  static createMediaReel(data: Omit<MediaReel, 'id'>): MediaReel {
    const reels = this.getMediaReels();
    const newReel: MediaReel = {
      ...data,
      id: `reel-${Date.now()}`,
    };
    reels.unshift(newReel);
    this.saveMediaReels(reels);
    return newReel;
  }

  static updateMediaReel(updated: MediaReel): void {
    const reels = this.getMediaReels();
    const idx = reels.findIndex(r => r.id === updated.id);
    if (idx !== -1) {
      reels[idx] = updated;
      this.saveMediaReels(reels);
    }
  }

  static deleteMediaReel(id: string): void {
    const reels = this.getMediaReels();
    const filtered = reels.filter(r => r.id !== id);
    this.saveMediaReels(filtered);
  }

  /**
   * Outbox SMS & WhatsApp Log Simulator
   * Note: Client-side simulator; in production, route through backend Twilio / Notify.lk adapter.
   */
  static recordOutboxMessage(recipientPhone: string, text: string): void {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEYS.SMS_OUTBOX);
    const list = stored ? JSON.parse(stored) : [];
    list.unshift({
      id: `sms-${Date.now()}`,
      phone: recipientPhone,
      text,
      timestamp: new Date().toISOString(),
      delivered: true,
    });
    localStorage.setItem(STORAGE_KEYS.SMS_OUTBOX, JSON.stringify(list.slice(0, 50)));
  }

  static getOutboxMessages(): Array<{ id: string; phone: string; text: string; timestamp: string; delivered: boolean }> {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.SMS_OUTBOX);
    return stored ? JSON.parse(stored) : [];
  }

  // TODO(2026-10-21): Replace localStorage storage provider with Supabase PostgreSQL client and Realtime channels.
  // TODO(2026-10-21): Replace SMS outbox simulator with live Twilio / Notify.lk server-side webhook dispatcher.
}
