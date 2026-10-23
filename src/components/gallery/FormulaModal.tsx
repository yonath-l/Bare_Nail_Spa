import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Shield, Clock, Droplet, Layers, Calendar } from 'lucide-react';
import { GalleryItem } from '../../types';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface FormulaModalProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !item) return null;

  const handleBookLook = () => {
    onClose();
    navigate('/book');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-linen rounded-3xl border border-champagne/50 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-espresso/70 hover:text-espresso rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label="Close Recipe Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Nail Photography */}
        <div className="md:w-5/12 relative aspect-square md:aspect-auto">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent md:hidden flex items-end p-4">
            <span className="text-linen font-serif text-lg font-semibold">{item.title}</span>
          </div>
        </div>

        {/* Right Side: Artisan Formula Recipe Breakdown */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-luxury text-clay font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-champagne" />
              <span>Bespoke Chemical & Pigment Recipe</span>
            </div>
            
            <h3 className="font-serif text-2xl font-semibold text-espresso leading-snug">
              {item.title}
            </h3>
            
            <p className="text-xs text-espresso/60 mt-1">
              Artisan Creator: <strong className="text-rosewood font-medium">{item.artisanName}</strong> · {item.treatmentDuration}
            </p>
          </div>

          {/* Formula Specification Cards */}
          <div className="space-y-3">
            
            <div className="p-3 rounded-2xl bg-white/80 border border-rosewood/15 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-champagne/15 text-rosewood shrink-0 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] uppercase tracking-wider text-clay font-bold block">
                  Artisan Chemical Base
                </span>
                <span className="font-medium text-espresso">
                  {item.formula.chemicalBase}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/80 border border-rosewood/15 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-champagne/15 text-rosewood shrink-0 mt-0.5">
                <Droplet className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] uppercase tracking-wider text-clay font-bold block">
                  Pigment Chemistry & Code
                </span>
                <span className="font-medium text-espresso">
                  {item.formula.pigmentCode}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/80 border border-rosewood/15 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-champagne/15 text-rosewood shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] uppercase tracking-wider text-clay font-bold block">
                  Apex Strength & C-Curve
                </span>
                <span className="font-medium text-espresso">
                  {item.formula.apexStrengthRating}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/80 border border-rosewood/15">
                <span className="text-[10px] uppercase tracking-wider text-clay font-bold block">
                  Longevity Guard
                </span>
                <span className="font-medium text-espresso flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-champagne" />
                  <span>{item.formula.wearLongevity}</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-rosewood/15">
                <span className="text-[10px] uppercase tracking-wider text-clay font-bold block">
                  Cure Cycle
                </span>
                <span className="font-medium text-espresso mt-0.5 block">
                  {item.formula.cureTime}
                </span>
              </div>
            </div>

          </div>

          {/* Pricing & Reservation CTA */}
          <div className="pt-4 border-t border-rosewood/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-clay block">
                Session Fee
              </span>
              <span className="font-serif text-xl font-bold text-espresso">
                {BRAND_CONFIG.currency.format(item.priceLKR)}
              </span>
            </div>

            <button
              onClick={handleBookLook}
              className="inline-flex items-center space-x-2 bg-rosewood hover:bg-rosewood-dark text-white px-5 py-2.5 rounded-full text-xs uppercase tracking-luxury font-medium shadow-luxury-subtle transition-all duration-300"
            >
              <Calendar className="w-3.5 h-3.5 text-champagne" />
              <span>Book This Look</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
