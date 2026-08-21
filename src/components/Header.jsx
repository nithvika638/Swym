import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Heart, GitMerge, RotateCcw, User, LogIn, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  wishlists, 
  activeWishlist,
  currentUser,
  onOpenAuthModal,
  onSignOut,
  onOpenMergeModal,
  onResetData
}) {
  const totalWishlists = wishlists.length;
  const activeItemsCount = activeWishlist ? activeWishlist.items.length : 0;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('storefront')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                ApexStore
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Database Hub
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'storefront'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Storefront</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlists')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'wishlists'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${activeItemsCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span>Wishlists</span>
              {totalWishlists > 0 && (
                <span className="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white shadow-xs">
                  {totalWishlists}
                </span>
              )}
            </button>

            {/* Admin Dashboard Tab (Only visible to Admin users) */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-purple-100 text-purple-800 font-bold shadow-xs'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* Right Utilities & Authentication Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {totalWishlists >= 2 && (
              <button
                onClick={onOpenMergeModal}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                title="Merge two wishlists into one"
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>Merge Lists</span>
              </button>
            )}

            {/* User Account Controls */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${
                    isAdmin ? 'bg-purple-600' : 'bg-indigo-600'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline font-bold truncate max-w-[100px]">{currentUser.name}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={onSignOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}

            <button
              onClick={onResetData}
              className="hidden sm:flex items-center space-x-1 text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
              title="Reset state to initial sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Demo</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
