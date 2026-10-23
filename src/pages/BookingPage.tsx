import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  User,
  Coffee,
  VolumeX,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { Step1Specialist } from '../components/booking/Step1Specialist';
import { Step2Services } from '../components/booking/Step2Services';
import { Step3CalendarTime } from '../components/booking/Step3CalendarTime';
import { Step4GuestDossier } from '../components/booking/Step4GuestDossier';
import { BRAND_CONFIG } from '../config/brandConfig';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const BookingPage: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    selectedSpecialist,
    isFirstAvailableSpecialist,
    selectedServices,
    selectedDate,
    selectedTimeSlot,
    calculatedFinalPrice,
    calculatedTotalMinutes,
    resetBooking,
  } = useBooking();

  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Artisan' },
    { number: 2, title: 'Rituals' },
    { number: 3, title: 'Calendar' },
    { number: 4, title: 'Dossier' },
  ];

  const handleBookingSuccess = (bookingId: string) => {
    setConfirmedBookingId(bookingId);
  };

  const handleNewBooking = () => {
    setConfirmedBookingId(null);
    resetBooking();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* SUCCESS CONFIRMATION MODAL */}
      {confirmedBookingId ? (
        <div className="max-w-xl mx-auto bg-linen-100 rounded-3xl p-8 sm:p-10 border-2 border-champagne shadow-2xl text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wide-luxury text-clay font-bold block">
              Reservation Request Received · {confirmedBookingId}
            </span>
            <h2 className="font-serif text-3xl font-semibold text-espresso">
              Your Sanctuary Awaits
            </h2>
            <p className="text-xs text-espresso/70 leading-relaxed">
              We have received your bespoke reservation request at Bare Nail Spa. Our atelier reception desk is preparing your artisan schedule and tea ritual. Your digital loyalty pass is active on this device.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="p-5 rounded-2xl bg-white border border-rosewood/15 text-left text-xs space-y-3">
            <div className="flex justify-between border-b border-rosewood/10 pb-2">
              <span className="text-clay">Date & Time:</span>
              <span className="font-medium text-espresso">{selectedDate} at {selectedTimeSlot}</span>
            </div>
            <div className="flex justify-between border-b border-rosewood/10 pb-2">
              <span className="text-clay">Artisan Specialist:</span>
              <span className="font-medium text-espresso">
                {isFirstAvailableSpecialist ? 'First Available Artisan' : selectedSpecialist?.name}
              </span>
            </div>
            <div className="border-b border-rosewood/10 pb-2">
              <span className="text-clay block mb-1">Services Reserved:</span>
              <ul className="space-y-1 text-espresso font-medium pl-2">
                {selectedServices.map(s => (
                  <li key={s.id}>• {s.title} ({s.durationMinutes}m)</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-semibold text-espresso">Total Due at Salon:</span>
              <span className="font-serif text-lg font-bold text-rosewood">
                {BRAND_CONFIG.currency.format(calculatedFinalPrice)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/loyalty"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-espresso hover:bg-rosewood text-linen px-6 py-3.5 rounded-full text-xs uppercase tracking-luxury font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4 text-champagne" />
              <span>Open My VIP Stamp Pass</span>
            </Link>

            <button
              onClick={handleNewBooking}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-rosewood/30 text-espresso hover:bg-rosewood/10 text-xs uppercase tracking-luxury font-medium transition-colors"
            >
              Make Another Booking
            </button>
          </div>
        </div>
      ) : (
        <ScrollReveal direction="up">
          <div className="space-y-10">
            {/* STEPPER PROGRESS BAR */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-rosewood/20 w-full z-0"></div>
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-rosewood transition-all duration-500 z-0"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map(step => {
                  const isCompleted = currentStep > step.number;
                  const isCurrent = currentStep === step.number;

                  return (
                    <button
                      key={step.number}
                      onClick={() => {
                        if (step.number < currentStep) setCurrentStep(step.number);
                      }}
                      className={`relative z-10 flex flex-col items-center group focus:outline-none transition-transform ${
                        step.number < currentStep ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                          isCompleted
                            ? 'bg-rosewood text-white shadow-md'
                            : isCurrent
                            ? 'bg-espresso text-linen ring-4 ring-rosewood/20 font-bold scale-110 shadow-luxury-gold'
                            : 'bg-linen-100 text-espresso/40 border border-rosewood/20'
                        }`}
                      >
                        {step.number}
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-wider mt-1.5 font-medium transition-colors ${
                          isCurrent ? 'text-rosewood font-bold' : 'text-espresso/60'
                        }`}
                      >
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTIVE STEP CONTENT */}
            <div className="card-luxury bg-linen-100 rounded-3xl p-6 sm:p-10 border border-rosewood/15 shadow-luxury-subtle">
              <div key={currentStep} className="animate-fade-in">
                {currentStep === 1 && <Step1Specialist />}
                {currentStep === 2 && <Step2Services />}
                {currentStep === 3 && <Step3CalendarTime />}
                {currentStep === 4 && <Step4GuestDossier onSuccess={handleBookingSuccess} />}
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

    </div>
  );
};
