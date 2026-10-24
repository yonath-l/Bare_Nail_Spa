import { asset } from '../utils/assetHelper';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Radio,
  FileSpreadsheet,
  Send,
  BarChart3,
  Settings,
  Lock,
  Search,
  ExternalLink,
  Plus,
  RefreshCw,
  QrCode,
  Smartphone,
  Gift,
  Copy,
  Check,
  Inbox,
  RotateCcw,
  Layers,
  Activity,
  TrendingUp,
  UserPlus,
  ShieldAlert,
  Users,
  Palette,
  MinusCircle,
  UserCheck,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brandConfig';
import {
  BlockedTimeSlot,
  BookingRequest,
  LoyaltyCustomerProfile,
  LoyaltyReward,
  Service,
} from '../types';
import {
  DEFAULT_SERVICES,
  SalonDataService,
} from '../services/salonDataService';
import { PendingInboundDesk } from '../components/admin/PendingInboundDesk';
import { AppointmentsDispatchDesk } from '../components/admin/AppointmentsDispatchDesk';
import { ExecutiveDecisionDashboard } from '../components/admin/ExecutiveDecisionDashboard';
import { DigitalCMSHub } from '../components/admin/cms/DigitalCMSHub';

type AdminTab = 'bookings' | 'pos' | 'outbox' | 'analytics' | 'cms' | 'digital_cms';
type BookingDeskView = 'pending' | 'dispatch' | 'all';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  // Admin Route Isolation Guard (Rule 5)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('bare_admin_auth_token'));
  });

  useEffect(() => {
    // Dynamic noindex robots tag (Rule 7)
    let metaTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
    }
    metaTag.content = 'noindex, nofollow';

    const token = localStorage.getItem('bare_admin_auth_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
  const [bookingDeskView, setBookingDeskView] = useState<BookingDeskView>('pending');
  
  // Data states
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTimeSlot[]>([]);
  const [profiles, setProfiles] = useState<Record<string, LoyaltyCustomerProfile>>({});
  const [outbox, setOutbox] = useState<Array<{ id: string; phone: string; text: string; timestamp: string; delivered: boolean }>>([]);
  
  // Master reservations log search & status filter
  const [allBookingsSearch, setAllBookingsSearch] = useState('');
  const [allBookingsStatusFilter, setAllBookingsStatusFilter] = useState('ALL');

  // Pos states
  const [stampTargetPhone, setStampTargetPhone] = useState('0771234567');
  const [stampSearchMode, setStampSearchMode] = useState<'phone' | 'name'>('phone');
  const [stampSearchNameQuery, setStampSearchNameQuery] = useState('');
  const [posSuccessMsg, setPosSuccessMsg] = useState<string | null>(null);
  const [posErrorMsg, setPosErrorMsg] = useState<string | null>(null);
  
  // Paper card migration modal
  const [showMigrateModal, setShowMigrateModal] = useState(false);
  const [migratePhone, setMigratePhone] = useState('');
  const [migrateName, setMigrateName] = useState('');
  const [migrateStamps, setMigrateStamps] = useState(4);
  const [migrateNotes, setMigrateNotes] = useState('Paper punch card presented at cashier');

  // CMS state for Loyalty Rules
  const [rulesConfig, setRulesConfig] = useState(BRAND_CONFIG.loyaltyRules);
  const [rulesSavedMsg, setRulesSavedMsg] = useState<string | null>(null);

  // Copy state for NFC URL
  const [copiedNfcUrl, setCopiedNfcUrl] = useState(false);

  const loadData = () => {
    setBookings(SalonDataService.getBookings());
    setBlockedTimes(SalonDataService.getBlockedTimes());
    setProfiles(SalonDataService.getAllProfiles());
    setOutbox(SalonDataService.getOutboxMessages());
  };

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bare_admin_auth_token');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  const handleReseedDemo = () => {
    if (window.confirm('Reset all bookings, blocked times, and guest profiles to initial studio demo state?')) {
      SalonDataService.reseedDemoData();
      loadData();
      setPosSuccessMsg('✨ Studio data restored to fresh demo state with pending inbound requests & technician blocks.');
    }
  };

  // Dispatch Action: Complete & Send Stamp
  const handleCompleteAndStamp = (booking: BookingRequest) => {
    try {
      SalonDataService.updateBookingStatus(booking.id, 'COMPLETED');
      // Add stamp to customer
      SalonDataService.addStamp(
        booking.guest.phone,
        'STAFF_POS_PIN',
        'CASHIER-1',
        `Completed session #${booking.id}`
      );
      loadData();
      setPosSuccessMsg(`Session #${booking.id} completed. Stamp sent to ${booking.guest.fullName} (${booking.guest.phone}).`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error completing booking';
      setPosErrorMsg(msg);
    }
  };

  // Cashier 1-Tap Stamp
  const handleCashierStamp = (e: React.FormEvent) => {
    e.preventDefault();
    setPosSuccessMsg(null);
    setPosErrorMsg(null);

    const cleanPhone = stampTargetPhone.trim();
    if (!cleanPhone) {
      setPosErrorMsg('Please enter a phone number.');
      return;
    }

    try {
      const { profile, newRewardUnlocked } = SalonDataService.addStamp(
        cleanPhone,
        'STAFF_POS_PIN',
        'CASHIER-1',
        'Cashier POS counter stamp'
      );
      loadData();
      setPosSuccessMsg(
        `✨ Success! ${profile.fullName} stamped (${profile.currentVisits}/10). ${
          newRewardUnlocked ? `Unlocked: ${newRewardUnlocked.title}!` : ''
        }`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Customer not found. Create pass first.';
      setPosErrorMsg(msg);
    }
  };

  // Cashier Accidental Stamp Reversal
  const handleRemoveAccidentalStamp = () => {
    setPosSuccessMsg(null);
    setPosErrorMsg(null);

    const cleanPhone = stampTargetPhone.trim();
    if (!cleanPhone) {
      setPosErrorMsg('Please enter or select a guest phone number to revoke a stamp.');
      return;
    }

    const guest = profiles[cleanPhone];
    const guestName = guest ? guest.fullName : cleanPhone;

    if (!window.confirm(`⚠️ Revoke Accidental Stamp: Are you sure you want to remove the most recent stamp from ${guestName}? This will decrement their visit count by 1 and roll back unredeemed rewards.`)) {
      return;
    }

    try {
      const { profile, revokedRewardTitle } = SalonDataService.removeLastStamp(
        cleanPhone,
        'Cashier accidental stamp revocation'
      );
      loadData();
      setPosSuccessMsg(
        `✨ Success! Accidental stamp removed for ${profile.fullName}. New balance: ${profile.currentVisits}/10 visits. ${
          revokedRewardTitle ? `(Revoked unlocked reward: ${revokedRewardTitle})` : ''
        }`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error removing stamp';
      setPosErrorMsg(msg);
    }
  };

  // Paper Migration Submit
  const handlePaperMigration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!migratePhone.trim() || !migrateName.trim()) return;

    SalonDataService.migratePaperCard(
      migratePhone,
      migrateName,
      migrateStamps,
      migrateNotes
    );
    loadData();
    setShowMigrateModal(false);
    setPosSuccessMsg(`Paper card migrated for ${migrateName}! Starting with ${migrateStamps}/10 stamps.`);
  };

  // Save Loyalty Rules CMS
  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    BRAND_CONFIG.loyaltyRules = rulesConfig;
    setRulesSavedMsg('Loyalty rules updated successfully in atelier configuration!');
    setTimeout(() => setRulesSavedMsg(null), 3000);
  };

  const nfcUrl = `${window.location.origin}/loyalty?stamp_key=${rulesConfig.nfcSecretToken}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNfcUrl(true);
    setTimeout(() => setCopiedNfcUrl(false), 2000);
  };

  // Metric derivations for Executive Decision Bar
  const pendingRequests = bookings.filter(b => b.status === 'PENDING_HOLD');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== 'CANCELLED');
  const totalPipelineLKR = bookings.reduce((sum, b) => sum + b.finalPriceLKR, 0);
  const todayBlockedCount = blockedTimes.filter(b => b.date === todayStr).length;
  const vipCount = Object.keys(profiles).length;

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] flex flex-col font-sans">
      
      {/* ISOLATED ADMIN HEADER WITH FINNOVA-STYLE CAPSULE NAVIGATION */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E2B4BD]/40 px-6 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Lockup */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0] border-2 border-[#E2B4BD] overflow-hidden shadow-xs p-0.5 flex items-center justify-center">
              <img src={asset('assets/logo.jpg')} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-[#4A4A4A] leading-tight">
                {BRAND_CONFIG.studioName}
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                Reception POS & Executive Hub
              </p>
            </div>
          </div>

          {/* Cream / Vanilla Capsule Main Navigation Bar */}
          <div className="hidden xl:flex items-center p-1.5 bg-[#FDF4D2] rounded-full shadow-xs border border-[#E2B4BD]/40">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                    : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Booking Desk</span>
                {pendingRequests.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E11D48] text-white shadow-xs">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('pos')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'pos'
                    ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                    : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Cashier POS & NFC</span>
              </button>

              <button
                onClick={() => setActiveTab('outbox')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'outbox'
                    ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                    : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>SMS Outbox ({outbox.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                    : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Insights</span>
              </button>

              <button
                onClick={() => setActiveTab('cms')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'cms'
                    ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                    : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Rules CMS</span>
              </button>

              <button
                onClick={() => setActiveTab('digital_cms')}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'digital_cms'
                    ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                    : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Digital CMS</span>
              </button>
            </nav>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleReseedDemo}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-stone-600 hover:text-[#4A4A4A] px-3 py-1.5 rounded-xl border border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30 transition-colors cursor-pointer font-medium"
              title="Restore sample requests, walk-ins, and technician blocks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            <button
              onClick={loadData}
              className="p-2 text-stone-600 hover:text-[#4A4A4A] rounded-xl hover:bg-[#F7D6D0]/30 transition-colors cursor-pointer border border-[#E2B4BD]/30"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-stone-700 hover:text-[#4A4A4A] px-3 py-1.5 rounded-xl border border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30 transition-colors font-medium"
            >
              <span>Public Boutique</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>

        </div>

        {/* Mobile / Tablet Horizontal Capsule Navigation */}
        <div className="xl:hidden mt-3 pt-3 border-t border-[#E2B4BD]/20 overflow-x-auto scrollbar-none">
          <div className="inline-flex items-center p-1.5 bg-[#FDF4D2] rounded-full shadow-xs border border-[#E2B4BD]/40 min-w-max">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#F7D6D0] text-[#4A4A4A]'
                  : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Booking Desk</span>
              {pendingRequests.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#E11D48] text-white">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pos')}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'pos'
                  ? 'bg-[#F7D6D0] text-[#4A4A4A]'
                  : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Cashier POS</span>
            </button>

            <button
              onClick={() => setActiveTab('outbox')}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'outbox'
                  ? 'bg-[#F7D6D0] text-[#4A4A4A]'
                  : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Outbox</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#F7D6D0] text-[#4A4A4A]'
                  : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Insights</span>
            </button>

            <button
              onClick={() => setActiveTab('cms')}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'cms'
                  ? 'bg-[#F7D6D0] text-[#4A4A4A]'
                  : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Rules</span>
            </button>

            <button
              onClick={() => setActiveTab('digital_cms')}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'digital_cms'
                  ? 'bg-[#F7D6D0] text-[#4A4A4A]'
                  : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Digital CMS</span>
            </button>
          </div>
        </div>
      </header>

      {/* TAB CONTENT VIEW */}
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Global Feedback Banners */}
        {posSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{posSuccessMsg}</span>
            </div>
            <button onClick={() => setPosSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold">✕</button>
          </div>
        )}

        {posErrorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs">
            <span className="font-medium">{posErrorMsg}</span>
            <button onClick={() => setPosErrorMsg(null)} className="text-rose-700 hover:text-rose-900 cursor-pointer font-bold">✕</button>
          </div>
        )}

        {/* TAB 1: BOOKING & DISPATCH DESK */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            
            {/* Live Operational Greeting Banner (Displayed Only on Booking Desk Tab) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/80 p-5 rounded-3xl border border-[#E2B4BD]/40 shadow-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-600">
                    Live Atelier Dispatch Desk · Malabe Studio
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#4A4A4A] mt-1">
                  Good day, Studio Concierge & Director
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Current studio telemetry: <strong>{pendingRequests.length} Inbound Requests</strong> awaiting triage · <strong>{todayBookings.length} Active Sessions</strong> on floor · <strong>84% Seat Occupancy</strong>
                </p>
              </div>

              {/* Quick Action Navigation Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    setActiveTab('bookings');
                    setBookingDeskView('dispatch');
                  }}
                  className="inline-flex items-center space-x-2 bg-[#4A4A4A] hover:bg-[#333333] text-white px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Walk-In Booking</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('bookings');
                    setBookingDeskView('dispatch');
                  }}
                  className="inline-flex items-center space-x-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>⏸ Block Time</span>
                </button>

                <button
                  onClick={() => setActiveTab('pos')}
                  className="inline-flex items-center space-x-2 bg-[#F7D6D0] hover:bg-[#E2B4BD] text-[#4A4A4A] border border-[#E2B4BD] px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-[#4A4A4A]" />
                  <span>1-Tap POS</span>
                </button>
              </div>
            </div>

            {/* 5 Top Executive KPI Cards (Displayed Only on Booking Desk Tab) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              
              {/* KPI Card 1: Inbound Requests */}
              <div
                onClick={() => {
                  setActiveTab('bookings');
                  setBookingDeskView('pending');
                }}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md ${
                  pendingRequests.length > 0
                    ? 'bg-white border-rose-300 hover:border-rose-400'
                    : 'bg-white border-[#E2B4BD]/40 hover:border-[#E2B4BD]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Inbound Requests
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                    <Inbox className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <p className="font-serif text-3xl font-bold text-[#4A4A4A]">
                    {pendingRequests.length}
                  </p>
                  <span className="text-[11px] font-semibold text-stone-500">
                    Pending review
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E2B4BD]/20 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    pendingRequests.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {pendingRequests.length > 0 ? 'Action Required' : 'All Clear'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    2 Today · 2 Tmrw
                  </span>
                </div>
              </div>

              {/* KPI Card 2: Today's Appointments & Occupancy */}
              <div
                onClick={() => {
                  setActiveTab('bookings');
                  setBookingDeskView('dispatch');
                }}
                className="p-4 rounded-3xl bg-white border-2 border-emerald-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Today's Appointments
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <p className="font-serif text-3xl font-bold text-[#4A4A4A]">
                    {todayBookings.length}
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    84% Seat Occupancy
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E2B4BD]/20 space-y-1">
                  <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full w-[84%]" />
                  </div>
                  <span className="text-[10px] text-stone-500 block text-right font-mono">
                    1 Session Active
                  </span>
                </div>
              </div>

              {/* KPI Card 3: Gross Pipeline Intake */}
              <div
                onClick={() => setActiveTab('analytics')}
                className="p-4 rounded-3xl bg-white border-2 border-[#E2B4BD]/40 hover:border-[#E2B4BD] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Gross Pipeline
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <p className="font-serif text-2xl font-bold text-[#4A4A4A] truncate">
                    {BRAND_CONFIG.currency.format(totalPipelineLKR)}
                  </p>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {bookings.length} reservations
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E2B4BD]/20 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ↑ +14.2% Yield
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    LKR
                  </span>
                </div>
              </div>

              {/* KPI Card 4: Artisan Dispatch Stations */}
              <div
                onClick={() => {
                  setActiveTab('bookings');
                  setBookingDeskView('dispatch');
                }}
                className="p-4 rounded-3xl bg-white border-2 border-amber-200/80 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Artisan Dispatch
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <p className="font-serif text-3xl font-bold text-[#4A4A4A]">
                    4
                  </p>
                  <span className="text-[11px] font-semibold text-amber-700">
                    Active Stations
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E2B4BD]/20 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    {todayBlockedCount} Blocked Slot{todayBlockedCount === 1 ? '' : 's'}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Autoclave / Prep
                  </span>
                </div>
              </div>

              {/* KPI Card 5: Loyalty Passholders */}
              <div
                onClick={() => setActiveTab('pos')}
                className="p-4 rounded-3xl bg-white border-2 border-[#E2B4BD]/40 hover:border-[#E2B4BD] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between col-span-2 sm:col-span-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    VIP Passholders
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#F7D6D0] border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <p className="font-serif text-3xl font-bold text-[#4A4A4A]">
                    {vipCount}
                  </p>
                  <span className="text-[11px] font-semibold text-stone-600">
                    Enrolled Members
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E2B4BD]/20 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    100% Mobile
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    ★ Voucher Ready
                  </span>
                </div>
              </div>

            </div>

            {/* BOOKING DESK SEGMENTED CONTROL BAR (Cream/Vanilla FDF4D2 Capsule Style) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2 bg-[#FDF4D2] rounded-full shadow-xs border border-[#E2B4BD]/40">
              <div className="flex flex-wrap items-center gap-1.5">
                
                {/* Sub-view 1: Pending Inbound Booking Requests */}
                <button
                  onClick={() => setBookingDeskView('pending')}
                  className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                    bookingDeskView === 'pending'
                      ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                      : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Pending Inbound Requests</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      bookingDeskView === 'pending'
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'bg-[#E11D48]/90 text-white'
                    }`}
                  >
                    {pendingRequests.length}
                  </span>
                </button>

                {/* Sub-view 2: Appointments & Technician Dispatch */}
                <button
                  onClick={() => setBookingDeskView('dispatch')}
                  className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                    bookingDeskView === 'dispatch'
                      ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                      : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Appointments & Technician Dispatch</span>
                </button>

                {/* Sub-view 3: All Reservations Log */}
                <button
                  onClick={() => setBookingDeskView('all')}
                  className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                    bookingDeskView === 'all'
                      ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                      : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A] hover:bg-white/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Master Reservations Log ({bookings.length})</span>
                </button>

              </div>

              <div className="px-5 text-right hidden lg:block text-xs font-semibold text-[#4A4A4A]/70">
                Atelier Floor Scheduling
              </div>
            </div>

            {/* SUB-VIEW 1: PENDING INBOUND BOOKING REQUESTS */}
            {bookingDeskView === 'pending' && (
              <PendingInboundDesk
                bookings={bookings}
                profiles={profiles}
                onRefresh={loadData}
                onShowSuccess={msg => setPosSuccessMsg(msg)}
              />
            )}

            {/* SUB-VIEW 2: APPOINTMENTS & TECHNICIAN DISPATCH */}
            {bookingDeskView === 'dispatch' && (
              <AppointmentsDispatchDesk
                bookings={bookings}
                blockedTimes={blockedTimes}
                onRefresh={loadData}
                onShowSuccess={msg => setPosSuccessMsg(msg)}
                onCompleteAndStamp={handleCompleteAndStamp}
              />
            )}

            {/* SUB-VIEW 3: MASTER RESERVATIONS LOG */}
            {bookingDeskView === 'all' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#4A4A4A]">
                      Master Reservations Archive
                    </h3>
                    <p className="text-xs text-stone-500">
                      Complete history of inbound, confirmed, in-session, and completed reservations.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {['ALL', 'CONFIRMED', 'IN_SESSION', 'COMPLETED', 'PENDING_HOLD', 'CANCELLED'].map(
                      st => (
                        <button
                          key={st}
                          onClick={() => setAllBookingsStatusFilter(st)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            allBookingsStatusFilter === st
                              ? 'bg-[#4A4A4A] text-white shadow-xs'
                              : 'bg-white text-stone-600 hover:text-[#4A4A4A] border border-[#E2B4BD]/40'
                          }`}
                        >
                          {st === 'ALL' ? 'All Statuses' : st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={allBookingsSearch}
                    onChange={e => setAllBookingsSearch(e.target.value)}
                    placeholder="Search by client, mobile, specialist, or service title..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] placeholder:text-stone-400 focus:outline-none focus:border-[#4A4A4A] shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {bookings
                    .filter(b => {
                      if (allBookingsStatusFilter !== 'ALL' && b.status !== allBookingsStatusFilter) {
                        return false;
                      }
                      if (!allBookingsSearch.trim()) return true;
                      const q = allBookingsSearch.toLowerCase();
                      return (
                        b.id.toLowerCase().includes(q) ||
                        b.guest.fullName.toLowerCase().includes(q) ||
                        b.guest.phone.includes(q) ||
                        b.specialistName.toLowerCase().includes(q)
                      );
                    })
                    .map(b => (
                      <div
                        key={b.id}
                        className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hover:border-[#E2B4BD] hover:shadow-md transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-xs font-bold text-[#4A4A4A]">
                              {b.id}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                                b.status === 'COMPLETED'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : b.status === 'CONFIRMED'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : b.status === 'IN_SESSION'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : b.status === 'PENDING_HOLD'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {b.status}
                            </span>
                            {b.isWalkIn && (
                              <span className="text-[10px] bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD] px-2 py-0.5 rounded-full font-bold">
                                Walk-In
                              </span>
                            )}
                            {b.guest.silentSession && (
                              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-medium">
                                Silent Session
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
                            {b.guest.fullName} ·{' '}
                            <span className="font-mono text-sm text-stone-500 font-normal">
                              {b.guest.phone}
                            </span>
                          </h3>

                          <div className="text-xs text-stone-600 space-y-1">
                            <p>
                              Schedule: <strong>{b.date} at {b.timeSlot}</strong> · Specialist: <strong>{b.specialistName}</strong>
                            </p>
                            <p>
                              Rituals: {b.services.map(s => s.title).join(', ')} ({b.totalDurationMinutes} mins)
                            </p>
                            <p className="text-stone-500">
                              Tea Ritual: {b.guest.preferredTea}
                            </p>
                            {b.guest.specialNotes && (
                              <p className="text-stone-400 italic">
                                Notes: "{b.guest.specialNotes}"
                              </p>
                            )}
                            {b.declineReason && (
                              <p className="text-rose-600 font-medium">
                                Declined / Cancelled: "{b.declineReason}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Financial & Action Button */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 border-[#E2B4BD]/20 pt-4 lg:pt-0">
                          <div className="text-left lg:text-right">
                            <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-semibold">
                              Amount Due
                            </span>
                            <span className="font-serif text-2xl font-bold text-[#4A4A4A]">
                              {BRAND_CONFIG.currency.format(b.finalPriceLKR)}
                            </span>
                            {b.discountAppliedLKR > 0 && (
                              <span className="text-[10px] text-emerald-700 block font-medium">
                                Includes {BRAND_CONFIG.currency.format(b.discountAppliedLKR)} Privilege Discount
                              </span>
                            )}
                          </div>

                          {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleCompleteAndStamp(b)}
                              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4 text-white" />
                              <span>Complete & Send Stamp</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: CASHIER LOYALTY POS & NFC HARDWARE KIT */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: 1-Tap Cashier Stamp */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0]/50 border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A]">
                    <Radio className="w-5 h-5 animate-pulse text-[#4A4A4A]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
                      Cashier 1-Tap Stamp Terminal
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Instantly stamp any client phone. Automatically triggers confetti explosion on customer tab!
                    </p>
                  </div>
                </div>

                {/* Search Mode Toggle (Phone vs Name) - Cream/Vanilla FDF4D2 Capsule Style */}
                <div className="flex items-center space-x-1.5 p-1.5 bg-[#FDF4D2] rounded-full shadow-xs border border-[#E2B4BD]/40">
                  <button
                    type="button"
                    onClick={() => setStampSearchMode('phone')}
                    className={`flex-1 py-2 px-3 rounded-full text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                      stampSearchMode === 'phone'
                        ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                        : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A]'
                    }`}
                  >
                    <span>📱 Search by Phone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStampSearchMode('name')}
                    className={`flex-1 py-2 px-3 rounded-full text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                      stampSearchMode === 'name'
                        ? 'bg-[#F7D6D0] text-[#4A4A4A] shadow-xs'
                        : 'text-[#4A4A4A]/80 hover:text-[#4A4A4A]'
                    }`}
                  >
                    <span>👤 Search by Guest Name</span>
                  </button>
                </div>

                <form onSubmit={handleCashierStamp} className="space-y-4">
                  
                  {stampSearchMode === 'phone' ? (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                        Guest Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={stampTargetPhone}
                        onChange={e => setStampTargetPhone(e.target.value)}
                        placeholder="e.g. 0771234567"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/50 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                        Search Guest by Full Name *
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={stampSearchNameQuery}
                          onChange={e => setStampSearchNameQuery(e.target.value)}
                          placeholder="Type guest name (e.g. Shenali, Amaya, Oshadi)..."
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/50 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                        />
                      </div>

                      {/* Matching Name Dropdown */}
                      {stampSearchNameQuery.trim().length > 0 && (
                        <div className="p-2 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 max-h-40 overflow-y-auto space-y-1">
                          {Object.values(profiles)
                            .filter(p =>
                              p.fullName.toLowerCase().includes(stampSearchNameQuery.toLowerCase())
                            )
                            .map(matched => (
                              <div
                                key={matched.phone}
                                onClick={() => {
                                  setStampTargetPhone(matched.phone);
                                  setStampSearchNameQuery('');
                                }}
                                className="p-2 rounded-xl bg-white hover:bg-[#F7D6D0]/40 flex items-center justify-between cursor-pointer transition-colors border border-[#E2B4BD]/30"
                              >
                                <span className="font-serif text-xs font-bold text-[#4A4A4A]">
                                  {matched.fullName}
                                </span>
                                <span className="font-mono text-[11px] text-stone-600 font-medium">
                                  {matched.phone} ({matched.currentVisits}/10)
                                </span>
                              </div>
                            ))}
                          {Object.values(profiles).filter(p =>
                            p.fullName.toLowerCase().includes(stampSearchNameQuery.toLowerCase())
                          ).length === 0 && (
                            <p className="p-2 text-[11px] text-stone-400 text-center">
                              No patron found matching "{stampSearchNameQuery}".
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Active Target Guest Dossier Card */}
                  {profiles[stampTargetPhone.trim()] && (
                    <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/50 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F7D6D0] border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A] font-serif font-bold text-sm">
                          {profiles[stampTargetPhone.trim()].fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-bold text-[#4A4A4A]">
                            {profiles[stampTargetPhone.trim()].fullName}
                          </h4>
                          <span className="text-[11px] font-mono text-stone-500 font-medium">
                            {profiles[stampTargetPhone.trim()].phone}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-stone-500 block">
                          Current Pass
                        </span>
                        <span className="font-mono text-xs font-bold text-emerald-700">
                          {profiles[stampTargetPhone.trim()].currentVisits}/10 Stamps
                        </span>
                        {profiles[stampTargetPhone.trim()].activeRewards.filter(r => !r.redeemed).length > 0 && (
                          <span className="text-[9px] text-amber-700 font-semibold block">
                            ★ Reward Voucher Ready
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2 Terminal Action Buttons: Seal Stamp & Revoke Accidental Stamp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="submit"
                      className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-bold shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Seal Stamp (+1)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveAccidentalStamp}
                      className="py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                      title="Revoke the last added stamp from this customer pass"
                    >
                      <MinusCircle className="w-4 h-4 text-rose-600" />
                      <span>Revoke Accidental Stamp (-1)</span>
                    </button>
                  </div>

                </form>

                {/* Quick Profile Selectors */}
                <div className="pt-2 border-t border-[#E2B4BD]/20 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                    Quick Select Active Guests:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(profiles).slice(0, 4).map(p => (
                      <button
                        key={p.phone}
                        onClick={() => setStampTargetPhone(p.phone)}
                        className="px-3 py-1 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0] text-[11px] text-stone-700 hover:text-[#4A4A4A] border border-[#E2B4BD]/40 font-medium transition-colors cursor-pointer"
                      >
                        {p.fullName} ({p.currentVisits}/10)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Paper Card Migration Banner */}
              <div className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#4A4A4A]">
                    Paper-to-Digital Card Migration
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Customer brought their old paper loyalty card? Migrate stamps immediately so paper can be trashed.
                  </p>
                </div>
                <button
                  onClick={() => setShowMigrateModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-[#4A4A4A] hover:bg-[#333333] text-white text-xs uppercase tracking-wider font-semibold shrink-0 ml-4 shadow-xs cursor-pointer transition-colors"
                >
                  Swap Paper Card
                </button>
              </div>
            </div>

            {/* Right Column: Physical NFC Hardware Kit & Counter QR */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0]/50 border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A]">
                    <QrCode className="w-5 h-5 text-[#4A4A4A]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
                      NFC Stamp & Hardware Setup Kit
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Program your physical NTAG215 NFC salon stamp or counter acrylic stand.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-stone-600 font-bold block">
                    NFC Stamp Payload URL (NTAG215)
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={nfcUrl}
                      className="w-full text-xs font-mono bg-white p-2.5 rounded-xl border border-[#E2B4BD]/40 text-[#4A4A4A] select-all shadow-xs"
                    />
                    <button
                      onClick={() => copyToClipboard(nfcUrl)}
                      className="p-2.5 rounded-xl bg-[#4A4A4A] text-white hover:bg-[#333333] transition-colors shrink-0 cursor-pointer shadow-xs"
                      title="Copy URL"
                    >
                      {copiedNfcUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Use the free <strong>NFC Tools</strong> mobile app (iOS/Android) to write this URL to your salon's physical acrylic or conductive stamp.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 space-y-2 text-xs text-stone-600">
                  <h4 className="font-bold text-[#4A4A4A] uppercase text-[11px] tracking-wider">
                    How The Physical Tap Experience Works:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-stone-600">
                    <li>Customer holds their phone unlocked at checkout.</li>
                    <li>Cashier taps the salon's physical NFC Stamp to the back of their phone.</li>
                    <li>The phone opens `/loyalty?stamp_key=...` in 1 second.</li>
                    <li>The system strips the secret key from the URL instantly, plays the chime, and showers gold confetti!</li>
                  </ol>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SMS & WHATSAPP OUTBOX */}
        {activeTab === 'outbox' && (
          <div className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#4A4A4A]">
                  Automated SMS & WhatsApp Dispatch Log
                </h2>
                <p className="text-xs text-stone-500">
                  Real-time notification outbox simulator with 1-click WhatsApp dispatch links.
                </p>
              </div>
              <span className="text-xs font-semibold text-stone-500 bg-[#FFF5F5] px-3 py-1 rounded-xl border border-[#E2B4BD]/30">
                {outbox.length} Dispatched Messages
              </span>
            </div>

            <div className="space-y-3">
              {outbox.map(msg => (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-semibold text-[#4A4A4A]">
                        {msg.phone}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                        Delivered
                      </span>
                    </div>
                    {/* Render plain text */}
                    <p className="text-xs text-stone-600">
                      {msg.text}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg.text)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-xs"
                  >
                    <span>Send on WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EXECUTIVE BUSINESS INTELLIGENCE & DECISION SUPPORT */}
        {activeTab === 'analytics' && (
          <ExecutiveDecisionDashboard bookings={bookings} profiles={profiles} />
        )}

        {/* TAB 5: STUDIO CMS & LOYALTY RULES */}
        {activeTab === 'cms' && (
          <div className="space-y-8">
            
            {/* Section A: Loyalty Rules Editor */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/30 shadow-xs space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#4A4A4A]">
                  Loyalty Rules & NFC Token Configuration
                </h2>
                <p className="text-xs text-stone-500">
                  Customize reward percentages, maximum currency caps, and hardware NFC tokens without touching code.
                </p>
              </div>

              {rulesSavedMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium">
                  {rulesSavedMsg}
                </div>
              )}

              <form onSubmit={handleSaveRules} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Total Stamps Per Card Cycle
                  </label>
                  <input
                    type="number"
                    value={rulesConfig.totalStamps}
                    onChange={e => setRulesConfig({ ...rulesConfig, totalStamps: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Milestone 1 (Visit Threshold)
                  </label>
                  <input
                    type="number"
                    value={rulesConfig.milestone1Visit}
                    onChange={e => setRulesConfig({ ...rulesConfig, milestone1Visit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Milestone 1 Discount (%)
                  </label>
                  <input
                    type="number"
                    value={rulesConfig.milestone1DiscountPct}
                    onChange={e => setRulesConfig({ ...rulesConfig, milestone1DiscountPct: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Milestone 2 Discount (%)
                  </label>
                  <input
                    type="number"
                    value={rulesConfig.milestone2DiscountPct}
                    onChange={e => setRulesConfig({ ...rulesConfig, milestone2DiscountPct: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Milestone 2 Maximum Cap (LKR)
                  </label>
                  <input
                    type="number"
                    value={rulesConfig.milestone2MaxCapLKR}
                    onChange={e => setRulesConfig({ ...rulesConfig, milestone2MaxCapLKR: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Physical NFC Stamp Secret Token
                  </label>
                  <input
                    type="text"
                    value={rulesConfig.nfcSecretToken}
                    onChange={e => setRulesConfig({ ...rulesConfig, nfcSecretToken: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] font-mono focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Save Loyalty Rules
                  </button>
                </div>
              </form>
            </div>

            {/* Section B: Studio Hours & Address Verification */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/30 shadow-xs space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
                Operating Schedule & Location Verification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30">
                  <span className="text-stone-500 font-bold block text-[10px] uppercase">Operating Days</span>
                  <span className="text-[#4A4A4A] font-semibold mt-1 block">{BRAND_CONFIG.operatingHours.days}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30">
                  <span className="text-stone-500 font-bold block text-[10px] uppercase">Hours</span>
                  <span className="text-[#4A4A4A] font-semibold mt-1 block">{BRAND_CONFIG.operatingHours.hours}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30">
                  <span className="text-stone-500 font-bold block text-[10px] uppercase">Studio Address</span>
                  <span className="text-[#4A4A4A] font-semibold mt-1 block">{BRAND_CONFIG.address}, {BRAND_CONFIG.city}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: DIGITAL CMS */}
        {activeTab === 'digital_cms' && (
          <DigitalCMSHub
            onRefreshGlobal={loadData}
            onShowSuccess={msg => setPosSuccessMsg(msg)}
          />
        )}

      </main>

      {/* PAPER TO DIGITAL CARD MODAL */}
      {showMigrateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E2B4BD]/40 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
              Migrate Physical Paper Stamp Card
            </h3>
            <p className="text-xs text-stone-500">
              Transfer existing stamps from a customer's physical cardboard loyalty card to their digital smartphone pass.
            </p>

            <form onSubmit={handlePaperMigration} className="space-y-3">
              <div>
                <label className="text-xs text-stone-600 font-semibold block mb-1">Customer Phone Number</label>
                <input
                  type="tel"
                  required
                  value={migratePhone}
                  onChange={e => setMigratePhone(e.target.value)}
                  placeholder="077 123 4567"
                  className="w-full px-3 py-2 bg-[#FFF5F5] border border-[#E2B4BD]/40 rounded-xl text-xs text-[#4A4A4A]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-600 font-semibold block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={migrateName}
                  onChange={e => setMigrateName(e.target.value)}
                  placeholder="Amaya Perera"
                  className="w-full px-3 py-2 bg-[#FFF5F5] border border-[#E2B4BD]/40 rounded-xl text-xs text-[#4A4A4A]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-600 font-semibold block mb-1">Verified Stamps on Paper Card (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={migrateStamps}
                  onChange={e => setMigrateStamps(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FFF5F5] border border-[#E2B4BD]/40 rounded-xl text-xs text-[#4A4A4A]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-600 font-semibold block mb-1">Staff Verification Notes</label>
                <input
                  type="text"
                  value={migrateNotes}
                  onChange={e => setMigrateNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF5F5] border border-[#E2B4BD]/40 rounded-xl text-xs text-[#4A4A4A]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMigrateModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2B4BD]/40 text-xs text-stone-600 hover:text-[#4A4A4A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Complete Migration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
