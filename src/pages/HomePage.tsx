import { asset } from '../utils/assetHelper';
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  Star,
  CheckCircle2,
  Coffee,
  ArrowRight,
  Instagram,
  Crown,
  Play,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brandConfig';
import { useLoyalty } from '../context/LoyaltyContext';
import {
  SalonDataService,
} from '../services/salonDataService';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const HomePage: React.FC = () => {
  const reviews = SalonDataService.getReviews();
  const reels = SalonDataService.getMediaReels();
  const { profile } = useLoyalty();
  const navigate = useNavigate();
  const mediaSliderRef = useRef<HTMLDivElement>(null);
  const reviewsSliderRef = useRef<HTMLDivElement>(null);

  const scrollMedia = (direction: 'left' | 'right') => {
    if (mediaSliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      mediaSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsSliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      reviewsSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-start overflow-hidden pt-8 pb-16">
        
        {/* Background Ambient Video Veil */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={asset('assets/hero-poster.jpg')}
            className="w-full h-full object-cover filter brightness-[0.82] contrast-[1.05]"
          >
            <source src={asset('assets/hero-loop.mp4')} type="video/mp4" />
          </video>
          {/* Directional Translucent Soft Gradient: Darker on the left for crisp text contrast, revealing video on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/65 to-espresso/35 sm:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-linen via-transparent to-transparent"></div>
        </div>

        {/* Hero Content Box - Left Aligned */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <ScrollReveal direction="up" delayMs={60}>
            <div className="max-w-2xl text-left text-linen space-y-6">
              
              {/* Top Atelier Badge with Floating Effect */}
              <div className="inline-flex items-center space-x-2 bg-linen/15 backdrop-blur-md border border-champagne/40 px-4 py-1.5 rounded-full text-xs uppercase tracking-wide-luxury text-champagne-light shadow-luxury-gold animate-float-slow">
                <span className="w-2 h-2 rounded-full bg-champagne animate-ping"></span>
                <span>Haute Parisian & Russian Nail Atelier · Malabe</span>
              </div>

              {/* Editorial Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-linen leading-[1.12]">
                Pure, Uncompromised <br />
                <span className="italic font-normal text-champagne-light">Architectural</span> Luxury.
              </h1>

              {/* Subhead Paragraph */}
              <p className="max-w-xl text-left text-sm sm:text-base text-linen/90 leading-relaxed font-light">
                {BRAND_CONFIG.editorialSubhead} Clinical-grade dry Russian e-file manicures, organic builder gel overlays, and bespoke VIP hospitality.
              </p>

              {/* Action CTAs with Luxury Sheen */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 pt-2">
                <Link
                  to="/book"
                  className="btn-sheen w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-rosewood hover:bg-rosewood-dark text-white px-8 py-4 rounded-full text-xs uppercase tracking-luxury font-medium shadow-luxury-gold hover:shadow-luxury-elevated transition-all duration-300 border border-champagne/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar className="w-4 h-4 text-champagne" />
                  <span>Reserve Atelier Session</span>
                </Link>

                <Link
                  to="/services"
                  className="btn-sheen w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-white/95 hover:bg-white text-espresso hover:text-rosewood px-8 py-4 rounded-full text-xs uppercase tracking-luxury font-medium shadow-luxury-subtle hover:shadow-luxury-gold transition-all duration-300 border border-rosewood/15 group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Service Menu</span>
                  <ArrowRight className="w-4 h-4 text-rosewood group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>

              {/* Micro Status & Verified Review Badges - Left Aligned */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-[11px] text-linen/80 uppercase tracking-luxury">
                <div className="inline-flex items-center space-x-2 bg-linen/20 backdrop-blur-md border border-champagne/35 px-3.5 py-1.5 rounded-full text-[11px] text-linen shadow-xs hover:border-champagne/60 transition-colors">
                  <div className="flex text-champagne">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold text-white">4.9</span>
                  <span className="text-linen/50">·</span>
                  <span className="text-[10px] uppercase tracking-luxury text-linen/95 font-medium">Verified Reviews</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-champagne" />
                    <span>100% Autoclave Grade 5</span>
                  </div>
                  <span className="text-linen/40">·</span>
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-champagne" />
                    <span>Non-Toxic Japanese Gels</span>
                  </div>
                  <span className="text-linen/40">·</span>
                  <div className="flex items-center space-x-1.5">
                    <Coffee className="w-4 h-4 text-champagne" />
                    <span>Ceylon Tea Ritual</span>
                  </div>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. WHY US: LUXURY ATELIER PILLARS */}
      <section className="relative isolate py-16 sm:py-20 overflow-hidden">
        {/* Atmospheric Background Image Layer (z-0 to sit firmly above page canvas) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={asset('assets/home/bg-elevating.jpg')}
            alt="Elevating Nail Care Ambiance"
            className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
          />
          {/* Translucent Linen Wash - Image clearly visible while protecting text */}
          <div className="absolute inset-0 bg-gradient-to-b from-linen/85 via-linen/60 to-linen/85"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 bg-linen-100/75 backdrop-blur-sm py-4 px-6 rounded-3xl border border-rosewood/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wide-luxury text-clay font-bold">
                The Haute Difference
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso">
                Elevating Nail Care to an Art Form
              </h2>
              <p className="text-xs sm:text-sm text-espresso/80 leading-relaxed font-light">
                Unlike rapid walk-in parlors, Bare Nail Spa operates as a private sanctuary where each appointment is unhurried, meticulous, and medically safeguarded.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <ScrollReveal direction="up" delayMs={0}>
              <div className="card-luxury group bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-rosewood/15 hover:border-champagne/60 shadow-luxury-subtle hover:shadow-luxury-elevated space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-champagne/20 border border-champagne/50 flex items-center justify-center text-rosewood group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-espresso group-hover:text-rosewood transition-colors">
                    Autoclave Medical Grade
                  </h3>
                  <p className="text-xs text-espresso/80 leading-relaxed font-light">
                    Every surgical-grade diamond bit and instrument is processed in our hospital-grade autoclave at 134°C. Pouch seals are opened in front of you. Zero exceptions.
                  </p>
                </div>
                <div className="pt-2 border-t border-rosewood/10">
                  <span className="text-[10px] uppercase tracking-luxury text-clay font-bold block">
                    Class B Sterilizer Standard
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delayMs={150}>
              <div className="card-luxury group bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-rosewood/15 hover:border-champagne/60 shadow-luxury-subtle hover:shadow-luxury-elevated space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-champagne/20 border border-champagne/50 flex items-center justify-center text-rosewood group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-espresso group-hover:text-rosewood transition-colors">
                    Russian E-File Precision
                  </h3>
                  <p className="text-xs text-espresso/80 leading-relaxed font-light">
                    Our dry electric-filing technique gently cleanses cuticles without soaking in water. This prevents premature water-loss shrinkage and delivers 4+ weeks of lift-free wear.
                  </p>
                </div>
                <div className="pt-2 border-t border-rosewood/10">
                  <span className="text-[10px] uppercase tracking-luxury text-clay font-bold block">
                    4+ Weeks Flawless Longevity
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delayMs={300}>
              <div className="card-luxury group bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-rosewood/15 hover:border-champagne/60 shadow-luxury-subtle hover:shadow-luxury-elevated space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-champagne/20 border border-champagne/50 flex items-center justify-center text-rosewood group-hover:scale-110 transition-transform duration-300">
                    <Coffee className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-espresso group-hover:text-rosewood transition-colors">
                    Artisan Tea & Silent Sessions
                  </h3>
                  <p className="text-xs text-espresso/80 leading-relaxed font-light">
                    Indulge in complimentary single-estate Ceylon Silver Tips tea. If you need peace after an exhausting week, select our Silent Session option with zero awkward small talk.
                  </p>
                </div>
                <div className="pt-2 border-t border-rosewood/10">
                  <span className="text-[10px] uppercase tracking-luxury text-clay font-bold block">
                    Mindful Sensory Sanctuary
                  </span>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* 3. ABOUT US & STERILIZATION METRICS BENTO */}
      <section id="about" className="relative isolate py-16 sm:py-20 scroll-mt-28 overflow-hidden">
        {/* Atmospheric Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={asset('assets/home/bg-sanctuary.jpg')}
            alt="Sanctuary Architecture Ambiance"
            className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-linen/85 via-linen/60 to-linen/85"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Atelier Interior Photos */}
            <div className="lg:col-span-6">
              <ScrollReveal direction="left" delayMs={50}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl overflow-hidden border border-rosewood/15 shadow-luxury-subtle group">
                    <img
                      src={asset('assets/about-interior-1.jpg')}
                      alt="Bare Nail Spa Atelier Interior"
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-3xl overflow-hidden border border-rosewood/15 shadow-luxury-subtle group">
                      <img
                        src={asset('assets/store-interior.webp')}
                        alt="Bare Nail Spa Pedicure Suites"
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="rounded-3xl overflow-hidden border border-rosewood/15 shadow-luxury-subtle group">
                      <img
                        src={asset('assets/about-interior-2.jpg')}
                        alt="Bare Nail Spa Decor"
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Narrative & Metrics Bento */}
            <div className="lg:col-span-6">
              <ScrollReveal direction="right" delayMs={150}>
                <div className="space-y-6 bg-linen-100/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-rosewood/15 shadow-luxury-subtle">
                  <span className="text-[10px] uppercase tracking-wide-luxury text-clay font-bold">
                    The Story of Bare
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso leading-tight">
                    An Architectural Sanctuary Designed for <span className="italic">You</span>.
                  </h2>
                  <p className="text-xs sm:text-sm text-espresso/80 leading-relaxed font-light">
                    Located on Athurugiriya Road in Malabe, Bare Nail Spa was envisioned to solve the shortcomings of mainstream nail bars: rushing clients through, using questionable sterilization jars, and causing nail-bed thinning from over-drilling.
                  </p>
                  <p className="text-xs sm:text-sm text-espresso/80 leading-relaxed font-light">
                    We practice mindful, restorative nail care. We preserve the natural nail apex, fortify weak plates with BIAB oligomer resin, and maintain an environment of refined European elegance.
                  </p>

                  {/* 3-Metric Bento Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-rosewood/15">
                    <div className="card-luxury p-4 rounded-2xl bg-white/95 backdrop-blur-sm border border-rosewood/15 text-center shadow-xs">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-rosewood block">
                        100%
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-clay font-semibold">
                        Autoclave Sealed
                      </span>
                    </div>
                    <div className="card-luxury p-4 rounded-2xl bg-white/95 backdrop-blur-sm border border-rosewood/15 text-center shadow-xs">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-rosewood block">
                        0%
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-clay font-semibold">
                        Cross Contamination
                      </span>
                    </div>
                    <div className="card-luxury p-4 rounded-2xl bg-white/95 backdrop-blur-sm border border-rosewood/15 text-center shadow-xs">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-rosewood block">
                        4+ Wks
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-clay font-semibold">
                        Regrowth Guarantee
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/services"
                      className="inline-flex items-center space-x-2 text-xs uppercase tracking-luxury text-rosewood hover:text-rosewood-dark font-medium underline underline-offset-8 transition-colors group"
                    >
                      <span>Explore Full Services & Rituals Menu</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE DOPAMINE LOYALTY TEASER */}
      <section id="loyalty" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative isolate rounded-3xl bg-espresso text-linen p-8 sm:p-14 border border-champagne/40 shadow-2xl overflow-hidden">
          
          {/* Background Loyalty Card Texture (Firmly positioned at z-0) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={asset('assets/home/bg-loyalty-card.jpg')}
              alt="Loyalty Card Texture"
              className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1]"
            />
            {/* Deep Cocoa/Espresso Gradient to protect 100% text contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-espresso/85 via-cocoa/80 to-espresso/90"></div>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <ScrollReveal direction="left" delayMs={50}>
                <div className="inline-flex items-center space-x-2 bg-champagne/20 border border-champagne/40 px-3 py-1 rounded-full text-[10px] uppercase tracking-wide-luxury text-champagne font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-champagne animate-pulse-soft" />
                  <span>Zero Password · Physical NFC Tap & Touch Stamp</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-linen leading-tight mt-3">
                  The Bare VIP Loyalty Club. <br />
                  <span className="italic text-champagne-light">Feel the Dopamine Rush.</span>
                </h2>

                <p className="text-xs sm:text-sm text-linen/80 leading-relaxed font-light mt-2">
                  Throw away paper punch cards that get lost in your bag. Our digital pass stays remembered on your smartphone. Tap the salon's physical NFC stamp or press the capacitive seal at checkout to unlock:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                  <div className="card-luxury p-4 rounded-2xl bg-espresso/70 border border-champagne/30 hover:border-champagne/60 space-y-1">
                    <div className="flex items-center space-x-2 text-champagne">
                      <Crown className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Visit #5 Reward</span>
                    </div>
                    <p className="font-serif text-xl font-bold text-linen">50% OFF Privilege</p>
                    <p className="text-[11px] text-linen/60">Half off any manicure, pedicure, or BIAB set.</p>
                  </div>

                  <div className="card-luxury p-4 rounded-2xl bg-espresso/70 border border-champagne/30 hover:border-champagne/60 space-y-1">
                    <div className="flex items-center space-x-2 text-champagne">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Visit #10 Grand Reward</span>
                    </div>
                    <p className="font-serif text-xl font-bold text-linen">100% OFF Privilege</p>
                    <p className="text-[11px] text-linen/60">Up to Rs. 5,000 max cap on full atelier rituals.</p>
                  </div>
                </div>

                <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    to="/loyalty"
                    className="btn-sheen w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-champagne hover:bg-champagne-light text-espresso px-8 py-3.5 rounded-full text-xs uppercase tracking-luxury font-bold shadow-luxury-gold hover:shadow-luxury-elevated transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Open Interactive Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <span className="text-xs text-linen/75 font-light">
                    ✨ Endowed Progress: New signups start with <strong className="text-champagne font-semibold">Stamp #1 Free</strong>!
                  </span>
                </div>
              </ScrollReveal>
            </div>

            {/* Interactive Phone Stamp Graphic with Floating Animation */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal direction="right" delayMs={150}>
                <div className="relative w-64 h-[420px] bg-espresso border-4 border-champagne/50 rounded-[40px] p-4 shadow-2xl flex flex-col justify-between items-center text-center animate-float-slow hover:border-champagne transition-colors">
                  <div className="w-20 h-4 bg-espresso-light rounded-full mb-2"></div>
                  
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-champagne mb-1 ring-2 ring-champagne/30">
                    <img src={asset('assets/logo.jpg')} alt="Logo" className="w-full h-full object-cover" />
                  </div>

                  <span className="font-serif text-lg text-linen font-bold">Bare Loyalty Pass</span>
                  <span className="text-[9px] uppercase tracking-luxury text-champagne">
                    {profile ? profile.fullName : 'Guest Device'}
                  </span>

                  {/* Mini Stamp Ring Preview */}
                  <div className="w-28 h-28 rounded-full border-4 border-dashed border-champagne flex flex-col items-center justify-center bg-champagne/10 my-2 animate-pulse-soft">
                    <Crown className="w-6 h-6 text-champagne mb-1" />
                    <span className="text-[10px] font-bold text-linen uppercase">
                      {profile ? `${profile.currentVisits}/10 Visited` : 'Tap to Stamp'}
                    </span>
                  </div>

                  <div className="w-full bg-linen/10 rounded-xl p-2 text-[10px] text-linen/75">
                    NFC Tap Enabled · NTAG215 Fast
                  </div>

                  <div className="w-24 h-1 bg-white/40 rounded-full mt-2"></div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BARE MEDIA SHOWCASE */}
      <section className="relative isolate py-16 sm:py-20 overflow-hidden">
        {/* Atmospheric Background Image Layer (z-0 to ensure visible canvas layer) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={asset('assets/home/bg-media-showcase.jpg')}
            alt="Bare Media Showcase Ambiance"
            className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-linen/85 via-linen/60 to-linen/85"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 bg-linen-100/75 backdrop-blur-sm py-4 px-6 rounded-3xl border border-rosewood/10 shadow-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wide-luxury text-clay font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-champagne animate-pulse-soft" />
                  <span>LIVE FROM THE ATELIER FLOOR</span>
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso mt-1">
                  Bare Media Showcase
                </h2>
                <p className="text-xs sm:text-sm text-espresso/80 mt-2 font-light">
                  Recent bespoke treatments captured candidly inside our Malabe atelier.{' '}
                  <span className="text-rosewood font-medium">Swipe horizontally to explore looks →</span>
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => scrollMedia('left')}
                  aria-label="Previous media"
                  className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-espresso hover:text-rosewood border border-rosewood/15 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollMedia('right')}
                  aria-label="Next media"
                  className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-espresso hover:text-rosewood border border-rosewood/15 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Horizontal Swipeable Media Track */}
          <ScrollReveal direction="up" delayMs={100}>
            <div
              ref={mediaSliderRef}
              className="flex items-stretch space-x-4 sm:space-x-5 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth snap-x snap-mandatory"
            >
              {reels.map(reel => {
                const isVideo = reel.videoUrl && (reel.videoUrl.endsWith('.mp4') || reel.videoUrl.startsWith('data:video/'));

                return (
                  <div
                    key={reel.id}
                    className="card-luxury flex-shrink-0 w-[220px] sm:w-[260px] aspect-[9/16] rounded-3xl overflow-hidden relative shadow-luxury-subtle hover:shadow-luxury-elevated transition-all duration-300 group select-none snap-start bg-espresso border border-rosewood/10 hover:border-champagne/60 cursor-pointer"
                  >
                    {isVideo ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={reel.posterUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onClick={e => {
                          const v = e.currentTarget;
                          if (v.paused) v.play().catch(() => {});
                          else v.pause();
                        }}
                        onMouseEnter={e => e.currentTarget.play().catch(() => {})}
                      >
                        <source src={reel.videoUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={reel.posterUrl || reel.videoUrl}
                        alt={reel.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. VERIFIED GOOGLE REVIEWS HUB */}
      <section id="reviews" className="relative isolate py-16 sm:py-20 scroll-mt-28 overflow-hidden">
        {/* Atmospheric Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={asset('assets/home/bg-patrons-say.jpg')}
            alt="Patrons Review Ambiance"
            className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-linen/85 via-linen/60 to-linen/85"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 bg-linen-100/75 backdrop-blur-sm py-4 px-6 rounded-3xl border border-rosewood/10 shadow-xs">
              <div>
                <div className="flex items-center space-x-1.5 text-champagne mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-champagne" />
                  ))}
                  <span className="text-xs font-bold text-espresso font-mono ml-1.5">4.9 / 5.0</span>
                </div>
                <span className="text-[10px] uppercase tracking-wide-luxury text-clay font-bold block">
                  4.9 Stars Across Verified Google Reviews
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso mt-1">
                  What Our Patrons Say
                </h2>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => scrollReviews('left')}
                  aria-label="Previous reviews"
                  className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-espresso hover:text-rosewood border border-rosewood/15 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollReviews('right')}
                  aria-label="Next reviews"
                  className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-espresso hover:text-rosewood border border-rosewood/15 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Horizontal Swipeable Track */}
          <ScrollReveal direction="up" delayMs={100}>
            <div
              ref={reviewsSliderRef}
              className="flex items-stretch space-x-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
            >
              {reviews.map(rev => (
                <div
                  key={rev.id}
                  className="card-luxury flex-shrink-0 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-rosewood/15 hover:border-champagne/60 shadow-luxury-subtle flex flex-col justify-between space-y-4 snap-start group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-champagne">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-champagne" />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-clay font-medium">
                        {rev.date}
                      </span>
                    </div>

                    {/* Plain text review rendering (Rule 2) */}
                    <p className="text-xs text-espresso/80 leading-relaxed font-light italic">
                      "{rev.reviewText}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-rosewood/10 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-serif font-bold text-espresso group-hover:text-rosewood transition-colors">
                        {rev.authorName}
                      </h4>
                      <span className="text-[10px] text-clay">
                        {rev.treatmentName}
                      </span>
                    </div>
                    <span className="text-[9px] bg-champagne/15 text-espresso font-medium px-2 py-0.5 rounded-full border border-champagne/30">
                      Google Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};
