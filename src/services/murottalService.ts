import { AVAILABLE_RECITERS } from './quranApi';
import type { Ayah, Reciter } from '../types/quran';

export interface MurottalState {
  isPlaying: boolean;
  surahNumber: number | null;
  surahNameLatin: string;
  totalAyat: number;
  currentAyahNumber: number | null;
  reciter: Reciter;
  duration: number;
  currentTime: number;
  repeatMode: 'none' | 'ayah' | 'surah';
  playbackRate: number;
  isLoading: boolean;
}

type MurottalListener = (state: MurottalState) => void;

class MurottalService {
  private audio: HTMLAudioElement | null = null;
  private currentAyahList: Ayah[] = [];
  private state: MurottalState = {
    isPlaying: false,
    surahNumber: null,
    surahNameLatin: '',
    totalAyat: 0,
    currentAyahNumber: null,
    reciter: AVAILABLE_RECITERS[0],
    duration: 0,
    currentTime: 0,
    repeatMode: 'none',
    playbackRate: 1.0,
    isLoading: false,
  };
  private listeners: MurottalListener[] = [];

  constructor() {
    // Restore reciter preference if saved
    try {
      const savedReciterId = localStorage.getItem('quran_reciter_id');
      if (savedReciterId) {
        const found = AVAILABLE_RECITERS.find((r) => r.id === savedReciterId);
        if (found) this.state.reciter = found;
      }
    } catch {}
  }

  public subscribe(listener: MurottalListener) {
    this.listeners.push(listener);
    listener({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const copy = { ...this.state };
    this.listeners.forEach((l) => l(copy));
  }

  public getState(): MurottalState {
    return { ...this.state };
  }

  public setReciter(reciter: Reciter) {
    this.state.reciter = reciter;
    try {
      localStorage.setItem('quran_reciter_id', reciter.id);
    } catch {}
    this.notify();

    // If currently playing, resume with new reciter audio
    if (this.state.isPlaying && this.state.currentAyahNumber !== null) {
      this.playAyah(this.state.currentAyahNumber);
    }
  }

  public setRepeatMode(mode: 'none' | 'ayah' | 'surah') {
    this.state.repeatMode = mode;
    this.notify();
  }

  public setPlaybackRate(rate: number) {
    this.state.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    this.notify();
  }

  public seek(seconds: number) {
    if (this.audio && !isNaN(seconds)) {
      this.audio.currentTime = seconds;
      this.state.currentTime = seconds;
      this.notify();
    }
  }

  /**
   * Load surah context for continuous playing
   */
  public loadSurah(surahNumber: number, surahNameLatin: string, ayat: Ayah[]) {
    this.state.surahNumber = surahNumber;
    this.state.surahNameLatin = surahNameLatin;
    this.state.totalAyat = ayat.length;
    this.currentAyahList = ayat;
    this.notify();
  }

  /**
   * Play specific ayah number within loaded surah
   */
  public playAyah(ayahNumber: number, surahNumber?: number, surahName?: string, ayat?: Ayah[]) {
    if (surahNumber && surahName && ayat) {
      this.loadSurah(surahNumber, surahName, ayat);
    }

    const ayahObj = this.currentAyahList.find((a) => a.nomorAyat === ayahNumber);
    if (!ayahObj) return;

    // Resolve reciter audio URL
    const reciterKey = this.state.reciter.qualityKey;
    let audioUrl = ayahObj.audio[reciterKey] || ayahObj.audio['05'] || Object.values(ayahObj.audio)[0];

    if (!audioUrl) return;

    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.state.isLoading = true;
    this.state.currentAyahNumber = ayahNumber;
    this.notify();

    const audio = new Audio(audioUrl);
    this.audio = audio;
    audio.playbackRate = this.state.playbackRate;

    audio.onloadedmetadata = () => {
      this.state.duration = audio.duration || 0;
      this.state.isLoading = false;
      this.notify();
    };

    audio.ontimeupdate = () => {
      this.state.currentTime = audio.currentTime;
      this.notify();
    };

    audio.onended = () => {
      this.handleAyahEnded();
    };

    audio.onerror = (e) => {
      console.warn('Murottal audio failed to load', e);
      this.state.isLoading = false;
      this.state.isPlaying = false;
      this.notify();
    };

    audio
      .play()
      .then(() => {
        this.state.isPlaying = true;
        this.state.isLoading = false;
        this.notify();
      })
      .catch((err) => {
        console.warn('Audio play prevented', err);
        this.state.isPlaying = false;
        this.state.isLoading = false;
        this.notify();
      });
  }

  private handleAyahEnded() {
    if (this.state.repeatMode === 'ayah') {
      if (this.state.currentAyahNumber !== null) {
        this.playAyah(this.state.currentAyahNumber);
      }
      return;
    }

    const current = this.state.currentAyahNumber;
    if (current === null) return;

    if (current < this.state.totalAyat) {
      // Advance to next ayah
      this.playAyah(current + 1);
    } else {
      // Reached end of surah
      if (this.state.repeatMode === 'surah') {
        this.playAyah(1);
      } else {
        this.state.isPlaying = false;
        this.notify();
      }
    }
  }

  public togglePlay() {
    if (!this.audio) {
      if (this.state.currentAyahNumber !== null) {
        this.playAyah(this.state.currentAyahNumber);
      } else if (this.currentAyahList.length > 0) {
        this.playAyah(1);
      }
      return;
    }

    if (this.state.isPlaying) {
      this.audio.pause();
      this.state.isPlaying = false;
      this.notify();
    } else {
      this.audio
        .play()
        .then(() => {
          this.state.isPlaying = true;
          this.notify();
        })
        .catch(() => {});
    }
  }

  public nextAyah() {
    const current = this.state.currentAyahNumber;
    if (current !== null && current < this.state.totalAyat) {
      this.playAyah(current + 1);
    }
  }

  public prevAyah() {
    const current = this.state.currentAyahNumber;
    if (current !== null && current > 1) {
      this.playAyah(current - 1);
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.state.isPlaying = false;
    this.state.isLoading = false;
    this.state.currentTime = 0;
    this.notify();
  }

  public close() {
    this.stop();
    this.state.surahNumber = null;
    this.state.currentAyahNumber = null;
    this.state.surahNameLatin = '';
    this.state.totalAyat = 0;
    this.currentAyahList = [];
    this.notify();
  }
}

export const murottalService = new MurottalService();
