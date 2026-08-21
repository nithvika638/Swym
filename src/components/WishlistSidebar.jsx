import React from 'react';
import { Plus, GitMerge, Edit2, Trash2, Heart, Share2, QrCode, Sparkles } from 'lucide-react';

export default function WishlistSidebar({ 
  wishlists, 
  activeWishlistId, 
  onSelectWishlist, 
  onCreateClick, 
  onRenameClick, 
  onDeleteClick, 
  onMergeClick,
  onShareClick,
  onOpenQRScanner
}) {
  const canMerge = wishlists.length >= 2;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-6">
      
      {/* Header & Quick Action Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>My Wishlists</span>
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {wishlists.length}
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onCreateClick}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create List</span>
            </button>

            <button
              onClick={onOpenQRScanner}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all border border-slate-200"
            >
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>Scan QR</span>
            </button>
          </div>

          <button
            onClick={onMergeClick}
            disabled={!canMerge}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all border ${
              canMerge
                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300 shadow-xs cursor-pointer'
                : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
            }`}
            title={canMerge ? "Merge two wishlists into one" : "Requires at least 2 wishlists to merge"}
          >
            <GitMerge className="w-4 h-4" />
            <span>Merge Wishlists</span>
          </button>

        </div>
      </div>

      {/* Wishlists Navigation Stack */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          Select Active Wishlist:
        </label>

        {wishlists.length > 0 ? (
          <div className="space-y-1.5">
            {wishlists.map((wl) => {
              const isActive = wl.id === activeWishlistId;

              return (
                <div
                  key={wl.id}
                  onClick={() => onSelectWishlist(wl.id)}
                  className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900 shadow-xs font-semibold'
                      : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                      isActive ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'
                    }`} />

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate leading-tight">
                        {wl.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {wl.items.length} {wl.items.length === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                  </div>

                  {/* List Item Actions (Share, Rename, Delete) */}
                  <div className="flex items-center space-x-0.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShareClick(wl);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                      title="Share Wishlist (Link & QR Code)"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRenameClick(wl);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                      title="Rename Wishlist"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(wl);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                      title="Delete Wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
            No wishlists available. Click "Create List" above to get started.
          </div>
        )}
      </div>

      {/* Info Tip Box */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px] text-indigo-800">
          <strong>Built-In QR Scanner:</strong> Click "Scan QR" to scan wishlist QR codes with your device camera or upload image files!
        </p>
      </div>

    </div>
  );
}
