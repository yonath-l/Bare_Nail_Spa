import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Info,
} from 'lucide-react';
import { BlockReasonCategory, BlockedTimeSlot } from '../../types';
import {
  SalonDataService,
  getTodayStr,
} from '../../services/salonDataService';

interface BlockTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialSpecialistId?: string;
  initialDate?: string;
}

export const BlockTimeModal: React.FC<BlockTimeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialSpecialistId,
  initialDate,
}) => {
  const activeSpecialists = SalonDataService.getSpecialists().filter(s => s.active !== false);

  const [specialistId, setSpecialistId] = useState(initialSpecialistId || 'ALL');
  const [date, setDate] = useState(initialDate || getTodayStr());
  const [startTime, setStartTime] = useState('01:00 PM');
  const [endTime, setEndTime] = useState('02:00 PM');
  const [reasonCategory, setReasonCategory] = useState<BlockReasonCategory>(
    'Atelier Deep Cleaning & Autoclave Sterilization'
  );
  const [specificDetails, setSpecificDetails] = useState('');
  const [createdBy, setCreatedBy] = useState('Admin Desk');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialSpecialistId) {
      setSpecialistId(initialSpecialistId);
    }
  }, [initialSpecialistId]);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!specificDetails.trim()) {
      setErrorMsg(
        'Please provide specific details explaining the reason for this blocked time interval.'
      );
      return;
    }

    const assignedSpecialist =
      specialistId === 'ALL'
        ? { id: 'ALL', name: 'All Technicians (Atelier Facility Block)' }
        : activeSpecialists.find(s => s.id === specialistId) || {
            id: specialistId,
            name: 'Resident Specialist',
          };

    try {
      const blocked = SalonDataService.addBlockedTime({
        specialistId: assignedSpecialist.id,
        specialistName: assignedSpecialist.name,
        date,
        startTime,
        endTime,
        reasonCategory,
        specificDetails: specificDetails.trim(),
        createdBy: createdBy.trim() || 'Admin Desk',
      });

      onSuccess(
        `Working time blocked for ${assignedSpecialist.name} on ${date} (${startTime} - ${endTime}). Reason: ${reasonCategory}.`
      );
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error blocking working time';
      setErrorMsg(msg);
    }
  };

  const timeOptions = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
  ];

  const reasonCategories: BlockReasonCategory[] = [
    'Atelier Deep Cleaning & Autoclave Sterilization',
    'Personal Leave / Sick Leave',
    'Team Training & Masterclass',
    'Lunch / Rest Break',
    'Emergency Maintenance',
    'Private VIP Buyout',
    'Other',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="block-time-title"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-2xl space-y-6 my-8 text-[#4A4A4A]">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2B4BD]/30 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="block-time-title" className="font-serif text-2xl font-bold text-[#4A4A4A]">
                Block Out Working Time
              </h2>
              <p className="text-xs text-[#6B7280]">
                Reserve hours for facility sterilization, technician personal leave, or training to avoid booking conflicts.
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
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Specialist Selection */}
          <div>
            <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
              Technician / Facility *
            </label>
            <select
              value={specialistId}
              onChange={e => setSpecialistId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
            >
              <option value="ALL">
                🏛 All Technicians (Whole Atelier Facility Closure / Maintenance)
              </option>
              {activeSpecialists.map(s => (
                <option key={s.id} value={s.id}>
                  👤 {s.name} ({s.title})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
              Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
            />
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                Start Time *
              </label>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
              >
                {timeOptions.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
                End Time *
              </label>
              <select
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
              >
                {timeOptions.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason Category */}
          <div>
            <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
              Reason Category *
            </label>
            <select
              value={reasonCategory}
              onChange={e => setReasonCategory(e.target.value as BlockReasonCategory)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
            >
              {reasonCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Details */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold">
                Specific Details & Operational Context *
              </label>
              <span className="text-[10px] text-[#6B7280]">Mandatory for team records</span>
            </div>
            <textarea
              required
              rows={3}
              value={specificDetails}
              onChange={e => setSpecificDetails(e.target.value)}
              placeholder="e.g. Certified autoclave sterilizer spore testing cycle; attending Colombo bridal fair consultation; doctor appointment; cleanroom air filter change."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white resize-none"
            />
          </div>

          {/* Authorized Admin / Staff */}
          <div>
            <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1.5">
              Authorized Staff / Admin
            </label>
            <input
              type="text"
              value={createdBy}
              onChange={e => setCreatedBy(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
            />
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
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>Lock Out Time Slot</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
