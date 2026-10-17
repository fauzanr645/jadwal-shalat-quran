import { useState, useEffect, useCallback } from 'react';
import { calculatePrayerTimes, type CalculatedPrayerData } from '../services/prayerService';
import { notificationService } from '../services/notificationService';
import { audioService } from '../services/audioService';
import { DEFAULT_CITY } from '../data/indonesiaCities';
import type { PrayerSettings, CityData, PrayerName, AdzanSoundPreference } from '../types/prayer';

const SETTINGS_STORAGE_KEY = 'shalat_app_settings';

const DEFAULT_SETTINGS: PrayerSettings = {
  autoLocation: false,
  latitude: DEFAULT_CITY.latitude,
  longitude: DEFAULT_CITY.longitude,
  cityName: DEFAULT_CITY.name,
  provinceName: DEFAULT_CITY.province,
  notificationsEnabled: true,
  soundPreferences: {
    imsak: 'chime_only',
    fajr: 'adzan_full',
    sunrise: 'muted',
    dhuha: 'muted',
    dhuhr: 'adzan_full',
    asr: 'adzan_full',
    maghrib: 'adzan_full',
    isha: 'adzan_full',
  },
  volume: 0.85,
  fajrCustomAudio: true,
  hijriAdjustment: 0,
};

export function usePrayerTimes() {
  const [settings, setSettings] = useState<PrayerSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [data, setData] = useState<CalculatedPrayerData>(() =>
    calculatePrayerTimes(settings.latitude, settings.longitude, new Date(), settings.hijriAdjustment)
  );
  const [isAdzanPlaying, setIsAdzanPlaying] = useState<boolean>(false);
  const [activeAdzanPrayer, setActiveAdzanPrayer] = useState<PrayerName | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() =>
    notificationService.getPermission()
  );

  // Save settings on change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      audioService.setVolume(settings.volume);
    } catch {}
  }, [settings]);

  // Subscribe to audio state
  useEffect(() => {
    const unsub = audioService.subscribe((state) => {
      setIsAdzanPlaying(state.isPlaying);
      setActiveAdzanPrayer(state.prayer);
    });
    return unsub;
  }, []);

  // Recalculate prayer times and tick every second for real-time countdown & adzan check
  useEffect(() => {
    const update = () => {
      const result = calculatePrayerTimes(
        settings.latitude,
        settings.longitude,
        selectedDate,
        settings.hijriAdjustment
      );
      setData(result);

      // Check for adzan trigger if selectedDate is today
      const now = new Date();
      const isToday =
        selectedDate.getDate() === now.getDate() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getFullYear() === now.getFullYear();

      if (isToday) {
        notificationService.checkAndNotify(
          result.prayers,
          settings.cityName,
          settings.soundPreferences,
          settings.notificationsEnabled
        );
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [settings, selectedDate]);

  // Set city manual
  const selectCity = useCallback((city: CityData) => {
    setSettings((prev) => ({
      ...prev,
      autoLocation: false,
      latitude: city.latitude,
      longitude: city.longitude,
      cityName: city.name,
      provinceName: city.province,
    }));
  }, []);

  // Request GPS Location
  const requestGPS = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!('geolocation' in navigator)) {
      return { success: false, message: 'Geolokasi tidak didukung oleh browser Anda' };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          let detectedName = 'Lokasi Saya (GPS)';
          try {
            // Reverse geocode via free bigdatacloud or openstreetmap reverse
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`
            );
            if (res.ok) {
              const geo = await res.json();
              detectedName = geo.city || geo.locality || geo.principalSubdivision || 'Lokasi Saya';
            }
          } catch {}

          setSettings((prev) => ({
            ...prev,
            autoLocation: true,
            latitude: lat,
            longitude: lng,
            cityName: detectedName,
            provinceName: 'Koordinat GPS',
          }));

          resolve({ success: true, message: `Lokasi berhasil dideteksi: ${detectedName}` });
        },
        (error) => {
          resolve({ success: false, message: `Gagal mendeteksi lokasi: ${error.message}` });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }, []);

  // Update sound preference for a prayer
  const setSoundPreference = useCallback((prayer: PrayerName, pref: AdzanSoundPreference) => {
    setSettings((prev) => ({
      ...prev,
      soundPreferences: {
        ...prev.soundPreferences,
        [prayer]: pref,
      },
    }));
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    const perm = await notificationService.requestPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      setSettings((prev) => ({ ...prev, notificationsEnabled: true }));
    }
    return perm;
  }, []);

  // Toggle notifications global
  const toggleNotifications = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, notificationsEnabled: enabled }));
  }, []);

  // Set volume
  const setVolume = useCallback((v: number) => {
    setSettings((prev) => ({ ...prev, volume: v }));
    audioService.setVolume(v);
  }, []);

  // Stop adzan
  const stopAdzan = useCallback(() => {
    audioService.stopAdzan();
  }, []);

  // Test sound
  const testAlert = useCallback(
    (prayer: PrayerName) => {
      const p = data.prayers.find((item) => item.id === prayer) || data.prayers[1];
      const pref = settings.soundPreferences[prayer] || 'adzan_full';
      notificationService.testAlert(prayer, p.name, settings.cityName, pref);
    },
    [data.prayers, settings]
  );

  return {
    settings,
    setSettings,
    selectedDate,
    setSelectedDate,
    data,
    selectCity,
    requestGPS,
    setSoundPreference,
    notificationPermission,
    requestNotificationPermission,
    toggleNotifications,
    setVolume,
    isAdzanPlaying,
    activeAdzanPrayer,
    stopAdzan,
    testAlert,
  };
}
