import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Volume2, 
  Bell, 
  Search, 
  Check, 
  VolumeX, 
  Sliders, 
  Calendar 
} from 'lucide-react';
import { INDONESIA_CITIES, searchCities } from '../../data/indonesiaCities';
import type { CityData, PrayerName, AdzanSoundPreference, PrayerSettings } from '../../types/prayer';

interface LocationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const LocationSettingsModal: React.FC<LocationSettingsModalProps> = ({
  isOpen,
  onClose,
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
  const [activeTab, setActiveTab] = useState<'location' | 'adzan' | 'calendar'>('location');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCities = searchCities(searchQuery);

  const handleGpsClick = async () => {
    setIsGpsLoading(true);
    setGpsMessage(null);
    const res = await onRequestGPS();
    setIsGpsLoading(false);
    setGpsMessage(res.message);
  };

  const prayersConfig: { id: PrayerName; label: string; sub: string; canAdzan: boolean }[] = [
    { id: 'imsak', label: 'Imsak', sub: 'Peringatan mulai puasa', canAdzan: false },
    { id: 'fajr', label: 'Subuh', sub: 'Adzan Subuh (Ash-shalatu khairum minan naum)', canAdzan: true },
    { id: 'sunrise', label: 'Terbit (Syuruq)', sub: 'Batas akhir waktu Subuh', canAdzan: false },
    { id: 'dhuha', label: 'Dhuha', sub: 'Waktu shalat Dhuha', canAdzan: false },
    { id: 'dhuhr', label: 'Dzuhur', sub: 'Adzan Dzuhur', canAdzan: true },
    { id: 'asr', label: 'Ashar', sub: 'Adzan Ashar', canAdzan: true },
    { id: 'maghrib', label: 'Maghrib', sub: 'Adzan Maghrib & Buka Puasa', canAdzan: true },
    { id: 'isha', label: 'Isya', sub: 'Adzan Isya', canAdzan: true },
  ];

  const popularCities = INDONESIA_CITIES.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl glass-panel-elevated border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Pengaturan & Wilayah</h2>
              <p className="text-xs text-slate-400">Atur lokasi jadwal shalat dan suara adzan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-white/10 px-6 bg-slate-900/30">
          <button
            onClick={() => setActiveTab('location')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'location'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Pilih Kota ({settings.cityName})</span>
          </button>
          <button
            onClick={() => setActiveTab('adzan')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'adzan'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Suara & Adzan</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Kalender Hijriyah</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'location' && (
            <div className="space-y-5">
              {/* GPS Auto Detect Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900/60 border border-emerald-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-emerald-400" />
                      Deteksi Lokasi Otomatis (GPS)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Gunakan koordinat GPS perangkat Anda untuk akurasi astronomis tertinggi.
                    </p>
                  </div>
                  <button
                    onClick={handleGpsClick}
                    disabled={isGpsLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer transition-all shrink-0"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isGpsLoading ? 'animate-spin' : ''}`} />
                    <span>{isGpsLoading ? 'Mencari...' : 'Gunakan GPS'}</span>
                  </button>
                </div>
                {gpsMessage && (
                  <p className="mt-2.5 text-xs text-emerald-300 bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
                    {gpsMessage}
                  </p>
                )}
              </div>

              {/* Popular Cities Chips */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Kota Populer
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularCities.map((city) => {
                    const isSelected = settings.cityName === city.name;
                    return (
                      <button
                        key={city.id}
                        onClick={() => {
                          onSelectCity(city);
                          onClose();
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                            : 'bg-slate-800/60 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {city.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search Indonesian Cities */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Cari Kota / Kabupaten Se-Indonesia
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik nama kota atau provinsi (contoh: Surabaya, Padang, Bali...)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Cities List */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {filteredCities.map((city) => {
                  const isSelected = settings.cityName === city.name;
                  return (
                    <div
                      key={city.id}
                      onClick={() => {
                        onSelectCity(city);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-white'
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
          )}

          {activeTab === 'adzan' && (
            <div className="space-y-6">
              {/* Notification Permission Card */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    Izin Notifikasi Browser
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {notificationPermission === 'granted'
                      ? 'Izin aktif. Notifikasi adzan akan muncul saat shalat tiba.'
                      : 'Aktifkan izin agar browser dapat memunculkan notifikasi waktu shalat.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {notificationPermission !== 'granted' ? (
                    <button
                      onClick={onRequestNotificationPermission}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer transition-all shrink-0"
                    >
                      Beri Izin Notifikasi
                    </button>
                  ) : (
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notificationsEnabled}
                        onChange={(e) => onToggleNotifications(e.target.checked)}
                        className="accent-emerald-500 rounded cursor-pointer"
                      />
                      <span>Notifikasi Aktif</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    Volume Adzan & Notifikasi
                  </span>
                  <span>{Math.round(settings.volume * 100)}%</span>
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

              {/* Sound Preferences Per Prayer */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Pilihan Suara Per Waktu Shalat
                </label>
                <div className="space-y-2">
                  {prayersConfig.map((prayer) => {
                    const currentPref = settings.soundPreferences[prayer.id] || 'adzan_full';
                    return (
                      <div
                        key={prayer.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-white/5 gap-2.5"
                      >
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{prayer.label}</span>
                            <span className="text-xs text-slate-400 font-normal">({prayer.sub})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          {/* Test Audio Button */}
                          <button
                            onClick={() => onTestAlert(prayer.id)}
                            className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-400 border border-white/5 transition-all cursor-pointer mr-1"
                            title="Test dengarkan suara"
                          >
                            Test
                          </button>

                          {/* Sound Mode Selector */}
                          <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                            {prayer.canAdzan && (
                              <button
                                onClick={() => onSetSoundPreference(prayer.id, 'adzan_full')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                  currentPref === 'adzan_full'
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                                title="Adzan Lengkap"
                              >
                                Adzan
                              </button>
                            )}
                            <button
                              onClick={() => onSetSoundPreference(prayer.id, 'chime_only')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                currentPref === 'chime_only'
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                              title="Bip Suara Singkat"
                            >
                              Bip
                            </button>
                            <button
                              onClick={() => onSetSoundPreference(prayer.id, 'notif_only')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                currentPref === 'notif_only'
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                              title="Hanya Teks Notifikasi"
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
                              title="Mute / Senyap"
                            >
                              <VolumeX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Koreksi Kalender Hijriyah
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Jika tanggal Hijriyah berbeda dengan pengumuman hilal resmi pemerintah (Kemenag RI), Anda dapat menyesuaikan koreksi hari (-2 s/d +2 hari).
                </p>

                <div className="flex items-center gap-3 mt-4">
                  {[-2, -1, 0, 1, 2].map((adj) => {
                    const isSelected = settings.hijriAdjustment === adj;
                    return (
                      <button
                        key={adj}
                        onClick={() => onUpdateHijriAdjustment(adj)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-800/60 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {adj > 0 ? `+${adj}` : adj} hari
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Perhitungan Standar <strong className="text-emerald-400">Kemenag RI</strong> (Subuh 20°, Isya 18°)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
