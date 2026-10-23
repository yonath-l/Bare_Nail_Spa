import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  RotateCcw,
  User,
  Send,
  AlertCircle,
} from 'lucide-react';
import { BookingRequest } from '../../types';
import {
  SalonDataService,
} from '../../services/salonDataService';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRequest | null;
  onSuccess: (message: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess,
}) => {
  const activeSpecialists = SalonDataService.getSpecialists().filter(s => s.active !== false);

  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [specialistId, setSpecialistId] = useState('');
  const [reason, setReason] = useState('Adjusted by admin desk to accommodate atelier schedule');
  const [notifyGuest, setNotifyGuest] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setNewDate(booking.date);
      setNewTimeSlot(booking.timeSlot);
      setSpecialistId(booking.specialistId);
      setReason('Adjusted by concierge to ensure seamless artisan availability');
      setNotifyGuest(true);
      setErrorMsg(null);
    }
  }, [booking]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newDate) {
      setErrorMsg('Please select a new appointment date.');
      return;
    }
    if (!newTimeSlot) {
      setErrorMsg('Please select a new time slot.');
      return;
    }

    const assignedSpecialist =
      activeSpecialists.find(s => s.id === specialistId) || {
        id: booking.specialistId,
        name: booking.specialistName,
      };

    try {
      SalonDataService.rescheduleBooking(
        booking.id,
        newDate,
        newTimeSlot,
        assignedSpecialist.id,
        assignedSpecialist.name,
        reason.trim(),
        notifyGuest
      );

      onSuccess(
        `Booking #${booking.id} rescheduled to ${newDate} at ${newTimeSlot} with ${assignedSpecialist.name}.${
          notifyGuest ? ' Client notification logged in outbox.' : ''
        }`
      );
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error rescheduling booking';
      setErrorMsg(msg);
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
      aria-labelledby="reschedule-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-2xl space-y-6 my-8 text-[#4A4A4A]">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2B4BD]/30 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 id="reschedule-modal-title" className="font-serif text-2xl font-bold text-[#4A4A4A]">
                Re-Schedule Booking #{booking.id}
              </h2>
              <p className="text-xs text-[#6B7280]">
                Update date, time slot, or assigned technician for {booking.guest.fullName}.
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

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Existing Schedule Summary */}
        <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#6B7280] block">
            Currently Requested Schedule:
          </span>
          <p className="text-[#4A4A4A]">
            📅 <strong>{booking.date} at {booking.timeSlot}</strong> · Specialist: <strong>{booking.specialistName}</strong>
          </p>
          <p className="text-[#6B7280]">
            Rituals: {booking.services.map(s => s.title).join(', ')} ({booking.totalDurationMinutes} mins)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* New Date and Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                New Date *
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                New Time Slot *
              </label>
              <select
                value={newTimeSlot}
                onChange={e => setNewTimeSlot(e.target.value)}
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

          {/* Reassign Specialist */}
          <div>
            <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
              Assigned Specialist
            </label>
            <select
              value={specialistId}
              onChange={e => setSpecialistId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
            >
              {activeSpecialists.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.specialties ? s.specialties.join(', ') : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Reason for Reschedule */}
          <div>
            <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
              Reschedule Reason (Sent to Guest in Notification)
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Previous session ran longer; offering preferred 2:30 PM slot"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
            />
          </div>

          {/* Notification Checkbox */}
          <div className="pt-1">
            <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/30 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyGuest}
                onChange={e => setNotifyGuest(e.target.checked)}
                className="rounded border-[#E2B4BD] text-[#4A4A4A] focus:ring-0 w-4 h-4"
              />
              <span className="text-xs text-[#4A4A4A]">
                Dispatch automated SMS & WhatsApp reschedule notice to {booking.guest.phone}
              </span>
            </label>
          </div>

          {/* Buttons */}
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
              className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-white" />
              <span>Confirm Re-schedule</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
