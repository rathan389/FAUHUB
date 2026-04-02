import React from 'react';
import { X, Trash2, ExternalLink, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  onDelete: (id: string) => void;
}

export default function AdminPanel({ isOpen, onClose, listings, onDelete }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = listings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Admin Console</h2>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Total: {listings.length} posts</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search all listings..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filtered.length > 0 ? (
              filtered.map((l) => (
                <div key={l.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start justify-between space-x-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        l.category === 'sell' ? 'bg-green-100 text-green-700' :
                        l.category === 'buy' ? 'bg-blue-100 text-blue-700' :
                        l.category === 'accommodation' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {l.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 truncate">{l.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{l.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onDelete(l.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-400 font-medium">No listings found matching your search.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              Exit Admin Console
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
