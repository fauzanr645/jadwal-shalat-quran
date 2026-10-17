import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Clock, 
  Heart, 
  Share2, 
  Check, 
  RotateCcw,
  Sparkles,
  Bell,
  Calendar,
  Gift
} from 'lucide-react';
import { DOA_LIST, DAILY_FEATURED_DOA, getTodayFeaturedDoa, type DailyFeaturedDoa } from '../../data/doaData';
import { notificationService } from '../../services/notificationService';

export const DoaTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'harian-spesial' | 'shalat' | 'pagi' | 'petang' | 'harian'>('harian-spesial');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay());
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notifSent, setNotifSent] = useState<boolean>(false);

  // Active daily doa based on day of week
  const todayDoa: DailyFeaturedDoa = DAILY_FEATURED_DOA.find((d) => d.dayIndex === selectedDayIndex) || getTodayFeaturedDoa();

  const categories = [
    { id: 'harian-spesial' as const, label: 'Doa Rezeki Hari Ini', icon: Sparkles },
    { id: 'shalat' as const, label: 'Dzikir Setelah Shalat', icon: Clock },
    { id: 'pagi' as const, label: 'Dzikir Pagi', icon: Sun },
    { id: 'petang' as const, label: 'Dzikir Petang', icon: Moon },
    { id: 'harian' as const, label: 'Doa Harian Lengkap', icon: Heart },
  ];

  const filteredDoa = DOA_LIST.filter((d) => d.category === activeCategory);

  const handleIncrement = (id: string, max: number = 33) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(35);
    }
    setCounters((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current < max ? current + 1 : current };
    });
  };

  const handleReset = (id: string) => {
    setCounters((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleCopy = (item: { title: string; arabic: string; translation: string; fawaid?: string }) => {
    const text = `${item.title}\n\n${item.arabic}\n\nArtinya: "${item.translation}"\n\n${item.fawaid || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.title);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendReminderNotification = async () => {
    const perm = await notificationService.requestPermission();
    if (perm === 'granted') {
      notificationService.showNotification(
        `Waktunya Berdoa Hari ${todayDoa.dayName}!`,
        `${todayDoa.title} — ${todayDoa.fadhilahRezeki}`
      );
      setNotifSent(true);
      setTimeout(() => setNotifSent(false), 3000);
    } else {
      alert('Mohon izinkan notifikasi di browser Anda untuk menerima pengingat doa harian.');
    }
  };

  const dailyCount = counters[`daily-${todayDoa.dayIndex}`] || 0;
  const isDailyCompleted = dailyCount >= todayDoa.targetCount;

  return (
    <div className="space-y-6 pb-28 md:pb-16 max-w-5xl mx-auto px-4 sm:px-6 pt-2 animate-in fade-in duration-300">
      
      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/25'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* FEATURED: DOA HARI INI BERUBAH-UBAH SESUAI HARI */}
      {activeCategory === 'harian-spesial' && (
        <div className="space-y-5">
          
          {/* Day of week selector chips */}
          <div className="p-3.5 rounded-3xl glass-panel border border-white/5 flex items-center justify-between gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Pilih Hari:
            </span>
            <div className="flex items-center gap-1.5">
              {DAILY_FEATURED_DOA.map((d) => {
                const isSelected = selectedDayIndex === d.dayIndex;
                const isActualToday = new Date().getDay() === d.dayIndex;
                return (
                  <button
                    key={d.dayIndex}
                    onClick={() => setSelectedDayIndex(d.dayIndex)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                        : isActualToday
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d.dayName.split(' ')[0]} {isActualToday ? '• Hari Ini' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hero Featured Card */}
          <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c192c] via-[#0d2238] to-[#063b2f] border border-emerald-500/40 shadow-2xl space-y-6">
            
            {/* Top Badges & Reminder Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Doa Spesial Hari {todayDoa.dayName}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  {todayDoa.theme}
                </span>
              </div>

              {/* Notification Reminder Button */}
              <button
                onClick={handleSendReminderNotification}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all text-xs font-bold cursor-pointer self-start sm:self-auto shrink-0"
              >
                {notifSent ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                <span>{notifSent ? 'Notifikasi Terkirim!' : 'Ingatkan Doa Hari Ini (Notif)'}</span>
              </button>
            </div>

            {/* Fadhilah Rezeki Box (Highlighted Banner) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                  Keutamaan & Janji Rezeki Hari Ini:
                </span>
                <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
                  {todayDoa.fadhilahRezeki}
                </p>
              </div>
            </div>

            {/* Doa Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {todayDoa.title}
              </h2>
            </div>

            {/* Arabic Text */}
            <div className="font-arabic text-2xl sm:text-4xl text-emerald-200 leading-loose text-right select-text">
              {todayDoa.arabic}
            </div>

            {/* Latin Transliteration */}
            <div className="text-xs sm:text-sm text-emerald-300 font-medium leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
              {todayDoa.latin}
            </div>

            {/* Indonesian Translation */}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-2 border-t border-white/10">
              <span className="font-bold text-white block mb-1">Artinya:</span>
              "{todayDoa.translation}"
            </div>

            {/* Reference */}
            <div className="text-xs text-slate-400 italic">
              Sumber: {todayDoa.fawaid}
            </div>

            {/* Counter Interactive Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300">
                  Target baca: <strong className="text-emerald-400">{dailyCount}</strong> / {todayDoa.targetCount}x
                </span>
                {dailyCount > 0 && (
                  <button
                    onClick={() => handleReset(`daily-${todayDoa.dayIndex}`)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Reset Hitungan"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleCopy(todayDoa)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Salin Doa"
                >
                  {copiedId === todayDoa.title ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={() => handleIncrement(`daily-${todayDoa.dayIndex}`, todayDoa.targetCount)}
                disabled={isDailyCompleted}
                className={`px-6 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95 ${
                  isDailyCompleted
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                }`}
              >
                {isDailyCompleted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Alhamdulillah, Selesai Dibaca</span>
                  </>
                ) : (
                  <span>Tekan Baca ({dailyCount}/{todayDoa.targetCount}x)</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* OTHER CATEGORIES: SHALAT, PAGI, PETANG, HARIAN */}
      {activeCategory !== 'harian-spesial' && (
        <div className="space-y-4">
          {filteredDoa.map((item) => {
            const currentCount = counters[item.id] || 0;
            const maxCount = item.repeatCount || 1;
            const isCompleted = currentCount >= maxCount;

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all duration-300 ${
                  isCompleted && maxCount > 1
                    ? 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'glass-panel border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {item.title}
                    </h3>
                    {maxCount > 1 && (
                      <span className="text-[11px] font-bold text-emerald-400 mt-0.5 block">
                        Target: Dibaca {maxCount}x
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {maxCount > 1 && currentCount > 0 && (
                      <button
                        onClick={() => handleReset(item.id)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Reset Hitungan"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(item)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Salin Teks Doa"
                    >
                      {copiedId === item.title ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="font-arabic text-2xl sm:text-3xl text-emerald-200 my-4 leading-loose select-text">
                  {item.arabic}
                </div>

                <div className="text-xs sm:text-sm text-emerald-300/80 font-medium leading-relaxed my-2">
                  {item.latin}
                </div>

                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-white/5">
                  {item.translation}
                </div>

                {item.fawaid && (
                  <div className="mt-3 text-[11px] font-medium text-amber-400/90 bg-amber-950/20 px-3 py-1.5 rounded-xl border border-amber-500/20 inline-block">
                    {item.fawaid}
                  </div>
                )}

                {maxCount > 1 && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="text-xs font-mono text-slate-400">
                      Progres: <strong className="text-emerald-400">{currentCount}</strong> / {maxCount}
                    </div>
                    <button
                      onClick={() => handleIncrement(item.id, maxCount)}
                      disabled={isCompleted}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer transform active:scale-95 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Selesai Dibaca</span>
                        </>
                      ) : (
                        <span>Tekan ({currentCount}/{maxCount})</span>
                      )}
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
