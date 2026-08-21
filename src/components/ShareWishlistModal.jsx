import React, { useState } from 'react';
import { X, Share2, Copy, Check, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { encodeWishlistToShareUrl } from '../utils/wishlistUtils';

export default function ShareWishlistModal({ 
  wishlist, 
  products, 
  onClose 
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link'); // 'link' | 'qr'

  if (!wishlist) return null;

  const shareUrl = encodeWishlistToShareUrl(wishlist);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Map wishlist items to full product objects
  const wishlistProducts = wishlist.items
    .map(item => products.find(p => p.id === item.productId))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-7 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Share Wishlist</h3>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">
                "{wishlist.name}" ({wishlist.items.length} items)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Link vs QR Code */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'link'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Shareable Link</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'qr'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </div>

        {/* Tab 1: Shareable Link View */}
        {activeTab === 'link' ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Copy Link to Share:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono focus:outline-none select-all truncate"
                />
                <button
                  onClick={handleCopy}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              💡 Anyone opening or pasting this link can preview and import <strong>"{wishlist.name}"</strong> directly into their account.
            </p>
          </div>
        ) : (
          /* Tab 2: Scannable QR Code View */
          <div className="space-y-4 text-center">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto shadow-inner">
              <QRCodeSVG
                value={shareUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#1e1b4b"
                level="M"
                includeMargin={true}
              />
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Scan this QR code with a phone camera to view & import wishlist.
            </p>
          </div>
        )}

        {/* Wishlist Items Preview List */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Items inside this wishlist ({wishlistProducts.length}):
          </span>

          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            {wishlistProducts.map(p => (
              <div key={p.id} className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-xs font-semibold text-slate-800 truncate flex-1">{p.name}</span>
                <span className="text-xs font-extrabold text-indigo-600">${p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          Done
        </button>

      </div>
    </div>
  );
}
