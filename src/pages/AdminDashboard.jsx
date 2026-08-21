import React, { useState } from 'react';
import { 
  Users, 
  FolderHeart, 
  ShoppingBag, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Search, 
  Layers, 
  TrendingUp, 
  UserX, 
  CheckCircle2, 
  Eye
} from 'lucide-react';
import { dbService } from '../services/dbService';

export default function AdminDashboard({ 
  currentUser, 
  onRefreshData, 
  onShowToast 
}) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'wishlists' | 'products'
  const [searchQuery, setSearchQuery] = useState('');

  // Products Add Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You must be logged in as an Administrator (`admin@apexstore.com`) to access the Admin Control Dashboard.
          </p>
        </div>
      </main>
    );
  }

  // Load Data
  const stats = dbService.getAdminStats();
  const users = dbService.getUsers();
  const allWishlists = dbService.getAllWishlistsAcrossUsers();
  const products = dbService.getProducts();

  // Filtered Users
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleDeleteUser = (userId, userName) => {
    if (userId === currentUser.id) {
      onShowToast("Cannot delete yourself while logged in!", "error");
      return;
    }
    dbService.deleteUser(userId);
    onRefreshData();
    onShowToast(`Deleted user "${userName}" and their wishlists`, "info");
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    dbService.addProduct({
      name: newProdName.trim(),
      price: parseFloat(newProdPrice),
      category: newProdCategory,
      image: newProdImage.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      shortDescription: newProdDesc.trim() || 'Premium quality storefront item.',
      brand: 'ApexStudio'
    });

    setNewProdName('');
    setNewProdPrice('');
    setNewProdImage('');
    setNewProdDesc('');
    onRefreshData();
    onShowToast("New product added to catalog successfully!");
  };

  const handleDeleteProduct = (prodId, prodName) => {
    dbService.deleteProduct(prodId);
    onRefreshData();
    onShowToast(`Removed product "${prodName}" from catalog`, "info");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Centralized Admin Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            System Administration Dashboard
          </h1>
          <p className="text-xs text-slate-300">
            Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalUsers}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <FolderHeart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Wishlists</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalWishlists}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Items Saved</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalItemsSaved}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Store Products</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalProducts}</span>
          </div>
        </div>

      </div>

      {/* Admin Tab Switcher */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlists')}
          className={`pb-3 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'wishlists'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FolderHeart className="w-4 h-4" />
          <span>All User Wishlists ({allWishlists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Product Catalog Manager</span>
        </button>
      </div>

      {/* Tab 1: User Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Registered User Accounts</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Wishlists</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((u) => {
                  const userListsCount = dbService.getUserWishlists(u.id).length;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-600">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900">{u.name}</span>
                            <span className="text-[11px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                            : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {userListsCount} {userListsCount === 1 ? 'list' : 'lists'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {u.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 2: All User Wishlists Inspector */}
      {activeTab === 'wishlists' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg">Centralized Wishlist Inspector</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allWishlists.map((wl) => (
              <div key={`${wl.userId}-${wl.id}`} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    Owner: {wl.userName}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {wl.items.length} items
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{wl.name}</h4>
                <span className="text-[11px] text-slate-400 block">{wl.userEmail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Storefront Catalog Manager */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Add Product Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>Add New Storefront Product</span>
            </h3>

            <form onSubmit={handleAddProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Office Desk"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Price ($):</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="99.99"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category:</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home">Home</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Image URL:</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Description:</label>
                <textarea
                  rows="2"
                  placeholder="Short product description..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Add Product to Storefront
                </button>
              </div>
            </form>
          </div>

          {/* Current Products Catalog Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Existing Storefront Catalog</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{p.name}</h5>
                      <span className="text-xs font-extrabold text-indigo-600">${p.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p.id, p.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </main>
  );
}
