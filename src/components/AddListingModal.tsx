import React, { useState, useEffect } from 'react';
import { X, Plus, Image as ImageIcon, MapPin, Phone, DollarSign, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Listing } from '../types';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: Omit<Listing, 'id' | 'createdAt'>) => void;
  initialCategory: Category;
}

export default function AddListingModal({ isOpen, onClose, onSubmit, initialCategory }: AddListingModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    contact: localStorage.getItem('lastContact') || '',
    category: initialCategory,
    location: localStorage.getItem('lastLocation') || '',
    type: initialCategory === 'public' ? 'academic' : initialCategory === 'accommodation' ? 'short' : undefined,
  });

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      category: initialCategory, 
      type: initialCategory === 'public' ? 'academic' : initialCategory === 'accommodation' ? 'short' : undefined,
      contact: localStorage.getItem('lastContact') || prev.contact,
      location: localStorage.getItem('lastLocation') || prev.location
    }));
  }, [initialCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.contact) return;
    
    localStorage.setItem('lastContact', formData.contact);
    if (formData.location) localStorage.setItem('lastLocation', formData.location);

    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      contact: formData.contact, // Keep the contact info for convenience
      category: initialCategory,
      location: formData.location, // Keep the location info for convenience
      type: initialCategory === 'public' ? 'academic' : initialCategory === 'accommodation' ? 'short' : undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {formData.category === 'public' ? 'Ask a Question' : `Post New ${formData.category}`}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    {formData.category === 'public' ? 'Question Title' : 'Title'}
                  </label>
                  <div className="relative group">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      placeholder={formData.category === 'public' ? "What's your question?" : "What are you posting?"}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>

                {formData.category === 'public' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Question Type</label>
                    <div className="flex space-x-2">
                      {['academic', 'campus', 'housing', 'other'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: t })}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                            formData.type === t
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.category === 'accommodation' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Stay Type</label>
                    <div className="flex space-x-2">
                      {['short', 'long'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: t })}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                            formData.type === t
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {t === 'short' ? 'Short Term' : 'Long Term'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    {formData.category === 'public' ? 'Details' : 'Description'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={formData.category === 'public' ? "Add more context to your question..." : "Provide details about your post..."}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Price (Optional)</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        type="text"
                        placeholder="e.g. $50"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Contact Info</label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="Phone or Email"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Location (Optional)</label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="City, Neighborhood"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Image URL (Optional)</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <Plus size={20} />
                <span>Publish Post</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
