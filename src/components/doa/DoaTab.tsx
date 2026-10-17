import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Clock, 
  Heart, 
  Share2, 
  Check, 
  RotateCcw
} from 'lucide-react';
import { DOA_LIST } from '../../data/doaData';
import type { DoaItem } from '../../types/doa';

export const DoaTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'shalat' | 'pagi' | 'petang' | 'harian'>('shalat');
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'shalat' as const, label: 'Dzikir Setelah Shalat', icon: Clock },
    { id: 'pagi' as const, label: 'Dzikir Pagi', icon: Sun },
    { id: 'petang' as const, label: 'Dzikir Petang', icon: Moon },
    { id: 'harian' as const, label: 'Doa Harian', icon: Heart },
  ];

  const filteredDoa = DOA_LIST.filter((d) => d.category === activeCategory);

  const handleIncrement = (id: string, max: number = 33) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    setCounters((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current < max ? current + 1 : current };
    });
  };

  const handleReset = (id: string) => {
    setCounters((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleCopy = (item: DoaItem) => {
    const text = `${item.title}\n\n${item.arabic}\n\nArtinya: "${item.translation}"\n\n${item.fawaid || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-28 md:pb-16 max-w-5xl mx-auto px-4 sm:px-6 pt-2">
      
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Doa Cards List */}
      <div className="space-y-4">
        {filteredDoa.map((item) => {
          const currentCount = counters[item.id] || 0;
          const maxCount = item.repeatCount || 1;
          const isCompleted = currentCount >= maxCount;

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all duration-300 ${
                isCompleted && maxCount > 1
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'glass-panel border-white/5 hover:border-white/15'
              }`}
            >
              {/* Header: Title & Actions */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {item.title}
                  </h3>
                  {maxCount > 1 && (
                    <span className="text-[11px] font-bold text-emerald-400 mt-0.5 block">
                      Target: Dibaca {maxCount}x
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Reset Counter Button */}
                  {maxCount > 1 && currentCount > 0 && (
                    <button
                      onClick={() => handleReset(item.id)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Reset Hitungan"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Salin Teks Doa"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <div className="font-arabic text-2xl sm:text-3xl text-emerald-200 my-4 leading-loose select-text">
                {item.arabic}
              </div>

              {/* Latin Transliteration */}
              <div className="text-xs sm:text-sm text-emerald-300/80 font-medium leading-relaxed my-2">
                {item.latin}
              </div>

              {/* Indonesian Translation */}
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-white/5">
                {item.translation}
              </div>

              {/* Fawaid / Reference */}
              {item.fawaid && (
                <div className="mt-3 text-[11px] font-medium text-amber-400/90 bg-amber-950/20 px-3 py-1.5 rounded-xl border border-amber-500/20 inline-block">
                  {item.fawaid}
                </div>
              )}

              {/* Counter Action Pill (for items with repeats) */}
              {maxCount > 1 && (
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-400">
                    Progres: <strong className="text-emerald-400">{currentCount}</strong> / {maxCount}
                  </div>
                  <button
                    onClick={() => handleIncrement(item.id, maxCount)}
                    disabled={isCompleted}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer transform active:scale-95 ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-md shadow-emerald-500/20'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Selesai Dibaca</span>
                      </>
                    ) : (
                      <span>Tekan ({currentCount}/{maxCount})</span>
                    )}
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
