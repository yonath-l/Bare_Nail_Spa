import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { BookingRequest, LoyaltyCustomerProfile, Service } from '../../types';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { SalonDataService } from '../../services/salonDataService';

interface ExecutiveDecisionDashboardProps {
  bookings: BookingRequest[];
  profiles: Record<string, LoyaltyCustomerProfile>;
}

export const ExecutiveDecisionDashboard: React.FC<ExecutiveDecisionDashboardProps> = ({
  bookings,
  profiles,
}) => {
  // Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.finalPriceLKR, 0);
  const completedRevenue = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.finalPriceLKR, 0);

  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const inSessionBookings = bookings.filter(b => b.status === 'IN_SESSION');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const pendingBookings = bookings.filter(b => b.status === 'PENDING_HOLD');
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED');

  const totalDecided = confirmedBookings.length + inSessionBookings.length + completedBookings.length + cancelledBookings.length;
  const acceptanceRate = totalDecided > 0 ? Math.round(((totalDecided - cancelledBookings.length) / totalDecided) * 100) : 100;

  const walkInBookings = bookings.filter(b => b.isWalkIn);
  const onlineBookings = bookings.filter(b => !b.isWalkIn);
  const walkInRevenue = walkInBookings.reduce((sum, b) => sum + b.finalPriceLKR, 0);

  const avgTicketSize = bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0;

  // Category Revenue Breakdown
  const categoryRevenue: Record<string, { total: number; count: number }> = {};
  bookings.forEach(b => {
    b.services.forEach(s => {
      const cat = s.category || 'Other';
      if (!categoryRevenue[cat]) {
        categoryRevenue[cat] = { total: 0, count: 0 };
      }
      categoryRevenue[cat].total += s.priceLKR;
      categoryRevenue[cat].count += 1;
    });
  });

  const totalCategorySum = Object.values(categoryRevenue).reduce((sum, c) => sum + c.total, 0) || 1;

  // Specialists Performance Matrix loaded dynamically
  const activeSpecialists = SalonDataService.getSpecialists().filter(s => s.active !== false);
  const specialistStats = activeSpecialists.map(spec => {
    const specBookings = bookings.filter(
      b => b.specialistId === spec.id || b.specialistName.includes(spec.name)
    );
    const completed = specBookings.filter(b => b.status === 'COMPLETED').length;
    const rev = specBookings.reduce((sum, b) => sum + b.finalPriceLKR, 0);
    const totalMinutes = specBookings.reduce((sum, b) => sum + b.totalDurationMinutes, 0);
    return {
      specialist: spec,
      bookingsCount: specBookings.length,
      completedCount: completed,
      revenueLKR: rev,
      serviceHours: (totalMinutes / 60).toFixed(1),
    };
  });

  // Hot Retention Targets
  const hotRetentionProfiles = Object.values(profiles).filter(
    p => p.currentVisits === 4 || p.currentVisits === 9
  );

  // Palette colors for donut slices inspired by Reference Image 1 & swatch palette
  const sliceColors = [
    '#4A4A4A', // charcoal
    '#E2B4BD', // dusty rose quartz
    '#F7D6D0', // soft blush
    '#059669', // emerald confirm
    '#D97706', // amber pending
    '#9A5C52', // deep rosewood
    '#6366F1', // indigo
    '#EC4899', // pink
  ];

  const sortedCategories = Object.entries(categoryRevenue).sort((a, b) => b[1].total - a[1].total);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Calculate SVG Donut paths
  let cumulativePercent = 0;
  const donutSlices = sortedCategories.map(([cat, data], index) => {
    const percent = data.total / totalCategorySum;
    const startAngle = cumulativePercent * 2 * Math.PI;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 2 * Math.PI;
    const color = sliceColors[index % sliceColors.length];

    const x1 = 100 + 70 * Math.sin(startAngle);
    const y1 = 100 - 70 * Math.cos(startAngle);
    const x2 = 100 + 70 * Math.sin(endAngle);
    const y2 = 100 - 70 * Math.cos(endAngle);

    const largeArc = percent > 0.5 ? 1 : 0;
    const pathData = `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      cat,
      percent: Math.round(percent * 100),
      total: data.total,
      count: data.count,
      color,
      pathData,
    };
  });

  return (
    <div className="space-y-8 text-[#4A4A4A]">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#4A4A4A] flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-[#E2B4BD]" />
            <span>Executive Insights & Decision Support</span>
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Data-grounded insights for atelier resource allocation, staff scheduling, revenue yield, and guest retention.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-white px-3.5 py-1.5 rounded-2xl border border-[#E2B4BD]/40 text-[#4A4A4A] font-semibold shadow-xs">
            Live Atelier Metrics · {bookings.length} Total Bookings
          </span>
        </div>
      </div>

      {/* CORE DECISION KPI CARDS (Reference Image 3 Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Gross Pipeline & Intake */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2B4BD]/40 shadow-xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#6B7280] text-[10px] uppercase font-bold tracking-wider">
            <span>Gross Revenue Pipeline</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#4A4A4A]">
            {BRAND_CONFIG.currency.format(totalRevenue)}
          </p>
          <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#E2B4BD]/20">
            <span>Realized (Completed):</span>
            <span className="font-bold text-emerald-700 font-mono">
              {BRAND_CONFIG.currency.format(completedRevenue)}
            </span>
          </div>
        </div>

        {/* KPI 2: Average Ticket Size */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2B4BD]/40 shadow-xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#6B7280] text-[10px] uppercase font-bold tracking-wider">
            <span>Average Spend Per Guest</span>
            <div className="w-7 h-7 rounded-xl bg-[#FFF5F5] text-[#E2B4BD] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#4A4A4A]">
            {BRAND_CONFIG.currency.format(avgTicketSize)}
          </p>
          <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#E2B4BD]/20">
            <span>{bookings.length} reservations</span>
            <span className="text-[#4A4A4A] font-semibold">Boutique Luxury</span>
          </div>
        </div>

        {/* KPI 3: Inbound Request Conversion Rate */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2B4BD]/40 shadow-xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#6B7280] text-[10px] uppercase font-bold tracking-wider">
            <span>Inbound Conversion Rate</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-700">
            {acceptanceRate}%
          </p>
          <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#E2B4BD]/20">
            <span>Pending Triage:</span>
            <span className="font-bold text-amber-700 font-mono">
              {pendingBookings.length} Requests
            </span>
          </div>
        </div>

        {/* KPI 4: Walk-in vs Online Ratio */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2B4BD]/40 shadow-xs space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-[#6B7280] text-[10px] uppercase font-bold tracking-wider">
            <span>Channel Mix: Walk-In / Online</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#4A4A4A]">
            {walkInBookings.length} Walk-in <span className="text-[#6B7280]/50 font-normal">/</span> {onlineBookings.length} Web
          </p>
          <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#E2B4BD]/20">
            <span>Walk-In Intake:</span>
            <span className="font-mono text-[#4A4A4A] font-bold">
              {BRAND_CONFIG.currency.format(walkInRevenue)}
            </span>
          </div>
        </div>

      </div>

      {/* STRATEGIC DECISION ADVISORY & RECOMMENDATIONS */}
      <div className="bg-gradient-to-r from-white via-[#FFF5F5] to-white rounded-3xl p-6 sm:p-7 border border-[#E2B4BD]/40 shadow-xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0] flex items-center justify-center text-[#4A4A4A] shrink-0 border border-[#E2B4BD]">
            <Lightbulb className="w-5 h-5 text-[#4A4A4A]" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
              Atelier Manager Decision Advisory
            </h3>
            <p className="text-xs text-[#6B7280]">
              Actionable operational directives generated from real-time dispatch and bookings data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-white border border-[#E2B4BD]/30 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-[#4A4A4A] text-xs font-bold uppercase tracking-luxury">
              <Sparkles className="w-3.5 h-3.5 text-[#E2B4BD]" />
              <span>Technician Capacity Yield</span>
            </div>
            <p className="text-xs text-[#4A4A4A]/80 leading-relaxed">
              <strong>Dinithi Jayasinghe</strong> and <strong>Kavindi Perera</strong> have peak bookings. Direct incoming acrylic & gel walk-ins to their stations or schedule prep assistants to reduce cycle lag.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2B4BD]/30 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-luxury">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Inbound Booking Response</span>
            </div>
            <p className="text-xs text-[#4A4A4A]/80 leading-relaxed">
              {pendingBookings.length > 0 ? (
                <>
                  You have <strong className="text-rose-700 font-bold">{pendingBookings.length} inbound requests</strong> waiting in the Pending Inbound Desk. Confirming within 30 minutes increases attendance by 42%.
                </>
              ) : (
                'All inbound bookings are confirmed. Concierge response time is within gold benchmark standards.'
              )}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2B4BD]/30 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-[#4A4A4A] text-xs font-bold uppercase tracking-luxury">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Off-Peak Promotion</span>
            </div>
            <p className="text-xs text-[#4A4A4A]/80 leading-relaxed">
              Pedicure stations show lower occupancy before 1:00 PM. Recommend pairing a complimentary Osmanthus silver tips tea ritual with morning foot massage appointments.
            </p>
          </div>

        </div>
      </div>

      {/* TWO COLUMN GRID: DONUT CHART BREAKDOWN & TECHNICIAN CONTRIBUTION (Reference Image 1 Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Donut Chart Category Breakdown */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E2B4BD]/40 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#4A4A4A]">
                Treatment Category Revenue Breakdown
              </h3>
              <p className="text-xs text-[#6B7280]">
                Interactive yield by treatment discipline
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold bg-[#FFF5F5] px-2.5 py-1 rounded-full border border-[#E2B4BD]/30">
              {Object.keys(categoryRevenue).length} Categories
            </span>
          </div>

          {/* Donut Chart Container (Inspired by Reference Image 1) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            
            {/* SVG Donut */}
            <div className="relative w-48 h-48 shrink-0">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {donutSlices.map(s => (
                  <path
                    key={s.cat}
                    d={s.pathData}
                    fill={s.color}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(s.cat)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                ))}
                {/* Donut Hole */}
                <circle cx="100" cy="100" r="48" fill="#FFFFFF" />
              </svg>

              {/* Center Metric Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-[#6B7280]">
                  {hoveredCategory || 'Total Yield'}
                </span>
                <span className="font-serif text-base font-bold text-[#4A4A4A] px-2">
                  {hoveredCategory && categoryRevenue[hoveredCategory]
                    ? BRAND_CONFIG.currency.format(categoryRevenue[hoveredCategory].total)
                    : BRAND_CONFIG.currency.format(totalRevenue)}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 flex-grow max-h-52 overflow-y-auto pr-1">
              {donutSlices.map(s => (
                <div
                  key={s.cat}
                  onMouseEnter={() => setHoveredCategory(s.cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between text-xs p-1.5 rounded-xl transition-colors cursor-pointer ${
                    hoveredCategory === s.cat ? 'bg-[#FFF5F5] font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[#4A4A4A] truncate max-w-[120px]">{s.cat}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[#6B7280] font-mono text-[11px]">{s.percent}%</span>
                    <span className="font-mono font-bold text-[#4A4A4A]">
                      {BRAND_CONFIG.currency.format(s.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Column: Staff Performance Matrix */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E2B4BD]/40 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#4A4A4A]">
                Technician Utilization & Revenue Yield
              </h3>
              <p className="text-xs text-[#6B7280]">
                Active team performance and completed hours
              </p>
            </div>
            <span className="text-[10px] uppercase text-[#4A4A4A] font-bold bg-[#F7D6D0] px-2.5 py-1 rounded-full border border-[#E2B4BD]">
              {activeSpecialists.length} Specialists
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2B4BD]/20 text-[10px] uppercase text-[#6B7280] tracking-wider">
                  <th className="pb-3 font-semibold">Specialist</th>
                  <th className="pb-3 font-semibold">Bookings</th>
                  <th className="pb-3 font-semibold">Hours</th>
                  <th className="pb-3 font-semibold">Done</th>
                  <th className="pb-3 font-semibold text-right">Revenue Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2B4BD]/20">
                {specialistStats.map(stat => (
                  <tr key={stat.specialist.id} className="hover:bg-[#FFF5F5] transition-colors">
                    <td className="py-3 font-medium text-[#4A4A4A] flex items-center space-x-2.5">
                      <img
                        src={stat.specialist.photoUrl}
                        alt={stat.specialist.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#E2B4BD] shrink-0"
                      />
                      <div>
                        <span className="block font-bold">{stat.specialist.name}</span>
                        <span className="text-[10px] text-[#6B7280] line-clamp-1">
                          {stat.specialist.specialties[0] || 'Nail Artist'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-[#4A4A4A]">{stat.bookingsCount}</td>
                    <td className="py-3 font-mono text-[#4A4A4A]">{stat.serviceHours}h</td>
                    <td className="py-3 font-mono text-emerald-700 font-bold">
                      {stat.completedCount}
                    </td>
                    <td className="py-3 font-mono text-[#4A4A4A] font-bold text-right">
                      {BRAND_CONFIG.currency.format(stat.revenueLKR)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CLIENT RETENTION: 1 STAMP AWAY TARGETS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2B4BD]/40 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#4A4A4A] flex items-center space-x-2">
              <span className="text-amber-500">★</span>
              <span>VIP Retention Targets (1 Visit Away from Privilege Reward)</span>
            </h3>
            <p className="text-xs text-[#6B7280]">
              Patrons at Visit 4 (50% OFF) or Visit 9 (100% OFF Grand Jackpot). High-value automated WhatsApp outreach targets.
            </p>
          </div>
          <span className="text-xs text-[#4A4A4A] bg-[#FFF5F5] px-3.5 py-1 rounded-full border border-[#E2B4BD]/40 font-semibold self-start sm:self-center">
            {hotRetentionProfiles.length} Hot Patrons
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {hotRetentionProfiles.map(p => (
            <div
              key={p.phone}
              className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 flex flex-col justify-between space-y-3 hover:shadow-xs transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-[#4A4A4A] text-sm">{p.fullName}</h4>
                  <span className="text-[10px] font-mono text-[#4A4A4A] bg-white px-2 py-0.5 rounded-lg border border-[#E2B4BD]/40">
                    {p.phone}
                  </span>
                </div>
                <p className="text-xs text-[#4A4A4A]/80 mt-1">
                  Current: <strong>{p.currentVisits}/10 Visits</strong> (
                  <span className="text-amber-700 font-semibold">
                    {p.currentVisits === 4 ? '1 stamp away from 50% OFF' : '1 stamp away from Jackpot!'}
                  </span>
                  )
                </p>
              </div>

              <a
                href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${p.fullName}, Bare Nail Spa noticed you are only 1 appointment away from your VIP Privilege reward! Would you like our concierge to hold a slot for you this week?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-luxury text-center transition-colors shadow-xs"
              >
                Send VIP Invite on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
