import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Heart, GitMerge, RotateCcw, User, UserPlus, Check, ChevronDown } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  wishlists, 
  activeWishlist,
  userAccounts,
  onOpenMergeModal,
  onResetData
}) {
  const { users, activeUser, switchUser, addUser } = userAccounts;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
        setShowAddUserForm(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalWishlists = wishlists.length;
  const activeItemsCount = activeWishlist ? activeWishlist.items.length : 0;

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    addUser(newUserName.trim());
    setNewUserName('');
    setShowAddUserForm(false);
    setIsUserMenuOpen(false);
  };

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
                Wishlist Hub
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
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
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
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
          </nav>

          {/* Right Utilities & User Account Switcher */}
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

            {/* User Account Switcher Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-xs font-semibold text-slate-800"
              >
                <span className="text-base">{activeUser.avatar || '👤'}</span>
                <span className="hidden sm:inline font-bold truncate max-w-[100px]">{activeUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-fade-in space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Switch Active Account Profile:
                    </span>
                  </div>

                  {/* List of Accounts */}
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {users.map((u) => {
                      const isSelected = u.id === activeUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="text-base">{u.avatar}</span>
                            <div className="text-left min-w-0">
                              <span className="block truncate font-semibold">{u.name}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{u.email}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add New User Section */}
                  <div className="pt-2 border-t border-slate-100">
                    {showAddUserForm ? (
                      <form onSubmit={handleCreateUser} className="p-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Account Name (e.g. Jordan)"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          autoFocus
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <div className="flex space-x-1">
                          <button
                            type="submit"
                            className="flex-1 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-bold"
                          >
                            Add Account
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddUserForm(false)}
                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setShowAddUserForm(true)}
                        className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add New Account Profile...</span>
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>

            <button
              onClick={onResetData}
              className="hidden sm:flex items-center space-x-1 text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
              title="Reset state to initial sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
