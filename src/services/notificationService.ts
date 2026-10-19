import { audioService } from './audioService';
import type { PrayerName, AdzanSoundPreference } from '../types/prayer';

class NotificationService {
  private lastNotifiedKey: string = '';

  public getPermission(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch {
      return 'denied';
    }
  }

  public showNotification(title: string, body: string, icon: string = '/apple-touch-icon.png') {
    if (this.getPermission() !== 'granted') return;

    try {
      const options: any = {
        body,
        icon,
        badge: icon,
        tag: 'prayer-notification',
        renotify: true,
        requireInteraction: true,
        vibrate: [500, 250, 500, 250, 500, 250, 500],
        silent: false,
        actions: [
          { action: 'open', title: 'Buka Jadwal' },
          { action: 'stop', title: 'Hentikan Suara' },
        ],
      };

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready
          .then((reg) => {
            reg.showNotification(title, options);
          })
          .catch(() => {
            new Notification(title, options);
          });
      } else {
        new Notification(title, options);
      }
    } catch (err) {
      console.warn('Failed to show notification:', err);
    }
  }

  /**
   * Triggers the alert for a prayer based on user preference
   */
  public triggerPrayerAlert(
    prayerName: PrayerName,
    prayerLabel: string,
    cityName: string,
    preference: AdzanSoundPreference,
    canPlayAdzan: boolean
  ) {
    const title = `Waktu Shalat ${prayerLabel} Telah Tiba!`;
    const body = `Wilayah ${cityName} dan sekitarnya. Mari tunaikan shalat tepat waktu.`;

    // 1. Browser / Mobile Notification with Vibration
    if (preference !== 'muted') {
      this.showNotification(title, body);
    }

    // 2. Audio Playback (Adzan / Chime)
    if (preference === 'adzan_full' && canPlayAdzan) {
      audioService.playAdzan(prayerName);
    } else if (preference === 'chime_only' || (preference === 'adzan_full' && !canPlayAdzan)) {
      audioService.playChime();
    }
  }

  /**
   * Called by the prayer timer tick loop every second and on visibility change.
   * Window increased to 3 minutes (180,000 ms) so aggressive mobile OS timer throttling does not miss the prayer.
   */
  public checkAndNotify(
    prayers: { id: PrayerName; name: string; date: Date; canPlayAdzan: boolean }[],
    cityName: string,
    soundPreferences: Record<PrayerName, AdzanSoundPreference>,
    notificationsEnabled: boolean
  ) {
    if (!notificationsEnabled) return;

    const now = new Date();
    const nowTime = now.getTime();
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    for (const p of prayers) {
      const pTime = p.date.getTime();
      const diffMs = nowTime - pTime;

      // Within 3 minutes of the prayer time (handles background timer delays on iOS/Android)
      if (diffMs >= 0 && diffMs < 180000) {
        const key = `${p.id}-${dateStr}`;
        if (this.lastNotifiedKey !== key) {
          this.lastNotifiedKey = key;
          const pref = soundPreferences[p.id] || 'adzan_full';
          this.triggerPrayerAlert(p.id, p.name, cityName, pref, p.canPlayAdzan);
        }
        break;
      }
    }
  }

  /**
   * Test trigger for user verification
   */
  public testAlert(
    prayerName: PrayerName,
    prayerLabel: string,
    cityName: string,
    preference: AdzanSoundPreference
  ) {
    this.triggerPrayerAlert(
      prayerName,
      prayerLabel,
      cityName,
      preference,
      prayerName !== 'imsak' && prayerName !== 'sunrise' && prayerName !== 'dhuha'
    );
  }
}

export const notificationService = new NotificationService();
