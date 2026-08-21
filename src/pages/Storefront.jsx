import React from 'react';
import ProductGrid from '../components/ProductGrid';

export default function Storefront({ 
  products, 
  wishlists, 
  onQuickView, 
  onAddToWishlistClick 
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductGrid
        products={products}
        wishlists={wishlists}
        onQuickView={onQuickView}
        onAddToWishlistClick={onAddToWishlistClick}
      />
    </main>
  );
}
