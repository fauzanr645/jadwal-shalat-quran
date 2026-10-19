export type PrayerName = 'imsak' | 'fajr' | 'sunrise' | 'dhuha' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimeItem {
  id: PrayerName;
  name: string;
  arabicName: string;
  time: string; // HH:mm
  date: Date;
  isPassed: boolean;
  isNext: boolean;
  isCurrent: boolean;
  canPlayAdzan: boolean;
}

export type AdzanSoundPreference = 'adzan_full' | 'chime_only' | 'notif_only' | 'muted';

export interface PrayerSettings {
  autoLocation: boolean;
  latitude: number;
  longitude: number;
  cityName: string;
  provinceName: string;
  notificationsEnabled: boolean;
  soundPreferences: Record<PrayerName, AdzanSoundPreference>;
  volume: number; // 0.0 - 1.0
  fajrCustomAudio: boolean;
  hijriAdjustment: number; // -2 to +2
  backgroundKeepAlive: boolean; // Keep background audio session alive for background adzan
  wakeLockEnabled: boolean; // Keep screen active on desk/stand
}

export interface CityData {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  timezone: 'WIB' | 'WITA' | 'WIT';
}
