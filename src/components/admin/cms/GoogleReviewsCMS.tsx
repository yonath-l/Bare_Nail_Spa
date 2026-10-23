import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Check, X, Upload, MessageSquare, ExternalLink } from 'lucide-react';
import { CustomerReview } from '../../../types';
import { SalonDataService } from '../../../services/salonDataService';

interface GoogleReviewsCMSProps {
  onRefreshGlobal?: () => void;
  onShowSuccess: (msg: string) => void;
}

export const GoogleReviewsCMS: React.FC<GoogleReviewsCMSProps> = ({
  onRefreshGlobal,
  onShowSuccess,
}) => {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => SalonDataService.getReviews());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);

  // Form Fields
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formDate, setFormDate] = useState<string>('Just now');
  const [formTreatment, setFormTreatment] = useState<string>('Signature Gel Manicure');
  const [formSource, setFormSource] = useState<'Google Verified Review' | 'Boutique Atelier Guest'>('Google Verified Review');
  const [formText, setFormText] = useState<string>('');
  const [formAvatarUrl, setFormAvatarUrl] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    const list = SalonDataService.getReviews();
    setReviews(list);
    if (onRefreshGlobal) onRefreshGlobal();
  };

  const openCreateModal = () => {
    setEditingReview(null);
    setFormAuthor('');
    setFormRating(5);
    setFormDate('Just now');
    setFormTreatment('Signature Gel Manicure & French Detailing');
    setFormSource('Google Verified Review');
    setFormText('');
    setFormAvatarUrl('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rev: CustomerReview) => {
    setEditingReview(rev);
    setFormAuthor(rev.authorName);
    setFormRating(rev.rating);
    setFormDate(rev.date);
    setFormTreatment(rev.treatmentName);
    setFormSource(rev.source);
    setFormText(rev.reviewText);
    setFormAvatarUrl(rev.avatarUrl || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formAuthor.trim()) {
      setFormError('Please enter the reviewer patron name.');
      return;
    }
    if (!formText.trim()) {
      setFormError('Please enter the patron review text.');
      return;
    }

    if (editingReview) {
      SalonDataService.updateReview({
        ...editingReview,
        authorName: formAuthor.trim(),
        rating: Number(formRating),
        date: formDate.trim() || 'Recently',
        treatmentName: formTreatment.trim() || 'Atelier Ritual',
        source: formSource,
        reviewText: formText.trim(),
        avatarUrl: formAvatarUrl.trim() || undefined,
      });
      onShowSuccess(`Updated review from "${formAuthor.trim()}".`);
    } else {
      SalonDataService.createReview({
        authorName: formAuthor.trim(),
        rating: Number(formRating),
        date: formDate.trim() || 'Recently',
        treatmentName: formTreatment.trim() || 'Atelier Ritual',
        source: formSource,
        reviewText: formText.trim(),
        avatarUrl: formAvatarUrl.trim() || undefined,
      });
      onShowSuccess(`Added new verified review from "${formAuthor.trim()}".`);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (rev: CustomerReview) => {
    if (window.confirm(`Are you sure you want to remove the review from "${rev.authorName}"?`)) {
      SalonDataService.deleteReview(rev.id);
      loadData();
      onShowSuccess(`Removed review from "${rev.authorName}".`);
    }
  };

  return (
    <div className="space-y-6 text-[#4A4A4A]">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2B4BD]/30 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-2xl font-bold text-[#4A4A4A]">
              Google Reviews Posts & Testimonials
            </h3>
            <span className="text-xs bg-[#FFF5F5] px-3 py-1 rounded-xl text-[#4A4A4A] border border-[#E2B4BD]/40 font-semibold">
              {reviews.length} Verified Reviews
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
            Manage, add, and publish authentic client reviews and Google star testimonials shown on the Bare Nail Spa homepage.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-[#4A4A4A] hover:bg-black text-white px-5 py-2.5 rounded-2xl text-xs uppercase tracking-luxury font-bold shadow-sm transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>+ Add Google Review</span>
        </button>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(rev => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-white border border-[#E2B4BD]/30 hover:border-[#E2B4BD] transition-all flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-[#4A4A4A] ml-1.5">
                    {rev.rating}.0
                  </span>
                </div>

                <span className="text-[9px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {rev.source}
                </span>
              </div>

              <p className="text-xs text-[#4A4A4A]/85 leading-relaxed font-light italic">
                "{rev.reviewText}"
              </p>

              <div className="pt-2 border-t border-[#E2B4BD]/20 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#F7D6D0] border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A] font-bold text-xs shrink-0 overflow-hidden shadow-xs">
                  {rev.avatarUrl ? (
                    <img src={rev.avatarUrl} alt={rev.authorName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{rev.authorName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#4A4A4A]">
                    {rev.authorName}
                  </h4>
                  <p className="text-[10px] text-[#6B7280]">
                    {rev.treatmentName} · <span>{rev.date}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2B4BD]/20 flex items-center justify-end space-x-2">
              <button
                onClick={() => openEditModal(rev)}
                className="p-2 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0] text-[#4A4A4A] border border-[#E2B4BD]/40 transition-colors cursor-pointer"
                title="Edit Review"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(rev)}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                title="Delete Review"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT REVIEW MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-2xl space-y-6 my-8 text-[#4A4A4A]">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E2B4BD]/30">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F7D6D0] border border-[#E2B4BD] flex items-center justify-center text-[#4A4A4A]">
                  <MessageSquare className="w-4 h-4 text-[#4A4A4A]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#4A4A4A]">
                    {editingReview ? 'Edit Review Post' : 'Add Google Review Post'}
                  </h3>
                  <p className="text-[11px] text-[#6B7280]">
                    Published into the homepage verified testimonials reel.
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
                    Patron Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={e => setFormAuthor(e.target.value)}
                    placeholder="e.g. Dinali Goonatillake"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Star Rating (1 to 5) *
                  </label>
                  <select
                    value={formRating}
                    onChange={e => setFormRating(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  >
                    <option value={5}>★★★★★ (5.0 Stars)</option>
                    <option value={4}>★★★★☆ (4.0 Stars)</option>
                    <option value={3}>★★★☆☆ (3.0 Stars)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Treatment Ritual Mentioned
                  </label>
                  <input
                    type="text"
                    value={formTreatment}
                    onChange={e => setFormTreatment(e.target.value)}
                    placeholder="e.g. Signature BIAB Apex Set"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                    Date Tag
                  </label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    placeholder="e.g. 2 weeks ago"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white"
                  />
                </div>
              </div>

              {/* Patron Avatar Photo Upload */}
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 space-y-2">
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block">
                  Patron Avatar (Device Gallery Upload)
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="inline-flex items-center space-x-2 bg-white hover:bg-[#F7D6D0]/40 border border-[#E2B4BD]/50 text-[#4A4A4A] px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Avatar Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={formAvatarUrl}
                    onChange={e => setFormAvatarUrl(e.target.value)}
                    placeholder="or enter image URL..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none"
                  />
                </div>
                {formAvatarUrl && (
                  <div className="flex items-center space-x-3 pt-1">
                    <img src={formAvatarUrl} alt="Avatar Preview" className="w-10 h-10 rounded-full object-cover border border-[#E2B4BD]" />
                    <span className="text-xs text-emerald-700 font-semibold">Avatar loaded</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-luxury text-[#4A4A4A] font-semibold block mb-1">
                  Verified Review Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formText}
                  onChange={e => setFormText(e.target.value)}
                  placeholder="Paste the genuine patron testimonial or feedback here..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] focus:outline-none focus:border-[#E2B4BD] focus:bg-white resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#E2B4BD]/30">
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
                  {editingReview ? 'Save Review Changes' : 'Publish Review'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
