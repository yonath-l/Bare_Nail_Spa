import React from 'react';
import { Star, Check, Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { SalonDataService } from '../../services/salonDataService';

export const Step1Specialist: React.FC = () => {
  const {
    selectedSpecialist,
    isFirstAvailableSpecialist,
    setSelectedSpecialist,
    setCurrentStep,
  } = useBooking();

  const specialists = SalonDataService.getSpecialists().filter(s => s.active !== false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-rosewood/10">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-clay font-bold">
            Step 1 of 4
          </span>
          <h2 className="font-serif text-3xl font-semibold text-espresso">
            Select Your Resident Artisan
          </h2>
          <p className="text-xs text-espresso/70 mt-1">
            Choose a certified Russian manicurist or select First Available for optimal scheduling.
          </p>
        </div>

        {/* Right-Top Next Step Button */}
        <button
          onClick={() => setCurrentStep(2)}
          className="inline-flex items-center space-x-2 bg-rosewood hover:bg-rosewood-dark text-white px-7 py-3 rounded-full text-xs uppercase tracking-luxury font-medium shadow-luxury-subtle transition-all duration-300 shrink-0 self-start sm:self-center cursor-pointer"
        >
          <UserCheck className="w-4 h-4 text-champagne" />
          <span>Continue to Services</span>
          <ArrowRight className="w-4 h-4 text-champagne" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* First Available Specialist Card */}
        <div
          onClick={() => setSelectedSpecialist(null, true)}
          className={`cursor-pointer p-5 rounded-3xl border-2 transition-all duration-300 flex items-center space-x-4 ${
            isFirstAvailableSpecialist
              ? 'bg-linen-100 border-rosewood shadow-luxury-subtle'
              : 'bg-white/80 border-rosewood/15 hover:border-clay'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-champagne-light via-rosewood to-espresso text-linen flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-7 h-7 text-champagne-light" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-lg font-semibold text-espresso">
                First Available Artisan
              </h3>
              {isFirstAvailableSpecialist && (
                <div className="w-5 h-5 rounded-full bg-rosewood text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
            <p className="text-xs text-espresso/70 mt-0.5">
              Maximum calendar flexibility with any of our certified Russian E-file masters.
            </p>
            <span className="inline-block mt-2 text-[10px] uppercase tracking-luxury text-clay font-semibold">
              Earliest Availability
            </span>
          </div>
        </div>

        {/* Individual Specialists */}
        {specialists.map(specialist => {
          const isSelected = !isFirstAvailableSpecialist && selectedSpecialist?.id === specialist.id;

          return (
            <div
              key={specialist.id}
              onClick={() => setSelectedSpecialist(specialist, false)}
              className={`cursor-pointer p-5 rounded-3xl border-2 transition-all duration-300 flex items-start space-x-4 ${
                isSelected
                  ? 'bg-linen-100 border-rosewood shadow-luxury-subtle'
                  : 'bg-white/80 border-rosewood/15 hover:border-clay'
              }`}
            >
              <img
                src={specialist.photoUrl}
                alt={specialist.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-champagne/40"
              />
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-espresso">
                    {specialist.name}
                  </h3>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-rosewood text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                
                <p className="text-[11px] text-clay font-medium">
                  {specialist.title}
                </p>

                <div className="flex items-center space-x-3 text-[11px] text-espresso/70 my-1.5">
                  <div className="flex items-center space-x-1 text-champagne-dark font-medium">
                    <Star className="w-3 h-3 fill-champagne text-champagne" />
                    <span>{specialist.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{specialist.reviewCount} verified sessions</span>
                  <span>·</span>
                  <span>{specialist.experienceYears}+ yrs exp</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  {specialist.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-linen-200 text-espresso/80 px-2 py-0.5 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
