import type { PrayerName } from '../types/prayer';

class AudioService {
  private adzanAudio: HTMLAudioElement | null = null;
  private chimeAudio: HTMLAudioElement | null = null;
  private keepAliveAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private currentVolume: number = 0.85;
  private isPlayingAdzan: boolean = false;
  private currentAdzanPrayer: PrayerName | null = null;
  private isKeepAliveActive: boolean = false;
  private listeners: ((state: { isPlaying: boolean; prayer: PrayerName | null; isKeepAlive: boolean }) => void)[] = [];

  constructor() {
    // Listen for messages from Service Worker (e.g. STOP_ADZAN action from notification)
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'STOP_ADZAN') {
          this.stopAdzan();
        }
      });
    }
  }

  public subscribe(listener: (state: { isPlaying: boolean; prayer: PrayerName | null; isKeepAlive: boolean }) => void) {
    this.listeners.push(listener);
    listener({
      isPlaying: this.isPlayingAdzan,
      prayer: this.currentAdzanPrayer,
      isKeepAlive: this.isKeepAliveActive,
    });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) =>
      l({
        isPlaying: this.isPlayingAdzan,
        prayer: this.currentAdzanPrayer,
        isKeepAlive: this.isKeepAliveActive,
      })
    );
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.adzanAudio) this.adzanAudio.volume = this.currentVolume;
    if (this.chimeAudio) this.chimeAudio.volume = this.currentVolume;
    if (this.keepAliveAudio && this.isPlayingAdzan) {
      this.keepAliveAudio.volume = this.currentVolume;
    }
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

  public getIsKeepAliveActive(): boolean {
    return this.isKeepAliveActive;
  }

  /**
   * Initializes or toggles background audio keep-alive session.
   * Plays a silent audio loop to prevent mobile OS (iOS/Android) from sleeping JS timers & blocking audio.
   */
  public async setBackgroundKeepAlive(enabled: boolean): Promise<boolean> {
    if (!enabled) {
      this.stopBackgroundKeepAlive();
      return false;
    }

    try {
      if (!this.keepAliveAudio) {
        this.keepAliveAudio = new Audio('/audio/silence.wav');
      }
      this.keepAliveAudio.loop = true;
      this.keepAliveAudio.volume = 0.01; // Minimum volume to prevent WebKit sleep optimization

      this.updateMediaSessionMetadata('Pengingat Shalat Aktif', 'Berjalan di latar belakang (Kemenag RI)');
      await this.keepAliveAudio.play();
      this.isKeepAliveActive = true;
      this.notify();
      return true;
    } catch (err) {
      console.warn('Background KeepAlive audio could not start without user interaction:', err);
      this.isKeepAliveActive = false;
      this.notify();
      return false;
    }
  }

  public stopBackgroundKeepAlive() {
    if (this.keepAliveAudio) {
      this.keepAliveAudio.pause();
      this.keepAliveAudio.src = '';
      this.keepAliveAudio = null;
    }
    this.isKeepAliveActive = false;
    this.notify();
  }

  private updateMediaSessionMetadata(title: string, artist: string) {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title,
          artist,
          album: 'Jadwal Shalat & Al-Quran PWA',
          artwork: [
            { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        });

        navigator.mediaSession.setActionHandler('play', () => {
          if (this.keepAliveAudio) this.keepAliveAudio.play().catch(() => {});
        });
        navigator.mediaSession.setActionHandler('stop', () => {
          this.stopAdzan();
        });
      } catch (e) {
        console.warn('MediaSession error:', e);
      }
    }
  }

  /**
   * Plays the Adzan audio (Subuh or Reguler).
   * If background keep-alive audio is active, re-uses that unlocked audio element to bypass mobile background autoplay restrictions.
   */
  public async playAdzan(prayer: PrayerName): Promise<boolean> {
    try {
      const audioSrc = prayer === 'fajr' ? '/audio/adzan-subuh.mp3' : '/audio/adzan-reguler.mp3';
      const prayerNameCapital = prayer.charAt(0).toUpperCase() + prayer.slice(1);

      // Path A: If background keep-alive audio is already playing, reuse its unlocked pipeline
      if (this.keepAliveAudio) {
        this.keepAliveAudio.pause();
        this.keepAliveAudio.src = audioSrc;
        this.keepAliveAudio.volume = this.currentVolume;
        this.keepAliveAudio.loop = false;

        this.keepAliveAudio.onended = () => {
          this.isPlayingAdzan = false;
          this.currentAdzanPrayer = null;
          // Restore silent loop in background
          if (this.keepAliveAudio) {
            this.keepAliveAudio.src = '/audio/silence.wav';
            this.keepAliveAudio.volume = 0.01;
            this.keepAliveAudio.loop = true;
            this.keepAliveAudio.play().catch(() => {});
            this.updateMediaSessionMetadata('Pengingat Shalat Aktif', 'Berjalan di latar belakang (Kemenag RI)');
          }
          this.notify();
        };

        this.updateMediaSessionMetadata(`Adzan ${prayerNameCapital} Berkumandang`, 'Mari tunaikan shalat tepat waktu');
        await this.keepAliveAudio.play();
        this.isPlayingAdzan = true;
        this.currentAdzanPrayer = prayer;
        this.notify();
        return true;
      }

      // Path B: Foreground standalone audio
      this.stopAdzan();
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

      this.updateMediaSessionMetadata(`Adzan ${prayerNameCapital} Berkumandang`, 'Mari tunaikan shalat tepat waktu');
      await this.adzanAudio.play();
      this.isPlayingAdzan = true;
      this.currentAdzanPrayer = prayer;
      this.notify();
      return true;
    } catch (err) {
      console.warn('Browser autoplay prevented audio or audio failed:', err);
      this.playWebAudioChime();
      return false;
    }
  }

  /**
   * Stops currently playing adzan
   */
  public stopAdzan() {
    if (this.keepAliveAudio && this.isPlayingAdzan) {
      this.keepAliveAudio.pause();
      this.keepAliveAudio.src = '/audio/silence.wav';
      this.keepAliveAudio.volume = 0.01;
      this.keepAliveAudio.loop = true;
      this.keepAliveAudio.play().catch(() => {});
      this.updateMediaSessionMetadata('Pengingat Shalat Aktif', 'Berjalan di latar belakang (Kemenag RI)');
    }

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
