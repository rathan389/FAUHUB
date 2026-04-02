import React from 'react';
import { Home, ShoppingBag, Bed, Users } from 'lucide-react';
import { Category } from '../types';

interface BottomNavProps {
  activeTab: Category | 'home';
  setActiveTab: (tab: Category | 'home') => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'sell', icon: ShoppingBag, label: 'Market' },
    { id: 'accommodation', icon: Bed, label: 'Stay' },
    { id: 'public', icon: Users, label: 'Public' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as Category | 'home')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeTab === id ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-400'
            }`}
          >
            <Icon size={24} className={activeTab === id ? 'animate-pulse' : ''} />
            <span className="text-[10px] mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
