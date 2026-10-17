import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Bookmark, 
  Share2, 
  BookOpen, 
  Check, 
  Type, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fetchSurahDetail, fetchTafsir, type TafsirData } from '../../services/quranApi';
import { murottalService, type MurottalState } from '../../services/murottalService';
import type { SurahDetail, Ayah } from '../../types/quran';
import { TafsirModal } from './TafsirModal';

interface SurahReaderProps {
  surahNumber: number;
  onBack: () => void;
  onSelectSurah: (num: number) => void;
  onBookmarkAyah: (surahNumber: number, surahName: string, ayahNumber: number) => void;
  bookmarkedAyahNumber?: number | null;
}

export const SurahReader: React.FC<SurahReaderProps> = ({
  surahNumber,
  onBack,
  onSelectSurah,
  onBookmarkAyah,
  bookmarkedAyahNumber,
}) => {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Customization controls
  const [arabicFontSize, setArabicFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quran_font_size');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 32;
  });
  const [showLatin, setShowLatin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Murottal state
  const [murottalState, setMurottalState] = useState<MurottalState>(murottalService.getState());

  // Tafsir modal state
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<number | null>(null);
  const [tafsirData, setTafsirData] = useState<TafsirData | null>(null);
  const [isTafsirLoading, setIsTafsirLoading] = useState(false);

  // Copy feedback state
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  // Subscribe to murottal state
  useEffect(() => {
    const unsub = murottalService.subscribe((s) => {
      setMurottalState(s);
    });
    return unsub;
  }, []);

  // Fetch Surah Detail
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchSurahDetail(surahNumber)
      .then((data) => {
        if (isMounted) {
          setSurah(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Gagal memuat surah');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [surahNumber]);

  // Auto-scroll to currently playing ayah
  useEffect(() => {
    if (
      murottalState.isPlaying &&
      murottalState.surahNumber === surahNumber &&
      murottalState.currentAyahNumber !== null
    ) {
      const el = document.getElementById(`ayah-${murottalState.currentAyahNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [murottalState.currentAyahNumber, murottalState.isPlaying, surahNumber]);

  // Save font size
  const handleFontSizeChange = (size: number) => {
    setArabicFontSize(size);
    try {
      localStorage.setItem('quran_font_size', size.toString());
    } catch {}
  };

  const handlePlayAyah = (ayahNum: number) => {
    if (!surah) return;
    if (
      murottalState.isPlaying &&
      murottalState.surahNumber === surah.nomor &&
      murottalState.currentAyahNumber === ayahNum
    ) {
      murottalService.togglePlay();
    } else {
      murottalService.playAyah(ayahNum, surah.nomor, surah.namaLatin, surah.ayat);
    }
  };

  const handlePlayFullSurah = () => {
    if (!surah) return;
    murottalService.playAyah(1, surah.nomor, surah.namaLatin, surah.ayat);
  };

  const handleCopyAyah = (ayah: Ayah) => {
    if (!surah) return;
    const text = `QS. ${surah.namaLatin} Ayat ${ayah.nomorAyat}\n\n${ayah.teksArab}\n\nArtinya: "${ayah.teksIndonesia}"`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayah.nomorAyat);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const handleOpenTafsir = async (ayahNum: number) => {
    setSelectedTafsirAyah(ayahNum);
    if (!tafsirData || tafsirData.nomor !== surahNumber) {
      setIsTafsirLoading(true);
      try {
        const t = await fetchTafsir(surahNumber);
        setTafsirData(t);
      } catch (e) {
        console.error(e);
      } finally {
        setIsTafsirLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-400">
        <div className="w-12 h-12 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-sm font-medium">Memuat ayat-ayat Al-Qur'an...</p>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto px-4">
        <div className="p-4 rounded-3xl bg-rose-950/30 border border-rose-500/20 text-rose-300">
          <p className="text-sm font-semibold">{error || 'Surah tidak ditemukan'}</p>
        </div>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Kembali ke Daftar Surah
        </button>
      </div>
    );
  }

  const currentTafsirText =
    selectedTafsirAyah && tafsirData
      ? tafsirData.tafsir.find((t) => t.ayat === selectedTafsirAyah)?.teks || null
      : null;

  return (
    <div className="space-y-6 pb-28 md:pb-16 max-w-5xl mx-auto px-4 sm:px-6 pt-2">
      
      {/* Top Header Bar & Navigation */}
      <div className="flex items-center justify-between gap-3 sticky top-18 z-20 py-2.5 glass-panel rounded-2xl px-4 border border-white/10 backdrop-blur-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Daftar Surah</span>
        </button>

        <div className="text-center truncate px-2">
          <span className="text-sm font-extrabold text-white truncate block">
            {surah.nomor}. {surah.namaLatin}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">
            {surah.tempatTurun} • {surah.jumlahAyat} Ayat
          </span>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
            showSettings
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-800/80 border-white/5 text-slate-300 hover:text-white'
          }`}
          title="Pengaturan Tampilan Baca"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Reader Settings Drawer/Box */}
      {showSettings && (
        <div className="p-4 rounded-3xl glass-panel-elevated border border-white/10 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-4 h-4 text-emerald-400" />
              Ukuran Font Arab: {arabicFontSize}px
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFontSizeChange(Math.max(22, arabicFontSize - 2))}
                className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 text-xs cursor-pointer"
              >
                A-
              </button>
              <button
                onClick={() => handleFontSizeChange(Math.min(48, arabicFontSize + 2))}
                className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 text-xs cursor-pointer"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showLatin}
                onChange={(e) => setShowLatin(e.target.checked)}
                className="accent-emerald-500 rounded cursor-pointer"
              />
              <span>Tampilkan Teks Transliterasi Latin</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showTranslation}
                onChange={(e) => setShowTranslation(e.target.checked)}
                className="accent-emerald-500 rounded cursor-pointer"
              />
              <span>Tampilkan Terjemahan Kemenag RI</span>
            </label>
          </div>
        </div>
      )}

      {/* Surah Header Hero Plate */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1626] via-[#0f243b] to-[#07362a] border border-white/10 p-6 sm:p-8 text-center shadow-xl">
        <div className="relative z-10 space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            Surah Ke-{surah.nomor}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {surah.namaLatin}
          </h1>
          <div className="text-4xl sm:text-5xl font-arabic text-emerald-300 my-2">
            {surah.nama}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            "{surah.arti}" • {surah.tempatTurun} • {surah.jumlahAyat} Ayat
          </p>

          {/* Quick Play Full Surah Button */}
          <div className="pt-2">
            <button
              onClick={handlePlayFullSurah}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Putar Murottal Seluruh Surah</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bismillah Header (Omitted for Surah 9 At-Taubah) */}
      {surah.nomor !== 9 && (
        <div className="text-center py-6 px-4 rounded-3xl glass-panel border border-white/5">
          <p className="text-2xl sm:text-3xl font-arabic text-emerald-300 leading-loose">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="text-xs text-slate-400 mt-1 italic">
            Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
          </p>
        </div>
      )}

      {/* Verses (Ayat) List */}
      <div className="space-y-4">
        {surah.ayat.map((ayah) => {
          const isPlayingThis =
            murottalState.isPlaying &&
            murottalState.surahNumber === surah.nomor &&
            murottalState.currentAyahNumber === ayah.nomorAyat;
          const isBookmarked = bookmarkedAyahNumber === ayah.nomorAyat;

          return (
            <div
              key={ayah.nomorAyat}
              id={`ayah-${ayah.nomorAyat}`}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
                isPlayingThis
                  ? 'bg-emerald-950/40 border-emerald-400 shadow-2xl shadow-emerald-500/20'
                  : 'glass-panel border-white/5 hover:border-white/15'
              }`}
            >
              {/* Verse Action Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
                {/* Verse Number Badge */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-emerald-400 font-mono shadow-inner">
                    {ayah.nomorAyat}
                  </div>
                  {isPlayingThis && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Sedang Diputar
                    </span>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Play Audio Button */}
                  <button
                    onClick={() => handlePlayAyah(ayah.nomorAyat)}
                    className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isPlayingThis
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                    title={isPlayingThis ? 'Jeda Audio' : 'Putar Murottal Ayat'}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => onBookmarkAyah(surah.nomor, surah.namaLatin, ayah.nomorAyat)}
                    className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isBookmarked
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700'
                    }`}
                    title={isBookmarked ? 'Ditandai Terakhir Dibaca' : 'Tandai Terakhir Dibaca'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyAyah(ayah)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Salin Teks Ayat"
                  >
                    {copiedAyah === ayah.nomorAyat ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Tafsir Button */}
                  <button
                    onClick={() => handleOpenTafsir(ayah.nomorAyat)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    title="Buka Tafsir Kemenag"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Tafsir</span>
                  </button>
                </div>
              </div>

              {/* Arabic Verse Text */}
              <div
                className="font-arabic text-slate-100 my-4 text-right select-text leading-loose"
                style={{ fontSize: `${arabicFontSize}px` }}
              >
                {ayah.teksArab}
                <span className="text-emerald-400 text-lg mr-2 font-mono">
                  ۝{ayah.nomorAyat}
                </span>
              </div>

              {/* Latin Transliteration */}
              {showLatin && (
                <div className="text-xs sm:text-sm text-emerald-300/90 font-medium leading-relaxed my-2">
                  {ayah.teksLatin}
                </div>
              )}

              {/* Indonesian Translation */}
              {showTranslation && (
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-white/5">
                  {ayah.teksIndonesia}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Prev / Next Surah Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10 gap-3">
        {surah.suratSebelumnya ? (
          <button
            onClick={() => onSelectSurah(surah.suratSebelumnya ? surah.suratSebelumnya.nomor : 1)}
            className="flex items-center gap-2 p-3 rounded-2xl glass-panel hover:bg-white/5 border border-white/5 text-left text-xs transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Surah Sebelumnya</span>
              <span className="font-bold text-white">{surah.suratSebelumnya.namaLatin}</span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {surah.suratSelanjutnya && (
          <button
            onClick={() => onSelectSurah(surah.suratSelanjutnya ? surah.suratSelanjutnya.nomor : 114)}
            className="flex items-center gap-2 p-3 rounded-2xl glass-panel hover:bg-white/5 border border-white/5 text-right text-xs transition-all cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-slate-400 block">Surah Selanjutnya</span>
              <span className="font-bold text-white">{surah.suratSelanjutnya.namaLatin}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
        )}
      </div>

      {/* Tafsir Modal */}
      <TafsirModal
        isOpen={selectedTafsirAyah !== null}
        onClose={() => setSelectedTafsirAyah(null)}
        surahNumber={surah.nomor}
        surahName={surah.namaLatin}
        ayahNumber={selectedTafsirAyah || 1}
        tafsirText={currentTafsirText}
        isLoading={isTafsirLoading}
      />

    </div>
  );
};
