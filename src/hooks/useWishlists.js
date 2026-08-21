import { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import {
  validateWishlistsData,
  createWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  renameWishlist,
  deleteWishlist,
  mergeWishlists
} from '../utils/wishlistUtils';

export function useWishlists(userId = null) {
  const [wishlists, setWishlists] = useState(() => {
    if (!userId) return [];
    return dbService.getUserWishlists(userId);
  });

  const [activeWishlistId, setActiveWishlistId] = useState(() => {
    const loaded = userId ? dbService.getUserWishlists(userId) : [];
    return loaded.length > 0 ? loaded[0].id : null;
  });

  // Re-sync wishlists when userId changes (e.g. User logs in or out)
  useEffect(() => {
    if (userId) {
      const userLists = dbService.getUserWishlists(userId);
      setWishlists(userLists);
      setActiveWishlistId(userLists.length > 0 ? userLists[0].id : null);
    } else {
      setWishlists([]);
      setActiveWishlistId(null);
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

  // Persist wishlists to Database Service per user
  useEffect(() => {
    if (userId) {
      dbService.saveUserWishlists(userId, wishlists);
    }
  }, [wishlists, userId]);

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
      // If no wishlists exist, create first wishlist
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

  const handleClearWishlists = () => {
    setWishlists([]);
    setActiveWishlistId(null);
    if (userId) {
      dbService.saveUserWishlists(userId, []);
    }
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
    clearWishlists: handleClearWishlists
  };
}
