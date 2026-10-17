import { STATIC_SURAH_LIST } from '../data/surahListStatic';
import type { SurahSummary, SurahDetail, Reciter } from '../types/quran';

export const AVAILABLE_RECITERS: Reciter[] = [
  {
    id: '05',
    name: 'Misyari Rasyid Al-Afasy',
    description: 'Imam Masjid Al-Kabir Kuwait, lantunan merdu & fasih',
    qualityKey: '05',
  },
  {
    id: '03',
    name: 'Abdurrahman As-Sudais',
    description: 'Imam Besar Masjidil Haram Makkah Al-Mukarramah',
    qualityKey: '03',
  },
  {
    id: '01',
    name: 'Abdullah Al-Juhany',
    description: 'Imam Masjidil Haram Makkah',
    qualityKey: '01',
  },
  {
    id: '06',
    name: 'Yasser Al-Dosari',
    description: 'Imam Masjidil Haram Makkah',
    qualityKey: '06',
  },
  {
    id: '02',
    name: 'Abdul-Muhsin Al-Qasim',
    description: 'Imam Masjid Nabawi Madinah Al-Munawwarah',
    qualityKey: '02',
  },
  {
    id: '04',
    name: 'Ibrahim Al-Dossari',
    description: 'Qari & Guru Besar Qiraat Arab Saudi',
    qualityKey: '04',
  },
];

export const DEFAULT_RECITER = AVAILABLE_RECITERS[0]; // Misyari Rasyid Al-Afasy

const CACHE_PREFIX = 'quran_surah_';
const TAFSIR_CACHE_PREFIX = 'quran_tafsir_';

export async function fetchSurahList(): Promise<SurahSummary[]> {
  try {
    const res = await fetch('https://equran.id/api/v2/surat');
    if (res.ok) {
      const json = await res.json();
      if (json.code === 200 && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn('Network fetch for surah list failed, fallback to static bundled list', e);
  }
  return STATIC_SURAH_LIST;
}

export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const cacheKey = `${CACHE_PREFIX}${surahNumber}`;
  
  // 1. Try local cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Cache read error', e);
  }

  // 2. Fetch from API
  const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
  if (!res.ok) {
    throw new Error(`Gagal memuat surah ${surahNumber} (HTTP ${res.status})`);
  }

  const json = await res.json();
  if (json.code !== 200 || !json.data) {
    throw new Error(json.message || 'Data surah tidak valid');
  }

  const data: SurahDetail = json.data;

  // 3. Save to cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (e) {
    console.warn('Cache write quota exceeded', e);
  }

  return data;
}

export interface TafsirAyat {
  ayat: number;
  teks: string;
}

export interface TafsirData {
  nomor: number;
  nama: string;
  namaLatin: string;
  tafsir: TafsirAyat[];
}

export async function fetchTafsir(surahNumber: number): Promise<TafsirData> {
  const cacheKey = `${TAFSIR_CACHE_PREFIX}${surahNumber}`;
  
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {}

  const res = await fetch(`https://equran.id/api/v2/tafsir/${surahNumber}`);
  if (!res.ok) throw new Error(`Gagal memuat tafsir surah ${surahNumber}`);
  const json = await res.json();
  const data: TafsirData = json.data;

  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {}

  return data;
}
