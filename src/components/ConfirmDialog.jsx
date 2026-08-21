import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Delete', 
  confirmVariant = 'danger', 
  onClose, 
  onConfirm 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-slate-900 text-base">{title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
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
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors text-white ${
              confirmVariant === 'danger' 
                ? 'bg-rose-600 hover:bg-rose-700 shadow-xs' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
