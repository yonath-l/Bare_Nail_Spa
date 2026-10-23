import React, { useState, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { SalonDataService } from '../services/salonDataService';
import { GalleryCard } from '../components/gallery/GalleryCard';
import { FormulaModal } from '../components/gallery/FormulaModal';
import { GalleryItem } from '../types';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const GalleryPage: React.FC = () => {
  const galleryItems = SalonDataService.getGallery();
  const [activeFormulaItem, setActiveFormulaItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  const handleOpenFormula = (item: GalleryItem) => {
    setActiveFormulaItem(item);
    setIsModalOpen(true);
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      galleryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <ScrollReveal direction="up">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-champagne/20 border border-champagne/40 px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wide-luxury text-rosewood font-bold animate-float-slow">
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span>Haute Exhibition & Precision Formulas</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-espresso">
            Center-Stage <span className="italic text-rosewood">Runway Gallery</span>
          </h1>

          <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed font-light max-w-2xl mx-auto">
            Each nail portrait represents an artisan formula calibrated for apex durability, skin-tone harmony, and zero-lift retention. Swipe horizontally or use the navigation controls to explore the looks.
          </p>
        </div>
      </ScrollReveal>

      {/* Horizontal Carousel Controls & Status Header */}
      <ScrollReveal direction="up" delayMs={100}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-b border-rosewood/10 pb-4">
          <div className="flex items-center space-x-2 text-xs text-clay">
            <span className="font-semibold text-espresso">{galleryItems.length}</span>
            <span>Curated Runway Looks</span>
            <span className="text-clay/50">·</span>
            <span className="text-rosewood font-medium flex items-center space-x-1">
              <span>Scroll left or right to view more</span>
              <ArrowRight className="w-3.5 h-3.5 inline" />
            </span>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={() => scrollGallery('left')}
              aria-label="Previous runway looks"
              className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-espresso hover:text-rosewood border border-rosewood/15 flex items-center justify-center shadow-luxury-subtle hover:shadow-luxury-elevated transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollGallery('right')}
              aria-label="Next runway looks"
              className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-espresso hover:text-rosewood border border-rosewood/15 flex items-center justify-center shadow-luxury-subtle hover:shadow-luxury-elevated transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Gallery Runway Track (Left-to-Right Scrolling) */}
        <div
          ref={galleryScrollRef}
          className="flex items-stretch space-x-6 overflow-x-auto pb-8 pt-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {galleryItems.map(item => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] snap-start"
            >
              <GalleryCard
                item={item}
                onOpenFormula={handleOpenFormula}
              />
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Formula Recipe Inspection Modal */}
      <FormulaModal
        item={activeFormulaItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};
