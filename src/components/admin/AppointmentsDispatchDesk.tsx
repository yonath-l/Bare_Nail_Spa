import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserPlus,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Scissors,
  Coffee,
  VolumeX,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  Filter,
} from 'lucide-react';
import { BlockedTimeSlot, BookingRequest, StaffSpecialist } from '../../types';
import {
  SalonDataService,
  getTodayStr,
  getTomorrowStr,
} from '../../services/salonDataService';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { WalkInBookingModal } from './WalkInBookingModal';
import { BlockTimeModal } from './BlockTimeModal';
import { RescheduleModal } from './RescheduleModal';

interface AppointmentsDispatchDeskProps {
  bookings: BookingRequest[];
  blockedTimes: BlockedTimeSlot[];
  onRefresh: () => void;
  onShowSuccess: (msg: string) => void;
  onCompleteAndStamp: (booking: BookingRequest) => void;
}

export const AppointmentsDispatchDesk: React.FC<AppointmentsDispatchDeskProps> = ({
  bookings,
  blockedTimes,
  onRefresh,
  onShowSuccess,
  onCompleteAndStamp,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  
  // Modals state
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInSpecialistId, setWalkInSpecialistId] = useState<string | undefined>(undefined);
  
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockSpecialistId, setBlockSpecialistId] = useState<string | undefined>(undefined);

  const [rescheduleTarget, setRescheduleTarget] = useState<BookingRequest | null>(null);
  const [showBlockedList, setShowBlockedList] = useState(false);

  // Active specialists loaded dynamically
  const activeSpecialists = SalonDataService.getSpecialists().filter(s => s.active !== false);

  // Filter bookings for active date (exclude cancelled / declined)
  const activeBookings = bookings.filter(
    b => b.date === selectedDate && b.status !== 'CANCELLED'
  );

  // Filter blocked times for active date
  const activeBlocks = blockedTimes.filter(b => b.date === selectedDate);

  // Check if whole facility is blocked on selected date
  const facilityBlocks = activeBlocks.filter(b => b.specialistId === 'ALL');

  const todayStr = getTodayStr();
  const tomorrowStr = getTomorrowStr();

  const handleStartSession = (bookingId: string, guestName: string) => {
    try {
      SalonDataService.updateBookingStatus(bookingId, 'IN_SESSION');
      onRefresh();
      onShowSuccess(`Session started for ${guestName}. Station marked In-Session.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error starting session';
      alert(msg);
    }
  };

  const handleRemoveBlock = (blockId: string, reason: string) => {
    if (window.confirm(`Unblock time window (${reason})? This will restore technician station availability.`)) {
      SalonDataService.removeBlockedTime(blockId);
      onRefresh();
      onShowSuccess(`Time block removed. Station hours restored.`);
    }
  };

  return (
    <div className="space-y-6 text-[#4A4A4A]">
      
      {/* Top Controls & Schedule Date Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2B4BD]/30 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="font-serif text-2xl font-bold text-[#4A4A4A]">
                Appointments & Technician Dispatch
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-bold shadow-xs">
                Live Floor Operations
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Real-time technician station scheduling, walk-in reservations dispatch, and working time blackout controls.
            </p>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setWalkInSpecialistId(undefined);
                setShowWalkInModal(true);
              }}
              className="inline-flex items-center space-x-2 bg-[#4A4A4A] hover:bg-black text-white px-4 py-2.5 rounded-2xl text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>+ New Walk-In Booking</span>
            </button>

            <button
              onClick={() => {
                setBlockSpecialistId('ALL');
                setShowBlockModal(true);
              }}
              className="inline-flex items-center space-x-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-2xl text-xs uppercase tracking-luxury font-bold transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>⏸ Block Working Time</span>
            </button>

            <button
              onClick={() => setShowBlockedList(!showBlockedList)}
              className="inline-flex items-center space-x-1.5 bg-[#FFF5F5] hover:bg-[#F7D6D0] text-[#4A4A4A] px-3.5 py-2.5 rounded-2xl text-xs font-semibold border border-[#E2B4BD]/40 transition-colors cursor-pointer"
            >
              <span>Blocked Slots ({blockedTimes.length})</span>
              {showBlockedList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Date Selector Strip & Day Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E2B4BD]/20">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-luxury">
              Dispatch Schedule Date:
            </span>
            <div className="flex items-center space-x-1.5 bg-[#FFF5F5] p-1 rounded-2xl border border-[#E2B4BD]/30">
              <button
                onClick={() => setSelectedDate(todayStr)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  selectedDate === todayStr
                    ? 'bg-[#4A4A4A] text-white font-bold shadow-xs'
                    : 'text-[#4A4A4A]/70 hover:text-[#4A4A4A]'
                }`}
              >
                Today ({todayStr})
              </button>
              <button
                onClick={() => setSelectedDate(tomorrowStr)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  selectedDate === tomorrowStr
                    ? 'bg-[#4A4A4A] text-white font-bold shadow-xs'
                    : 'text-[#4A4A4A]/70 hover:text-[#4A4A4A]'
                }`}
              >
                Tomorrow ({tomorrowStr})
              </button>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-1 bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] rounded-xl focus:outline-none focus:border-[#E2B4BD]"
            />
          </div>

          <div className="flex items-center space-x-4 text-xs text-[#6B7280]">
            <span>
              Total Bookings: <strong className="text-[#4A4A4A]">{activeBookings.length}</strong>
            </span>
            <span>
              In Session: <strong className="text-indigo-600">{activeBookings.filter(b => b.status === 'IN_SESSION').length}</strong>
            </span>
            <span>
              Completed: <strong className="text-emerald-700">{activeBookings.filter(b => b.status === 'COMPLETED').length}</strong>
            </span>
            <span>
              Blocked Windows: <strong className="text-rose-600">{activeBlocks.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Facility-Wide Blockout Alert Banner (if any) */}
      {facilityBlocks.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-luxury">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Atelier Facility Block Active for Selected Date ({selectedDate})</span>
            </div>
          </div>
          {facilityBlocks.map(fb => (
            <div
              key={fb.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-amber-900 pl-6 border-l-2 border-amber-400"
            >
              <div>
                <p>
                  <strong>{fb.startTime} – {fb.endTime}</strong> · Reason: <strong>{fb.reasonCategory}</strong>
                </p>
                <p className="text-[11px] text-amber-800/80 mt-0.5">
                  Specific Details: "{fb.specificDetails}" (By: {fb.createdBy})
                </p>
              </div>
              <button
                onClick={() => handleRemoveBlock(fb.id, fb.reasonCategory)}
                className="text-xs text-rose-700 hover:text-rose-900 font-bold underline self-start sm:self-center cursor-pointer"
              >
                Unblock Facility
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Expandable Active Blocked Times Drawer */}
      {showBlockedList && (
        <div className="bg-white rounded-3xl p-6 border border-amber-300 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#4A4A4A] flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>All Scheduled Blocked Working Hours ({blockedTimes.length})</span>
              </h3>
              <p className="text-xs text-[#6B7280]">
                Staff leaves, facility sterilizations, and reserved private masterclass time blocks.
              </p>
            </div>
            <button
              onClick={() => {
                setBlockSpecialistId('ALL');
                setShowBlockModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              + Add Block
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {blockedTimes.map(slot => (
              <div
                key={slot.id}
                className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-amber-200 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#4A4A4A]">{slot.specialistName}</span>
                    <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                      {slot.reasonCategory}
                    </span>
                  </div>
                  <p className="text-[#4A4A4A]/80">
                    📅 {slot.date} · ⏰ {slot.startTime} – {slot.endTime}
                  </p>
                  <p className="text-[11px] text-[#6B7280] italic">
                    "{slot.specificDetails}"
                  </p>
                  <span className="text-[9px] text-[#6B7280]/60 block">
                    Authorized: {slot.createdBy || 'Admin Desk'}
                  </span>
                </div>

                <button
                  onClick={() => handleRemoveBlock(slot.id, slot.reasonCategory)}
                  className="p-2 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TECHNICIAN MATRIX / DISPATCH BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {activeSpecialists.map(specialist => {
          // Specialist's bookings for this date
          const specialistBookings = activeBookings.filter(
            b => b.specialistId === specialist.id || b.specialistName.includes(specialist.name)
          );

          // Specialist's blocked times (include ALL facility blocks)
          const specialistBlocks = activeBlocks.filter(
            b => b.specialistId === specialist.id || b.specialistId === 'ALL'
          );

          // Determine current live status
          const hasInSession = specialistBookings.some(b => b.status === 'IN_SESSION');
          const activeBlockNow = specialistBlocks[0];

          let statusBadge = (
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </span>
          );

          if (hasInSession) {
            statusBadge = (
              <span className="text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>In Session</span>
              </span>
            );
          } else if (activeBlockNow) {
            statusBadge = (
              <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Time Blocked</span>
              </span>
            );
          }

          return (
            <div
              key={specialist.id}
              className="bg-[#FFF5F5] rounded-3xl p-5 border border-[#E2B4BD]/40 shadow-xs flex flex-col justify-between space-y-4"
            >
              {/* Technician Header */}
              <div className="space-y-3 pb-3 border-b border-[#E2B4BD]/30">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#E2B4BD] shadow-xs shrink-0 bg-white">
                    <img
                      src={specialist.photoUrl}
                      alt={specialist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#4A4A4A]">
                      {specialist.name}
                    </h3>
                    <p className="text-[10px] text-[#6B7280] font-medium line-clamp-1">
                      {specialist.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {statusBadge}
                  <span className="text-[10px] text-[#6B7280]">
                    {specialistBookings.length} booking{specialistBookings.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Quick Add Walk-In or Block for this Specialist */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => {
                      setWalkInSpecialistId(specialist.id);
                      setShowWalkInModal(true);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-[#F7D6D0] border border-[#E2B4BD]/40 text-[11px] text-[#4A4A4A] font-bold text-center transition-colors cursor-pointer shadow-xs"
                  >
                    + Walk-In
                  </button>
                  <button
                    onClick={() => {
                      setBlockSpecialistId(specialist.id);
                      setShowBlockModal(true);
                    }}
                    className="py-1.5 px-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-[11px] text-rose-700 font-semibold transition-colors cursor-pointer shadow-xs"
                    title="Block time for this technician"
                  >
                    ⏸ Block
                  </button>
                </div>
              </div>

              {/* Day Schedule Timeline */}
              <div className="space-y-3 flex-grow min-h-[220px]">
                
                {/* Render Blocked Intervals First if any */}
                {specialistBlocks.map(block => (
                  <div
                    key={block.id}
                    className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 text-xs text-rose-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-[11px]">
                        ⏸ {block.startTime} – {block.endTime}
                      </span>
                      <button
                        onClick={() => handleRemoveBlock(block.id, block.reasonCategory)}
                        className="text-[10px] text-rose-600 hover:text-rose-900 cursor-pointer"
                        title="Unblock"
                      >
                        ✕
                      </button>
                    </div>
                    <span className="text-[10px] uppercase font-bold block text-rose-900">
                      {block.reasonCategory}
                    </span>
                    <p className="text-[11px] text-rose-800/80 italic line-clamp-2">
                      "{block.specificDetails}"
                    </p>
                  </div>
                ))}

                {/* Render Active Bookings */}
                {specialistBookings.map(b => (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border space-y-2 text-xs transition-colors bg-white shadow-xs ${
                      b.status === 'IN_SESSION'
                        ? 'border-indigo-400 ring-2 ring-indigo-100'
                        : b.status === 'COMPLETED'
                        ? 'border-emerald-300 text-[#4A4A4A]/70'
                        : 'border-[#E2B4BD]/40 text-[#4A4A4A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-[11px] font-bold text-[#4A4A4A] bg-[#FFF5F5] px-2 py-0.5 rounded-lg border border-[#E2B4BD]/30">
                          {b.timeSlot}
                        </span>
                        {b.isWalkIn && (
                          <span className="text-[9px] bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD] px-1.5 py-0.5 rounded-full font-bold uppercase">
                            Walk-In
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'IN_SESSION'
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            : b.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-[#4A4A4A] text-sm">
                        {b.guest.fullName}
                      </h4>
                      <p className="text-[11px] text-[#6B7280] line-clamp-1">
                        {b.services.map(s => s.title).join(', ')} ({b.totalDurationMinutes}m)
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1.5 border-t border-[#E2B4BD]/20">
                      <span>{b.guest.phone}</span>
                      <span className="font-mono font-bold text-[#4A4A4A]">
                        {BRAND_CONFIG.currency.format(b.finalPriceLKR)}
                      </span>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="pt-1 flex items-center space-x-1.5">
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStartSession(b.id, b.guest.fullName)}
                          className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] uppercase font-bold tracking-luxury flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-xs"
                        >
                          <Play className="w-3 h-3" />
                          <span>Start Session</span>
                        </button>
                      )}

                      {b.status === 'IN_SESSION' && (
                        <button
                          onClick={() => onCompleteAndStamp(b)}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold tracking-luxury flex items-center justify-center space-x-1 shadow-xs cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-200" />
                          <span>Complete & Stamp</span>
                        </button>
                      )}

                      {b.status !== 'COMPLETED' && (
                        <button
                          onClick={() => setRescheduleTarget(b)}
                          className="p-1.5 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0] border border-[#E2B4BD]/40 text-[#4A4A4A] text-[10px] cursor-pointer transition-colors"
                          title="Reassign / Reschedule"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {specialistBookings.length === 0 && specialistBlocks.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-[#E2B4BD]/40 text-[#6B7280]/60 space-y-1 bg-white/40">
                    <Clock className="w-6 h-6 text-[#E2B4BD]" />
                    <span className="text-xs">No bookings for this date</span>
                    <button
                      onClick={() => {
                        setWalkInSpecialistId(specialist.id);
                        setShowWalkInModal(true);
                      }}
                      className="text-[11px] text-[#4A4A4A] font-semibold hover:underline pt-1 cursor-pointer"
                    >
                      Assign Walk-In Guest
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modals */}
      <WalkInBookingModal
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        initialSpecialistId={walkInSpecialistId}
        onSuccess={msg => {
          onRefresh();
          onShowSuccess(msg);
        }}
      />

      <BlockTimeModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        initialSpecialistId={blockSpecialistId}
        initialDate={selectedDate}
        onSuccess={msg => {
          onRefresh();
          onShowSuccess(msg);
        }}
      />

      <RescheduleModal
        isOpen={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
        booking={rescheduleTarget}
        onSuccess={msg => {
          onRefresh();
          onShowSuccess(msg);
        }}
      />

    </div>
  );
};
