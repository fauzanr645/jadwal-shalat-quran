import React, { useState } from 'react';
import { Navbar, type AppTab } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { PrayerTab } from './components/prayer/PrayerTab';
import { QuranTab } from './components/quran/QuranTab';
import { DoaTab } from './components/doa/DoaTab';
import { TasbihKiblatTab } from './components/doa/TasbihKiblatTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { FloatingMurottalPlayer } from './components/quran/FloatingMurottalPlayer';
import { PwaUpdatePrompt } from './components/common/PwaUpdatePrompt';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { Sliders } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('prayer');

  const {
    settings,
    selectedDate,
    setSelectedDate,
    data,
    selectCity,
    requestGPS,
    setSoundPreference,
    setVolume,
    toggleNotifications,
    toggleBackgroundKeepAlive,
    toggleWakeLock,
    isKeepAliveActive,
    notificationPermission,
    requestNotificationPermission,
    isAdzanPlaying,
    activeAdzanPrayer,
    stopAdzan,
    testAlert,
    setSettings,
  } = usePrayerTimes();

  const handleUpdateHijriAdjustment = (adj: number) => {
    setSettings((prev) => ({ ...prev, hijriAdjustment: adj }));
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cityName={settings.cityName}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full animate-in fade-in duration-300">
        {activeTab === 'prayer' && (
          <PrayerTab
            data={data}
            settings={settings}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            isAdzanPlaying={isAdzanPlaying}
            activeAdzanPrayer={activeAdzanPrayer}
            onStopAdzan={stopAdzan}
            onToggleBackgroundKeepAlive={toggleBackgroundKeepAlive}
            isKeepAliveActive={isKeepAliveActive}
            onOpenSettings={() => setActiveTab('settings')}
          />
        )}

        {activeTab === 'quran' && <QuranTab />}

        {activeTab === 'doa' && <DoaTab />}

        {activeTab === 'tasbih' && (
          <TasbihKiblatTab
            qiblaDirection={data.qiblaDirection}
            cityName={settings.cityName}
            latitude={settings.latitude}
            longitude={settings.longitude}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            onSelectCity={selectCity}
            onRequestGPS={requestGPS}
            onSetSoundPreference={setSoundPreference}
            onSetVolume={setVolume}
            onToggleNotifications={toggleNotifications}
            onToggleBackgroundKeepAlive={toggleBackgroundKeepAlive}
            isKeepAliveActive={isKeepAliveActive}
            onToggleWakeLock={toggleWakeLock}
            onRequestNotificationPermission={requestNotificationPermission}
            notificationPermission={notificationPermission}
            onTestAlert={testAlert}
            onUpdateHijriAdjustment={handleUpdateHijriAdjustment}
          />
        )}
      </main>

      {/* Global Persistent Murottal Player */}
      <FloatingMurottalPlayer />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Footer with Settings Link */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-400 glass-panel mt-auto pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400">
            Jadwal Shalat Akurat Standar <strong>Kemenag RI</strong> • Al-Qur'an 30 Juz & Murottal Audio
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pengaturan & Lokasi</span>
            </button>
            <span className="text-emerald-500/80 text-[11px]">
              Offline Ready • Audio Adzan
            </span>
          </div>
        </div>
      </footer>

      {/* PWA Update Notification Prompt & Offline Ready Toast */}
      <PwaUpdatePrompt />

    </div>
  );
};

export default App;
