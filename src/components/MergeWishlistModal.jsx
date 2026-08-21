import React, { useState, useMemo } from 'react';
import { X, GitMerge, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { previewWishlistMerge } from '../utils/wishlistUtils';

export default function MergeWishlistModal({ 
  wishlists, 
  onClose, 
  onConfirmMerge 
}) {
  const [sourceId, setSourceId] = useState(() => {
    return wishlists.length > 0 ? wishlists[0].id : '';
  });

  const [targetId, setTargetId] = useState(() => {
    return wishlists.length > 1 ? wishlists[1].id : (wishlists[0]?.id || '');
  });

  // Calculate live preview statistics
  const preview = useMemo(() => {
    if (!sourceId || !targetId || sourceId === targetId) return null;
    return previewWishlistMerge(wishlists, sourceId, targetId);
  }, [wishlists, sourceId, targetId]);

  const isSameList = sourceId === targetId;
  const canSubmit = sourceId && targetId && !isSameList && preview && !preview.error;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onConfirmMerge(sourceId, targetId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Merge Wishlists</h3>
              <p className="text-xs text-slate-500">
                Combine unique products from a source list into a target list.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Wishlists Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            
            {/* Source Wishlist Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                1. Select Source Wishlist (Kept):
              </label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {wishlists.map((wl) => (
                  <option key={wl.id} value={wl.id}>
                    {wl.name} ({wl.items.length} {wl.items.length === 1 ? 'item' : 'items'})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Wishlist Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                2. Select Target Wishlist (Receives items):
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {wishlists.map((wl) => (
                  <option key={wl.id} value={wl.id} disabled={wl.id === sourceId}>
                    {wl.name} {wl.id === sourceId ? '(Source list)' : `(${wl.items.length} items)`}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Validation Alert for Self-Merge */}
          {isSameList && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Invalid selection:</strong> Source and target wishlists must be different. Please choose two distinct lists.
              </span>
            </div>
          )}

          {/* Live Merge Breakdown Statistics Box */}
          {preview && !preview.error && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Merge Calculation Preview</span>
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center">
                
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-medium block">Source Items</span>
                  <span className="text-lg font-bold text-slate-800">{preview.sourceItemCount}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-medium block">Overlap / Duplicates</span>
                  <span className="text-lg font-bold text-amber-600">-{preview.duplicateCount}</span>
                </div>

                <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs">
                  <span className="text-[10px] text-indigo-200 font-medium block">Final Target Total</span>
                  <span className="text-lg font-extrabold">{preview.totalFinalUniqueCount}</span>
                </div>

              </div>

              <p className="text-xs text-slate-600 leading-relaxed text-center pt-1">
                Merging <strong className="text-slate-900">{preview.sourceName}</strong> into <strong className="text-slate-900">{preview.targetName}</strong> will add <strong className="text-indigo-600">{preview.newUniqueFromSource} new unique items</strong> to your target list.
              </p>
            </div>
          )}

          {/* Non-Destructive Preservation Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Safe Preservation Guarantee:</span>
              <p className="leading-relaxed">
                All unique items will be copied into target wishlist <strong>"{preview ? preview.targetName : 'Target'}"</strong>. Your source wishlist <strong>"{preview ? preview.sourceName : 'Source'}"</strong> will be preserved intact in your account.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center space-x-2"
            >
              <GitMerge className="w-4 h-4" />
              <span>Confirm & Merge</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
