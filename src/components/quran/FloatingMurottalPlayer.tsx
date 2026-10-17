import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  Volume2, 
  X, 
  ChevronUp, 
  ChevronDown,
  User
} from 'lucide-react';
import { murottalService, type MurottalState } from '../../services/murottalService';
import { AVAILABLE_RECITERS } from '../../services/quranApi';

export const FloatingMurottalPlayer: React.FC = () => {
  const [state, setState] = useState<MurottalState>(murottalService.getState());
  const [isMinimized, setIsMinimized] = useState(false);
  const [showReciterModal, setShowReciterModal] = useState(false);

  useEffect(() => {
    const unsub = murottalService.subscribe((s) => {
      setState(s);
    });
    return unsub;
  }, []);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // If no surah loaded yet or ayah number is null, don't show floating bar
  if (!state.surahNumber) return null;

  const cycleRepeat = () => {
    if (state.repeatMode === 'none') {
      murottalService.setRepeatMode('ayah');
    } else if (state.repeatMode === 'ayah') {
      murottalService.setRepeatMode('surah');
    } else {
      murottalService.setRepeatMode('none');
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(state.playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    murottalService.setPlaybackRate(speeds[nextIndex]);
  };

  return (
    <div className="fixed bottom-16 md:bottom-3 left-0 right-0 z-40 px-3 pointer-events-none">
      <div className="pointer-events-auto max-w-4xl mx-auto glass-panel-elevated rounded-3xl border border-emerald-500/30 p-3 sm:p-4 shadow-2xl backdrop-blur-2xl">
        
        {/* Minimized View Bar */}
        {isMinimized ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white">
                  QS. {state.surahNameLatin} : {state.currentAyahNumber}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {state.reciter.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => murottalService.togglePlay()}
                className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                {state.isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => setIsMinimized(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Perbesar Pemutar"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => murottalService.close()}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Tutup Pemutar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Top row: Track Info & Options */}
            <div className="flex items-center justify-between gap-3">
              
              {/* Surah & Ayah Info with animated wave visualizer */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  {state.isPlaying ? (
                    <div className="flex gap-0.5 items-end h-4">
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2"></span>
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4 [animation-delay:0.15s]"></span>
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3 [animation-delay:0.3s]"></span>
                    </div>
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </div>

                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-white truncate">
                      QS. {state.surahNameLatin}
                    </h4>
                    {state.currentAyahNumber && (
                      <span className="text-xs font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        Ayat {state.currentAyahNumber}/{state.totalAyat}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowReciterModal(!showReciterModal)}
                    className="text-xs text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer truncate"
                  >
                    <User className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{state.reciter.name}</span>
                    <span className="text-[10px] text-slate-500 underline ml-0.5">(Ganti)</span>
                  </button>
                </div>
              </div>

              {/* Tools: Speed, Repeat, Minimize, Close */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Playback speed */}
                <button
                  onClick={cycleSpeed}
                  className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all cursor-pointer"
                  title="Kecepatan Putar"
                >
                  {state.playbackRate}x
                </button>

                {/* Repeat mode */}
                <button
                  onClick={cycleRepeat}
                  className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    state.repeatMode !== 'none'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={
                    state.repeatMode === 'ayah'
                      ? 'Ulangi Ayat Ini'
                      : state.repeatMode === 'surah'
                      ? 'Ulangi Seluruh Surah'
                      : 'Tidak Diulang'
                  }
                >
                  {state.repeatMode === 'ayah' ? (
                    <Repeat1 className="w-4 h-4" />
                  ) : (
                    <Repeat className="w-4 h-4" />
                  )}
                </button>

                {/* Minimize */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer hidden sm:block"
                  title="Kecilkan Pemutar"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Stop & Close */}
                <button
                  onClick={() => murottalService.close()}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Tutup Pemutar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Reciter Selector Dropdown Popover */}
            {showReciterModal && (
              <div className="p-3 rounded-2xl bg-slate-900/95 border border-white/10 space-y-1.5 animate-in fade-in duration-150">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pilih Suara Qari:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                  {AVAILABLE_RECITERS.map((r) => {
                    const isSelected = r.id === state.reciter.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          murottalService.setReciter(r);
                          setShowReciterModal(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                            : 'bg-slate-800/60 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-semibold">{r.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{r.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timeline Progress Bar Slider */}
            <div className="space-y-1">
              <div className="relative flex items-center group">
                <input
                  type="range"
                  min="0"
                  max={state.duration || 100}
                  step="0.1"
                  value={state.currentTime || 0}
                  onChange={(e) => murottalService.seek(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg accent-emerald-500 cursor-pointer transition-all"
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>{formatTime(state.currentTime)}</span>
                <span>{formatTime(state.duration)}</span>
              </div>
            </div>

            {/* Center Controls: Prev, Play/Pause, Next */}
            <div className="flex items-center justify-center gap-4 pt-0.5">
              <button
                onClick={() => murottalService.prevAyah()}
                disabled={!state.currentAyahNumber || state.currentAyahNumber <= 1}
                className="p-2 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Ayat Sebelumnya"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => murottalService.togglePlay()}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 transition-all cursor-pointer transform active:scale-95"
                title={state.isPlaying ? 'Jeda Audio' : 'Putar Audio'}
              >
                {state.isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={() => murottalService.nextAyah()}
                disabled={!state.currentAyahNumber || state.currentAyahNumber >= state.totalAyat}
                className="p-2 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Ayat Berikutnya"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
