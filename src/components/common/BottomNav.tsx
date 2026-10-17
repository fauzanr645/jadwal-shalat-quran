import React from 'react';
import { Clock, BookOpen, Sparkles, Compass } from 'lucide-react';
import type { AppTab } from './Navbar';

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'prayer' as AppTab, label: 'Shalat', icon: Clock },
    { id: 'quran' as AppTab, label: 'Al-Qur’an', icon: BookOpen },
    { id: 'doa' as AppTab, label: 'Doa', icon: Sparkles },
    { id: 'tasbih' as AppTab, label: 'Kiblat', icon: Compass },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-1 pointer-events-none">
      <nav className="pointer-events-auto max-w-md mx-auto glass-panel-elevated rounded-2xl border border-white/10 p-1.5 flex items-center justify-around shadow-2xl backdrop-blur-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/30'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
