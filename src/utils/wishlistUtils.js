/**
  * Utility functions for Wishlist operations
  */

// Initial seed default wishlists per user
export const DEFAULT_WISHLISTS = [
  {
    id: "wishlist-default-1",
    name: "Tech Wishlist",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      { productId: "prod-1", addedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      { productId: "prod-2", addedAt: new Date(Date.now() - 86400000 * 1.5).toISOString() },
      { productId: "prod-4", addedAt: new Date(Date.now() - 86400000 * 1).toISOString() }
    ]
  },
  {
    id: "wishlist-default-2",
    name: "Birthday Ideas",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    items: [
      { productId: "prod-1", addedAt: new Date(Date.now() - 86400000 * 4).toISOString() },
      { productId: "prod-6", addedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
      { productId: "prod-7", addedAt: new Date(Date.now() - 86400000 * 2).toISOString() }
    ]
  }
];

/**
 * Validates raw wishlist data (e.g. loaded from localStorage).
 */
export function validateWishlistsData(raw) {
  if (!Array.isArray(raw)) {
    return DEFAULT_WISHLISTS;
  }

  const validWishlists = raw.filter(wl => {
    return (
      wl &&
      typeof wl === 'object' &&
      typeof wl.id === 'string' &&
      wl.id.trim().length > 0 &&
      typeof wl.name === 'string' &&
      Array.isArray(wl.items)
    );
  }).map(wl => ({
    id: wl.id,
    name: wl.name.trim() || 'Untitled Wishlist',
    createdAt: wl.createdAt || new Date().toISOString(),
    items: wl.items.filter(item => item && typeof item.productId === 'string').map(item => ({
      productId: item.productId,
      addedAt: item.addedAt || new Date().toISOString()
    }))
  }));

  return validWishlists;
}

/**
 * Create a new Wishlist with a given name
 */
export function createWishlist(wishlists, name) {
  const cleanName = (name || '').trim() || `Wishlist ${wishlists.length + 1}`;
  const newWishlist = {
    id: `wishlist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    createdAt: new Date().toISOString(),
    items: []
  };

  const updatedWishlists = [...wishlists, newWishlist];
  return {
    updatedWishlists,
    newWishlist
  };
}

/**
 * Add a product to a specific wishlist (prevents duplicate insertion inside the same list)
 */
export function addItemToWishlist(wishlists, wishlistId, productId) {
  let alreadyExisted = false;

  const updatedWishlists = wishlists.map(wl => {
    if (wl.id !== wishlistId) return wl;

    const exists = wl.items.some(item => item.productId === productId);
    if (exists) {
      alreadyExisted = true;
      return wl;
    }

    return {
      ...wl,
      items: [
        ...wl.items,
        {
          productId,
          addedAt: new Date().toISOString()
        }
      ]
    };
  });

  return {
    updatedWishlists,
    alreadyExisted
  };
}

/**
 * Remove a product from a specific wishlist
 */
export function removeItemFromWishlist(wishlists, wishlistId, productId) {
  return wishlists.map(wl => {
    if (wl.id !== wishlistId) return wl;
    return {
      ...wl,
      items: wl.items.filter(item => item.productId !== productId)
    };
  });
}

/**
 * Rename an existing wishlist
 */
export function renameWishlist(wishlists, wishlistId, newName) {
  const cleanName = (newName || '').trim();
  if (!cleanName) return wishlists;

  return wishlists.map(wl => {
    if (wl.id !== wishlistId) return wl;
    return { ...wl, name: cleanName };
  });
}

/**
 * Delete a wishlist by ID
 * Automatically determines next active Wishlist ID if active list was deleted.
 */
export function deleteWishlist(wishlists, wishlistIdToDelete, currentActiveId) {
  const updatedWishlists = wishlists.filter(wl => wl.id !== wishlistIdToDelete);

  let updatedActiveId = currentActiveId;
  if (currentActiveId === wishlistIdToDelete) {
    updatedActiveId = updatedWishlists.length > 0 ? updatedWishlists[0].id : null;
  }

  return {
    updatedWishlists,
    updatedActiveId
  };
}

/**
 * Calculates pre-merge statistics without mutating data (for confirmation modal preview)
 */
export function previewWishlistMerge(wishlists, sourceId, targetId) {
  if (sourceId === targetId) {
    return { error: "Source and target wishlists must be different." };
  }

  const source = wishlists.find(wl => wl.id === sourceId);
  const target = wishlists.find(wl => wl.id === targetId);

  if (!source || !target) {
    return { error: "Source or Target wishlist not found." };
  }

  const targetProductIds = new Set(target.items.map(item => item.productId));
  const sourceItems = source.items;

  let duplicateCount = 0;
  let newUniqueFromSource = 0;

  sourceItems.forEach(item => {
    if (targetProductIds.has(item.productId)) {
      duplicateCount++;
    } else {
      newUniqueFromSource++;
    }
  });

  const totalFinalUniqueCount = target.items.length + newUniqueFromSource;

  return {
    sourceName: source.name,
    targetName: target.name,
    sourceItemCount: source.items.length,
    targetItemCount: target.items.length,
    duplicateCount,
    newUniqueFromSource,
    totalFinalUniqueCount
  };
}

/**
 * Merges source wishlist into target wishlist.
 * All unique items from source are combined into target (deduplicated by productId).
 * NOTE: SOURCE WISHLIST IS RETAINED (NOT DELETED).
 */
export function mergeWishlists(wishlists, sourceId, targetId, currentActiveId) {
  if (sourceId === targetId) {
    throw new Error("Source and target wishlists must be different.");
  }

  const source = wishlists.find(wl => wl.id === sourceId);
  const target = wishlists.find(wl => wl.id === targetId);

  if (!source || !target) {
    throw new Error("Invalid source or target wishlist selected.");
  }

  // Combine items & deduplicate by productId
  const targetMap = new Map();
  
  // Add target items first
  target.items.forEach(item => {
    targetMap.set(item.productId, { ...item });
  });

  // Add source items if not present
  source.items.forEach(item => {
    if (!targetMap.has(item.productId)) {
      targetMap.set(item.productId, {
        productId: item.productId,
        addedAt: item.addedAt || new Date().toISOString()
      });
    }
  });

  const mergedItems = Array.from(targetMap.values());

  // Update target wishlist without deleting source wishlist
  const updatedWishlists = wishlists.map(wl => {
    if (wl.id === targetId) {
      return {
        ...wl,
        items: mergedItems
      };
    }
    return wl;
  });

  return {
    updatedWishlists,
    updatedActiveId: currentActiveId,
    targetName: target.name,
    sourceName: source.name,
    finalUniqueCount: mergedItems.length
  };
}

/**
 * Encodes a wishlist into a shareable Base64 URL parameter string
 */
export function encodeWishlistToShareUrl(wishlist) {
  try {
    const payload = {
      name: wishlist.name,
      items: wishlist.items.map(item => item.productId),
      createdAt: wishlist.createdAt
    };

    const jsonStr = JSON.stringify(payload);
    const b64 = btoa(encodeURIComponent(jsonStr));

    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?share=${b64}`;
  } catch (e) {
    console.error("Failed to encode wishlist to share URL:", e);
    return window.location.href;
  }
}

/**
 * Robustly decodes a share parameter string or full URL or raw Base64 into a wishlist object payload
 */
export function decodeWishlistFromShareUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return null;

  try {
    let b64Payload = null;

    // Extract share query parameter if input contains 'share='
    if (rawInput.includes('share=')) {
      const match = rawInput.match(/[?&]share=([^&]+)/);
      if (match && match[1]) {
        b64Payload = match[1];
      }
    } else {
      b64Payload = rawInput.trim();
    }

    if (b64Payload) {
      // Decode URL encoding first
      b64Payload = decodeURIComponent(b64Payload);
      b64Payload = b64Payload.replace(/^[?&]?share=/, '');

      let jsonStr = '';
      try {
        jsonStr = decodeURIComponent(atob(b64Payload));
      } catch (e1) {
        try {
          jsonStr = atob(b64Payload);
        } catch (e2) {
          jsonStr = b64Payload; // Raw JSON fallback
        }
      }

      const payload = JSON.parse(jsonStr);

      if (payload && typeof payload.name === 'string' && Array.isArray(payload.items)) {
        return {
          name: payload.name.trim() || 'Shared Wishlist',
          items: payload.items.filter(id => typeof id === 'string'),
          createdAt: payload.createdAt || new Date().toISOString()
        };
      }
    }
  } catch (e) {
    // Fail silently on non-wishlist frames
  }

  return null;
}
