import { INITIAL_PRODUCTS } from '../data/products';

const STORAGE_USERS = 'apex_db_users_v1';
const STORAGE_WISHLISTS_PREFIX = 'apex_db_wishlists_';
const STORAGE_PRODUCTS = 'apex_db_products_v1';
const STORAGE_SESSION = 'apex_db_session_v1';

// Seed Initial Admin and Demo Users
const DEFAULT_USERS = [
  {
    id: 'user-admin',
    name: 'System Admin',
    email: 'admin@apexstore.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 'user-alex',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'user123',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'user-sarah',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    password: 'user123',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const dbService = {
  // --- USERS ---
  getUsers() {
    try {
      const saved = localStorage.getItem(STORAGE_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load users from DB:", e);
    }
    // Save default users
    localStorage.setItem(STORAGE_USERS, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  },

  saveUser(user) {
    const users = this.getUsers();
    const existingIdx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    
    let updatedUsers;
    if (existingIdx >= 0) {
      updatedUsers = [...users];
      updatedUsers[existingIdx] = { ...users[existingIdx], ...user };
    } else {
      updatedUsers = [...users, user];
    }
    
    localStorage.setItem(STORAGE_USERS, JSON.stringify(updatedUsers));
    return updatedUsers;
  },

  deleteUser(userId) {
    const users = this.getUsers().filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    localStorage.removeItem(`${STORAGE_WISHLISTS_PREFIX}${userId}`);
    return users;
  },

  // --- WISHLISTS ---
  getUserWishlists(userId) {
    if (!userId) return [];
    try {
      const saved = localStorage.getItem(`${STORAGE_WISHLISTS_PREFIX}${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn(`Failed to load wishlists for ${userId}:`, e);
    }
    // Return sample seed wishlists for new users
    return [
      {
        id: `wishlist-${userId}-1`,
        name: 'My Favorites',
        createdAt: new Date().toISOString(),
        items: [
          { productId: 'prod-1', addedAt: new Date().toISOString() },
          { productId: 'prod-2', addedAt: new Date().toISOString() }
        ]
      }
    ];
  },

  saveUserWishlists(userId, wishlists) {
    if (!userId) return;
    try {
      localStorage.setItem(`${STORAGE_WISHLISTS_PREFIX}${userId}`, JSON.stringify(wishlists));
    } catch (e) {
      console.error(`Failed to save wishlists for ${userId}:`, e);
    }
  },

  getAllWishlistsAcrossUsers() {
    const users = this.getUsers();
    const result = [];
    users.forEach(user => {
      const userLists = this.getUserWishlists(user.id);
      userLists.forEach(wl => {
        result.push({
          ...wl,
          userName: user.name,
          userEmail: user.email,
          userId: user.id
        });
      });
    });
    return result;
  },

  // --- PRODUCTS CATALOG ---
  getProducts() {
    try {
      const saved = localStorage.getItem(STORAGE_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load products from DB:", e);
    }
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 1,
      inStock: product.inStock !== false
    };
    const updated = [newProduct, ...products];
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(updated));
    return updated;
  },

  deleteProduct(productId) {
    const products = this.getProducts().filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
    return products;
  },

  // --- SESSION ---
  getSession() {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default session: Alex Johnson
    return { userId: 'user-alex' };
  },

  setSession(session) {
    if (session) {
      localStorage.setItem(STORAGE_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_SESSION);
    }
  },

  // --- ADMIN STATS ---
  getAdminStats() {
    const users = this.getUsers();
    const products = this.getProducts();
    const allWishlists = this.getAllWishlistsAcrossUsers();
    const totalItems = allWishlists.reduce((acc, wl) => acc + wl.items.length, 0);

    return {
      totalUsers: users.length,
      totalWishlists: allWishlists.length,
      totalItemsSaved: totalItems,
      totalProducts: products.length
    };
  }
};
