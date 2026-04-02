import React from 'react';
import { MapPin, Phone, Calendar, Tag, Share2, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, isOwner, onDelete }) => {
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Sharing not supported on this browser');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md active:scale-[0.98] mb-4">
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-300">
            <Tag size={48} />
            <span className="text-[10px] font-bold uppercase mt-2">No Image Provided</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex space-x-2">
          {isOwner && onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); if(confirm('Delete this post?')) onDelete(listing.id); }}
              className="p-2 bg-red-50/80 backdrop-blur-md rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-sm"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-700 hover:bg-white transition-colors shadow-sm"
          >
            <Share2 size={16} />
          </button>
          {listing.price && (
            <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {listing.price}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{listing.title}</h3>
            {listing.type && (
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">
                {listing.type}
              </span>
            )}
          </div>
          <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-lg shadow-sm border ${
            listing.category === 'sell' ? 'bg-green-50 text-green-700 border-green-100' :
            listing.category === 'buy' ? 'bg-blue-50 text-blue-700 border-blue-100' :
            listing.category === 'accommodation' ? 'bg-purple-50 text-purple-700 border-purple-100' :
            'bg-orange-50 text-orange-700 border-orange-100'
          }`}>
            {listing.category === 'public' ? 'QUESTION' : 
             listing.category === 'accommodation' ? 'ACCOMMODATION' : 
             listing.category.toUpperCase()}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {listing.description}
        </p>
        
        <div className="space-y-2 pt-2 border-t border-gray-50">
          {listing.location && (
            <div className="flex items-center text-gray-500 text-xs">
              <MapPin size={14} className="mr-1.5 shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
          )}
          
          <a 
            href={listing.contact.includes('@') ? `mailto:${listing.contact}` : `tel:${listing.contact.replace(/\s/g, '')}`}
            className="flex items-center text-indigo-600 hover:text-indigo-700 text-xs font-medium transition-colors"
          >
            <Phone size={14} className="mr-1.5 shrink-0" />
            <span className="truncate">{listing.contact}</span>
          </a>
          
        <div className="flex items-center text-gray-400 text-[10px] pt-1">
          <Calendar size={12} className="mr-1 shrink-0" />
          <span>{formatTimeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </div>
  </div>
  );
};
