import React from 'react';
import { Smartphone, Share, PlusSquare, MoreVertical, Download, X } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface AddToHomeScreenGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddToHomeScreenGuide: React.FC<AddToHomeScreenGuideProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-linen rounded-3xl p-6 sm:p-8 border border-champagne/40 shadow-2xl text-espresso">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-espresso/60 hover:text-espresso rounded-full hover:bg-rosewood/10 transition-colors"
          aria-label="Close Guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-champagne/20 border border-champagne/40 flex items-center justify-center text-rosewood">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-espresso">
              Keep Pass On Your Phone
            </h3>
            <p className="text-[11px] text-clay uppercase tracking-luxury">
              Zero App Store Download Needed
            </p>
          </div>
        </div>

        {/* Instructions Container */}
        <div className="space-y-6">
          
          {/* iOS Safari */}
          <div className="p-4 rounded-2xl bg-white/70 border border-rosewood/15 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-rosewood uppercase tracking-wider">
              <span>Apple iPhone (Safari)</span>
            </div>
            <ol className="text-xs text-espresso/80 space-y-2 list-decimal list-inside leading-relaxed">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-rosewood shrink-0">1.</span>
                <span>Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-rosewood" /> <strong>Share</strong> button at bottom of Safari.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-rosewood shrink-0">2.</span>
                <span>Scroll down and select <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-rosewood" /> <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-rosewood shrink-0">3.</span>
                <span>Tap <strong>Add</strong> in the top-right corner. {BRAND_CONFIG.studioName} Loyalty Pass will appear on your phone screen!</span>
              </li>
            </ol>
          </div>

          {/* Android Chrome */}
          <div className="p-4 rounded-2xl bg-white/70 border border-rosewood/15 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-rosewood uppercase tracking-wider">
              <span>Android (Google Chrome)</span>
            </div>
            <ol className="text-xs text-espresso/80 space-y-2 list-decimal list-inside leading-relaxed">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-rosewood shrink-0">1.</span>
                <span>Tap the <MoreVertical className="w-3.5 h-3.5 inline mx-1 text-rosewood" /> <strong>Three dots</strong> menu at top right.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-rosewood shrink-0">2.</span>
                <span>Select <Download className="w-3.5 h-3.5 inline mx-1 text-rosewood" /> <strong>Install App</strong> or <strong>Add to Home screen</strong>.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-rosewood shrink-0">3.</span>
                <span>Confirm install. Your pass will open full-screen anytime you visit.</span>
              </li>
            </ol>
          </div>

        </div>

        {/* Footer Button */}
        <div className="mt-6 pt-4 border-t border-rosewood/10 text-center">
          <button
            onClick={onClose}
            className="w-full bg-espresso text-linen py-3 rounded-full text-xs uppercase tracking-luxury font-medium hover:bg-rosewood transition-colors"
          >
            Understood, Return to Pass
          </button>
        </div>

      </div>
    </div>
  );
};
