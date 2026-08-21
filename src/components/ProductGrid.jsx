import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({ 
  products, 
  wishlists, 
  onQuickView, 
  onAddToWishlistClick 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Available Categories
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">

      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-10 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-600/30 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Wishlist Management Enabled</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Curated Products for Your Lifestyle
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse our catalog, create distinct wishlists for different occasions, and seamlessly merge lists together whenever you're ready to consolidate.
          </p>
        </div>
      </div>

      {/* Controls Bar: Search, Category Filters, Sort */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name, description, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="featured">Featured Catalog</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 scrollbar-none border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid Results Header */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredProducts.length}</strong> products
          {selectedCategory !== 'All' && <span> in <span className="text-indigo-600 font-semibold">{selectedCategory}</span></span>}
        </span>

        {(searchQuery || selectedCategory !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-indigo-600 font-semibold hover:underline flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlists={wishlists}
              onQuickView={onQuickView}
              onAddToWishlistClick={onAddToWishlistClick}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto my-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
          <p className="text-xs text-slate-500 mb-6">
            We couldn't find any products matching your current search or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
}
