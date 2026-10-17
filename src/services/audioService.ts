import type { PrayerName } from '../types/prayer';

class AudioService {
  private adzanAudio: HTMLAudioElement | null = null;
  private chimeAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private currentVolume: number = 0.85;
  private isPlayingAdzan: boolean = false;
  private currentAdzanPrayer: PrayerName | null = null;
  private listeners: ((state: { isPlaying: boolean; prayer: PrayerName | null }) => void)[] = [];

  constructor() {
    // Lazy initialized on user interaction or first call
  }

  public subscribe(listener: (state: { isPlaying: boolean; prayer: PrayerName | null }) => void) {
    this.listeners.push(listener);
    // notify initial
    listener({ isPlaying: this.isPlayingAdzan, prayer: this.currentAdzanPrayer });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l({ isPlaying: this.isPlayingAdzan, prayer: this.currentAdzanPrayer }));
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.adzanAudio) this.adzanAudio.volume = this.currentVolume;
    if (this.chimeAudio) this.chimeAudio.volume = this.currentVolume;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public getIsPlaying(): boolean {
    return this.isPlayingAdzan;
  }

  public getCurrentPrayer(): PrayerName | null {
    return this.currentAdzanPrayer;
  }

  /**
   * Plays the Adzan audio (Subuh or Reguler)
   */
  public async playAdzan(prayer: PrayerName): Promise<boolean> {
    try {
      this.stopAdzan();

      const audioSrc = prayer === 'fajr' ? '/audio/adzan-subuh.mp3' : '/audio/adzan-reguler.mp3';

      this.adzanAudio = new Audio(audioSrc);
      this.adzanAudio.volume = this.currentVolume;

      this.adzanAudio.onended = () => {
        this.isPlayingAdzan = false;
        this.currentAdzanPrayer = null;
        this.notify();
      };

      this.adzanAudio.onerror = (e) => {
        console.warn('Adzan audio file failed, using Web Audio synthesizer chime fallback', e);
        this.playWebAudioChime();
        this.isPlayingAdzan = false;
        this.currentAdzanPrayer = null;
        this.notify();
      };

      await this.adzanAudio.play();
      this.isPlayingAdzan = true;
      this.currentAdzanPrayer = prayer;
      this.notify();
      return true;
    } catch (err) {
      console.warn('Browser autoplay prevented audio or audio failed:', err);
      // Fallback
      this.playWebAudioChime();
      return false;
    }
  }

  /**
   * Stops currently playing adzan
   */
  public stopAdzan() {
    if (this.adzanAudio) {
      this.adzanAudio.pause();
      this.adzanAudio.currentTime = 0;
      this.adzanAudio = null;
    }
    this.isPlayingAdzan = false;
    this.currentAdzanPrayer = null;
    this.notify();
  }

  /**
   * Plays the gentle notification chime
   */
  public async playChime(): Promise<void> {
    try {
      if (!this.chimeAudio) {
        this.chimeAudio = new Audio('/audio/notif-chime.wav');
      }
      this.chimeAudio.volume = this.currentVolume;
      this.chimeAudio.currentTime = 0;
      await this.chimeAudio.play();
    } catch (e) {
      console.warn('Chime audio play failed, using web audio oscillator', e);
      this.playWebAudioChime();
    }
  }

  /**
   * Synthesizer fallback using Web Audio API when file is inaccessible or offline
   */
  public playWebAudioChime() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      const ctx = this.audioContext;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6 harmonic chime

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.25 * this.currentVolume, now + idx * 0.15 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.3);
      });
    } catch (err) {
      console.error('Web Audio error:', err);
    }
  }
}

export const audioService = new AudioService();
