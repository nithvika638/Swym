import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3 } from 'lucide-react';

export default function CreateWishlistModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialName = '', 
  isRename = false 
}) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isRename ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
            }`}>
              {isRename ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {isRename ? 'Rename Wishlist' : 'Create New Wishlist'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Wishlist Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Birthday Ideas, Summer Gear..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isRename ? 'Save Name' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
