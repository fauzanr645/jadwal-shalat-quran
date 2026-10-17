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
            onGoToSettings={() => setActiveTab('settings')}
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

      {/* Subtle Footer on Desktop */}
      <footer className="hidden md:block py-6 border-t border-white/5 text-center text-xs text-slate-500 glass-panel mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Jadwal Shalat Akurat Standar <strong>Kemenag RI</strong> • Al-Qur'an 30 Juz & Murottal Audio
          </p>
          <p className="text-emerald-500/80">
            Offline Ready • Audio Adzan Subuh & Reguler
          </p>
        </div>
      </footer>

      {/* PWA Update Notification Prompt & Offline Ready Toast */}
      <PwaUpdatePrompt />

    </div>
  );
};

export default App;
