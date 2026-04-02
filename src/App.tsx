import React, { useState, useEffect } from 'react';
import { Search, Plus, Bell, ShoppingBag, Bed, Users, X, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import BottomNav from './components/BottomNav';
import { ListingCard } from './components/ListingCard';
import AddListingModal from './components/AddListingModal';
import QRCodeModal from './components/QRCodeModal';
import AdminPanel from './components/AdminPanel';
import { Category, Listing } from './types';
import { db, collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from './firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<Category | 'home'>('home');
  const [marketFilter, setMarketFilter] = useState<'all' | 'sell' | 'buy'>('all');
  const [stayFilter, setStayFilter] = useState<'all' | 'short' | 'long'>('all');
  const [questionFilter, setQuestionFilter] = useState<'all' | 'academic' | 'campus' | 'housing' | 'other'>('all');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  const handleLogoClick = () => {
    setAdminClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdmin(!isAdmin);
        return 0;
      }
      return next;
    });
  };

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedListings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];
      setListings(fetchedListings);
    }, (error) => {
      console.error("Error fetching listings:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleAddListing = async (newListing: Omit<Listing, 'id' | 'createdAt'>) => {
    try {
      // Filter out undefined values as Firestore doesn't support them
      const cleanListing = Object.fromEntries(
        Object.entries(newListing).filter(([_, v]) => v !== undefined)
      );

      await addDoc(collection(db, 'listings'), {
        ...cleanListing,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Error adding listing:", error);
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'listings', id));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const filteredListings = listings.filter(l => {
    let matchesTab = false;
    if (activeTab === 'home') {
      matchesTab = true;
    } else if (activeTab === 'sell' || activeTab === 'buy') {
      // Market tab covers both sell and buy
      if (marketFilter === 'all') {
        matchesTab = l.category === 'sell' || l.category === 'buy';
      } else {
        matchesTab = l.category === marketFilter;
      }
    } else if (activeTab === 'accommodation') {
      matchesTab = stayFilter === 'all' || l.type === stayFilter;
    } else if (activeTab === 'public') {
      matchesTab = questionFilter === 'all' || l.type === questionFilter;
    } else {
      matchesTab = l.category === activeTab;
    }

    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         l.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-gray-50 shadow-xl relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-2 cursor-pointer select-none" onClick={handleLogoClick}>
          <div className={`w-10 h-10 ${isAdmin ? 'bg-red-600' : 'bg-indigo-600'} rounded-xl flex items-center justify-center shadow-lg transition-colors`}>
            <ShoppingBag className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none">FAU HUB</h1>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">
              {isAdmin ? 'Admin Mode' : 'Local Network'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isAdmin && (
            <button 
              onClick={() => setIsAdminPanelOpen(true)}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-100 transition-colors border border-red-100"
            >
              Manage
            </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={() => setIsQRModalOpen(true)}
            className="p-2.5 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <QrCode size={20} />
          </button>
          <button className="p-2.5 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-6 py-4 space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder={`Search in ${activeTab === 'home' ? 'everything' : activeTab === 'public' ? 'questions' : activeTab}...`}
            className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {(activeTab === 'sell' || activeTab === 'buy') && (
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'sell', label: 'Selling' },
              { id: 'buy', label: 'Buying' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setMarketFilter(f.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  marketFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-gray-500 border border-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'accommodation' && (
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Stays' },
              { id: 'short', label: 'Short Term' },
              { id: 'long', label: 'Long Term' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStayFilter(f.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  stayFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-gray-500 border border-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'public' && (
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'academic', label: 'Academic' },
              { id: 'campus', label: 'Campus' },
              { id: 'housing', label: 'Housing' },
              { id: 'other', label: 'Other' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setQuestionFilter(f.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  questionFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-gray-500 border border-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'sell', label: 'Market', icon: ShoppingBag, color: 'bg-green-500', desc: 'Buy & Sell' },
                { id: 'accommodation', label: 'Stay', icon: Bed, color: 'bg-purple-500', desc: 'Rentals' },
                { id: 'public', label: 'Questions', icon: Users, color: 'bg-orange-500', desc: 'Ask & Help' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id as Category);
                  }}
                  className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start space-y-3 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    <cat.icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">{cat.label}</p>
                    <p className="text-[10px] text-gray-500">{cat.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Featured Listings</h2>
              <button className="text-indigo-600 text-xs font-bold hover:underline">View All</button>
            </div>

            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
              {listings.slice(0, 3).map((l) => (
                <div key={l.id} className="min-w-[240px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
                  {l.imageUrl && (
                    <img src={l.imageUrl} alt={l.title} className="h-24 w-full object-cover" referrerPolicy="no-referrer" />
                  )}
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{l.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-1">{l.price || 'Contact for info'}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Updates</h2>
              <button className="text-indigo-600 text-xs font-bold hover:underline">View All</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  isOwner={isAdmin} 
                  onDelete={isAdmin ? handleDeleteListing : undefined}
                />
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Search size={32} className="text-gray-300" />
              </div>
              <div>
                <p className="text-gray-900 font-bold">No posts found</p>
                <p className="text-gray-500 text-sm">Be the first to post something here!</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }} 
      />

      {/* Modal */}
      <AddListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddListing}
        initialCategory={activeTab === 'home' ? 'sell' : activeTab}
      />

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url={window.location.origin + window.location.pathname}
      />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        listings={listings}
        onDelete={handleDeleteListing}
      />
    </div>
  );
}
