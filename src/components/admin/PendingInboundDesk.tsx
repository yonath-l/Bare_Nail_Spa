import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
  MessageCircle,
  Eye,
  Filter,
  User,
  Coffee,
  VolumeX,
  AlertCircle,
  Check,
} from 'lucide-react';
import { BookingRequest, LoyaltyCustomerProfile } from '../../types';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { SalonDataService } from '../../services/salonDataService';
import { RescheduleModal } from './RescheduleModal';
import { DeclineModal } from './DeclineModal';

interface PendingInboundDeskProps {
  bookings: BookingRequest[];
  profiles: Record<string, LoyaltyCustomerProfile>;
  onRefresh: () => void;
  onShowSuccess: (msg: string) => void;
}

export const PendingInboundDesk: React.FC<PendingInboundDeskProps> = ({
  bookings,
  profiles,
  onRefresh,
  onShowSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all');
  
  // Modals state
  const [rescheduleBooking, setRescheduleBooking] = useState<BookingRequest | null>(null);
  const [declineBooking, setDeclineBooking] = useState<BookingRequest | null>(null);
  const [previewMoodboardUrl, setPreviewMoodboardUrl] = useState<string | null>(null);

  // Filter pending requests only (Rule: status === 'PENDING_HOLD')
  const pendingRequests = bookings.filter(b => b.status === 'PENDING_HOLD');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const filteredRequests = pendingRequests.filter(b => {
    // Search filter
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guest.phone.includes(searchTerm) ||
      b.specialistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.services.some(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // Date filter
    if (dateFilter === 'today') return matchesSearch && b.date === todayStr;
    if (dateFilter === 'tomorrow') return matchesSearch && b.date === tomorrowStr;
    return matchesSearch;
  });

  const handleConfirm = (b: BookingRequest) => {
    try {
      SalonDataService.confirmBooking(b.id);
      onRefresh();
      onShowSuccess(
        `Reservation #${b.id} for ${b.guest.fullName} confirmed! Scheduled for ${b.date} at ${b.timeSlot} with ${b.specialistName}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error confirming request';
      alert(msg);
    }
  };

  const getTimeElapsed = (createdAtStr: string) => {
    const elapsedMs = Date.now() - new Date(createdAtStr).getTime();
    const elapsedMins = Math.floor(elapsedMs / (60 * 1000));
    if (elapsedMins < 1) return 'Just now';
    if (elapsedMins < 60) return `${elapsedMins}m ago`;
    const elapsedHours = Math.floor(elapsedMins / 60);
    if (elapsedHours < 24) return `${elapsedHours}h ago`;
    return `${Math.floor(elapsedHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6 text-[#4A4A4A]">
      
      {/* Top Action Bar & Filter Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#E2B4BD]/30 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="font-serif text-2xl font-bold text-[#4A4A4A]">
                Pending Inbound Booking Requests
              </h3>
              <span className="px-3.5 py-1 rounded-full bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD] font-mono text-xs font-bold shadow-xs">
                {pendingRequests.length} Awaiting Action
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Review and triage client reservation requests. Admin access required to confirm, re-schedule, or decline appointments.
            </p>
          </div>

          {/* Quick Date Segmented Filters */}
          <div className="flex items-center space-x-1.5 bg-[#F7D6D0]/40 p-1.5 rounded-2xl border border-[#E2B4BD]/40 shrink-0">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-[#4A4A4A] text-white font-bold shadow-xs'
                  : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
              }`}
            >
              All Requests ({pendingRequests.length})
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-[#4A4A4A] text-white font-bold shadow-xs'
                  : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
              }`}
            >
              Today ({pendingRequests.filter(b => b.date === todayStr).length})
            </button>
            <button
              onClick={() => setDateFilter('tomorrow')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                dateFilter === 'tomorrow'
                  ? 'bg-[#4A4A4A] text-white font-bold shadow-xs'
                  : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
              }`}
            >
              Tomorrow ({pendingRequests.filter(b => b.date === tomorrowStr).length})
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by client name, mobile number, specialist, or service..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/50 text-xs text-[#4A4A4A] placeholder:text-stone-400 focus:outline-none focus:border-[#4A4A4A] focus:bg-white transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* List of Pending Booking Cards */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E2B4BD]/30 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-xl font-bold text-[#4A4A4A]">
              All Inbound Requests Triaged
            </h4>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto">
              There are no pending booking requests waiting for confirmation in this view. New reservations submitted online will instantly populate here.
            </p>
          </div>
          <button
            onClick={() => {
              setDateFilter('all');
              setSearchTerm('');
            }}
            className="px-4 py-2 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD]/40 text-xs font-semibold cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredRequests.map(b => {
            const guestProfile = profiles[b.guest.phone.trim().replace(/\s+/g, '')];
            const hasReward = guestProfile?.activeRewards?.some(r => !r.redeemed);

            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2B4BD]/40 shadow-xs space-y-5 hover:border-[#E2B4BD] hover:shadow-md transition-all"
              >
                {/* Top Strip: ID, Elapsed Time, Status & VIP Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2B4BD]/20 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm font-bold text-[#4A4A4A] bg-[#FFF5F5] px-3 py-1 rounded-xl border border-[#E2B4BD]/40">
                      {b.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Pending Concierge Review</span>
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Received {getTimeElapsed(b.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {guestProfile ? (
                      <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-0.5 rounded-full font-semibold">
                        VIP Member · {guestProfile.currentVisits}/10 Visits
                      </span>
                    ) : (
                      <span className="text-[11px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-0.5 rounded-full font-medium">
                        New Patron
                      </span>
                    )}

                    {hasReward && (
                      <span className="text-[10px] bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD] px-2.5 py-0.5 rounded-full font-bold">
                        ★ 50% Voucher Ready
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Dossier Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Guest & Ritual Specifics */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#F7D6D0] border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A] font-serif font-bold text-base shrink-0">
                        {b.guest.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-serif text-2xl font-bold text-[#4A4A4A]">
                          {b.guest.fullName}
                        </h4>
                        <a
                          href={`https://wa.me/${b.guest.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-mono border border-emerald-200 transition-colors mt-0.5"
                          title="Open WhatsApp chat with guest"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>{b.guest.phone}</span>
                        </a>
                      </div>
                    </div>

                    {/* Schedule & Specialist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30">
                        <span className="text-[10px] uppercase font-bold text-[#6B7280] block">
                          Requested Schedule
                        </span>
                        <span className="font-semibold text-[#4A4A4A] mt-0.5 block">
                          📅 {b.date} at {b.timeSlot}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30">
                        <span className="text-[10px] uppercase font-bold text-[#6B7280] block">
                          Requested Artisan
                        </span>
                        <span className="font-semibold text-[#4A4A4A] mt-0.5 block">
                          👤 {b.specialistName}
                        </span>
                      </div>
                    </div>

                    {/* Selected Rituals Breakdown */}
                    <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#4A4A4A]">
                          Selected Rituals ({b.totalDurationMinutes} mins total)
                        </span>
                        <span className="text-[10px] text-[#6B7280]">Official atelier menu rates</span>
                      </div>
                      <div className="space-y-1.5">
                        {b.services.map(s => (
                          <div key={s.id} className="flex items-center justify-between text-[#4A4A4A]">
                            <span className="font-medium">• {s.title} ({s.durationMinutes}m)</span>
                            <span className="font-mono font-bold text-[#4A4A4A]">
                              {BRAND_CONFIG.currency.format(s.priceLKR)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Guest Preferences: Tea & Silent Session */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/30 text-[#4A4A4A]">
                        <Coffee className="w-3.5 h-3.5 text-[#E2B4BD]" />
                        <span>Tea: <strong>{b.guest.preferredTea}</strong></span>
                      </span>

                      {b.guest.silentSession && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
                          <VolumeX className="w-3.5 h-3.5 text-purple-600" />
                          <span>Silent Session Requested</span>
                        </span>
                      )}
                    </div>

                    {/* Special Notes & Moodboard */}
                    {b.guest.specialNotes && (
                      <div className="p-3 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 text-xs italic text-[#4A4A4A]/80">
                        "{b.guest.specialNotes}"
                      </div>
                    )}
                  </div>

                  {/* Right Column: Moodboard Photo, Pricing, & 3 Action Buttons */}
                  <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-[#E2B4BD]/30 lg:pl-6 flex flex-col justify-between h-full">
                    
                    {/* Reference Photo / Moodboard Preview if present */}
                    {b.guest.moodboardUrl ? (
                      <div className="p-3 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-[#4A4A4A] flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-[#E2B4BD]" />
                            <span>Client Reference Moodboard</span>
                          </span>
                          <button
                            onClick={() => setPreviewMoodboardUrl(b.guest.moodboardUrl || null)}
                            className="text-[10px] text-[#4A4A4A] hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Enlarge</span>
                          </button>
                        </div>
                        <div
                          onClick={() => setPreviewMoodboardUrl(b.guest.moodboardUrl || null)}
                          className="h-28 rounded-xl overflow-hidden border border-[#E2B4BD]/30 cursor-pointer relative group"
                        >
                          <img
                            src={b.guest.moodboardUrl}
                            alt="Client Reference Inspiration"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-[#4A4A4A]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-medium text-white">
                            Tap to expand photo
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Financial Summary */}
                    <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-1.5">
                      <div className="flex justify-between items-baseline text-xs text-[#6B7280]">
                        <span>Original Treatment Subtotal:</span>
                        <span className="font-mono">{BRAND_CONFIG.currency.format(b.originalPriceLKR)}</span>
                      </div>
                      {b.discountAppliedLKR > 0 && (
                        <div className="flex justify-between items-baseline text-xs text-emerald-700">
                          <span>VIP Privilege Discount:</span>
                          <span className="font-mono font-bold">-{BRAND_CONFIG.currency.format(b.discountAppliedLKR)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-baseline pt-2 border-t border-[#E2B4BD]/30">
                        <span className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-bold">Total Due at Salon:</span>
                        <span className="font-serif text-2xl font-bold text-[#4A4A4A]">
                          {BRAND_CONFIG.currency.format(b.finalPriceLKR)}
                        </span>
                      </div>
                    </div>

                    {/* 3 Explicit Admin Actions: Confirm, Re-schedule, Decline */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] uppercase tracking-luxury text-[#6B7280] font-bold block">
                        Admin Dispatch Decision:
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* 1. Confirm (Green) */}
                        <button
                          onClick={() => handleConfirm(b)}
                          className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-luxury transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                          title="Confirm reservation and notify guest"
                        >
                          <Check className="w-4 h-4" />
                          <span>Confirm</span>
                        </button>

                        {/* 2. Re-schedule (Amber) */}
                        <button
                          onClick={() => setRescheduleBooking(b)}
                          className="py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-luxury transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                          title="Propose new date or time"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reschedule</span>
                        </button>

                        {/* 3. Decline (Red) */}
                        <button
                          onClick={() => setDeclineBooking(b)}
                          className="py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-luxury transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                          title="Decline request with reason"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={Boolean(rescheduleBooking)}
        onClose={() => setRescheduleBooking(null)}
        booking={rescheduleBooking}
        onSuccess={msg => {
          onRefresh();
          onShowSuccess(msg);
        }}
      />

      {/* Decline Modal */}
      <DeclineModal
        isOpen={Boolean(declineBooking)}
        onClose={() => setDeclineBooking(null)}
        booking={declineBooking}
        onSuccess={msg => {
          onRefresh();
          onShowSuccess(msg);
        }}
      />

      {/* Moodboard Enlarge Modal */}
      {previewMoodboardUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setPreviewMoodboardUrl(null)}
        >
          <div
            className="max-w-2xl max-h-[85vh] bg-white rounded-3xl p-5 border border-[#E2B4BD]/40 shadow-2xl space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-bold">
                Guest Reference Design / Inspiration
              </span>
              <button
                onClick={() => setPreviewMoodboardUrl(null)}
                className="text-[#6B7280] hover:text-[#4A4A4A] p-1 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <img
              src={previewMoodboardUrl}
              alt="Expanded reference inspiration"
              className="max-h-[70vh] rounded-2xl object-contain mx-auto"
            />
          </div>
        </div>
      )}

    </div>
  );
};
