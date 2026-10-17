import React, { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, Sparkles, X, Wifi } from 'lucide-react';

interface PwaUpdatePromptProps {
  onCheckUpdateRef?: (checkFn: () => Promise<void>) => void;
}

export const PwaUpdatePrompt: React.FC<PwaUpdatePromptProps> = ({ onCheckUpdateRef }) => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Periodically check for updates every 30 minutes
      if (registration) {
        setInterval(() => {
          registration.update().catch((err) => console.log('SW update check error:', err));
        }, 30 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    },
  });

  // Provide manual check function to parent if needed
  useEffect(() => {
    if (onCheckUpdateRef) {
      onCheckUpdateRef(async () => {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            await reg.update();
          }
        }
      });
    }
  }, [onCheckUpdateRef]);

  // Auto-dismiss offlineReady notification after 4 seconds
  useEffect(() => {
    if (offlineReady) {
      const timer = setTimeout(() => {
        setOfflineReady(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady, setOfflineReady]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleCloseNeedRefresh = () => {
    setNeedRefresh(false);
  };

  const handleCloseOfflineReady = () => {
    setOfflineReady(false);
  };

  return (
    <>
      {/* Toast: Offline Ready */}
      {offlineReady && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 rounded-2xl glass-panel-elevated border border-emerald-500/40 shadow-2xl flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/90 to-slate-900/90 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Mode Offline Siap</h4>
                <p className="text-[11px] text-slate-300">Aplikasi kini dapat dibuka tanpa koneksi internet.</p>
              </div>
            </div>
            <button
              onClick={handleCloseOfflineReady}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Prompt: New Version Available (needRefresh) */}
      {needRefresh && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0b1b2b] via-[#092233] to-[#043d2c] border border-emerald-400/50 shadow-2xl shadow-emerald-500/20 backdrop-blur-2xl space-y-3">
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    Pembaruan Tersedia!
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Versi baru aplikasi siap digunakan.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseNeedRefresh}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Tutup pemberitahuan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Pembaruan ini mencakup peningkatan performa, perbaikan bug, dan fitur terbaru jadwal shalat & Al-Qur'an.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Perbarui Sekarang</span>
              </button>

              <button
                onClick={handleCloseNeedRefresh}
                className="py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/5 transition-all cursor-pointer"
              >
                Nanti
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
