import React from 'react';
import { 
  Clock, 
  Compass, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  Square
} from 'lucide-react';
import type { CalculatedPrayerData } from '../../services/prayerService';
import type { PrayerSettings, PrayerName } from '../../types/prayer';

interface PrayerTabProps {
  data: CalculatedPrayerData;
  settings: PrayerSettings;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  isAdzanPlaying: boolean;
  activeAdzanPrayer: PrayerName | null;
  onStopAdzan: () => void;
}

export const PrayerTab: React.FC<PrayerTabProps> = ({
  data,
  settings,
  selectedDate,
  onSelectDate,
  isAdzanPlaying,
  activeAdzanPrayer,
  onStopAdzan,
}) => {
  // Prayer icon mapping
  const getPrayerIcon = (id: PrayerName) => {
    switch (id) {
      case 'imsak':
        return Moon;
      case 'fajr':
        return Sunrise;
      case 'sunrise':
        return Sun;
      case 'dhuha':
        return Sparkles;
      case 'dhuhr':
        return Sun;
      case 'asr':
        return Sunset;
      case 'maghrib':
        return Sunset;
      case 'isha':
        return Moon;
      default:
        return Clock;
    }
  };

  const getDayOffsetName = () => {
    const now = new Date();
    const isToday =
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear();

    if (isToday) return 'Hari Ini';

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow =
      selectedDate.getDate() === tomorrow.getDate() &&
      selectedDate.getMonth() === tomorrow.getMonth() &&
      selectedDate.getFullYear() === tomorrow.getFullYear();

    if (isTomorrow) return 'Besok';

    return selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const changeDateBy = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    onSelectDate(next);
  };

  const formattedGregorian = selectedDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 animate-in fade-in duration-300">
      
      {/* Active Adzan Alert Banner */}
      {isAdzanPlaying && (
        <div className="relative overflow-hidden p-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-2xl shadow-emerald-500/30 border border-emerald-400/40 animate-pulse">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1 items-end h-6">
                <span className="w-1.5 h-3 bg-white rounded-full animate-bounce"></span>
                <span className="w-1.5 h-6 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-4 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
                <span className="w-1.5 h-5 bg-white rounded-full animate-bounce [animation-delay:0.45s]"></span>
              </div>
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider">
                  Adzan {activeAdzanPrayer?.toUpperCase()} Sedang Berkumandang
                </h4>
                <p className="text-xs text-emerald-100">
                  Mari tunaikan shalat tepat waktu dan dengarkan lantunan panggilan Ilahi.
                </p>
              </div>
            </div>
            <button
              onClick={onStopAdzan}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-emerald-800 hover:bg-slate-100 font-bold text-xs shadow-lg transition-all cursor-pointer shrink-0"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Hentikan Suara</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Date Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl glass-panel border border-white/5">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="font-semibold text-white">{formattedGregorian}</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-medium">{data.hijriDate.formatted}</span>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900/80 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => changeDateBy(-1)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Hari Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectDate(new Date())}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-all cursor-pointer"
          >
            {getDayOffsetName()}
          </button>

          <button
            onClick={() => changeDateBy(1)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Hari Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Card: Dynamic Countdown & Next Prayer */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1626] via-[#0d1f35] to-[#07362a] border border-white/10 p-6 sm:p-8 shadow-2xl">
        
        {/* Subtle decorative geometric Islamic background watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5 pointer-events-none flex items-center justify-end pr-8">
          <svg className="w-96 h-96" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            <circle cx="100" cy="100" r="90" strokeWidth="2" />
            <polygon points="100,10 190,100 100,190 10,100" strokeWidth="1.5" />
            <polygon points="100,10 100,190" strokeWidth="1" />
            <polygon points="10,100 190,100" strokeWidth="1" />
            <circle cx="100" cy="100" r="45" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Info: Hijri Date & Prayer Status */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                {data.hijriDate.formatted}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-white/5 text-xs font-medium">
                {formattedGregorian}
              </span>
            </div>

            {/* Next Prayer Big Title */}
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-emerald-400/90">
                Waktu Shalat Berikutnya
              </p>
              <div className="flex items-baseline gap-4 mt-1">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {data.nextPrayer?.name}
                </h1>
                <span className="text-2xl sm:text-3xl text-emerald-300 font-arabic font-normal">
                  {data.nextPrayer?.arabicName}
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-400">
                  {data.nextPrayer?.time}
                </span>
              </div>
            </div>

            {/* Progress Bar Between Prayers */}
            <div className="space-y-1.5 pt-2 max-w-md">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>{data.currentPrayer?.name} ({data.currentPrayer?.time})</span>
                <span className="text-emerald-400 font-semibold">{data.progressPercent}% Berlalu</span>
                <span>{data.nextPrayer?.name} ({data.nextPrayer?.time})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900/80 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-emerald-500/50"
                  style={{ width: `${data.progressPercent}%` }}
                />
              </div>
            </div>

          </div>

          {/* Right Hero: Real-time Countdown Box */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-end justify-center">
            <div className="glass-panel-elevated p-6 rounded-3xl border border-white/10 text-center w-full max-w-xs shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Hitung Mundur</span>
              </div>

              {/* Glowing countdown text */}
              <div className="text-4xl sm:text-5xl font-mono font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent my-1">
                {data.formattedCountdown}
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Menuju waktu <strong className="text-emerald-400">{data.nextPrayer?.name}</strong>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Prayer Schedule Cards Grid (8 items) */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight">Jadwal Waktu Shalat Lengkap</h2>
          <p className="text-xs text-slate-400">Standar Kemenag RI • Wilayah {settings.cityName} & Sekitarnya</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {data.prayers.map((prayer) => {
            const Icon = getPrayerIcon(prayer.id);
            const isNext = prayer.isNext;
            const isCurrent = prayer.isCurrent;
            const pref = settings.soundPreferences[prayer.id] || 'adzan_full';

            return (
              <div
                key={prayer.id}
                className={`relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 group ${
                  isNext
                    ? 'bg-gradient-to-b from-emerald-950/70 to-slate-900 border-emerald-400/50 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                    : isCurrent
                    ? 'bg-slate-900/90 border-teal-500/40 shadow-lg shadow-teal-500/10'
                    : 'glass-panel border-white/5 hover:border-white/20'
                }`}
              >
                {/* Status Badge */}
                {isNext && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-extrabold uppercase text-white tracking-wide shadow-md whitespace-nowrap">
                    Berikutnya
                  </div>
                )}

                {/* Top Row: Icon & Arabic Name */}
                <div className="flex items-start justify-between">
                  <div
                    className={`p-2 rounded-xl border ${
                      isNext
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : isCurrent
                        ? 'bg-teal-500/20 text-teal-300 border-teal-400/30'
                        : 'bg-slate-800 text-slate-400 border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-arabic text-slate-400 group-hover:text-emerald-300 transition-colors">
                    {prayer.arabicName}
                  </span>
                </div>

                {/* Center: Prayer Name & Time */}
                <div className="my-3">
                  <span
                    className={`text-xs font-semibold block ${
                      isNext ? 'text-emerald-300' : 'text-slate-300'
                    }`}
                  >
                    {prayer.name}
                  </span>
                  <div
                    className={`text-2xl font-mono font-extrabold tracking-tight mt-0.5 ${
                      isNext
                        ? 'text-white'
                        : isCurrent
                        ? 'text-teal-300'
                        : prayer.isPassed
                        ? 'text-slate-400'
                        : 'text-slate-100'
                    }`}
                  >
                    {prayer.time}
                  </div>
                </div>

                {/* Bottom: Sound preference badge */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-500">
                    {prayer.canPlayAdzan ? 'Adzan' : 'Waktu'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      pref === 'adzan_full'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : pref === 'chime_only'
                        ? 'bg-blue-500/20 text-blue-400'
                        : pref === 'notif_only'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {pref === 'adzan_full' ? 'Adzan' : pref === 'chime_only' ? 'Bip' : pref === 'notif_only' ? 'Teks' : 'Mute'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Qibla Direction & Islamic Quote Info Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Qibla Heading Card */}
        <div className="p-5 rounded-3xl glass-panel border border-white/5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 text-amber-400 shrink-0">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Arah Kiblat
            </span>
            <div className="text-xl font-bold text-white mt-0.5">
              {data.qiblaDirection}° <span className="text-xs font-normal text-slate-400">Barat Laut</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dari wilayah {settings.cityName} menuju Ka'bah di Makkah.
            </p>
          </div>
        </div>

        {/* Hadith / Wisdom Quote Card */}
        <div className="md:col-span-2 p-5 rounded-3xl glass-panel border border-white/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Keutamaan Shalat Awal Waktu
            </span>
          </div>
          <blockquote className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
            "Amalan apa yang paling dicintai oleh Allah? Rasulullah shallallahu ‘alaihi wa sallam menjawab: 'Shalat pada waktunya'."
          </blockquote>
          <span className="text-xs font-semibold text-slate-400 mt-2">
            — Shahih Bukhari no. 527 & Shahih Muslim no. 85
          </span>
        </div>

      </div>

    </div>
  );
};
