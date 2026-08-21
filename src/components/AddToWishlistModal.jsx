import React, { useState } from 'react';
import { X, Heart, Plus, Check, FolderPlus } from 'lucide-react';

export default function AddToWishlistModal({ 
  product, 
  wishlists, 
  onClose, 
  onToggleProductInWishlist, 
  onCreateAndAdd 
}) {
  const [newListName, setNewListName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

  if (!product) return null;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onCreateAndAdd(newListName.trim(), product.id);
    setNewListName('');
    setShowCreateInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Save to Wishlist</h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">
                {product.name}
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

        {/* Product Snippet Card */}
        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-12 h-12 rounded-xl object-cover" 
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate">{product.name}</h4>
            <span className="text-xs font-extrabold text-indigo-600">${product.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Wishlists Selection List */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Select Destination Wishlist(s):
          </label>

          {wishlists.length > 0 ? (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {wishlists.map((wl) => {
                const containsProduct = wl.items.some(item => item.productId === product.id);

                return (
                  <button
                    key={wl.id}
                    onClick={() => onToggleProductInWishlist(wl.id, product.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      containsProduct
                        ? 'bg-rose-50/70 border-rose-200 text-rose-900 font-semibold'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        containsProduct ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {containsProduct && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-sm block">{wl.name}</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {wl.items.length} {wl.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>

                    {containsProduct && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-md">
                        Added
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
              You don't have any wishlists yet. Create your first one below!
            </div>
          )}
        </div>

        {/* Create New Wishlist Option */}
        <div className="pt-2 border-t border-slate-100">
          {showCreateInput ? (
            <form onSubmit={handleCreateSubmit} className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Wishlist Name (e.g. Work Setup)"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  autoFocus
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                >
                  Create & Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateInput(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowCreateInput(true)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold transition-colors"
            >
              <FolderPlus className="w-4 h-4 text-indigo-500" />
              <span>Create New Wishlist...</span>
            </button>
          )}
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          Done
        </button>

      </div>
    </div>
  );
}
