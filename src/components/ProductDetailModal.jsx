import React from 'react';
import { X, Star, Heart, Check, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetailModal({ 
  product, 
  wishlists, 
  onClose, 
  onAddToWishlistClick 
}) {
  if (!product) return null;

  const wishlistsContainingProduct = wishlists.filter(wl =>
    wl.items.some(item => item.productId === product.id)
  );

  const isInAnyWishlist = wishlistsContainingProduct.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      {/* Modal Card */}
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 bg-slate-100 relative min-h-[280px] md:min-h-[400px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white shadow-xs">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-4">
            
            <div>
              <div className="flex items-center justify-between text-xs text-indigo-600 font-bold mb-1">
                <span>{product.brand}</span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] ${product.inStock ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'bg-amber-50 text-amber-700'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Rating & Price */}
            <div className="flex items-center justify-between py-2 border-y border-slate-100">
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-extrabold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} customer reviews)</span>
              </div>
              <span className="text-2xl font-black text-slate-900">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Key Features */}
            {product.features && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Key Specifications
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2">
              <div className="flex items-center space-x-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <Truck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center space-x-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>2 Year Warranty</span>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center space-x-3">
            <button
              onClick={() => {
                onAddToWishlistClick(product);
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
                isInAnyWishlist
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInAnyWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>
                {isInAnyWishlist 
                  ? `In ${wishlistsContainingProduct.length} Wishlist(s) (Manage)`
                  : 'Add to Wishlist'
                }
              </span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
