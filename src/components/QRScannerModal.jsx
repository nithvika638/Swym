import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, QrCode, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { decodeWishlistFromShareUrl } from '../utils/wishlistUtils';

export default function QRScannerModal({ 
  isOpen, 
  onClose, 
  onScanSuccess 
}) {
  const [scanMode, setScanMode] = useState('camera'); // 'camera' | 'file'
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [fileError, setFileError] = useState('');
  const scannerRef = useRef(null);

  const regionId = 'qr-reader-container';

  useEffect(() => {
    if (!isOpen || scanMode !== 'camera') return;

    let html5Qrcode = null;

    const startCameraScanner = async () => {
      setCameraError('');
      setIsScanning(true);

      try {
        html5Qrcode = new Html5Qrcode(regionId);
        scannerRef.current = html5Qrcode;

        const config = { fps: 10, qrbox: { width: 220, height: 220 } };

        await html5Qrcode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            handleDecodedResult(decodedText);
          },
          (errorMessage) => {
            // Ignore frame scan errors
          }
        );
      } catch (err) {
        console.warn("Camera scanner start failed:", err);
        setCameraError("Camera access denied or unavailable. You can use the Upload Image tab below to select a QR code image!");
        setIsScanning(false);
      }
    };

    const timer = setTimeout(startCameraScanner, 300);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
          scannerRef.current = null;
        });
      }
    };
  }, [isOpen, scanMode]);

  if (!isOpen) return null;

  const handleDecodedResult = (text) => {
    // Stop camera scanner
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
    }

    const payload = decodeWishlistFromShareUrl(text);

    if (payload) {
      onScanSuccess(payload);
      onClose();
    } else {
      setCameraError("Scanned QR code is not a valid wishlist format.");
      setFileError("Scanned QR code is not a valid wishlist format.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');
    try {
      const html5Qrcode = new Html5Qrcode("file-qr-temp");
      const decodedText = await html5Qrcode.scanFile(file, true);
      handleDecodedResult(decodedText);
    } catch (err) {
      setFileError("Could not detect a valid QR Code in the selected image. Please try another image.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">In-Browser QR Scanner</h3>
              <p className="text-xs text-slate-500">
                Scan a wishlist QR code to import it instantly.
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

        {/* Scan Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setScanMode('camera')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
              scanMode === 'camera'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            type="button"
            onClick={() => setScanMode('file')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
              scanMode === 'file'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Mode 1: Camera Scanner View */}
        {scanMode === 'camera' && (
          <div className="space-y-4">
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden min-h-[260px] flex items-center justify-center border border-slate-800">
              <div id={regionId} className="w-full h-full overflow-hidden" />

              {cameraError && (
                <div className="absolute inset-0 p-6 bg-slate-900/90 text-white flex flex-col items-center justify-center text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-rose-400" />
                  <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Position the QR code inside the viewfinder box above to scan automatically.
            </p>
          </div>
        )}

        {/* Mode 2: File Upload Scanner View */}
        {scanMode === 'file' && (
          <div className="space-y-4">
            <div id="file-qr-temp" className="hidden" />

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3 hover:border-indigo-400 transition-colors bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm">Select QR Code Image</h4>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, or WebP screenshot</p>
              </div>

              <label className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors">
                <span>Browse File</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {fileError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
