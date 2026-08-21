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
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';

export default function AdminDashboard({ 
  currentUser, 
  onAdminLoginSuccess, 
  onRefreshData, 
  onShowToast 
}) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'wishlists' | 'products'
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Portal Login Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Products Add Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      const user = authService.signIn(adminEmail, adminPassword);
      if (user.role !== 'admin') {
        throw new Error("Access Denied: Account is not authorized as Administrator.");
      }
      onAdminLoginSuccess(user);
      onShowToast("Authenticated to System Admin Dashboard!");
    } catch (err) {
      setAdminError(err.message || 'Admin authentication failed');
    }
  };

  // If NOT logged in as Admin, show Dedicated Admin Portal Login
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Admin Portal Login</h2>
            <p className="text-xs text-slate-500">
              Restricted portal for System Administrators.
            </p>
          </div>

          {adminError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Admin Email:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@apexstore.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Login to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 text-center">
            🔑 Default Admin Credentials: <br />
            <strong>admin@apexstore.com</strong> / <strong>admin123</strong>
          </div>
        </div>
      </main>
    );
  }

  // Load Data for Authenticated Admin
  const stats = dbService.getAdminStats();
  const users = dbService.getUsers();
  const allWishlists = dbService.getAllWishlistsAcrossUsers();
  const products = dbService.getProducts();

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {allWishlists.length > 0 ? (
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
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
              No wishlists have been created by users yet.
            </div>
          )}
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
