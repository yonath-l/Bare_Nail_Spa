import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Instagram, Clock, ShieldCheck, Heart } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cocoa text-linen border-t border-champagne/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-linen/10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/logo.jpg" 
                alt={BRAND_CONFIG.studioName}
                className="w-10 h-10 rounded-full border border-champagne/40 object-cover" 
              />
              <span className="font-serif text-2xl tracking-wide font-semibold text-linen">
                {BRAND_CONFIG.studioName}
              </span>
            </div>
            <p className="text-xs text-linen/70 leading-relaxed font-light">
              A high-ticket sanctuary designed for intentional beauty, clinical-grade dry Russian manicures, and bespoke builder gel architecture.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com/bare.nailspa"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-espresso text-champagne hover:text-white hover:bg-clay transition-colors"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-espresso text-champagne hover:text-white hover:bg-clay transition-colors"
                aria-label="WhatsApp Concierge"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Studio Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-luxury text-champagne font-medium">
              Atelier Location
            </h4>
            <div className="flex items-start space-x-2 text-xs text-linen/80">
              <MapPin className="w-4 h-4 text-clay shrink-0 mt-0.5" />
              <span>
                {BRAND_CONFIG.address}<br />
                {BRAND_CONFIG.city} {BRAND_CONFIG.postalCode}, Sri Lanka
              </span>
            </div>
            <div className="flex items-start space-x-2 text-xs text-linen/80 pt-2">
              <Clock className="w-4 h-4 text-clay shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-linen">{BRAND_CONFIG.operatingHours.days}</p>
                <p className="text-linen/70">{BRAND_CONFIG.operatingHours.hours}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-luxury text-champagne font-medium">
              Sanctuary
            </h4>
            <ul className="space-y-2 text-xs text-linen/75">
              <li>
                <Link to="/" className="hover:text-champagne transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-champagne transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-champagne transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-champagne transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#reviews" className="hover:text-champagne transition-colors">
                  Reviews
                </a>
              </li>
              <li>
                <Link to="/loyalty" className="hover:text-champagne transition-colors flex items-center space-x-1.5">
                  <span>Interactive VIP Stamp Pass</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-champagne text-espresso font-bold rounded">
                    HOT
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-champagne transition-colors">
                  Reservation Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Sterilization & Reception */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-luxury text-champagne font-medium">
              Medical-Grade Standard
            </h4>
            <p className="text-xs text-linen/70 leading-relaxed">
              Every surgical-grade diamond bit and stainless instrument is sterilized in high-temperature autoclaves and unsealed in front of each guest.
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center space-x-1.5 text-[11px] text-champagne/80 hover:text-champagne border border-champagne/30 rounded-lg px-2.5 py-1 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff & Reception POS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-linen/50 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.studioName}. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-clay fill-clay" />
            <span>for high-ticket salon experiences in Malabe</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
