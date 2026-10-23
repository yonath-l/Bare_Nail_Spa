import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Sparkles,
  Calendar,
  Clock,
  User,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Scissors,
  ShieldCheck,
} from 'lucide-react';
import { Service, StaffSpecialist, TeaRitual } from '../../types';
import {
  SalonDataService,
  getTodayStr,
} from '../../services/salonDataService';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface WalkInBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialSpecialistId?: string;
}

export const WalkInBookingModal: React.FC<WalkInBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialSpecialistId,
}) => {
  const allSpecialists = SalonDataService.getSpecialists().filter(s => s.active !== false);
  const allServices = SalonDataService.getServices();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialistId, setSpecialistId] = useState(
    initialSpecialistId || (allSpecialists[0] ? allSpecialists[0].id : 'staff-1')
  );

  const assignedSpecialist =
    allSpecialists.find(s => s.id === specialistId) || allSpecialists[0];

  // Enforce qualified categories for selected specialist
  const availableServices = allServices.filter(s => {
    if (assignedSpecialist && assignedSpecialist.specialties && assignedSpecialist.specialties.length > 0) {
      return assignedSpecialist.specialties.includes(s.category);
    }
    return true;
  });

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(() => {
    return availableServices[0] ? [availableServices[0].id] : [];
  });
  const [date, setDate] = useState(getTodayStr());
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [preferredTea, setPreferredTea] = useState<TeaRitual>(
    'Ceylon Silver Tips with Osmanthus'
  );
  const [silentSession, setSilentSession] = useState(false);
  const [staffNotes, setStaffNotes] = useState('Walk-in guest from reception lounge');
  const [startImmediately, setStartImmediately] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // VIP detection state
  const [detectedProfile, setDetectedProfile] = useState<any | null>(null);

  useEffect(() => {
    if (initialSpecialistId) {
      setSpecialistId(initialSpecialistId);
    }
  }, [initialSpecialistId]);

  // Check phone for existing loyalty customer
  useEffect(() => {
    const clean = phone.trim().replace(/\s+/g, '');
    if (clean.length >= 9) {
      const profile = SalonDataService.getProfileByPhone(clean);
      if (profile) {
        setDetectedProfile(profile);
        if (!fullName) setFullName(profile.fullName);
        if (profile.email && !email) setEmail(profile.email);
        if (profile.preferredArtisanTea)
          setPreferredTea(profile.preferredArtisanTea as TeaRitual);
        if (typeof profile.silentSessionPreference === 'boolean')
          setSilentSession(profile.silentSessionPreference);
      } else {
        setDetectedProfile(null);
      }
    } else {
      setDetectedProfile(null);
    }
  }, [phone]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedServices = availableServices.filter(s =>
    selectedServiceIds.includes(s.id)
  );
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.priceLKR, 0);
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.durationMinutes,
    0
  );

  const toggleService = (srvId: string) => {
    setSelectedServiceIds(prev => {
      if (prev.includes(srvId)) {
        if (prev.length <= 1) return prev; // At least one service required
        return prev.filter(id => id !== srvId);
      } else {
        return [...prev, srvId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Please enter the guest full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setFormError('Please enter a valid guest phone number (at least 9 digits).');
      return;
    }
    if (selectedServiceIds.length === 0) {
      setFormError('Please select at least one treatment ritual.');
      return;
    }

    const assignedSpecialist =
      allSpecialists.find(s => s.id === specialistId) || allSpecialists[0];

    try {
      // Auto-register guest if not existing
      if (!detectedProfile) {
        SalonDataService.registerNewGuest(phone, fullName, email || undefined);
      }

      const booking = SalonDataService.createWalkInBooking({
        guestFullName: fullName,
        guestPhone: phone,
        guestEmail: email || undefined,
        specialistId: assignedSpecialist.id,
        specialistName: assignedSpecialist.name,
        services: selectedServices,
        date,
        timeSlot,
        preferredTea,
        silentSession,
        staffNotes,
        startImmediately,
      });

      onSuccess(
        `Walk-in reservation #${booking.id} created for ${fullName} with ${assignedSpecialist.name} (${startImmediately ? 'In Session' : 'Confirmed'}).`
      );
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating walk-in booking';
      setFormError(msg);
    }
  };

  const availableTimeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:30 PM',
    '01:30 PM',
    '02:30 PM',
    '03:30 PM',
    '04:30 PM',
    '05:30 PM',
    '06:30 PM',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="walk-in-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-2xl space-y-6 my-8 text-[#4A4A4A]">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2B4BD]/30 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0] border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A] shrink-0">
              <UserPlus className="w-5 h-5 text-[#4A4A4A]" />
            </div>
            <div>
              <h2 id="walk-in-title" className="font-serif text-2xl font-bold text-[#4A4A4A]">
                Dispatch Manual Walk-In Booking
              </h2>
              <p className="text-xs text-[#6B7280]">
                Register an unscheduled guest directly into technician schedule and salon loyalty pass.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#4A4A4A] hover:bg-[#FFF5F5] transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Existing VIP alert if detected */}
        {detectedProfile && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Recognized VIP Member: <strong>{detectedProfile.fullName}</strong> ({detectedProfile.currentVisits}/10 visits)
              </span>
            </div>
            {detectedProfile.activeRewards?.some((r: any) => !r.redeemed) && (
              <span className="text-[10px] bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD] px-2.5 py-0.5 rounded-full font-bold">
                ★ Has Unredeemed Privilege Voucher!
              </span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Guest Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                Guest Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Ruwani Jayawardena"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                Phone Number (Auto-Detect VIP) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 0771234567"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
              />
            </div>
          </div>

          {/* Specialist & Immediate Start Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                Assign Specialist *
              </label>
              <select
                value={specialistId}
                onChange={e => setSpecialistId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
              >
                {allSpecialists.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.specialties ? s.specialties.join(', ') : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={startImmediately}
                  onChange={e => setStartImmediately(e.target.checked)}
                  className="rounded border-[#E2B4BD] text-[#4A4A4A] focus:ring-0 w-4 h-4"
                />
                <span className="text-xs text-[#4A4A4A] font-medium">
                  Seat & Start Session Immediately (In-Session)
                </span>
              </label>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
              >
                {availableTimeSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Picker with Quick Category Multi-select */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
              <div>
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold">
                  Select Treatments & Rituals ({selectedServices.length} selected)
                </label>
                {assignedSpecialist && (
                  <span className="text-[10px] text-[#6B7280] block">
                    ✓ Filtered by certified categories for {assignedSpecialist.name} ({assignedSpecialist.specialties?.join(', ')})
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-bold text-[#4A4A4A] shrink-0">
                Est: {totalDuration} mins · {BRAND_CONFIG.currency.format(totalPrice)}
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 p-3 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 scrollbar-thin">
              {availableServices.map(srv => {
                const isSelected = selectedServiceIds.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border border-[#E2B4BD] text-[#4A4A4A] shadow-xs'
                        : 'hover:bg-white/60 text-[#4A4A4A]/70'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-[#E2B4BD] text-[#4A4A4A] focus:ring-0 w-3.5 h-3.5"
                      />
                      <span className="font-medium">{srv.title}</span>
                      <span className="text-[10px] text-[#6B7280] uppercase">
                        ({srv.category})
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-[11px] text-[#6B7280]">{srv.durationMinutes}m</span>
                      <span className="font-mono text-[#4A4A4A] font-bold">
                        {BRAND_CONFIG.currency.format(srv.priceLKR)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tea Ritual & Silent Session */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                Complimentary Tea Ritual
              </label>
              <select
                value={preferredTea}
                onChange={e => setPreferredTea(e.target.value as TeaRitual)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
              >
                <option value="Ceylon Silver Tips with Osmanthus">
                  Ceylon Silver Tips with Osmanthus
                </option>
                <option value="Warm Jasmine Lemongrass Infusion">
                  Warm Jasmine Lemongrass Infusion
                </option>
                <option value="Roasted Genmaicha with Brown Rice">
                  Roasted Genmaicha with Brown Rice
                </option>
                <option value="Chilled White Peach & Elderflower">
                  Chilled White Peach & Elderflower
                </option>
                <option value="Artisan Still Mineral Water">
                  Artisan Still Mineral Water
                </option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={silentSession}
                  onChange={e => setSilentSession(e.target.checked)}
                  className="rounded border-[#E2B4BD] text-[#4A4A4A] focus:ring-0 w-4 h-4"
                />
                <span className="text-xs text-[#4A4A4A]">
                  Quiet / Silent Pampering Session
                </span>
              </label>
            </div>
          </div>

          {/* Walk-in Notes */}
          <div>
            <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
              Station & Reception Notes
            </label>
            <input
              type="text"
              value={staffNotes}
              onChange={e => setStaffNotes(e.target.value)}
              placeholder="e.g. Seated at Station 1 with Russian prep; requested fast dry"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E2B4BD]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-[#E2B4BD]/40 text-xs uppercase tracking-luxury font-semibold text-[#4A4A4A] hover:bg-[#FFF5F5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Dispatch Walk-In Reservation</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
