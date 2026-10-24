import { asset } from '../../../utils/assetHelper';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Check, X, Upload, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { StaffSpecialist, TreatmentCategory } from '../../../types';
import { SalonDataService } from '../../../services/salonDataService';

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

interface StaffDirectoryCMSProps {
  onRefreshGlobal?: () => void;
  onShowSuccess: (msg: string) => void;
}

export const StaffDirectoryCMS: React.FC<StaffDirectoryCMSProps> = ({
  onRefreshGlobal,
  onShowSuccess,
}) => {
  const [specialists, setSpecialists] = useState<StaffSpecialist[]>(() =>
    SalonDataService.getSpecialists()
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSpecialist, setEditingSpecialist] = useState<StaffSpecialist | null>(null);

  // Form Fields
  const [formName, setFormName] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formBio, setFormBio] = useState<string>('');
  const [formPhotoUrl, setFormPhotoUrl] = useState<string>('');
  const [formSpecialties, setFormSpecialties] = useState<TreatmentCategory[]>([]);
  const [formExperienceYears, setFormExperienceYears] = useState<number>(5);
  const [formRating, setFormRating] = useState<number>(4.95);
  const [formReviewCount, setFormReviewCount] = useState<number>(120);
  const [formActive, setFormActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    const list = SalonDataService.getSpecialists();
    setSpecialists(list);
    if (onRefreshGlobal) onRefreshGlobal();
  };

  const openCreateModal = () => {
    setEditingSpecialist(null);
    setFormName('');
    setFormTitle('Resident Nail Artisan & E-File Specialist');
    setFormBio('');
    setFormPhotoUrl('/assets/about-interior-1.jpg');
    setFormSpecialties(['Manicures', 'Gel Extensions']);
    setFormExperienceYears(4);
    setFormRating(4.95);
    setFormReviewCount(85);
    setFormActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (specialist: StaffSpecialist) => {
    setEditingSpecialist(specialist);
    setFormName(specialist.name);
    setFormTitle(specialist.title);
    setFormBio(specialist.bio);
    setFormPhotoUrl(specialist.photoUrl);
    setFormSpecialties(specialist.specialties || []);
    setFormExperienceYears(specialist.experienceYears);
    setFormRating(specialist.rating);
    setFormReviewCount(specialist.reviewCount);
    setFormActive(specialist.active !== false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleCategory = (cat: TreatmentCategory) => {
    setFormSpecialties(prev => {
      if (prev.includes(cat)) {
        if (prev.length <= 1) return prev; // Keep at least one category
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Please enter specialist full name.');
      return;
    }
    if (!formTitle.trim()) {
      setFormError('Please enter specialist title or specialty.');
      return;
    }
    if (formSpecialties.length === 0) {
      setFormError('Please select at least one certified service category.');
      return;
    }

    if (editingSpecialist) {
      SalonDataService.updateSpecialist({
        id: editingSpecialist.id,
        name: formName.trim(),
        title: formTitle.trim(),
        bio: formBio.trim(),
        photoUrl: formPhotoUrl.trim() || '/assets/about-interior-1.jpg',
        specialties: formSpecialties,
        experienceYears: Number(formExperienceYears),
        rating: Number(formRating),
        reviewCount: Number(formReviewCount),
        active: formActive,
      });
      onShowSuccess(`Updated specialist profile "${formName.trim()}".`);
    } else {
      SalonDataService.createSpecialist({
        name: formName.trim(),
        title: formTitle.trim(),
        bio: formBio.trim(),
        photoUrl: formPhotoUrl.trim() || '/assets/about-interior-1.jpg',
        specialties: formSpecialties,
        experienceYears: Number(formExperienceYears),
        rating: Number(formRating),
        reviewCount: Number(formReviewCount),
        active: formActive,
      });
      onShowSuccess(`Added new resident specialist "${formName.trim()}" to staff directory.`);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (specialist: StaffSpecialist) => {
    if (window.confirm(`Are you sure you want to remove "${specialist.name}" from the resident staff directory?`)) {
      SalonDataService.deleteSpecialist(specialist.id);
      loadData();
      onShowSuccess(`Removed "${specialist.name}" from directory.`);
    }
  };

  const handleToggleActive = (specialist: StaffSpecialist) => {
    const updated = { ...specialist, active: specialist.active === false ? true : false };
    SalonDataService.updateSpecialist(updated);
    loadData();
    onShowSuccess(`${specialist.name} is now ${updated.active ? 'Active' : 'Inactive'} for booking appointments.`);
  };

  return (
    <div className="space-y-6 text-[#4A4A4A]">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-2xl font-bold text-[#4A4A4A]">
              Staff Directory & Qualified Categories
            </h3>
            <span className="text-xs bg-[#FFF5F5] px-3 py-1 rounded-xl text-[#4A4A4A] border border-[#E2B4BD]/40 font-semibold">
              {specialists.length} Resident Artisans
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 max-w-3xl">
            Configure resident technicians, upload high-resolution profile photography, and assign certified service categories. The booking engine automatically filters ritual selections according to these qualified categories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-[#4A4A4A] hover:bg-black text-white px-5 py-2.5 rounded-2xl text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>+ Add New Specialist</span>
        </button>
      </div>

      {/* Specialists Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specialists.map(specialist => (
          <div
            key={specialist.id}
            className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-5 shadow-xs ${
              specialist.active === false
                ? 'border-[#E2B4BD]/20 opacity-70'
                : 'border-[#E2B4BD]/40 hover:border-[#E2B4BD] hover:shadow-md'
            }`}
          >
            <div className="space-y-4">
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#E2B4BD] bg-[#FFF5F5] shrink-0 shadow-xs">
                    <img
                      src={specialist.photoUrl}
                      alt={specialist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-serif text-lg font-bold text-[#4A4A4A]">
                        {specialist.name}
                      </h4>
                      {specialist.active !== false ? (
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Active Floor
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-100 text-[#6B7280] font-bold px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                      {specialist.title}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-[#6B7280] mt-1">
                      <span className="flex items-center space-x-1 text-amber-600">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="font-bold">{specialist.rating}</span>
                        <span className="text-[#6B7280]">({specialist.reviewCount})</span>
                      </span>
                      <span>•</span>
                      <span>{specialist.experienceYears} Years Exp</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => openEditModal(specialist)}
                    className="p-2 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD]/40 transition-colors cursor-pointer"
                    title="Edit Specialist"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(specialist)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Specialist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-[#4A4A4A]/80 leading-relaxed font-light">
                {specialist.bio || 'Resident atelier master at Bare Nail Spa.'}
              </p>

              {/* Certified Qualified Categories */}
              <div className="space-y-1.5 pt-2 border-t border-[#E2B4BD]/20">
                <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Qualified Service Categories ({specialist.specialties.length}):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {specialist.specialties.map(cat => (
                    <span
                      key={cat}
                      className="text-[10px] bg-[#F7D6D0] text-[#4A4A4A] px-2.5 py-1 rounded-xl border border-[#E2B4BD] font-medium"
                    >
                      ✓ {cat}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Controls */}
            <div className="pt-3 border-t border-[#E2B4BD]/20 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#6B7280]">
                Status: {specialist.active !== false ? 'Accepting bookings' : 'Hidden from booking portal'}
              </span>

              <button
                onClick={() => handleToggleActive(specialist)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  specialist.active !== false
                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {specialist.active !== false ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT SPECIALIST MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-2xl space-y-6 my-8 text-[#4A4A4A]">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E2B4BD]/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0] border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
                    {editingSpecialist ? `Edit ${editingSpecialist.name}` : 'Add Resident Specialist'}
                  </h3>
                  <p className="text-[11px] text-[#6B7280]">
                    Set artisan credentials, biography, and qualified ritual categories.
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Specialist Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Ridmi Samarasinghe"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Professional Title / Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Japanese Hard Gel Virtuoso"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formExperienceYears}
                    onChange={e => setFormExperienceYears(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Rating (e.g. 4.98)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="5"
                    value={formRating}
                    onChange={e => setFormRating(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Reviews Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formReviewCount}
                    onChange={e => setFormReviewCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>
              </div>

              {/* Profile Picture Upload from Device Gallery */}
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 space-y-3">
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block">
                  Artisan Portrait (Upload from Device Gallery)
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="inline-flex items-center space-x-2 bg-white hover:bg-[#F7D6D0]/40 border border-[#E2B4BD]/50 text-[#4A4A4A] px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[11px] text-[#6B7280]">or URL:</span>

                  <input
                    type="text"
                    value={formPhotoUrl}
                    onChange={e => setFormPhotoUrl(e.target.value)}
                    placeholder="e.g. /assets/about-interior-1.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD]"
                  />
                </div>

                {formPhotoUrl && (
                  <div className="flex items-center space-x-3 pt-1">
                    <img
                      src={formPhotoUrl}
                      alt="Artisan Preview"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E2B4BD] shadow-xs"
                    />
                    <span className="text-xs text-emerald-700 font-semibold">Portrait verified</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                  Artisan Biography & Specialization Details
                </label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={e => setFormBio(e.target.value)}
                  placeholder="Detail European or Japanese certification, cuticle craftsmanship, apex strength, or podiatry wellness..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white resize-none"
                />
              </div>

              {/* QUALIFIED SERVICE CATEGORIES (MULTI-SELECT CHECKBOXES) */}
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-bold block">
                    Qualified Service Categories *
                  </label>
                  <span className="text-[11px] text-[#6B7280] font-semibold">
                    {formSpecialties.length} categories certified
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Select which treatment categories this artisan is authorized to perform. Clients booking this specialist will only see rituals belonging to these certified categories.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {ALL_CATEGORIES.map(category => {
                    const isChecked = formSpecialties.includes(category);
                    return (
                      <label
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#F7D6D0] border-[#E2B4BD] text-[#4A4A4A] font-bold shadow-xs'
                            : 'bg-white border-[#E2B4BD]/30 text-[#4A4A4A]/70 hover:bg-[#FFF5F5]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#4A4A4A] border-[#4A4A4A] text-white'
                              : 'border-[#E2B4BD]/50 bg-[#FFF5F5]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{category}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <label className="flex items-center space-x-2 text-xs text-[#4A4A4A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={e => setFormActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4A4A4A] focus:ring-[#E2B4BD] border-[#E2B4BD]"
                  />
                  <span className="font-medium">Active & Available for Client Booking</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E2B4BD]/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-[#FFF5F5] hover:bg-[#F7D6D0] border border-[#E2B4BD]/40 text-[#4A4A4A] text-xs uppercase tracking-luxury font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {editingSpecialist ? 'Save Specialist Changes' : 'Add to Staff Directory'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
