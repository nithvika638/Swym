import { useState, useEffect } from 'react';
import {
  DEFAULT_WISHLISTS,
  validateWishlistsData,
  createWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  renameWishlist,
  deleteWishlist,
  mergeWishlists
} from '../utils/wishlistUtils';

export function useWishlists(userId = 'default-user') {
  const storageKeyWishlists = `apex_store_wishlists_${userId}_v2`;
  const storageKeyActiveId = `apex_store_active_id_${userId}_v2`;

  const [wishlists, setWishlists] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKeyWishlists);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated = validateWishlistsData(parsed);
        if (validated && validated.length > 0) {
          return validated;
        }
      }
    } catch (e) {
      console.warn(`Failed to load wishlists for ${userId}:`, e);
    }
    return DEFAULT_WISHLISTS;
  });

  const [activeWishlistId, setActiveWishlistId] = useState(() => {
    try {
      const savedActive = localStorage.getItem(storageKeyActiveId);
      if (savedActive && wishlists.some(w => w.id === savedActive)) {
        return savedActive;
      }
    } catch (e) {
      console.warn(`Failed to load active wishlist ID for ${userId}:`, e);
    }
    return wishlists.length > 0 ? wishlists[0].id : null;
  });

  // Re-sync when userId changes
  useEffect(() => {
    try {
      const savedWishlists = localStorage.getItem(storageKeyWishlists);
      if (savedWishlists) {
        const parsed = JSON.parse(savedWishlists);
        const validated = validateWishlistsData(parsed);
        setWishlists(validated);
      } else {
        setWishlists(DEFAULT_WISHLISTS);
      }

      const savedActive = localStorage.getItem(storageKeyActiveId);
      if (savedActive) {
        setActiveWishlistId(savedActive);
      }
    } catch (e) {
      console.warn("Failed to switch user storage scope:", e);
    }
  }, [userId]);

  // Keep activeWishlistId synchronized if wishlists array changes
  useEffect(() => {
    if (wishlists.length === 0) {
      if (activeWishlistId !== null) {
        setActiveWishlistId(null);
      }
    } else if (!wishlists.some(w => w.id === activeWishlistId)) {
      setActiveWishlistId(wishlists[0].id);
    }
  }, [wishlists, activeWishlistId]);

  // Persist wishlists state to localStorage per user
  useEffect(() => {
    try {
      localStorage.setItem(storageKeyWishlists, JSON.stringify(wishlists));
    } catch (e) {
      console.error("Failed to save wishlists to localStorage:", e);
    }
  }, [wishlists, storageKeyWishlists]);

  // Persist activeWishlistId to localStorage per user
  useEffect(() => {
    try {
      if (activeWishlistId) {
        localStorage.setItem(storageKeyActiveId, activeWishlistId);
      } else {
        localStorage.removeItem(storageKeyActiveId);
      }
    } catch (e) {
      console.error("Failed to save active wishlist ID to localStorage:", e);
    }
  }, [activeWishlistId, storageKeyActiveId]);

  // Active Wishlist Object helper
  const activeWishlist = wishlists.find(w => w.id === activeWishlistId) || null;

  // Actions
  const handleCreateWishlist = (name) => {
    const { updatedWishlists, newWishlist } = createWishlist(wishlists, name);
    setWishlists(updatedWishlists);
    setActiveWishlistId(newWishlist.id);
    return newWishlist;
  };

  const handleAddItem = (wishlistId, productId) => {
    const targetId = wishlistId || activeWishlistId;
    if (!targetId && wishlists.length === 0) {
      // If no wishlists exist, auto-create one first
      const { updatedWishlists, newWishlist } = createWishlist(wishlists, "My Wishlist");
      const { updatedWishlists: finalWishlists } = addItemToWishlist(updatedWishlists, newWishlist.id, productId);
      setWishlists(finalWishlists);
      setActiveWishlistId(newWishlist.id);
      return { success: true, listName: newWishlist.name, alreadyExisted: false };
    }

    const targetList = wishlists.find(w => w.id === targetId);
    const { updatedWishlists, alreadyExisted } = addItemToWishlist(wishlists, targetId, productId);
    setWishlists(updatedWishlists);

    return {
      success: true,
      listName: targetList ? targetList.name : 'Wishlist',
      alreadyExisted
    };
  };

  const handleRemoveItem = (wishlistId, productId) => {
    const updated = removeItemFromWishlist(wishlists, wishlistId, productId);
    setWishlists(updated);
  };

  const handleRenameWishlist = (wishlistId, newName) => {
    const updated = renameWishlist(wishlists, wishlistId, newName);
    setWishlists(updated);
  };

  const handleDeleteWishlist = (wishlistId) => {
    const { updatedWishlists, updatedActiveId } = deleteWishlist(wishlists, wishlistId, activeWishlistId);
    setWishlists(updatedWishlists);
    setActiveWishlistId(updatedActiveId);
  };

  const handleMergeWishlists = (sourceId, targetId) => {
    const result = mergeWishlists(wishlists, sourceId, targetId, activeWishlistId);
    setWishlists(result.updatedWishlists);
    setActiveWishlistId(result.updatedActiveId);
    return result;
  };

  const handleImportSharedWishlist = (sharedPayload) => {
    const listName = sharedPayload.name.startsWith("Shared:") 
      ? sharedPayload.name 
      : `Shared: ${sharedPayload.name}`;

    const newWishlist = {
      id: `wishlist-imported-${Date.now()}`,
      name: listName,
      createdAt: new Date().toISOString(),
      items: (sharedPayload.items || []).map(pid => ({
        productId: pid,
        addedAt: new Date().toISOString()
      }))
    };

    setWishlists(prev => [...prev, newWishlist]);
    setActiveWishlistId(newWishlist.id);
    return newWishlist;
  };

  const handleResetToDefaults = () => {
    setWishlists(DEFAULT_WISHLISTS);
    setActiveWishlistId(DEFAULT_WISHLISTS[0].id);
    localStorage.removeItem(storageKeyWishlists);
    localStorage.removeItem(storageKeyActiveId);
  };

  return {
    wishlists,
    activeWishlistId,
    activeWishlist,
    setActiveWishlistId,
    createWishlist: handleCreateWishlist,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    renameWishlist: handleRenameWishlist,
    deleteWishlist: handleDeleteWishlist,
    mergeWishlists: handleMergeWishlists,
    importSharedWishlist: handleImportSharedWishlist,
    resetToDefaults: handleResetToDefaults
  };
}
