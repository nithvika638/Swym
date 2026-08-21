import React from 'react';
import { Heart, Plus, GitMerge, Edit2, Trash2, ShoppingBag, ArrowRight, FolderHeart, Share2 } from 'lucide-react';
import WishlistSidebar from '../components/WishlistSidebar';
import WishlistItem from '../components/WishlistItem';

export default function Wishlists({ 
  wishlists, 
  activeWishlistId, 
  activeWishlist, 
  products, 
  onSelectWishlist, 
  onCreateWishlistClick, 
  onRenameWishlistClick, 
  onDeleteWishlistClick, 
  onMergeWishlistsClick, 
  onShareWishlistClick,
  onRemoveItem, 
  onQuickView, 
  onNavigateToStorefront 
}) {
  // Map active items to product objects
  const activeProducts = activeWishlist 
    ? activeWishlist.items.map(item => ({
        item,
        product: products.find(p => p.id === item.productId)
      })).filter(pair => pair.product !== undefined)
    : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Wishlist Switcher & Actions */}
        <div className="lg:col-span-1">
          <WishlistSidebar
            wishlists={wishlists}
            activeWishlistId={activeWishlistId}
            onSelectWishlist={onSelectWishlist}
            onCreateClick={onCreateWishlistClick}
            onRenameClick={() => activeWishlist && onRenameWishlistClick(activeWishlist)}
            onDeleteClick={() => activeWishlist && onDeleteWishlistClick(activeWishlist)}
            onMergeClick={onMergeWishlistsClick}
            onShareClick={onShareWishlistClick}
          />
        </div>

        {/* Right Main Panel: Active Wishlist Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeWishlist ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              
              {/* Active Wishlist Banner / Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
                    <FolderHeart className="w-4 h-4" />
                    <span>Active Wishlist</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeWishlist.name}
                  </h1>

                  <span className="text-xs text-slate-400 font-medium">
                    Created {new Date(activeWishlist.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {activeWishlist.items.length} {activeWishlist.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* List Action Buttons */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  <button
                    onClick={() => onShareWishlistClick(activeWishlist)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200/60"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share List</span>
                  </button>

                  <button
                    onClick={() => onRenameWishlistClick(activeWishlist)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Rename</span>
                  </button>

                  <button
                    onClick={() => onDeleteWishlistClick(activeWishlist)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  {wishlists.length >= 2 && (
                    <button
                      onClick={onMergeWishlistsClick}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Merge List</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Items List inside Active Wishlist */}
              {activeProducts.length > 0 ? (
                <div className="space-y-3">
                  {activeProducts.map(({ item, product }) => (
                    <WishlistItem
                      key={`${activeWishlist.id}-${product.id}`}
                      item={item}
                      product={product}
                      onRemove={(productId) => onRemoveItem(activeWishlist.id, productId)}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>
              ) : (
                /* Empty Active Wishlist State */
                <div className="text-center py-12 px-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mx-auto">
                    <Heart className="w-8 h-8" />
                  </div>

                  <div className="max-w-sm mx-auto">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">This wishlist is empty</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      You haven't added any products to "{activeWishlist.name}" yet. Explore our storefront and save products here!
                    </p>

                    <button
                      onClick={onNavigateToStorefront}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Browse Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Zero Wishlists Exist State */
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-5 max-w-md mx-auto my-12">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">No Wishlists Found</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  All wishlists have been deleted. Create a new wishlist to start saving your favorite products.
                </p>
              </div>

              <button
                onClick={onCreateWishlistClick}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create Wishlist</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
