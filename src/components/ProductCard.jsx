import React from 'react';
import { Heart, Star, Eye, Check } from 'lucide-react';

export default function ProductCard({ 
  product, 
  wishlists, 
  onQuickView, 
  onAddToWishlistClick 
}) {
  // Check which wishlists currently contain this product
  const wishlistsContainingProduct = wishlists.filter(wl =>
    wl.items.some(item => item.productId === product.id)
  );

  const isInAnyWishlist = wishlistsContainingProduct.length > 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category & Stock Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/60 shadow-xs">
            {product.category}
          </span>
          {!product.inStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-500 text-white shadow-xs">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Heart Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlistClick(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
            isInAnyWishlist
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={
            isInAnyWishlist
              ? `In ${wishlistsContainingProduct.length} wishlist(s)`
              : 'Add to Wishlist'
          }
        >
          <Heart className={`w-4 h-4 ${isInAnyWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={() => onQuickView(product)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold text-xs shadow-lg hover:bg-slate-50 transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-indigo-600">{product.brand}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-700">{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 mb-1.5"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Footer: Price & Add Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAddToWishlistClick(product)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isInAnyWishlist
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xs'
            }`}
          >
            {isInAnyWishlist ? (
              <>
                <Check className="w-3.5 h-3.5 text-rose-600" />
                <span>Wishlisted ({wishlistsContainingProduct.length})</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5" />
                <span>Add to Wishlist</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
