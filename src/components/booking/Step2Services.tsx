import React, { useState } from 'react';
import { Check, Clock, Sparkles, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { SalonDataService } from '../../services/salonDataService';
import { TreatmentCategory } from '../../types';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const Step2Services: React.FC = () => {
  const {
    selectedSpecialist,
    isFirstAvailableSpecialist,
    selectedServices,
    toggleService,
    calculatedOriginalPrice,
    calculatedTotalMinutes,
    setCurrentStep,
  } = useBooking();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const allServices = SalonDataService.getServices();

  // If a specific specialist is chosen, enforce their qualified categories
  const isSpecificSpecialist = selectedSpecialist && !isFirstAvailableSpecialist;
  const qualifiedCategories: TreatmentCategory[] =
    isSpecificSpecialist && selectedSpecialist.specialties && selectedSpecialist.specialties.length > 0
      ? selectedSpecialist.specialties
      : [
          'Manicures',
          'Hand Massage',
          'Pedicures',
          'Foot Massage',
          'Acrylic Extensions',
          'Gel Extensions',
          'Nail Services',
          "Men's Services",
          "Kid's Services",
          'Add-ons',
        ];

  const categories: string[] = ['ALL', ...qualifiedCategories];

  const filteredServices = allServices.filter(s => {
    // Enforce specialist qualification
    if (isSpecificSpecialist && selectedSpecialist.specialties && selectedSpecialist.specialties.length > 0) {
      if (!selectedSpecialist.specialties.includes(s.category)) {
        return false;
      }
    }
    // Enforce active category filter
    if (activeCategory !== 'ALL' && s.category !== activeCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-rosewood/10">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-clay font-bold">
            Step 2 of 4
          </span>
          <h2 className="font-serif text-3xl font-semibold text-espresso">
            Select Your Bespoke Rituals
          </h2>
          <p className="text-xs text-espresso/70 mt-1">
            Multi-select your treatments. You can combine manicures, pedicures, and nail art.
          </p>

          {isSpecificSpecialist && (
            <div className="inline-flex items-center space-x-2 mt-2 px-3 py-1 rounded-full bg-champagne/20 border border-champagne/40 text-[11px] text-espresso">
              <ShieldCheck className="w-3.5 h-3.5 text-rosewood" />
              <span>
                Showing rituals qualified for <strong>{selectedSpecialist.name}</strong> ({selectedSpecialist.specialties.join(', ')})
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-center">
          <button
            onClick={() => setCurrentStep(1)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-rosewood/25 text-espresso hover:bg-rosewood/10 text-xs uppercase tracking-luxury font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {/* Running Tally Card */}
          <div className="bg-white/90 p-2.5 px-4 rounded-2xl border border-rosewood/20 flex items-center space-x-4 shrink-0 shadow-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-clay block">
                Duration
              </span>
              <span className="font-serif text-xs sm:text-sm font-bold text-espresso flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-rosewood" />
                <span>{calculatedTotalMinutes}m</span>
              </span>
            </div>
            <div className="h-6 w-px bg-rosewood/20"></div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-clay block">
                Subtotal
              </span>
              <span className="font-serif text-xs sm:text-sm font-bold text-espresso">
                {BRAND_CONFIG.currency.format(calculatedOriginalPrice)}
              </span>
            </div>
          </div>

          {/* Right-Top Next Step Button */}
          <button
            onClick={() => setCurrentStep(3)}
            className="inline-flex items-center space-x-2 bg-rosewood hover:bg-rosewood-dark text-white px-7 py-3 rounded-full text-xs uppercase tracking-luxury font-medium shadow-luxury-subtle transition-all duration-300 cursor-pointer"
          >
            <span>Select Date & Time</span>
            <ArrowRight className="w-4 h-4 text-champagne" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-luxury whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-espresso text-linen shadow-sm'
                : 'bg-white/80 text-espresso/70 hover:text-espresso border border-rosewood/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map(service => {
          const isSelected = selectedServices.some(s => s.id === service.id);

          return (
            <div
              key={service.id}
              onClick={() => toggleService(service)}
              className={`cursor-pointer p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-linen-100 border-rosewood shadow-luxury-subtle'
                  : 'bg-white/80 border-rosewood/15 hover:border-clay'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-luxury text-clay font-bold">
                      {service.category}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-espresso">
                      {service.title}
                    </h3>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ml-2 ${
                      isSelected
                        ? 'bg-rosewood border-rosewood text-white'
                        : 'border-rosewood/30 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-espresso/70 mt-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Formula Highlights */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {service.formulaHighlights.map((hl, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-white border border-rosewood/10 text-espresso/75 px-2 py-0.5 rounded-full"
                    >
                      {hl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Duration */}
              <div className="pt-4 mt-4 border-t border-rosewood/10 flex items-center justify-between text-xs">
                <span className="text-clay flex items-center space-x-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.durationMinutes} mins</span>
                </span>
                <span className="font-serif text-base font-bold text-espresso">
                  {BRAND_CONFIG.currency.format(service.priceLKR)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
