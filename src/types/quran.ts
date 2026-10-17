export interface SurahSummary {
  nomor: number;
  nama: string; // Arabic name
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah';
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends SurahSummary {
  ayat: Ayah[];
  suratSebelumnya: {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
  } | false;
  suratSelanjutnya: {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
  } | false;
}

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  updatedAt: string;
}

export interface Reciter {
  id: string;
  name: string;
  description: string;
  qualityKey: string; // e.g. "01" for Mishary, "02" for Sudais, etc.
}
