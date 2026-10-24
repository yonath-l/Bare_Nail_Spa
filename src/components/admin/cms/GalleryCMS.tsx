import { asset } from '../../../utils/assetHelper';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Upload, Sparkles, Image as ImageIcon, Tag } from 'lucide-react';
import { GalleryItem } from '../../../types';
import { SalonDataService } from '../../../services/salonDataService';
import { BRAND_CONFIG } from '../../../config/brandConfig';

interface GalleryCMSProps {
  onRefreshGlobal?: () => void;
  onShowSuccess: (msg: string) => void;
}

export const GalleryCMS: React.FC<GalleryCMSProps> = ({
  onRefreshGlobal,
  onShowSuccess,
}) => {
  const [gallery, setGallery] = useState<GalleryItem[]>(() => SalonDataService.getGallery());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Gel Extensions');
  const [formArtisanName, setFormArtisanName] = useState<string>('Dinithi Jayasinghe');
  const [formDuration, setFormDuration] = useState<string>('75 mins');
  const [formPrice, setFormPrice] = useState<number>(7500);
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formChemicalBase, setFormChemicalBase] = useState<string>('Japanese Oligomer Soft Gel & Rubber Reinforcement');
  const [formPigmentCode, setFormPigmentCode] = useState<string>('#E6C2BA (Sheer Nude) + Platinum Shimmer');
  const [formApexRating, setFormApexRating] = useState<string>('Apex Grade 4 (High Arch Durability)');
  const [formLongevity, setFormLongevity] = useState<string>('4-5 Weeks Zero-Lift');
  const [formCureTime, setFormCureTime] = useState<string>('60s LED dual-spectrum');
  const [formTags, setFormTags] = useState<string>('Runway, Russian Prep, High Gloss');
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    const list = SalonDataService.getGallery();
    setGallery(list);
    if (onRefreshGlobal) onRefreshGlobal();
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Gel Extensions');
    setFormArtisanName('Dinithi Jayasinghe');
    setFormDuration('75 mins');
    setFormPrice(7500);
    setFormImageUrl('/assets/about-interior-1.jpg');
    setFormChemicalBase('Japanese Oligomer Soft Gel & Rubber Reinforcement');
    setFormPigmentCode('#E6C2BA (Sheer Nude) + Platinum Shimmer');
    setFormApexRating('Apex Grade 4 (High Arch Durability)');
    setFormLongevity('4-5 Weeks Zero-Lift');
    setFormCureTime('60s LED dual-spectrum');
    setFormTags('Runway, Russian Prep, High Gloss');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormArtisanName(item.artisanName);
    setFormDuration(item.treatmentDuration);
    setFormPrice(item.priceLKR);
    setFormImageUrl(item.imageUrl);
    setFormChemicalBase(item.formula?.chemicalBase || 'Japanese Oligomer Gel');
    setFormPigmentCode(item.formula?.pigmentCode || '#E6C2BA');
    setFormApexRating(item.formula?.apexStrengthRating || 'Apex Grade 4');
    setFormLongevity(item.formula?.wearLongevity || '4-5 Weeks');
    setFormCureTime(item.formula?.cureTime || '60s LED');
    setFormTags(item.tags ? item.tags.join(', ') : '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormError('Please enter a runway look title.');
      return;
    }
    if (!formImageUrl.trim()) {
      setFormError('Please upload an image from your device or specify an image URL.');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const formulaObj = {
      chemicalBase: formChemicalBase.trim(),
      pigmentCode: formPigmentCode.trim(),
      apexStrengthRating: formApexRating.trim(),
      wearLongevity: formLongevity.trim(),
      cureTime: formCureTime.trim(),
    };

    if (editingItem) {
      SalonDataService.updateGalleryItem({
        id: editingItem.id,
        title: formTitle.trim(),
        category: formCategory.trim(),
        imageUrl: formImageUrl.trim(),
        artisanName: formArtisanName.trim() || 'Resident Specialist',
        treatmentDuration: formDuration.trim() || '60 mins',
        priceLKR: Number(formPrice),
        tags: tagsArray,
        formula: formulaObj,
      });
      onShowSuccess(`Updated runway look "${formTitle.trim()}".`);
    } else {
      SalonDataService.createGalleryItem({
        title: formTitle.trim(),
        category: formCategory.trim(),
        imageUrl: formImageUrl.trim(),
        artisanName: formArtisanName.trim() || 'Resident Specialist',
        treatmentDuration: formDuration.trim() || '60 mins',
        priceLKR: Number(formPrice),
        tags: tagsArray,
        formula: formulaObj,
      });
      onShowSuccess(`Published new runway look "${formTitle.trim()}".`);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (item: GalleryItem) => {
    if (window.confirm(`Are you sure you want to remove "${item.title}" from the runway exhibition?`)) {
      SalonDataService.deleteGalleryItem(item.id);
      loadData();
      onShowSuccess(`Removed "${item.title}" from gallery.`);
    }
  };

  const categories = ['ALL', ...Array.from(new Set(gallery.map(g => g.category)))];

  const filtered = gallery.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6 text-[#4A4A4A]">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-2xl font-bold text-[#4A4A4A]">
              Center-Stage Runway Gallery Visuals
            </h3>
            <span className="text-xs bg-[#FFF5F5] px-3 py-1 rounded-xl text-[#4A4A4A] border border-[#E2B4BD]/40 font-semibold">
              {gallery.length} Curated Looks
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 max-w-3xl">
            Upload and curate editorial photography, nail art formulas, and patron showcase portraits displayed on the public Gallery page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-[#4A4A4A] hover:bg-black text-white px-5 py-2.5 rounded-2xl text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>+ Add Runway Look</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#4A4A4A] text-white font-bold shadow-xs'
                : 'bg-[#FFF5F5] text-[#4A4A4A]/80 hover:text-[#4A4A4A] border border-[#E2B4BD]/30'
            }`}
          >
            {cat} {cat !== 'ALL' && `(${gallery.filter(g => g.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="rounded-3xl bg-white border border-[#E2B4BD]/30 overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#E2B4BD] hover:shadow-md transition-all group"
          >
            <div>
              <div className="w-full h-56 relative bg-[#FFF5F5] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[9px] uppercase font-bold bg-white/90 backdrop-blur-md text-[#4A4A4A] px-2.5 py-1 rounded-lg border border-[#E2B4BD]/40 shadow-xs">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 text-xs font-serif font-bold bg-white/95 backdrop-blur-md text-[#4A4A4A] px-3 py-1 rounded-xl border border-[#E2B4BD]/40 shadow-xs">
                  {BRAND_CONFIG.currency.format(item.priceLKR)}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-serif text-base font-bold text-[#4A4A4A]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#6B7280] font-medium">
                  By {item.artisanName} · {item.treatmentDuration}
                </p>

                {item.formula && (
                  <div className="text-[10px] text-[#4A4A4A]/80 bg-[#FFF5F5] p-2.5 rounded-xl border border-[#E2B4BD]/30 space-y-1">
                    <p><strong className="text-[#4A4A4A] font-semibold">Base:</strong> {item.formula.chemicalBase}</p>
                    <p><strong className="text-[#4A4A4A] font-semibold">Longevity:</strong> {item.formula.wearLongevity}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-[#E2B4BD]/20 flex items-center justify-end space-x-2">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD]/40 transition-colors cursor-pointer"
                title="Edit Gallery Look"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                title="Delete Gallery Look"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT GALLERY ITEM MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-2xl space-y-6 my-8 text-[#4A4A4A]">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E2B4BD]/30">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F7D6D0] border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A]">
                  <Sparkles className="w-4 h-4 text-[#4A4A4A]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
                    {editingItem ? 'Edit Runway Gallery Look' : 'Add Runway Gallery Look'}
                  </h3>
                  <p className="text-[11px] text-[#6B7280]">
                    Upload visual from device and configure formula precision details.
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
                    Runway Look Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Celestial Platinum Ombré"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    placeholder="e.g. Gel Extensions or Nail Art"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Artisan Specialist
                  </label>
                  <input
                    type="text"
                    value={formArtisanName}
                    onChange={e => setFormArtisanName(e.target.value)}
                    placeholder="e.g. Dinithi Jayasinghe"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Treatment Duration
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    placeholder="e.g. 75 mins"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>
              </div>

              {/* Visual Upload from Device Gallery */}
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 space-y-3">
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block">
                  Runway Photography (Upload from Device Gallery) *
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="inline-flex items-center space-x-2 bg-white hover:bg-[#F7D6D0]/40 border border-[#E2B4BD]/50 text-[#4A4A4A] px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device Gallery</span>
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
                    value={formImageUrl}
                    onChange={e => setFormImageUrl(e.target.value)}
                    placeholder="https://... or /assets/..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none"
                  />
                </div>

                {formImageUrl && (
                  <div className="flex items-center space-x-3 pt-2">
                    <img
                      src={formImageUrl}
                      alt="Preview"
                      className="w-20 h-20 rounded-xl object-cover border border-[#E2B4BD]"
                    />
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="text-[11px] text-rose-700 hover:text-rose-900 font-semibold underline cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Formula Calibration Details */}
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 space-y-3">
                <h4 className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-bold">
                  Chemical Formula & Apex Calibration
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#6B7280] block mb-0.5">Chemical Base</label>
                    <input
                      type="text"
                      value={formChemicalBase}
                      onChange={e => setFormChemicalBase(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#6B7280] block mb-0.5">Pigment Code / Tone</label>
                    <input
                      type="text"
                      value={formPigmentCode}
                      onChange={e => setFormPigmentCode(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#6B7280] block mb-0.5">Apex Strength Rating</label>
                    <input
                      type="text"
                      value={formApexRating}
                      onChange={e => setFormApexRating(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#6B7280] block mb-0.5">Wear Longevity</label>
                    <input
                      type="text"
                      value={formLongevity}
                      onChange={e => setFormLongevity(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#6B7280] block mb-0.5">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={e => setFormTags(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A]"
                  />
                </div>
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
                  {editingItem ? 'Save Changes' : 'Publish to Runway Gallery'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
