import React from 'react';
import { X, Download, Gift, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ImportSharedWishlistModal({ 
  sharedData, 
  products, 
  onClose, 
  onConfirmImport 
}) {
  if (!sharedData) return null;

  // Map shared product IDs to full catalog objects
  const sharedProducts = (sharedData.items || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  const handleImport = () => {
    onConfirmImport(sharedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
                <span>Shared Wishlist Detected</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-wider font-extrabold">
                  Import
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                A friend shared their wishlist with you!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Info Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-base">{sharedData.name}</h4>
            <span className="text-xs font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-indigo-100">
              {sharedProducts.length} {sharedProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Importing this wishlist will add a new wishlist named <strong>"{sharedData.name}"</strong> to your active account profile.
          </p>
        </div>

        {/* Preview of items inside */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Items included in this shared list:
          </label>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
            {sharedProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-12 h-12 rounded-xl object-cover" 
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 truncate">{product.name}</h5>
                  <span className="text-xs text-slate-500">{product.category}</span>
                </div>
                <span className="text-xs font-extrabold text-indigo-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={handleImport}
            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Import to My Account</span>
          </button>
        </div>

      </div>
    </div>
  );
}
