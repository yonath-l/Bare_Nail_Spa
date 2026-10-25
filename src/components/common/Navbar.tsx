import { asset } from '../../utils/assetHelper';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Menu, X, ShieldCheck, Home } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { useLoyalty } from '../../context/LoyaltyContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useLoyalty();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCurrent = (path: string) => location.pathname === path;

  // Seamless Anchor Scroll Handler (Fixes navigation from another page to #about or #reviews)
  const handleAnchorNavigate = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      // Currently on Home page: scroll smoothly directly to section
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${sectionId}`);
      }
    } else {
      // Navigating from another route (e.g. /services, /gallery, etc.)
      navigate(`/#${sectionId}`);
      // Fallback timer to guarantee smooth scroll after route change
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-linen-100/98 backdrop-blur-md border-b border-champagne/50 shadow-luxury-subtle py-1'
        : 'bg-linen-100/85 backdrop-blur-sm border-b border-champagne/30 py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo Symbol with Original Background */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center group py-0.5 shrink-0">
          <img 
            src={asset('assets/logo-nav.png')} 
            alt={BRAND_CONFIG.studioName}
            className="h-10 sm:h-12 md:h-13 w-auto object-contain rounded-xl shadow-xs border border-champagne/40 bg-[#CFC6BD] transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Enhanced Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center bg-white/70 border border-rosewood/15 rounded-full px-2 py-1 shadow-xs">
          {/* 1. Home */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-luxury transition-all duration-200 ${
              isCurrent('/') && !location.hash
                ? 'bg-rosewood text-white font-medium shadow-xs'
                : 'text-espresso/75 hover:text-rosewood hover:bg-rosewood/10'
            }`}
          >
            Home
          </Link>

          {/* 2. Services */}
          <Link
            to="/services"
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-luxury transition-all duration-200 ${
              isCurrent('/services')
                ? 'bg-rosewood text-white font-medium shadow-xs'
                : 'text-espresso/75 hover:text-rosewood hover:bg-rosewood/10'
            }`}
          >
            Services
          </Link>

          {/* 3. Gallery */}
          <Link
            to="/gallery"
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-luxury transition-all duration-200 ${
              isCurrent('/gallery')
                ? 'bg-rosewood text-white font-medium shadow-xs'
                : 'text-espresso/75 hover:text-rosewood hover:bg-rosewood/10'
            }`}
          >
            Gallery
          </Link>

          {/* 4. About Us (Smooth Anchor) */}
          <a
            href="/#about"
            onClick={(e) => handleAnchorNavigate(e, 'about')}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-luxury transition-all duration-200 ${
              isCurrent('/') && location.hash === '#about'
                ? 'bg-rosewood text-white font-medium shadow-xs'
                : 'text-espresso/75 hover:text-rosewood hover:bg-rosewood/10'
            }`}
          >
            About Us
          </a>

          {/* 5. Reviews (Smooth Anchor) */}
          <a
            href="/#reviews"
            onClick={(e) => handleAnchorNavigate(e, 'reviews')}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-luxury transition-all duration-200 ${
              isCurrent('/') && location.hash === '#reviews'
                ? 'bg-rosewood text-white font-medium shadow-xs'
                : 'text-espresso/75 hover:text-rosewood hover:bg-rosewood/10'
            }`}
          >
            Reviews
          </a>

          {/* 6. Interactive Loyalty Pass */}
          <Link
            to="/loyalty"
            className={`ml-1 flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs uppercase tracking-luxury transition-all duration-300 ${
              isCurrent('/loyalty')
                ? 'bg-espresso text-linen border-champagne shadow-luxury-gold'
                : 'border-champagne/80 bg-champagne/15 text-espresso hover:bg-champagne/30 shadow-xs'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-champagne"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span className="font-medium">
              Loyalty Pass
            </span>
          </Link>
        </nav>

        {/* Action Button & Reservation CTA (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/book"
            className="btn-sheen inline-flex items-center space-x-2 bg-gradient-to-r from-rosewood to-espresso hover:from-rosewood-dark hover:to-espresso text-white px-5 py-2.5 rounded-full text-xs uppercase tracking-luxury font-medium transition-all duration-300 shadow-luxury-subtle hover:shadow-luxury-gold hover:scale-[1.02] border border-champagne/30"
          >
            <Calendar className="w-3.5 h-3.5 text-champagne-light" />
            <span>Book a Session</span>
          </Link>
        </div>

        {/* Mobile Right Controls: Book a Session CTA + Loyalty + Hamburger */}
        <div className="flex md:hidden items-center space-x-1.5 sm:space-x-2 shrink-0">
          <Link
            to="/book"
            className="btn-sheen inline-flex items-center space-x-1.5 bg-gradient-to-r from-rosewood to-espresso hover:from-rosewood-dark hover:to-espresso text-white px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs uppercase tracking-luxury font-medium shadow-luxury-subtle border border-champagne/30 active:scale-95 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-champagne-light shrink-0" />
            <span>Book a Session</span>
          </Link>

          <Link
            to="/loyalty"
            aria-label="Loyalty Pass"
            className="p-2 rounded-full border border-champagne/60 bg-champagne/15 text-espresso shadow-xs hover:bg-champagne/25 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-champagne-dark" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-espresso hover:text-rosewood border border-rosewood/15 rounded-xl bg-white/70 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Exquisite Champagne Micro-Hairline Accent Line */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-champagne/50 to-transparent"></div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-linen-100 border-b border-rosewood/15 px-6 pt-4 pb-6 space-y-4 shadow-xl animate-fade-in">
          <div className="flex flex-col space-y-2">
            {/* 1. Home */}
            <Link
              to="/"
              onClick={handleHomeClick}
              className={`text-sm uppercase tracking-luxury font-medium py-2 px-3 rounded-xl transition-colors ${
                isCurrent('/') && !location.hash
                  ? 'bg-rosewood text-white'
                  : 'text-espresso/90 hover:bg-rosewood/10 hover:text-rosewood'
              }`}
            >
              Home
            </Link>

            {/* 2. Services */}
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm uppercase tracking-luxury font-medium py-2 px-3 rounded-xl transition-colors ${
                isCurrent('/services')
                  ? 'bg-rosewood text-white'
                  : 'text-espresso/90 hover:bg-rosewood/10 hover:text-rosewood'
              }`}
            >
              Services
            </Link>

            {/* 3. Gallery */}
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm uppercase tracking-luxury font-medium py-2 px-3 rounded-xl transition-colors ${
                isCurrent('/gallery')
                  ? 'bg-rosewood text-white'
                  : 'text-espresso/90 hover:bg-rosewood/10 hover:text-rosewood'
              }`}
            >
              Gallery
            </Link>

            {/* 4. About Us */}
            <a
              href="/#about"
              onClick={(e) => handleAnchorNavigate(e, 'about')}
              className={`text-sm uppercase tracking-luxury font-medium py-2 px-3 rounded-xl transition-colors ${
                isCurrent('/') && location.hash === '#about'
                  ? 'bg-rosewood text-white'
                  : 'text-espresso/90 hover:bg-rosewood/10 hover:text-rosewood'
              }`}
            >
              About Us
            </a>

            {/* 5. Reviews */}
            <a
              href="/#reviews"
              onClick={(e) => handleAnchorNavigate(e, 'reviews')}
              className={`text-sm uppercase tracking-luxury font-medium py-2 px-3 rounded-xl transition-colors ${
                isCurrent('/') && location.hash === '#reviews'
                  ? 'bg-rosewood text-white'
                  : 'text-espresso/90 hover:bg-rosewood/10 hover:text-rosewood'
              }`}
            >
              Reviews
            </a>

            {/* 6. Loyalty Pass */}
            <Link
              to="/loyalty"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-espresso text-linen border border-champagne/50 shadow-sm mt-1"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-champagne" />
                <span className="text-xs uppercase tracking-luxury font-medium">
                  {profile ? `Loyalty Card: ${profile.fullName} (${profile.currentVisits}/10)` : 'Open Loyalty Pass'}
                </span>
              </div>
              <span className="text-[10px] bg-champagne text-espresso px-2 py-0.5 rounded-full font-semibold">
                TAP TO STAMP
              </span>
            </Link>

            {/* Admin Desk Link */}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-1.5 text-[11px] text-espresso/50 hover:text-espresso py-2 pt-3"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Reception & Cashier Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
