import React from 'react';
import { X, BookOpen, Share2, Check } from 'lucide-react';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  tafsirText: string | null;
  isLoading: boolean;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  isOpen,
  onClose,
  surahName,
  ayahNumber,
  tafsirText,
  isLoading,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (tafsirText) {
      navigator.clipboard.writeText(`Tafsir ${surahName} Ayat ${ayahNumber} (Kemenag RI):\n\n${tafsirText}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl glass-panel-elevated border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Tafsir Kemenag RI — QS. {surahName} : {ayahNumber}
              </h2>
              <p className="text-xs text-slate-400">Lajnah Pentashihan Mushaf Al-Qur'an Kementerian Agama</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Salin Tafsir"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <p className="text-xs">Memuat penjelasan tafsir resmi...</p>
            </div>
          ) : tafsirText ? (
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-3 font-normal">
              {tafsirText}
            </div>
          ) : (
            <p className="text-center py-8 text-sm text-slate-400">
              Tafsir untuk ayat ini belum tersedia.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Sumber: Aplikasi Qur'an Kemenag RI
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
