import { asset } from '../../../utils/assetHelper';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Film, Play, Upload, X, Eye, Clock, Sparkles } from 'lucide-react';
import { MediaReel } from '../../../types';
import { SalonDataService } from '../../../services/salonDataService';
import { BRAND_CONFIG } from '../../../config/brandConfig';

interface MediaShowcaseCMSProps {
  onRefreshGlobal?: () => void;
  onShowSuccess: (msg: string) => void;
}

export const MediaShowcaseCMS: React.FC<MediaShowcaseCMSProps> = ({
  onRefreshGlobal,
  onShowSuccess,
}) => {
  const [reels, setReels] = useState<MediaReel[]>(() => SalonDataService.getMediaReels());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingReel, setEditingReel] = useState<MediaReel | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Salon Atmosphere');
  const [formVideoUrl, setFormVideoUrl] = useState<string>('/assets/reel-1.mp4');
  const [formPosterUrl, setFormPosterUrl] = useState<string>('/assets/reel-1-poster.jpg');
  const [formViews, setFormViews] = useState<string>('12.5K');
  const [formDuration, setFormDuration] = useState<string>('0:45');
  const [formPrice, setFormPrice] = useState<number>(4500);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    const list = SalonDataService.getMediaReels();
    setReels(list);
    if (onRefreshGlobal) onRefreshGlobal();
  };

  const openCreateModal = () => {
    setEditingReel(null);
    setFormTitle('');
    setFormCategory('Salon Atmosphere');
    setFormVideoUrl('/assets/reel-1.mp4');
    setFormPosterUrl('/assets/reel-1-poster.jpg');
    setFormViews('15.2K');
    setFormDuration('0:45');
    setFormPrice(4500);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (reel: MediaReel) => {
    setEditingReel(reel);
    setFormTitle(reel.title);
    setFormCategory(reel.category);
    setFormVideoUrl(reel.videoUrl);
    setFormPosterUrl(reel.posterUrl);
    setFormViews(reel.viewsDisplay);
    setFormDuration(reel.durationDisplay);
    setFormPrice(reel.treatmentPriceLKR || 4500);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormPosterUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormVideoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) {
      setFormError('Please enter a reel title.');
      return;
    }
    if (!formVideoUrl.trim()) {
      setFormError('Please provide a video source or file.');
      return;
    }

    if (editingReel) {
      SalonDataService.updateMediaReel({
        ...editingReel,
        title: formTitle.trim(),
        category: formCategory.trim(),
        videoUrl: formVideoUrl.trim(),
        posterUrl: formPosterUrl.trim() || '/assets/reel-1-poster.jpg',
        viewsDisplay: formViews.trim() || '10.0K',
        durationDisplay: formDuration.trim() || '0:45',
        treatmentPriceLKR: Number(formPrice) || 4500,
      });
      onShowSuccess(`Updated Media Reel "${formTitle.trim()}".`);
    } else {
      SalonDataService.createMediaReel({
        title: formTitle.trim(),
        category: formCategory.trim(),
        videoUrl: formVideoUrl.trim(),
        posterUrl: formPosterUrl.trim() || '/assets/reel-1-poster.jpg',
        viewsDisplay: formViews.trim() || '10.0K',
        durationDisplay: formDuration.trim() || '0:45',
        treatmentPriceLKR: Number(formPrice) || 4500,
      });
      onShowSuccess(`Added new Media Reel "${formTitle.trim()}" to Bare Media Showcase.`);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (reel: MediaReel) => {
    if (window.confirm(`Are you sure you want to remove "${reel.title}" from the Bare Media Showcase?`)) {
      SalonDataService.deleteMediaReel(reel.id);
      loadData();
      onShowSuccess(`Removed "${reel.title}" from Media Showcase.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-2xl font-bold text-[#4A4A4A]">
              Bare Media Showcase & Runway Reels
            </h3>
            <span className="text-xs bg-[#F7D6D0]/50 px-3 py-1 rounded-xl text-[#4A4A4A] font-semibold border border-[#E2B4BD]/40">
              {reels.length} Active Reels
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-3xl">
            Manage the vertical 9:16 video reels displayed on the homepage Bare Media Showcase. Upload videos or poster covers directly from your device gallery.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-[#4A4A4A] hover:bg-[#333333] text-white px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>+ Add Media Reel</span>
        </button>
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {reels.map(reel => (
          <div
            key={reel.id}
            className="rounded-3xl bg-white border border-[#E2B4BD]/30 overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#E2B4BD] hover:shadow-md transition-all group"
          >
            <div>
              {/* 9:16 Aspect Video Container */}
              <div className="w-full aspect-[9/16] relative bg-[#FFF5F5] overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={reel.posterUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                >
                  <source src={reel.videoUrl} type="video/mp4" />
                </video>

                <span className="absolute top-3 left-3 text-[10px] uppercase font-bold bg-white/90 backdrop-blur-md text-[#4A4A4A] px-2.5 py-1 rounded-lg border border-[#E2B4BD]/40 shadow-xs">
                  {reel.category}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#4A4A4A] font-mono bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#E2B4BD]/40 shadow-xs">
                  <span className="flex items-center space-x-1 font-semibold">
                    <Eye className="w-3 h-3 text-[#4A4A4A]" />
                    <span>{reel.viewsDisplay}</span>
                  </span>
                  <span className="flex items-center space-x-1 font-semibold">
                    <Clock className="w-3 h-3 text-[#4A4A4A]" />
                    <span>{reel.durationDisplay}</span>
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-serif text-base font-bold text-[#4A4A4A] line-clamp-1">
                  {reel.title}
                </h4>
                {reel.treatmentPriceLKR > 0 && (
                  <p className="text-xs font-semibold text-emerald-700">
                    Featured Ritual: {BRAND_CONFIG.currency.format(reel.treatmentPriceLKR)}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-[#E2B4BD]/20 flex items-center justify-end space-x-2">
              <button
                onClick={() => openEditModal(reel)}
                className="p-2 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD]/40 transition-colors cursor-pointer"
                title="Edit Media Reel"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(reel)}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                title="Delete Media Reel"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MEDIA REEL MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-2xl space-y-6 my-8 text-[#4A4A4A]">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E2B4BD]/30">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F7D6D0]/50 flex items-center justify-center text-[#4A4A4A]">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
                    {editingReel ? 'Edit Media Reel' : 'Add Media Showcase Reel'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Upload or configure 9:16 vertical video reels for the live boutique showcase.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FFF5F5] hover:bg-rose-50 text-stone-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer border border-[#E2B4BD]/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                  Reel Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Russian Apex Precision Detailing"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/50 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Showcase Category
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    placeholder="e.g. Salon Atmosphere, Guest Experience, Nail Artistry"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/50 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Treatment Price (LKR)
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    placeholder="4500"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/50 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Views Display
                  </label>
                  <input
                    type="text"
                    value={formViews}
                    onChange={e => setFormViews(e.target.value)}
                    placeholder="e.g. 18.4K"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/50 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block mb-1">
                    Duration Display
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    placeholder="e.g. 0:58"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/50 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>
              </div>

              {/* Poster Cover Upload from Device Gallery */}
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-3">
                <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block">
                  Poster Thumbnail (Upload from Device Gallery)
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="inline-flex items-center space-x-2 bg-white hover:bg-[#F7D6D0]/50 border border-[#E2B4BD] text-[#4A4A4A] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-[#4A4A4A]" />
                    <span>Upload Poster Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={formPosterUrl}
                    onChange={e => setFormPosterUrl(e.target.value)}
                    placeholder="e.g. /assets/reel-1-poster.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none"
                  />
                </div>

                {formPosterUrl && (
                  <div className="flex items-center space-x-3 pt-1">
                    <img
                      src={formPosterUrl}
                      alt="Poster Preview"
                      className="w-12 h-16 rounded-xl object-cover border border-[#E2B4BD]"
                    />
                    <span className="text-xs text-emerald-700 font-medium">Cover verified</span>
                  </div>
                )}
              </div>

              {/* Video URL or File Upload */}
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-3">
                <label className="text-xs uppercase tracking-wider text-stone-600 font-bold block">
                  Video Source (MP4 URL or Video Upload) *
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="inline-flex items-center space-x-2 bg-white hover:bg-[#F7D6D0]/50 border border-[#E2B4BD] text-[#4A4A4A] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-[#4A4A4A]" />
                    <span>Upload Video File</span>
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    required
                    value={formVideoUrl}
                    onChange={e => setFormVideoUrl(e.target.value)}
                    placeholder="e.g. /assets/reel-1.mp4 or URL"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E2B4BD]/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD]/40 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {editingReel ? 'Save Reel Changes' : 'Publish Reel to Showcase'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
