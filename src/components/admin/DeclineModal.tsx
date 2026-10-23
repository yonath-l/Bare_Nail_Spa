import React, { useState, useEffect } from 'react';
import {
  X,
  XCircle,
  AlertOctagon,
  Send,
} from 'lucide-react';
import { BookingRequest } from '../../types';
import { SalonDataService } from '../../services/salonDataService';

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRequest | null;
  onSuccess: (message: string) => void;
}

export const DeclineModal: React.FC<DeclineModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess,
}) => {
  const [reasonCategory, setReasonCategory] = useState(
    'Fully Booked at Requested Slot'
  );
  const [customExplanation, setCustomExplanation] = useState(
    'Our atelier is at maximum capacity during this requested timeframe. We invite you to explore alternative time slots.'
  );
  const [notifyGuest, setNotifyGuest] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setReasonCategory('Fully Booked at Requested Slot');
      setCustomExplanation(
        `Our atelier is currently fully booked on ${booking.date} at ${booking.timeSlot}. We would love to hold an alternative appointment for you.`
      );
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

    const fullReason = `${reasonCategory} — ${customExplanation.trim()}`;

    try {
      SalonDataService.declineBooking(
        booking.id,
        fullReason,
        `Declined by admin desk: ${reasonCategory}`,
        notifyGuest
      );

      onSuccess(
        `Booking request #${booking.id} from ${booking.guest.fullName} declined.${
          notifyGuest ? ' Polite notification logged in outbox.' : ''
        }`
      );
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error declining booking';
      setErrorMsg(msg);
    }
  };

  const reasonCategories = [
    'Fully Booked at Requested Slot',
    'Specialist Unavailable / Scheduled Leave',
    'Outside Atelier Operating Hours',
    'Specialized Formula / Materials Temporarily Unavailable',
    'Duplicate / Test Request',
    'Client Requested Cancellation',
    'Other Custom Reason',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="decline-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-2xl space-y-6 my-8 text-[#4A4A4A]">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2B4BD]/30 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 id="decline-modal-title" className="font-serif text-2xl font-bold text-[#4A4A4A]">
                Decline Booking Request #{booking.id}
              </h2>
              <p className="text-xs text-[#6B7280]">
                Cancel unconfirmed request from {booking.guest.fullName} ({booking.guest.phone}).
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
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Request Dossier Snippet */}
        <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-rose-200 text-xs space-y-1">
          <p className="text-[#4A4A4A]">
            Client: <strong>{booking.guest.fullName}</strong> ({booking.guest.phone})
          </p>
          <p className="text-[#6B7280]">
            Requested: {booking.date} at {booking.timeSlot} · Specialist: {booking.specialistName}
          </p>
          <p className="text-[#4A4A4A] font-medium">
            Rituals: {booking.services.map(s => s.title).join(', ')} ({booking.totalDurationMinutes}m)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Reason Category */}
          <div>
            <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
              Decline Reason Category *
            </label>
            <select
              value={reasonCategory}
              onChange={e => {
                const cat = e.target.value;
                setReasonCategory(cat);
                if (cat === 'Fully Booked at Requested Slot') {
                  setCustomExplanation(
                    `Our atelier is fully booked on ${booking.date} at ${booking.timeSlot}. We would love to hold an alternative appointment for you.`
                  );
                } else if (cat === 'Specialist Unavailable / Scheduled Leave') {
                  setCustomExplanation(
                    `Specialist ${booking.specialistName} is unavailable during this time. We invite you to choose another resident artisan.`
                  );
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
            >
              {reasonCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Explanation Text */}
          <div>
            <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
              Client Explanation Note *
            </label>
            <textarea
              required
              rows={3}
              value={customExplanation}
              onChange={e => setCustomExplanation(e.target.value)}
              placeholder="Polite message explaining why the request cannot be accommodated..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white resize-none"
            />
          </div>

          {/* Outbox Notification Checkbox */}
          <div className="pt-1">
            <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/30 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyGuest}
                onChange={e => setNotifyGuest(e.target.checked)}
                className="rounded border-[#E2B4BD] text-rose-600 focus:ring-0 w-4 h-4"
              />
              <span className="text-xs text-[#4A4A4A]">
                Dispatch courteous decline SMS & WhatsApp notification with alternative booking invite
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
              className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-white" />
              <span>Confirm & Decline Request</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
