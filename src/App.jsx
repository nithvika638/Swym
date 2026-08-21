import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Storefront from './pages/Storefront';
import Wishlists from './pages/Wishlists';
import ProductDetailModal from './components/ProductDetailModal';
import AddToWishlistModal from './components/AddToWishlistModal';
import MergeWishlistModal from './components/MergeWishlistModal';
import CreateWishlistModal from './components/CreateWishlistModal';
import ShareWishlistModal from './components/ShareWishlistModal';
import ImportSharedWishlistModal from './components/ImportSharedWishlistModal';
import ConfirmDialog from './components/ConfirmDialog';
import { INITIAL_PRODUCTS } from './data/products';
import { useWishlists } from './hooks/useWishlists';
import { useUserAccounts } from './hooks/useUserAccounts';
import { decodeWishlistFromShareUrl } from './utils/wishlistUtils';
import { CheckCircle2, Heart, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('storefront');
  const [products] = useState(INITIAL_PRODUCTS);

  // Multi-user profile management
  const userAccounts = useUserAccounts();
  const { activeUserId } = userAccounts;

  // Custom hook for wishlists & localStorage persistence per user
  const {
    wishlists,
    activeWishlistId,
    activeWishlist,
    setActiveWishlistId,
    createWishlist,
    addItem,
    removeItem,
    renameWishlist,
    deleteWishlist,
    mergeWishlists,
    importSharedWishlist,
    resetToDefaults
  } = useWishlists(activeUserId);

  // Modals & Dialog State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addModalProduct, setAddModalProduct] = useState(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [renameListTarget, setRenameListTarget] = useState(null);
  const [deleteListTarget, setDeleteListTarget] = useState(null);
  const [shareListTarget, setShareListTarget] = useState(null);
  const [sharedImportData, setSharedImportData] = useState(null);

  // Toast Banner State
  const [toast, setToast] = useState(null);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast((current) => (current?.text === text ? null : current));
    }, 4000);
  };

  // Check URL query parameters for shared wishlist payload on load
  useEffect(() => {
    const sharedPayload = decodeWishlistFromShareUrl(window.location.search);
    if (sharedPayload) {
      setSharedImportData(sharedPayload);
    }
  }, []);

  // Handlers
  const handleAddToWishlistClick = (product) => {
    if (wishlists.length === 1) {
      const res = addItem(wishlists[0].id, product.id);
      if (res.alreadyExisted) {
        showToast(`"${product.name}" is already in ${res.listName}`, 'info');
      } else {
        showToast(`Added "${product.name}" to ${res.listName}!`);
      }
    } else {
      setAddModalProduct(product);
    }
  };

  const handleToggleProductInWishlist = (wishlistId, productId) => {
    const targetList = wishlists.find(w => w.id === wishlistId);
    if (!targetList) return;

    const contains = targetList.items.some(item => item.productId === productId);
    const prod = products.find(p => p.id === productId);

    if (contains) {
      removeItem(wishlistId, productId);
      showToast(`Removed "${prod?.name || 'Item'}" from ${targetList.name}`, 'info');
    } else {
      const res = addItem(wishlistId, productId);
      showToast(`Added "${prod?.name || 'Item'}" to ${res.listName}!`);
    }
  };

  const handleCreateAndAdd = (name, productId) => {
    const newList = createWishlist(name);
    addItem(newList.id, productId);
    const prod = products.find(p => p.id === productId);
    showToast(`Created "${newList.name}" and added "${prod?.name || 'Item'}"!`);
  };

  const handleConfirmMerge = (sourceId, targetId) => {
    try {
      const res = mergeWishlists(sourceId, targetId);
      setIsMergeModalOpen(false);
      showToast(`Merged "${res.sourceName}" into "${res.targetName}"! (${res.finalUniqueCount} total items)`);
      setActiveTab('wishlists');
    } catch (err) {
      showToast(err.message || 'Failed to merge wishlists.', 'error');
    }
  };

  const handleConfirmImportShared = (sharedPayload) => {
    const importedList = importSharedWishlist(sharedPayload);
    // Clean up share parameter from URL without reload
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    setSharedImportData(null);
    setActiveTab('wishlists');
    showToast(`Imported wishlist "${importedList.name}" to your account!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Inter',sans-serif]">
      
      {/* Top Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wishlists={wishlists}
        activeWishlist={activeWishlist}
        userAccounts={userAccounts}
        onOpenMergeModal={() => setIsMergeModalOpen(true)}
        onResetData={() => {
          resetToDefaults();
          showToast('Wishlists reset to default sample data', 'info');
        }}
      />

      {/* Main View Switching */}
      <div className="flex-1">
        {activeTab === 'storefront' ? (
          <Storefront
            products={products}
            wishlists={wishlists}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToWishlistClick={handleAddToWishlistClick}
          />
        ) : (
          <Wishlists
            wishlists={wishlists}
            activeWishlistId={activeWishlistId}
            activeWishlist={activeWishlist}
            products={products}
            onSelectWishlist={(id) => setActiveWishlistId(id)}
            onCreateWishlistClick={() => setIsCreateModalOpen(true)}
            onRenameWishlistClick={(wl) => setRenameListTarget(wl)}
            onDeleteWishlistClick={(wl) => setDeleteListTarget(wl)}
            onMergeWishlistsClick={() => setIsMergeModalOpen(true)}
            onShareWishlistClick={(wl) => setShareListTarget(wl)}
            onRemoveItem={(wlId, prodId) => {
              removeItem(wlId, prodId);
              showToast('Item removed from wishlist', 'info');
            }}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigateToStorefront={() => setActiveTab('storefront')}
          />
        )}
      </div>

      {/* Modals & Dialogs */}

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          wishlists={wishlists}
          onClose={() => setQuickViewProduct(null)}
          onAddToWishlistClick={(p) => {
            setQuickViewProduct(null);
            handleAddToWishlistClick(p);
          }}
        />
      )}

      {/* Destination Wishlist Selector Modal */}
      {addModalProduct && (
        <AddToWishlistModal
          product={addModalProduct}
          wishlists={wishlists}
          onClose={() => setAddModalProduct(null)}
          onToggleProductInWishlist={handleToggleProductInWishlist}
          onCreateAndAdd={(name, prodId) => {
            handleCreateAndAdd(name, prodId);
            setAddModalProduct(null);
          }}
        />
      )}

      {/* Merge Wishlists Workflow Modal */}
      {isMergeModalOpen && (
        <MergeWishlistModal
          wishlists={wishlists}
          onClose={() => setIsMergeModalOpen(false)}
          onConfirmMerge={handleConfirmMerge}
        />
      )}

      {/* Share Wishlist Modal (Link & QR Code) */}
      {shareListTarget && (
        <ShareWishlistModal
          wishlist={shareListTarget}
          products={products}
          onClose={() => setShareListTarget(null)}
        />
      )}

      {/* Import Shared Wishlist Modal */}
      {sharedImportData && (
        <ImportSharedWishlistModal
          sharedData={sharedImportData}
          products={products}
          onClose={() => {
            setSharedImportData(null);
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }}
          onConfirmImport={handleConfirmImportShared}
        />
      )}

      {/* Create Wishlist Modal */}
      {isCreateModalOpen && (
        <CreateWishlistModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(name) => {
            const newList = createWishlist(name);
            showToast(`Created wishlist "${newList.name}"`);
          }}
        />
      )}

      {/* Rename Wishlist Modal */}
      {renameListTarget && (
        <CreateWishlistModal
          isOpen={!!renameListTarget}
          isRename={true}
          initialName={renameListTarget.name}
          onClose={() => setRenameListTarget(null)}
          onSubmit={(newName) => {
            renameWishlist(renameListTarget.id, newName);
            showToast(`Renamed wishlist to "${newName}"`);
            setRenameListTarget(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteListTarget && (
        <ConfirmDialog
          isOpen={!!deleteListTarget}
          title="Delete Wishlist"
          message={`Are you sure you want to delete "${deleteListTarget.name}"? This action cannot be undone.`}
          confirmText="Delete Wishlist"
          onClose={() => setDeleteListTarget(null)}
          onConfirm={() => {
            deleteWishlist(deleteListTarget.id);
            showToast(`Deleted wishlist "${deleteListTarget.name}"`, 'info');
            setDeleteListTarget(null);
          }}
        />
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold ${
            toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : toast.type === 'info'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-emerald-600 text-white border-emerald-500'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-300" />
            ) : toast.type === 'info' ? (
              <Heart className="w-4 h-4 text-indigo-300 fill-indigo-300" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            )}
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 ApexStore • Multi-User Wishlists & Sharing Engine • GitHub Pages Ready</p>
        </div>
      </footer>

    </div>
  );
}
