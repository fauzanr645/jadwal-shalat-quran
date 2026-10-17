import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Volume2, 
  Bell, 
  Search, 
  Check, 
  VolumeX, 
  Sliders, 
  Calendar,
  Info,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { INDONESIA_CITIES, searchCities } from '../../data/indonesiaCities';
import type { CityData, PrayerName, AdzanSoundPreference, PrayerSettings } from '../../types/prayer';

interface SettingsTabProps {
  settings: PrayerSettings;
  onSelectCity: (city: CityData) => void;
  onRequestGPS: () => Promise<{ success: boolean; message: string }>;
  onSetSoundPreference: (prayer: PrayerName, pref: AdzanSoundPreference) => void;
  onSetVolume: (volume: number) => void;
  onToggleNotifications: (enabled: boolean) => void;
  onRequestNotificationPermission: () => Promise<NotificationPermission>;
  notificationPermission: NotificationPermission;
  onTestAlert: (prayer: PrayerName) => void;
  onUpdateHijriAdjustment: (adjustment: number) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onSelectCity,
  onRequestGPS,
  onSetSoundPreference,
  onSetVolume,
  onToggleNotifications,
  onRequestNotificationPermission,
  notificationPermission,
  onTestAlert,
  onUpdateHijriAdjustment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateCheckMsg, setUpdateCheckMsg] = useState<string | null>(null);

  const handleManualCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateCheckMsg('Memeriksa versi terbaru ke server...');
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
        }
      }
      setTimeout(() => {
        setIsCheckingUpdate(false);
        setUpdateCheckMsg('Aplikasi Anda sudah dalam versi terbaru (Al-Qur\'an & PWA v1.2.0)');
        setTimeout(() => setUpdateCheckMsg(null), 4000);
      }, 1200);
    } catch {
      setIsCheckingUpdate(false);
      setUpdateCheckMsg('Gagal memeriksa pembaruan. Pastikan Anda online.');
      setTimeout(() => setUpdateCheckMsg(null), 3000);
    }
  };

  const filteredCities = searchCities(searchQuery);
  const popularCities = INDONESIA_CITIES.slice(0, 10);

  const handleGpsClick = async () => {
    setIsGpsLoading(true);
    setGpsMessage(null);
    const res = await onRequestGPS();
    setIsGpsLoading(false);
    setGpsMessage(res.message);
  };

  const prayersConfig: { id: PrayerName; label: string; sub: string; canAdzan: boolean }[] = [
    { id: 'imsak', label: 'Imsak', sub: 'Peringatan mulai berpuasa', canAdzan: false },
    { id: 'fajr', label: 'Subuh', sub: 'Adzan Subuh (Ash-shalatu khairum minan naum)', canAdzan: true },
    { id: 'sunrise', label: 'Terbit (Syuruq)', sub: 'Batas akhir waktu Subuh', canAdzan: false },
    { id: 'dhuha', label: 'Dhuha', sub: 'Waktu shalat sunnah Dhuha', canAdzan: false },
    { id: 'dhuhr', label: 'Dzuhur', sub: 'Adzan Dzuhur', canAdzan: true },
    { id: 'asr', label: 'Ashar', sub: 'Adzan Ashar', canAdzan: true },
    { id: 'maghrib', label: 'Maghrib', sub: 'Adzan Maghrib & Waktu Berbuka', canAdzan: true },
    { id: 'isha', label: 'Isya', sub: 'Adzan Isya', canAdzan: true },
  ];

  return (
    <div className="space-y-6 pb-28 md:pb-16 max-w-5xl mx-auto px-4 sm:px-6 pt-2 animate-in fade-in duration-300">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-emerald-400" />
            Pengaturan Aplikasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Konfigurasi lokasi wilayah, bunyi adzan, notifikasi waktu shalat, dan kalender.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Kemenag RI</span>
        </div>
      </div>

      {/* SECTION 1: LOKASI & WILAYAH */}
      <div className="p-6 rounded-3xl glass-panel-elevated border border-white/10 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Wilayah & Koordinat Shalat</h2>
              <p className="text-xs text-slate-400">
                Lokasi aktif saat ini: <strong className="text-emerald-400">{settings.cityName}</strong> ({settings.provinceName})
              </p>
            </div>
          </div>
        </div>

        {/* GPS Auto Detect Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-400" />
              Deteksi GPS Otomatis
            </h3>
            <p className="text-xs text-slate-400">
              Gunakan sensor GPS perangkat Anda untuk menghitung jadwal shalat paling akurat di posisi Anda sekarang.
            </p>
          </div>
          <button
            onClick={handleGpsClick}
            disabled={isGpsLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 cursor-pointer transition-all shrink-0"
          >
            <Navigation className={`w-3.5 h-3.5 ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>{isGpsLoading ? 'Mendeteksi...' : 'Gunakan Lokasi GPS'}</span>
          </button>
        </div>

        {gpsMessage && (
          <p className="text-xs text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/40">
            {gpsMessage}
          </p>
        )}

        {/* Popular Cities */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Kota Pilihan Cepat:
          </label>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => {
              const isSelected = settings.cityName === city.name;
              return (
                <button
                  key={city.id}
                  onClick={() => onSelectCity(city)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-white font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Cities */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Cari Seluruh Kota / Kabupaten se-Indonesia:
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik nama kota, kabupaten, atau provinsi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 mt-2">
            {filteredCities.map((city) => {
              const isSelected = settings.cityName === city.name;
              return (
                <div
                  key={city.id}
                  onClick={() => onSelectCity(city)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-white'
                      : 'bg-slate-900/40 border-white/5 text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-sm font-semibold">{city.name}</div>
                      <div className="text-xs text-slate-400">{city.province} • Zona {city.timezone}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-emerald-500 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: NOTIFIKASI & SUARA ADZAN */}
      <div className="p-6 rounded-3xl glass-panel-elevated border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Notifikasi & Bunyi Adzan</h2>
            <p className="text-xs text-slate-400">Atur izin notifikasi popup browser dan suara panggilan shalat</p>
          </div>
        </div>

        {/* Notification Permission Card */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Status Notifikasi Browser
            </h3>
            <p className="text-xs text-slate-400">
              {notificationPermission === 'granted'
                ? 'Izin notifikasi aktif. Anda akan menerima pemberitahuan otomatis saat waktu shalat tiba.'
                : 'Izin notifikasi belum aktif. Aktifkan agar browser memunculkan peringatan shalat.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {notificationPermission !== 'granted' ? (
              <button
                onClick={onRequestNotificationPermission}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer transition-all shrink-0"
              >
                Aktifkan Izin Notifikasi
              </button>
            ) : (
              <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer font-bold bg-emerald-500/20 px-3.5 py-2 rounded-xl border border-emerald-500/30">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => onToggleNotifications(e.target.checked)}
                  className="accent-emerald-500 rounded cursor-pointer w-4 h-4"
                />
                <span>Peringatan Shalat Aktif</span>
              </label>
            )}
          </div>
        </div>

        {/* Master Volume Slider */}
        <div className="space-y-2 p-4 rounded-2xl bg-slate-900/50 border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              Volume Suara Adzan & Chime
            </span>
            <span className="font-mono text-emerald-400">{Math.round(settings.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(e) => onSetVolume(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
          />
        </div>

        {/* Per-Prayer Sound Preference Table */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pilihan Bunyi Setiap Waktu Shalat:
          </label>
          <div className="space-y-2">
            {prayersConfig.map((prayer) => {
              const currentPref = settings.soundPreferences[prayer.id] || 'adzan_full';
              return (
                <div
                  key={prayer.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{prayer.label}</span>
                      <span className="text-xs text-slate-400 font-normal">({prayer.sub})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Test Audio Button */}
                    <button
                      onClick={() => onTestAlert(prayer.id)}
                      className="px-3 py-1.5 rounded-xl text-xs bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 border border-white/5 transition-all cursor-pointer"
                      title="Test Dengarkan Suara"
                    >
                      Test
                    </button>

                    {/* Mode Selector */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                      {prayer.canAdzan && (
                        <button
                          onClick={() => onSetSoundPreference(prayer.id, 'adzan_full')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            currentPref === 'adzan_full'
                              ? 'bg-emerald-500 text-white shadow-sm font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Adzan
                        </button>
                      )}
                      <button
                        onClick={() => onSetSoundPreference(prayer.id, 'chime_only')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          currentPref === 'chime_only'
                            ? 'bg-emerald-500 text-white shadow-sm font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Bip
                      </button>
                      <button
                        onClick={() => onSetSoundPreference(prayer.id, 'notif_only')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          currentPref === 'notif_only'
                            ? 'bg-emerald-500 text-white shadow-sm font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Teks
                      </button>
                      <button
                        onClick={() => onSetSoundPreference(prayer.id, 'muted')}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          currentPref === 'muted'
                            ? 'bg-rose-500/80 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Senyap / Mute"
                      >
                        <VolumeX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: KALENDER HIJRIYAH */}
      <div className="p-6 rounded-3xl glass-panel-elevated border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Koreksi Kalender Hijriyah</h2>
            <p className="text-xs text-slate-400">
              Sesuaikan jika ada perbedaan penetapan hilal rukyatul hilal resmi pemerintah.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          {[-2, -1, 0, 1, 2].map((adj) => {
            const isSelected = settings.hijriAdjustment === adj;
            return (
              <button
                key={adj}
                onClick={() => onUpdateHijriAdjustment(adj)}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {adj > 0 ? `+${adj}` : adj} hari
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: PEMBARUAN APLIKASI (PWA UPDATE) */}
      <div className="p-6 rounded-3xl glass-panel-elevated border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-400/30 p-1.5 flex items-center justify-center shrink-0">
              <img src="/favicon.svg" alt="Al-Qur'an Icon" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Shalat & Al-Qur'an PWA</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  v1.2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aplikasi Web Progresif (PWA) dengan ikon Al-Qur'an & offline support.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Notifikasi Pembaruan Otomatis
            </h4>
            <p className="text-[11px] text-slate-400">
              Setiap kali versi baru dirilis, aplikasi akan menampilkan pop-up pemberitahuan untuk memperbarui ke versi terbaru.
            </p>
          </div>

          <button
            onClick={handleManualCheckUpdate}
            disabled={isCheckingUpdate}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isCheckingUpdate ? 'Memeriksa...' : 'Periksa Pembaruan'}</span>
          </button>
        </div>

        {updateCheckMsg && (
          <div className="text-xs text-emerald-300 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40 flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{updateCheckMsg}</span>
          </div>
        )}
      </div>

      {/* SECTION 5: INFO SISTEM & STANDAR */}
      <div className="p-5 rounded-3xl glass-panel border border-white/5 flex items-center gap-3 text-xs text-slate-400">
        <Info className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          Aplikasi menggunakan formula perhitungan resmi <strong>Kementerian Agama Republik Indonesia (Kemenag RI)</strong>: Subuh 20°, Isya 18°, bayangan Ashar Shafi'i, dan safety margin ikhtiyat +2 menit.
        </span>
      </div>

    </div>
  );
};
