import { audioService } from './audioService';
import type { PrayerName, AdzanSoundPreference } from '../types/prayer';

class NotificationService {
  private lastNotifiedKey: string = '';

  public getPermission(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch {
      return 'denied';
    }
  }

  public showNotification(title: string, body: string, icon: string = '/favicon.svg') {
    if (this.getPermission() !== 'granted') return;

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon,
            badge: icon,
            tag: 'prayer-notification',
            requireInteraction: true,
          } as any);
        });
      } else {
        new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: 'prayer-notification',
        } as any);
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
    const body = `Untuk wilayah ${cityName} dan sekitarnya. Mari tunaikan shalat tepat waktu.`;

    // 1. Browser Notification
    if (preference !== 'muted') {
      this.showNotification(title, body);
    }

    // 2. Audio Playback
    if (preference === 'adzan_full' && canPlayAdzan) {
      audioService.playAdzan(prayerName);
    } else if (preference === 'chime_only' || (preference === 'adzan_full' && !canPlayAdzan)) {
      audioService.playChime();
    }
  }

  /**
   * Called by the prayer timer tick loop every second
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

      // Within 45 seconds of the prayer time
      if (diffMs >= 0 && diffMs < 45000) {
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
