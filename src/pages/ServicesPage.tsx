import { asset } from '../utils/assetHelper';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Sparkles, Check, ArrowRight, Calendar, ShieldCheck } from 'lucide-react';
import { SalonDataService } from '../services/salonDataService';
import { BRAND_CONFIG } from '../config/brandConfig';
import { Service, TreatmentCategory } from '../types';
import { useBooking } from '../context/BookingContext';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedServices, toggleService, setCurrentStep } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const allServices = SalonDataService.getServices();

  const categories: string[] = [
    'ALL',
    'Manicures',
    'Hand Massage',
    'Pedicures',
    'Foot Massage',
    'Acrylic Extensions',
    'Gel Extensions',
    'Nail Services',
    "Men's Services",
    "Kid's Services",
    'Add-ons',
  ];

  const filteredServices = allServices.filter(service => {
    const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.formulaHighlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleBookNow = (service: Service) => {
    if (!selectedServices.some(s => s.id === service.id)) {
      toggleService(service);
    }
    setCurrentStep(1);
    navigate('/book');
  };

  const handleDrawerProceed = () => {
    setCurrentStep(1);
    navigate('/book');
  };

  const totalDrawerPrice = selectedServices.reduce((sum, s) => sum + s.priceLKR, 0);
  const totalDrawerMinutes = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header & Atmospheric Hero Bento */}
      <ScrollReveal direction="up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-champagne/20 border border-champagne/40 px-3 py-1 rounded-full text-[10px] uppercase tracking-wide-luxury text-rosewood font-bold animate-float-slow">
              <Sparkles className="w-3.5 h-3.5 text-champagne" />
              <span>Haute Treatment Architecture</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-espresso leading-tight">
              Services & <br />
              <span className="italic text-rosewood">Atelier Rituals</span>
            </h1>

            <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed font-light max-w-xl">
              Every procedure at Bare Nail Spa is executed with hospital-grade autoclave sterilization, certified European Russian diamond e-filing, and healthy apex-protecting gels.
            </p>

            {/* Instant Search Bar */}
            <div className="relative max-w-md pt-2">
              <Search className="w-4 h-4 text-clay absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search treatments, BIAB, autoclave, chrome..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-linen-100 border border-rosewood/20 text-xs text-espresso focus:outline-none focus:border-rosewood shadow-sm transition-all focus:shadow-md"
              />
            </div>
          </div>

          {/* Bento Atmosphere Video */}
          <div className="lg:col-span-5">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-rosewood/15 shadow-luxury-subtle bg-espresso group">
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={asset('assets/reel-2-poster.jpg')}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              >
                <source src={asset('assets/reel-2.mp4')} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent flex items-end p-5 text-linen">
                <div>
                  <span className="text-[10px] uppercase tracking-luxury text-champagne font-bold block">
                    Studio Atmosphere
                  </span>
                  <p className="font-serif text-sm font-semibold">
                    Zero Rush. Pure Mindfulness.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* Sticky Category Filter Pills */}
      <div className="sticky top-20 z-30 bg-linen/95 backdrop-blur-md py-4 border-y border-rosewood/10">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-luxury whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-rosewood text-white shadow-luxury-subtle font-medium'
                  : 'bg-linen-100 text-espresso/70 hover:text-espresso border border-rosewood/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map(service => {
          const isSelected = selectedServices.some(s => s.id === service.id);

          return (
            <div
              key={service.id}
              className={`card-luxury p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-linen-100 border-rosewood shadow-luxury-elevated'
                  : 'bg-white/90 border-rosewood/15 hover:border-champagne/60 shadow-luxury-subtle hover:shadow-luxury-elevated'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-luxury text-clay font-bold">
                      {service.category}
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-espresso">
                      {service.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleService(service)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 hover:scale-110 active:scale-95 ${
                      isSelected
                        ? 'bg-rosewood border-rosewood text-white shadow-xs'
                        : 'border-rosewood/30 bg-white hover:border-rosewood'
                    }`}
                    title={isSelected ? 'Remove from selection' : 'Add to reservation'}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                  {service.description}
                </p>

                {/* Formula Specifications */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-clay font-bold block">
                    Formula Highlights
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.formulaHighlights.map((hl, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-linen-200 text-espresso/80 px-2.5 py-1 rounded-md"
                      >
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Booking Actions */}
              <div className="pt-6 mt-6 border-t border-rosewood/10 flex items-center justify-between">
                <div className="flex items-baseline space-x-3">
                  <span className="font-serif text-2xl font-bold text-espresso">
                    {BRAND_CONFIG.currency.format(service.priceLKR)}
                  </span>
                  <span className="text-xs text-clay flex items-center space-x-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.durationMinutes} mins</span>
                  </span>
                </div>

                <button
                  onClick={() => handleBookNow(service)}
                  className="btn-sheen inline-flex items-center space-x-2 bg-espresso hover:bg-rosewood text-linen px-5 py-2.5 rounded-full text-xs uppercase tracking-luxury font-medium transition-all shadow-xs hover:shadow-luxury-gold hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Calendar className="w-3.5 h-3.5 text-champagne" />
                  <span>Reserve</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating Reservation Drawer with Entrance Animation */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-espresso/98 text-linen rounded-3xl p-4 sm:p-5 border border-champagne/60 shadow-2xl flex items-center justify-between backdrop-blur-lg animate-fade-up">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-2xl bg-champagne/20 text-champagne shrink-0 animate-pulse-soft">
              <Sparkles className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wide-luxury text-champagne font-bold block">
                {selectedServices.length} Ritual(s) Selected · {totalDrawerMinutes} mins
              </span>
              <p className="font-serif text-lg font-bold text-linen">
                Total: {BRAND_CONFIG.currency.format(totalDrawerPrice)}
              </p>
            </div>
          </div>

          <button
            onClick={handleDrawerProceed}
            className="btn-sheen inline-flex items-center space-x-2 bg-rosewood hover:bg-rosewood-dark text-white px-6 py-3 rounded-full text-xs uppercase tracking-luxury font-bold shadow-luxury-gold hover:shadow-luxury-elevated transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Proceed to Calendar</span>
            <ArrowRight className="w-4 h-4 text-champagne" />
          </button>
        </div>
      )}

    </div>
  );
};
