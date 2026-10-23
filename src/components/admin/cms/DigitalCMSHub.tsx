import React, { useState } from 'react';
import { Sparkles, Users, MessageSquare, Image as ImageIcon, Film } from 'lucide-react';
import { ServicesMenuCMS } from './ServicesMenuCMS';
import { StaffDirectoryCMS } from './StaffDirectoryCMS';
import { GoogleReviewsCMS } from './GoogleReviewsCMS';
import { GalleryCMS } from './GalleryCMS';
import { MediaShowcaseCMS } from './MediaShowcaseCMS';

type DigitalCmsSection = 'services' | 'staff' | 'reviews' | 'gallery' | 'media';

interface DigitalCMSHubProps {
  onRefreshGlobal?: () => void;
  onShowSuccess: (msg: string) => void;
}

export const DigitalCMSHub: React.FC<DigitalCMSHubProps> = ({
  onRefreshGlobal,
  onShowSuccess,
}) => {
  const [activeSection, setActiveSection] = useState<DigitalCmsSection>('services');

  return (
    <div className="space-y-6 text-[#4A4A4A]">
      
      {/* DIGITAL CMS SUB-NAVIGATION BAR (Cream/Vanilla FDF4D2 Capsule Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2 bg-[#FDF4D2] rounded-full shadow-xs border border-[#E2B4BD]/40">
        <div className="flex flex-wrap items-center gap-1.5">
          
          <button
            onClick={() => setActiveSection('services')}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSection === 'services'
                ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Services & Rituals Catalog</span>
          </button>

          <button
            onClick={() => setActiveSection('staff')}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSection === 'staff'
                ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Directory & Categories</span>
          </button>

          <button
            onClick={() => setActiveSection('reviews')}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSection === 'reviews'
                ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Google Reviews Posts</span>
          </button>

          <button
            onClick={() => setActiveSection('gallery')}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSection === 'gallery'
                ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Runway Gallery Looks</span>
          </button>

          <button
            onClick={() => setActiveSection('media')}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSection === 'media'
                ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Bare Media Showcase</span>
          </button>

        </div>

        <div className="px-5 text-right hidden lg:block text-xs font-semibold text-[#4A4A4A]/70">
          Digital Atelier CMS
        </div>
      </div>

      {/* ACTIVE SUB-SECTION VIEW */}
      {activeSection === 'services' && (
        <ServicesMenuCMS
          onRefreshGlobal={onRefreshGlobal}
          onShowSuccess={onShowSuccess}
        />
      )}

      {activeSection === 'staff' && (
        <StaffDirectoryCMS
          onRefreshGlobal={onRefreshGlobal}
          onShowSuccess={onShowSuccess}
        />
      )}

      {activeSection === 'reviews' && (
        <GoogleReviewsCMS
          onRefreshGlobal={onRefreshGlobal}
          onShowSuccess={onShowSuccess}
        />
      )}

      {activeSection === 'gallery' && (
        <GalleryCMS
          onRefreshGlobal={onRefreshGlobal}
          onShowSuccess={onShowSuccess}
        />
      )}

      {activeSection === 'media' && (
        <MediaShowcaseCMS
          onRefreshGlobal={onRefreshGlobal}
          onShowSuccess={onShowSuccess}
        />
      )}

    </div>
  );
};
