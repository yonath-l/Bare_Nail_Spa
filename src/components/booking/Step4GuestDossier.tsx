import React, { useState } from 'react';
import { Sparkles, Coffee, VolumeX, Upload, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { TeaRitual } from '../../types';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface Step4GuestDossierProps {
  onSuccess: (bookingId: string) => void;
}

export const Step4GuestDossier: React.FC<Step4GuestDossierProps> = ({ onSuccess }) => {
  const {
    guestFullName,
    setGuestFullName,
    guestPhone,
    setGuestPhone,
    guestEmail,
    setGuestEmail,
    preferredTea,
    setPreferredTea,
    silentSession,
    setSilentSession,
    specialNotes,
    setSpecialNotes,
    moodboardFileName,
    setMoodboardFile,
    availableLoyaltyDiscountPct,
    appliedRewardId,
    calculatedOriginalPrice,
    calculatedDiscount,
    calculatedFinalPrice,
    confirmBooking,
    setCurrentStep,
  } = useBooking();

  const [formError, setFormError] = useState<string | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const teaRituals: TeaRitual[] = [
    'Ceylon Silver Tips with Osmanthus',
    'Warm Jasmine Lemongrass Infusion',
    'Roasted Genmaicha with Brown Rice',
    'Chilled White Peach & Elderflower',
    'Artisan Still Mineral Water',
  ];

  /**
   * File Upload Gate (Rule 8)
   * Client-side validation: Validates file type (JPEG/PNG/HEIC) and max size 15MB.
   * NOTE: Server-side validation required here in production before storage.
   */
  const handleMoodboardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setMoodboardFile(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/jpg'];
    if (!allowedTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpeg|jpg|png|heic|heif)$/i)) {
      setFileUploadError('Invalid format. Only JPEG, PNG, or HEIC images are accepted.');
      setMoodboardFile(null);
      return;
    }

    // 15 MB limit
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileUploadError('File exceeds 15MB limit. Please choose a smaller photo.');
      setMoodboardFile(null);
      return;
    }

    setMoodboardFile(file.name);
  };

  /**
   * Form Submission (Rule 1 & Rule 2)
   * Client-side validation: Ensures name and valid phone are entered.
   * NOTE: Server-side validation required here in production to verify availability and input sanitization.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!guestFullName.trim()) {
      setFormError('Please enter your full name for the atelier guest dossier.');
      return;
    }

    if (!guestPhone.trim() || guestPhone.trim().length < 9) {
      setFormError('Please enter a valid contact phone number.');
      return;
    }

    const booking = confirmBooking();
    onSuccess(booking.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-rosewood/10">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-clay font-bold">
            Step 4 of 4
          </span>
          <h2 className="font-serif text-3xl font-semibold text-espresso">
            Guest Dossier & Privileges
          </h2>
          <p className="text-xs text-espresso/70 mt-1">
            Provide your contact details. Your loyalty rewards and tea ritual are automatically customized.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-rosewood/25 text-espresso hover:bg-rosewood/10 text-xs uppercase tracking-luxury font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {/* Right-Top Submit Button */}
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-rosewood hover:bg-rosewood-dark text-white px-7 py-3 rounded-full text-xs uppercase tracking-luxury font-bold shadow-luxury-elevated transition-all duration-300 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-champagne" />
            <span>Confirm Atelier Reservation</span>
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Auto-detected Loyalty Banner */}
      {availableLoyaltyDiscountPct > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-espresso via-cocoa to-espresso text-linen border border-champagne/60 shadow-luxury-gold flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-champagne/20 text-champagne shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wide-luxury text-champagne font-bold block">
                VIP Reward Auto-Recognized
              </span>
              <p className="text-xs font-serif font-semibold text-linen">
                {availableLoyaltyDiscountPct}% OFF Privilege Voucher Activated
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-champagne bg-champagne/15 px-3 py-1 rounded-full border border-champagne/30">
            -{BRAND_CONFIG.currency.format(calculatedDiscount)}
          </span>
        </div>
      )}

      {/* Guest Contact Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-luxury text-clay font-semibold block mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={guestFullName}
            onChange={e => setGuestFullName(e.target.value)}
            placeholder="e.g. Amaya Perera"
            className="w-full text-xs px-4 py-3 rounded-2xl border border-rosewood/25 bg-white focus:outline-none focus:border-rosewood"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-luxury text-clay font-semibold block mb-1.5">
            Mobile / WhatsApp Phone *
          </label>
          <input
            type="tel"
            required
            value={guestPhone}
            onChange={e => setGuestPhone(e.target.value)}
            placeholder="e.g. 077 123 4567"
            className="w-full text-xs px-4 py-3 rounded-2xl border border-rosewood/25 bg-white focus:outline-none focus:border-rosewood"
          />
          <span className="text-[10px] text-espresso/50 mt-1 block">
            Used for appointment confirmation and digital loyalty pass memory.
          </span>
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-luxury text-clay font-semibold block mb-1.5">
          Email Address (Optional)
        </label>
        <input
          type="email"
          value={guestEmail}
          onChange={e => setGuestEmail(e.target.value)}
          placeholder="e.g. amaya@example.lk"
          className="w-full text-xs px-4 py-3 rounded-2xl border border-rosewood/25 bg-white focus:outline-none focus:border-rosewood"
        />
      </div>

      {/* Bespoke Salon Comfort Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Tea Ritual Picker */}
        <div className="p-4 rounded-2xl bg-linen-100 border border-rosewood/15 space-y-2">
          <label className="text-xs uppercase tracking-luxury text-clay font-semibold flex items-center space-x-1.5">
            <Coffee className="w-4 h-4 text-rosewood" />
            <span>Complimentary Tea Ritual</span>
          </label>
          <select
            value={preferredTea}
            onChange={e => setPreferredTea(e.target.value as TeaRitual)}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-rosewood/20 bg-white text-espresso focus:outline-none focus:border-rosewood"
          >
            {teaRituals.map(tea => (
              <option key={tea} value={tea}>
                {tea}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-espresso/60 block">
            Served warm or chilled upon your arrival in our reception lounge.
          </span>
        </div>

        {/* Silent Session Toggle */}
        <div className="p-4 rounded-2xl bg-linen-100 border border-rosewood/15 flex items-start justify-between space-x-3">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-luxury text-clay font-semibold flex items-center space-x-1.5">
              <VolumeX className="w-4 h-4 text-rosewood" />
              <span>Silent Session Ritual</span>
            </label>
            <p className="text-[11px] text-espresso/70 leading-relaxed">
              Prefer peaceful quietude? Our artisans will only speak to consult on nail shape, length, and comfort.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSilentSession(!silentSession)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 mt-1 ${
              silentSession ? 'bg-rosewood' : 'bg-gray-300'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                silentSession ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

      </div>

      {/* Moodboard / Inspiration Reference Upload (Gate UX) */}
      <div className="p-4 rounded-2xl bg-white/80 border border-rosewood/20 space-y-2">
        <label className="text-xs uppercase tracking-luxury text-clay font-semibold flex items-center space-x-1.5">
          <Upload className="w-3.5 h-3.5 text-rosewood" />
          <span>Upload Nail Inspo / Moodboard (Max 15MB)</span>
        </label>
        <p className="text-[11px] text-espresso/60">
          Have an Instagram screenshot or Pinterest design? Attach it so your artisan can prepare specific pigments and foils.
        </p>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.heic,.heif"
          onChange={handleMoodboardFileChange}
          className="text-xs text-espresso file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rosewood file:text-white hover:file:bg-rosewood-dark cursor-pointer"
        />

        {moodboardFileName && (
          <div className="flex items-center space-x-2 text-xs text-emerald-700 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready: {moodboardFileName}</span>
          </div>
        )}

        {fileUploadError && (
          <p className="text-xs text-rose-600 font-medium pt-1">
            {fileUploadError}
          </p>
        )}
      </div>

      {/* Special Requests / Notes */}
      <div>
        <label className="text-xs uppercase tracking-luxury text-clay font-semibold block mb-1.5">
          Special Notes / Allergies (Optional)
        </label>
        <textarea
          rows={2}
          value={specialNotes}
          onChange={e => setSpecialNotes(e.target.value)}
          placeholder="e.g. Sensitive cuticles, allergic to acetone, celebrating a birthday..."
          className="w-full text-xs px-4 py-3 rounded-2xl border border-rosewood/25 bg-white focus:outline-none focus:border-rosewood"
        />
      </div>

      {/* Final Financial Breakdown */}
      <div className="p-5 rounded-2xl bg-linen-100 border border-rosewood/20 space-y-2">
        <div className="flex justify-between text-xs text-espresso/70">
          <span>Treatments Subtotal</span>
          <span>{BRAND_CONFIG.currency.format(calculatedOriginalPrice)}</span>
        </div>
        {calculatedDiscount > 0 && (
          <div className="flex justify-between text-xs text-rosewood font-medium">
            <span>Milestone Loyalty Privilege Applied</span>
            <span>-{BRAND_CONFIG.currency.format(calculatedDiscount)}</span>
          </div>
        )}
        <div className="pt-2 border-t border-rosewood/15 flex justify-between items-baseline font-bold text-espresso">
          <span className="font-serif text-lg">Total Due at Salon</span>
          <span className="font-serif text-2xl text-rosewood">
            {BRAND_CONFIG.currency.format(calculatedFinalPrice)}
          </span>
        </div>
      </div>
    </form>
  );
};
