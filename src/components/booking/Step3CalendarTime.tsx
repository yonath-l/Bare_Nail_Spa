import React from 'react';
import { Calendar as CalendarIcon, Clock, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const Step3CalendarTime: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    holdSecondsRemaining,
    isHoldExpired,
    setCurrentStep,
  } = useBooking();

  // Generate next 10 calendar days starting tomorrow
  const availableDates: Array<{ dateString: string; dayName: string; dayNumber: number; monthName: string }> = [];
  for (let i = 1; i <= 10; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    availableDates.push({
      dateString: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }

  const morningSlots = ['09:30 AM', '11:00 AM', '12:15 PM'];
  const afternoonSlots = ['01:30 PM', '02:45 PM', '04:15 PM'];
  const eveningSlots = ['05:30 PM', '06:30 PM'];

  // Booked slot demonstration
  const bookedSlots = ['02:45 PM'];

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-rosewood/10">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-clay font-bold">
            Step 3 of 4
          </span>
          <h2 className="font-serif text-3xl font-semibold text-espresso">
            Date & Temporary Hold Slot
          </h2>
          <p className="text-xs text-espresso/70 mt-1">
            Choose your preferred time. We temporarily hold your slot for 7 minutes during checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-center">
          <button
            onClick={() => setCurrentStep(2)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-rosewood/25 text-espresso hover:bg-rosewood/10 text-xs uppercase tracking-luxury font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {/* 7-Minute Hold Countdown Banner */}
          <div
            className={`p-2.5 px-3.5 rounded-2xl border flex items-center space-x-2.5 shrink-0 ${
              isHoldExpired
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-white/90 border-champagne text-espresso shadow-xs'
            }`}
          >
            <div className="p-1.5 rounded-xl bg-champagne/20 text-rosewood">
              <Clock className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-clay font-bold block">
                {isHoldExpired ? 'Expired' : 'Temporary Hold'}
              </span>
              <span className="font-mono text-xs font-bold text-rosewood">
                {isHoldExpired ? 'Released' : formatTimer(holdSecondsRemaining)}
              </span>
            </div>
          </div>

          {/* Right-Top Next Step Button */}
          <button
            onClick={() => setCurrentStep(4)}
            className="inline-flex items-center space-x-2 bg-rosewood hover:bg-rosewood-dark text-white px-7 py-3 rounded-full text-xs uppercase tracking-luxury font-medium shadow-luxury-subtle transition-all duration-300 cursor-pointer"
          >
            <span>Guest Dossier</span>
            <ArrowRight className="w-4 h-4 text-champagne" />
          </button>
        </div>
      </div>

      {isHoldExpired && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Your 7-minute reservation hold expired. Please re-confirm your slot to hold again.</span>
        </div>
      )}

      {/* Date Carousel */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-luxury text-clay font-semibold flex items-center space-x-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-rosewood" />
          <span>Select Date</span>
        </label>
        
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {availableDates.map(dateObj => {
            const isSelected = selectedDate === dateObj.dateString;

            return (
              <button
                key={dateObj.dateString}
                onClick={() => setSelectedDate(dateObj.dateString)}
                className={`flex-shrink-0 w-20 py-3 rounded-2xl border-2 text-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-rosewood text-white border-rosewood shadow-luxury-subtle'
                    : 'bg-white/80 border-rosewood/15 text-espresso hover:border-clay'
                }`}
              >
                <span className={`text-[10px] uppercase tracking-wider block font-medium ${isSelected ? 'text-champagne-light' : 'text-clay'}`}>
                  {dateObj.dayName}
                </span>
                <span className="font-serif text-2xl font-bold block my-0.5">
                  {dateObj.dayNumber}
                </span>
                <span className={`text-[10px] uppercase block ${isSelected ? 'text-white/80' : 'text-espresso/60'}`}>
                  {dateObj.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="space-y-4 pt-2">
        <label className="text-xs uppercase tracking-luxury text-clay font-semibold flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-rosewood" />
          <span>Select Time Window</span>
        </label>

        {/* Morning */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-espresso/60 font-semibold mb-2 block">
            Morning Radiance (09:00 AM – 12:30 PM)
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {morningSlots.map(slot => {
              const isSelected = selectedTimeSlot === slot;
              const isBooked = bookedSlots.includes(slot);

              return (
                <button
                  key={slot}
                  disabled={isBooked}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-3 px-4 rounded-2xl text-xs font-medium border transition-all ${
                    isBooked
                      ? 'bg-gray-100 border-gray-200 text-gray-400 line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-espresso text-linen border-champagne shadow-luxury-gold'
                      : 'bg-white/80 border-rosewood/20 text-espresso hover:border-rosewood'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Afternoon */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-espresso/60 font-semibold mb-2 block">
            Afternoon Sanctuary (01:00 PM – 05:00 PM)
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {afternoonSlots.map(slot => {
              const isSelected = selectedTimeSlot === slot;
              const isBooked = bookedSlots.includes(slot);

              return (
                <button
                  key={slot}
                  disabled={isBooked}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-3 px-4 rounded-2xl text-xs font-medium border transition-all ${
                    isBooked
                      ? 'bg-gray-100 border-gray-200 text-gray-400 line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-espresso text-linen border-champagne shadow-luxury-gold'
                      : 'bg-white/80 border-rosewood/20 text-espresso hover:border-rosewood'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Evening */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-espresso/60 font-semibold mb-2 block">
            Twilight Serenity (05:00 PM – 07:00 PM)
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {eveningSlots.map(slot => {
              const isSelected = selectedTimeSlot === slot;
              const isBooked = bookedSlots.includes(slot);

              return (
                <button
                  key={slot}
                  disabled={isBooked}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-3 px-4 rounded-2xl text-xs font-medium border transition-all ${
                    isBooked
                      ? 'bg-gray-100 border-gray-200 text-gray-400 line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-espresso text-linen border-champagne shadow-luxury-gold'
                      : 'bg-white/80 border-rosewood/20 text-espresso hover:border-rosewood'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
