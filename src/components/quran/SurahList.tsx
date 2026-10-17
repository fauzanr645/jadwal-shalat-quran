import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  Play, 
  Pause, 
  X 
} from 'lucide-react';
import type { SurahSummary, Bookmark as BookmarkType } from '../../types/quran';
import { murottalService, type MurottalState } from '../../services/murottalService';

interface SurahListProps {
  surahs: SurahSummary[];
  onSelectSurah: (surahNumber: number) => void;
  bookmark: BookmarkType | null;
  onJumpToBookmark: () => void;
}

export const SurahList: React.FC<SurahListProps> = ({
  surahs,
  onSelectSurah,
  bookmark,
  onJumpToBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Mekah' | 'Madinah'>('all');
  const [murottalState, setMurottalState] = useState<MurottalState>(murottalService.getState());

  React.useEffect(() => {
    const unsub = murottalService.subscribe((s) => {
      setMurottalState(s);
    });
    return unsub;
  }, []);

  const filteredSurahs = useMemo(() => {
    return surahs.filter((s) => {
      const matchQuery =
        !searchQuery.trim() ||
        s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        s.arti.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        s.nomor.toString() === searchQuery.trim();

      const matchType = typeFilter === 'all' || s.tempatTurun === typeFilter;
      return matchQuery && matchType;
    });
  }, [surahs, searchQuery, typeFilter]);

  const handleQuickPlay = (e: React.MouseEvent, s: SurahSummary) => {
    e.stopPropagation();
    if (murottalState.isPlaying && murottalState.surahNumber === s.nomor) {
      murottalService.togglePlay();
    } else {
      // Load and open surah reader or start playing
      onSelectSurah(s.nomor);
    }
  };

  return (
    <div className="space-y-6 pb-28 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
      
      {/* Last Read Bookmark Quick Bar */}
      {bookmark && (
        <div
          onClick={onJumpToBookmark}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-500/30 flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-500/60 transition-all shadow-xl group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 shrink-0">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">
                Terakhir Dibaca
              </span>
              <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                QS. {bookmark.surahName} : Ayat {bookmark.ayahNumber}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Klik untuk melanjutkan tilawah Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
            <span>Lanjutkan</span>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari surah berdasarkan nama, arti, atau nomor (contoh: Yasin, Al-Kahf, 36)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl glass-panel border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'all'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Semua (114 Surah)
          </button>
          <button
            onClick={() => setTypeFilter('Mekah')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'Mekah'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Makkiyah (86)
          </button>
          <button
            onClick={() => setTypeFilter('Madinah')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'Madinah'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Madaniyah (28)
          </button>
        </div>
      </div>

      {/* Surah Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSurahs.map((surah) => {
          const isPlayingThis =
            murottalState.isPlaying && murottalState.surahNumber === surah.nomor;

          return (
            <div
              key={surah.nomor}
              onClick={() => onSelectSurah(surah.nomor)}
              className={`p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden ${
                isPlayingThis
                  ? 'bg-emerald-950/40 border-emerald-400/60 shadow-xl shadow-emerald-500/10'
                  : 'glass-panel border-white/5 hover:border-emerald-500/40 hover:bg-white/[0.04]'
              }`}
            >
              {/* Left: Number & Titles */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Number Badge */}
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-2xl border text-xs font-mono font-extrabold shrink-0 shadow-inner ${
                    isPlayingThis
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-slate-900/80 text-emerald-400 border-white/10 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10'
                  }`}
                >
                  {surah.nomor}
                </div>

                {/* Latin Name & Meaning */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors truncate">
                      {surah.namaLatin}
                    </h3>
                    {isPlayingThis && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {surah.arti}
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                  </span>
                </div>
              </div>

              {/* Right: Arabic calligraphy & Quick Play */}
              <div className="flex flex-col items-end shrink-0 gap-1">
                <span className="text-xl font-arabic text-emerald-300 group-hover:text-emerald-200 transition-colors">
                  {surah.nama}
                </span>

                <button
                  onClick={(e) => handleQuickPlay(e, surah)}
                  className={`p-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isPlayingThis
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border-white/5'
                  }`}
                  title="Buka / Putar Surah"
                >
                  {isPlayingThis ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="py-16 text-center text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold">Surah tidak ditemukan</p>
          <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian Anda</p>
        </div>
      )}

    </div>
  );
};
