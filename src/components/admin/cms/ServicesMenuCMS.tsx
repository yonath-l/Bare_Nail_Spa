import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Sparkles, Clock, Check, X, Upload } from 'lucide-react';
import { Service, TreatmentCategory } from '../../../types';
import { SalonDataService } from '../../../services/salonDataService';
import { BRAND_CONFIG } from '../../../config/brandConfig';

const ALL_CATEGORIES: TreatmentCategory[] = [
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

interface ServicesMenuCMSProps {
  onRefreshGlobal?: () => void;
  onShowSuccess: (msg: string) => void;
}

export const ServicesMenuCMS: React.FC<ServicesMenuCMSProps> = ({
  onRefreshGlobal,
  onShowSuccess,
}) => {
  const [services, setServices] = useState<Service[]>(() => SalonDataService.getServices());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<TreatmentCategory>('Manicures');
  const [formDuration, setFormDuration] = useState<number>(45);
  const [formPrice, setFormPrice] = useState<number>(3500);
  const [formDesc, setFormDesc] = useState<string>('');
  const [formHighlights, setFormHighlights] = useState<string>('');
  const [formIsAddon, setFormIsAddon] = useState<boolean>(false);
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    setServices(SalonDataService.getServices());
    if (onRefreshGlobal) onRefreshGlobal();
  };

  const openCreateModal = () => {
    setEditingService(null);
    setFormTitle('');
    setFormCategory('Manicures');
    setFormDuration(45);
    setFormPrice(3500);
    setFormDesc('');
    setFormHighlights('Russian e-file cuticle care, Long-wear diamond topcoat');
    setFormIsAddon(false);
    setFormImageUrl('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormTitle(service.title);
    setFormCategory(service.category);
    setFormDuration(service.durationMinutes);
    setFormPrice(service.priceLKR);
    setFormDesc(service.description);
    setFormHighlights(service.formulaHighlights ? service.formulaHighlights.join(', ') : '');
    setFormIsAddon(Boolean(service.isAddon));
    setFormImageUrl(service.imageUrl || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) {
      setFormError('Please enter a ritual title.');
      return;
    }
    if (formPrice <= 0) {
      setFormError('Please enter a valid price in LKR.');
      return;
    }
    if (formDuration <= 0) {
      setFormError('Please enter a valid duration in minutes.');
      return;
    }

    const highlightsArray = formHighlights
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingService) {
      SalonDataService.updateService({
        ...editingService,
        title: formTitle.trim(),
        category: formCategory,
        durationMinutes: Number(formDuration),
        priceLKR: Number(formPrice),
        description: formDesc.trim(),
        formulaHighlights: highlightsArray,
        isAddon: formIsAddon,
        imageUrl: formImageUrl.trim() || undefined,
      });
      onShowSuccess(`Updated ritual "${formTitle.trim()}" successfully.`);
    } else {
      SalonDataService.createService({
        title: formTitle.trim(),
        category: formCategory,
        durationMinutes: Number(formDuration),
        priceLKR: Number(formPrice),
        description: formDesc.trim(),
        formulaHighlights: highlightsArray,
        isAddon: formIsAddon,
        imageUrl: formImageUrl.trim() || undefined,
      });
      onShowSuccess(`Added new treatment ritual "${formTitle.trim()}" to menu catalog.`);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (service: Service) => {
    if (window.confirm(`Are you sure you want to remove "${service.title}" from the atelier catalog?`)) {
      SalonDataService.deleteService(service.id);
      loadData();
      onShowSuccess(`Removed "${service.title}" from menu catalog.`);
    }
  };

  const filtered = services.filter(s => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 text-[#4A4A4A]">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-2xl font-bold text-[#4A4A4A]">
                Services & Rituals Menu Catalog
              </h3>
              <span className="text-xs bg-[#FFF5F5] px-3 py-1 rounded-xl text-[#4A4A4A] border border-[#E2B4BD]/40 font-semibold">
                {services.length} Total Rituals
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Add, update prices, change durations, and manage treatment descriptions displayed on the public boutique and booking portal.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 bg-[#4A4A4A] hover:bg-black text-white px-5 py-2.5 rounded-2xl text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Add Treatment Ritual</span>
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="pt-2 border-t border-[#E2B4BD]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#4A4A4A] text-white font-bold shadow-xs'
                  : 'bg-[#FFF5F5] text-[#4A4A4A]/80 hover:text-[#4A4A4A] border border-[#E2B4BD]/30'
              }`}
            >
              All ({services.length})
            </button>
            {ALL_CATEGORIES.map(cat => {
              const count = services.filter(s => s.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#4A4A4A] text-white font-bold shadow-xs'
                      : 'bg-[#FFF5F5] text-[#4A4A4A]/80 hover:text-[#4A4A4A] border border-[#E2B4BD]/30'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search rituals by title or keywords..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(service => (
          <div
            key={service.id}
            className="p-5 rounded-3xl bg-white border border-[#E2B4BD]/30 hover:border-[#E2B4BD] transition-all flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-[#4A4A4A] bg-[#F7D6D0] px-2.5 py-0.5 rounded-full border border-[#E2B4BD]">
                  {service.category}
                </span>
                <span className="font-serif text-lg font-bold text-[#4A4A4A]">
                  {BRAND_CONFIG.currency.format(service.priceLKR)}
                </span>
              </div>

              {service.imageUrl && (
                <div className="w-full h-32 rounded-2xl overflow-hidden border border-[#E2B4BD]/30 bg-[#FFF5F5]">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h4 className="font-serif text-base font-bold text-[#4A4A4A]">
                  {service.title}
                </h4>
                <p className="text-xs text-[#6B7280] line-clamp-2 mt-1">
                  {service.description || 'Exclusive Bare Nail Spa treatment.'}
                </p>
              </div>

              {service.formulaHighlights && service.formulaHighlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.formulaHighlights.map((hl, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-[#FFF5F5] text-[#4A4A4A] px-2 py-0.5 rounded-md border border-[#E2B4BD]/30"
                    >
                      {hl}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E2B4BD]/20 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs text-[#6B7280]">
                <Clock className="w-3.5 h-3.5 text-[#E2B4BD]" />
                <span>{service.durationMinutes} mins</span>
                {service.isAddon && (
                  <span className="ml-1 text-[10px] text-amber-700 font-semibold">• Add-on</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="p-2 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD]/40 transition-colors cursor-pointer"
                  title="Edit Ritual"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(service)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                  title="Delete Ritual"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E2B4BD]/30">
          <p className="text-xs text-[#6B7280]">No treatment rituals found matching your filters.</p>
        </div>
      )}

      {/* ADD / EDIT SERVICE MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-2xl space-y-6 my-8 text-[#4A4A4A]">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E2B4BD]/30">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F7D6D0] flex items-center justify-center text-[#4A4A4A] border border-[#E2B4BD]">
                  <Sparkles className="w-4 h-4 text-[#4A4A4A]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
                    {editingService ? 'Edit Treatment Ritual' : 'Add New Treatment Ritual'}
                  </h3>
                  <p className="text-[11px] text-[#6B7280]">
                    Configure official service pricing, duration, and client-facing description.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FFF5F5] hover:bg-rose-50 text-[#6B7280] hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer border border-[#E2B4BD]/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                  Treatment Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Russian E-File Diamond Manicure"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as TreatmentCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  >
                    {ALL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Duration (Mins) *
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="5"
                    required
                    value={formDuration}
                    onChange={e => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                  Treatment Visual (Device Gallery Upload)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="flex-1 w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/40 text-[#4A4A4A] text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[#4A4A4A]" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={e => setFormImageUrl(e.target.value)}
                    placeholder="or enter image URL..."
                    className="flex-1 w-full px-3 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD]"
                  />
                </div>
                {formImageUrl && (
                  <div className="mt-2 flex items-center space-x-2">
                    <img src={formImageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[#E2B4BD]/40" />
                    <span className="text-[10px] text-emerald-700 font-semibold">Image verified</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                  Client Description
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Detailed explanation of the treatment benefits, technique, and result..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                  Formula Highlights (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={formHighlights}
                  onChange={e => setFormHighlights(e.target.value)}
                  placeholder="e.g. Japanese Builder Gel, Cruelty-Free, 4-Week Wear"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsAddon"
                  checked={formIsAddon}
                  onChange={e => setFormIsAddon(e.target.checked)}
                  className="rounded border-[#E2B4BD] text-[#4A4A4A] focus:ring-0 w-4 h-4"
                />
                <label htmlFor="formIsAddon" className="text-xs text-[#4A4A4A] cursor-pointer">
                  Mark as an Add-on Service (e.g. French tip add-on, cuticle oil booster)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E2B4BD]/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl border border-[#E2B4BD]/40 text-xs uppercase tracking-luxury font-semibold text-[#4A4A4A] hover:bg-[#FFF5F5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {editingService ? 'Save Ritual Changes' : 'Create Ritual'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
