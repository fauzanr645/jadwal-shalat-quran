import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Download, 
  Bell, 
  BellOff, 
  Wifi, 
  WifiOff 
} from 'lucide-react';

export type AppTab = 'prayer' | 'quran' | 'doa' | 'tasbih';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  cityName: string;
  notificationsEnabled: boolean;
  onRequestNotification: () => void;
  notificationPermission: NotificationPermission;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cityName,
  notificationsEnabled,
  onRequestNotification,
  notificationPermission,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA install prompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const navItems = [
    { id: 'prayer' as AppTab, label: 'Jadwal Shalat', icon: Clock },
    { id: 'quran' as AppTab, label: 'Al-Qur’an & Murottal', icon: BookOpen },
    { id: 'doa' as AppTab, label: 'Doa & Dzikir', icon: Sparkles },
    { id: 'tasbih' as AppTab, label: 'Tasbih & Kiblat', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('prayer')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25 border border-emerald-400/30">
              {/* Crescent & Star Icon */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor" fillOpacity="0.85"/>
                <polygon points="19 3 19.5 4.5 21 5 19.5 5.5 19 7 18.5 5.5 17 5 18.5 4.5 19 3" fill="#fbbf24" stroke="#fbbf24"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent">
                  Shalat & Qur'an
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PWA
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{cityName}</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Real-time Clock Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs font-mono text-emerald-400 font-semibold tracking-wide shadow-inner">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>{currentTime}</span>
            </div>

            {/* Offline/Online Badge */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border ${
                isOnline
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                  : 'bg-amber-950/40 text-amber-400 border-amber-800/40 animate-pulse'
              }`}
              title={isOnline ? 'Terhubung Online' : 'Mode Offline Aktif'}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Notification Permission Toggle */}
            <button
              onClick={onRequestNotification}
              className={`p-2 rounded-xl border text-sm transition-all duration-200 cursor-pointer ${
                notificationPermission === 'granted' && notificationsEnabled
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-slate-800 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-slate-700'
              }`}
              title={
                notificationPermission === 'granted'
                  ? 'Notifikasi Adzan Aktif'
                  : 'Aktifkan Izin Notifikasi Adzan'
              }
            >
              {notificationPermission === 'granted' && notificationsEnabled ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </button>

            {/* PWA Install Button */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-lg shadow-amber-500/20 border border-amber-400/30 transition-all cursor-pointer animate-bounce"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
