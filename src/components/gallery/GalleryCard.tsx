import React from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { GalleryItem } from '../../types';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface GalleryCardProps {
  item: GalleryItem;
  onOpenFormula: (item: GalleryItem) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  item,
  onOpenFormula,
}) => {
  return (
    <div className="card-luxury group relative bg-linen-100 rounded-3xl overflow-hidden border border-rosewood/15 hover:border-champagne/60 shadow-luxury-subtle hover:shadow-luxury-elevated transition-all duration-500 flex flex-col justify-between h-full">
      
      {/* Nail Photography */}
      <div className="relative aspect-[4/5] overflow-hidden bg-espresso/10">
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button
            onClick={() => onOpenFormula(item)}
            className="btn-sheen w-full inline-flex items-center justify-center space-x-2 bg-linen/95 hover:bg-white text-espresso text-xs uppercase tracking-luxury font-medium py-2.5 rounded-full shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Eye className="w-3.5 h-3.5 text-rosewood" />
            <span>Inspect Formula Recipe</span>
          </button>
        </div>

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-linen/90 backdrop-blur-md text-espresso text-[10px] uppercase tracking-luxury font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {item.category}
        </span>
      </div>

      {/* Card Metadata */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
        <div>
          <h4 className="font-serif text-lg font-semibold text-espresso leading-snug group-hover:text-rosewood transition-colors">
            {item.title}
          </h4>
          <p className="text-xs text-clay mt-1">
            Artisan: <span className="text-espresso font-medium">{item.artisanName}</span> · {item.treatmentDuration}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] bg-white border border-rosewood/10 text-espresso/70 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Price & Formula Trigger Link */}
        <div className="pt-3 border-t border-rosewood/10 flex items-center justify-between">
          <span className="font-serif text-base font-bold text-espresso">
            {BRAND_CONFIG.currency.format(item.priceLKR)}
          </span>

          <button
            onClick={() => onOpenFormula(item)}
            className="text-xs text-rosewood hover:text-rosewood-dark font-medium flex items-center space-x-1 uppercase tracking-luxury"
          >
            <Sparkles className="w-3 h-3 text-champagne" />
            <span>Recipe</span>
          </button>
        </div>
      </div>

    </div>
  );
};
