import React from 'react';
import { X, QrCode, Clipboard, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xs bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 flex flex-col items-center text-center space-y-6"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>

            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <QrCode size={32} />
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">FAU HUB Mobile</h2>
              <p className="text-xs text-gray-500 mt-1 px-4 leading-relaxed">Scan with your phone camera to open the app instantly.</p>
            </div>

            <div className="p-5 bg-white border-8 border-gray-50 rounded-[2rem] shadow-inner">
              <QRCodeSVG 
                value={url} 
                size={200} 
                level="Q" 
                includeMargin={false}
                className="rounded-lg"
              />
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleCopy}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${
                  copied 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? <Check size={18} /> : <Clipboard size={18} />}
                <span>{copied ? 'Link Copied!' : 'Copy App Link'}</span>
              </button>
              
              <p className="text-[9px] font-mono text-gray-400 break-all px-2 opacity-50">
                {url}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
