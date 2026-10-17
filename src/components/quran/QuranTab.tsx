import React, { useState, useEffect } from 'react';
import { SurahList } from './SurahList';
import { SurahReader } from './SurahReader';
import { STATIC_SURAH_LIST } from '../../data/surahListStatic';
import { fetchSurahList } from '../../services/quranApi';
import type { SurahSummary, Bookmark } from '../../types/quran';

const BOOKMARK_STORAGE_KEY = 'quran_last_read';

export const QuranTab: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahSummary[]>(STATIC_SURAH_LIST);
  const [activeSurahNumber, setActiveSurahNumber] = useState<number | null>(null);
  const [bookmark, setBookmark] = useState<Bookmark | null>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Fetch updated surahs in background
  useEffect(() => {
    fetchSurahList().then((list) => {
      if (list && list.length > 0) setSurahs(list);
    });
  }, []);

  const handleBookmarkAyah = (surahNumber: number, surahName: string, ayahNumber: number) => {
    const newBm: Bookmark = {
      surahNumber,
      surahName,
      ayahNumber,
      updatedAt: new Date().toISOString(),
    };
    setBookmark(newBm);
    try {
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(newBm));
    } catch {}
  };

  const handleJumpToBookmark = () => {
    if (bookmark) {
      setActiveSurahNumber(bookmark.surahNumber);
    }
  };

  return (
    <div>
      {activeSurahNumber === null ? (
        <SurahList
          surahs={surahs}
          onSelectSurah={(num) => setActiveSurahNumber(num)}
          bookmark={bookmark}
          onJumpToBookmark={handleJumpToBookmark}
        />
      ) : (
        <SurahReader
          surahNumber={activeSurahNumber}
          onBack={() => setActiveSurahNumber(null)}
          onSelectSurah={(num) => setActiveSurahNumber(num)}
          onBookmarkAyah={handleBookmarkAyah}
          bookmarkedAyahNumber={
            bookmark && bookmark.surahNumber === activeSurahNumber
              ? bookmark.ayahNumber
              : null
          }
        />
      )}
    </div>
  );
};
