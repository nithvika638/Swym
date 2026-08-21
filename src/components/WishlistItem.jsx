import React from 'react';
import { Trash2, ExternalLink, Calendar } from 'lucide-react';

export default function WishlistItem({ 
  item, 
  product, 
  onRemove, 
  onQuickView 
}) {
  if (!product) return null;

  const formattedDate = new Date(item.addedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      
      {/* Thumbnail + Details */}
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        
        {/* Product Image */}
        <div 
          onClick={() => onQuickView(product)}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 cursor-pointer relative group-hover:opacity-95"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-indigo-600 mb-0.5">
            <span>{product.category}</span>
            <span>•</span>
            <span>{product.brand}</span>
          </div>

          <h4 
            onClick={() => onQuickView(product)}
            className="font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 cursor-pointer transition-colors truncate"
          >
            {product.name}
          </h4>

          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Added {formattedDate}</span>
            </span>
          </div>
        </div>

      </div>

      {/* Price & Actions */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-400 block font-medium">Price</span>
          <span className="text-base font-extrabold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onQuickView(product)}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors"
            title="View Product Details"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={() => onRemove(product.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
            title="Remove from Wishlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
