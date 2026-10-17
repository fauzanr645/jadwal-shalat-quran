import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  RotateCcw, 
  Sparkles, 
  Navigation, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface TasbihKiblatTabProps {
  qiblaDirection: number;
  cityName: string;
  latitude: number;
  longitude: number;
}

const PRESETS = [
  { label: 'Subhanallah', arabic: 'سُبْحَانَ اللّٰهِ', target: 33 },
  { label: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلّٰهِ', target: 33 },
  { label: 'Allahu Akbar', arabic: 'اللّٰهُ أَكْبَرُ', target: 33 },
  { label: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللّٰهَ', target: 100 },
  { label: 'La Ilaha Illallah', arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', target: 100 },
  { label: 'Dzikir Bebas', arabic: 'ذِكْرٌ حُرٌّ', target: 0 },
];

export const TasbihKiblatTab: React.FC<TasbihKiblatTabProps> = ({
  qiblaDirection,
  cityName,
  latitude,
  longitude,
}) => {
  const [activeTab, setActiveTab] = useState<'tasbih' | 'kiblat'>('tasbih');
  
  // Tasbih state
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Compass state
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [compassPermission, setCompassPermission] = useState<boolean>(false);

  const activePreset = PRESETS[selectedPresetIndex];

  // Handle click on big tasbih button
  const handleTasbihTap = () => {
    // Vibration feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }

    // Gentle web audio click
    if (soundEnabled) {
      audioService.playWebAudioChime();
    }

    const nextCount = count + 1;
    if (activePreset.target > 0 && nextCount >= activePreset.target) {
      setCount(0);
      setTotalRounds((r) => r + 1);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    setTotalRounds(0);
  };

  // Device orientation for compass
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // iOS webkitCompassHeading or standard alpha
      const heading = (e as any).webkitCompassHeading || (e.alpha ? 360 - e.alpha : null);
      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(Math.round(heading));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const requestCompassPermission = async () => {
    if (
      typeof (DeviceOrientationEvent as any) !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setCompassPermission(true);
        }
      } catch (err) {
        console.error('Compass permission denied', err);
      }
    } else {
      setCompassPermission(true);
    }
  };

  // Calculate distance to Ka'bah (approx 21.4225 N, 39.8262 E)
  const calculateDistanceToMecca = () => {
    const R = 6371; // Earth radius km
    const lat1 = (latitude * Math.PI) / 180;
    const lon1 = (longitude * Math.PI) / 180;
    const lat2 = (21.4225 * Math.PI) / 180;
    const lon2 = (39.8262 * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const distanceKm = calculateDistanceToMecca();
  const qiblaRelativeAngle = deviceHeading !== null ? (qiblaDirection - deviceHeading + 360) % 360 : qiblaDirection;

  return (
    <div className="space-y-6 pb-28 md:pb-16 max-w-4xl mx-auto px-4 sm:px-6 pt-2">
      
      {/* Tab Switcher: Tasbih Digital vs Arah Kiblat */}
      <div className="flex p-1.5 rounded-2xl glass-panel border border-white/10 max-w-sm mx-auto">
        <button
          onClick={() => setActiveTab('tasbih')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'tasbih'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tasbih Digital</span>
        </button>

        <button
          onClick={() => setActiveTab('kiblat')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'kiblat'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Kompas Kiblat</span>
        </button>
      </div>

      {activeTab === 'tasbih' && (
        <div className="space-y-6">
          
          {/* Preset Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PRESETS.map((p, idx) => {
              const isSelected = selectedPresetIndex === idx;
              return (
                <button
                  key={p.label}
                  onClick={() => {
                    setSelectedPresetIndex(idx);
                    setCount(0);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {p.label} {p.target > 0 ? `(${p.target}x)` : ''}
                </button>
              );
            })}
          </div>

          {/* Main Tasbih Console Card */}
          <div className="p-8 rounded-3xl glass-panel-elevated border border-white/10 text-center max-w-md mx-auto relative overflow-hidden shadow-2xl">
            
            {/* Top preset title and arabic */}
            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                {activePreset.label}
              </span>
              <div className="text-3xl font-arabic text-white">
                {activePreset.arabic}
              </div>
              {activePreset.target > 0 && (
                <span className="text-xs text-slate-400">
                  Target: {activePreset.target}x per putaran
                </span>
              )}
            </div>

            {/* Huge Round Counter Button */}
            <div className="my-6 flex justify-center">
              <button
                onClick={handleTasbihTap}
                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 border-4 border-emerald-400/40 shadow-2xl shadow-emerald-500/40 flex flex-col items-center justify-center cursor-pointer transform active:scale-95 transition-all select-none group"
              >
                <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none" />
                
                {/* Number display */}
                <span className="text-5xl sm:text-6xl font-mono font-extrabold text-white tracking-tight drop-shadow-md">
                  {count}
                </span>

                <span className="text-xs text-emerald-200/80 font-semibold uppercase tracking-wider mt-1">
                  {activePreset.target > 0 ? `dari ${activePreset.target}` : 'Tekan'}
                </span>
              </button>
            </div>

            {/* Rounds & Tools */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <div className="text-left">
                <span className="text-slate-400 block text-[11px]">Selesai Putaran</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {totalRounds} Putaran
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sound Toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-white/5'
                  }`}
                  title={soundEnabled ? 'Suara Aktif' : 'Suara Senyap'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer border border-white/5 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'kiblat' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl glass-panel-elevated border border-white/10 text-center max-w-md mx-auto shadow-2xl space-y-6">
            
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Compass className="w-4 h-4" />
                Arah Menuju Ka'bah Makkah
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                {qiblaDirection}° <span className="text-base text-slate-400 font-normal">Barat Laut</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Wilayah {cityName} • Jarak ~{distanceKm.toLocaleString('id-ID')} km
              </p>
            </div>

            {/* Rotating Compass Graphic */}
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              {/* Compass Ring Background */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 transition-transform duration-300"
                style={{
                  transform: `rotate(${deviceHeading !== null ? -deviceHeading : 0}deg)`,
                }}
              >
                {/* North, East, South, West labels */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-rose-400">U</span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">T</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">S</span>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">B</span>
              </div>

              {/* Ka'bah Pointer Needle */}
              <div
                className="absolute w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
                style={{
                  transform: `rotate(${qiblaRelativeAngle}deg)`,
                }}
              >
                {/* Ka'bah Icon on needle head */}
                <div className="absolute top-2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/50 border border-amber-300">
                    <Navigation className="w-4 h-4 fill-current transform rotate-45" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 mt-1">Ka'bah</span>
                </div>

                {/* Needle line */}
                <div className="w-1 h-32 bg-gradient-to-t from-transparent via-amber-400/50 to-amber-400 rounded-full" />
              </div>

              {/* Compass Center Pivot */}
              <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 z-10 shadow-lg" />
            </div>

            {/* Device sensor info / calibration */}
            <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl border border-white/5 space-y-1">
              <p>
                {deviceHeading !== null
                  ? `Sensor Kompas Aktif (Sudut perangkat: ${deviceHeading}°)`
                  : 'Arahkan perangkat Anda menghadap sudut di atas untuk menentukan kiblat.'}
              </p>
              {!compassPermission && (
                <button
                  onClick={requestCompassPermission}
                  className="mt-2 text-xs text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  Kalibrasi / Izinkan Sensor Kompas
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
