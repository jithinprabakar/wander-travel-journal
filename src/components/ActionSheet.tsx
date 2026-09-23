import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, Archive, Trash2, X, Check, Copy } from 'lucide-react';
import { Trip } from '../types';
import { playHapticClick } from '../utils/audio';

interface ActionSheetProps {
  isOpen: boolean;
  trip: Trip | null;
  onClose: () => void;
  onArchive: (tripId: string) => void;
  onDelete: (tripId: string) => void;
  onTriggerPaywall: () => void;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  trip,
  onClose,
  onArchive,
  onDelete,
  onTriggerPaywall,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareStep, setShareStep] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen || !trip) return null;

  const handleShare = () => {
    playHapticClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out my journal on Wander: ${trip.title}, ${trip.country} • ${trip.moments.length} moments`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
    setShareStep(true);
  };

  const handleExport = () => {
    playHapticClick();
    // Check if free or pro - trigger paywall or generate JSON export
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Wander_${trip.title}_Journal.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice('Exported Wander Journal JSON. Pro PDF layout available in Wander Pro.');
    setTimeout(() => {
      setExportNotice(null);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
        {/* Backdrop tap to dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full rounded-t-[36px] liquid-glass-dark p-5 pb-8 border-t border-white/20 shadow-2xl z-10"
        >
          {/* Top handle pill */}
          <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#FF6B4A] font-semibold">Trip Options</p>
              <h3 className="text-lg font-bold text-white tracking-tight">{trip.title}, {trip.country}</h3>
              <p className="text-xs text-white/50">{trip.dates} · {trip.moments.length} moments</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {exportNotice && (
            <div className="mb-4 p-3 rounded-2xl bg-[#FF6B4A]/20 border border-[#FF6B4A]/40 text-xs text-white flex items-center gap-2">
              <Check size={14} className="text-[#FF6B4A]" />
              <span>{exportNotice}</span>
            </div>
          )}

          {shareStep ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/80 truncate max-w-[200px]">
                  wander.app/t/{trip.id}
                </span>
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-full bg-[#FF6B4A] text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <button
                onClick={() => setShareStep(false)}
                className="w-full py-2.5 rounded-2xl bg-white/10 text-white text-xs font-medium"
              >
                Back to Options
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                id="action-share-trip"
                onClick={handleShare}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl liquid-glass-subtle hover:bg-white/10 text-white text-left transition-all active:scale-98"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/90">
                  <Share2 size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold">Share Trip Story</div>
                  <div className="text-xs text-white/50">Invite friends or copy web link</div>
                </div>
              </button>

              <button
                id="action-export-trip"
                onClick={handleExport}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl liquid-glass-subtle hover:bg-white/10 text-white text-left transition-all active:scale-98"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#FF6B4A]">
                  <Download size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span>Export Journal</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] font-semibold border border-[#FF6B4A]/30">PDF / JSON</span>
                  </div>
                  <div className="text-xs text-white/50">Export timeline with high-res photos</div>
                </div>
              </button>

              <button
                id="action-archive-trip"
                onClick={() => {
                  playHapticClick();
                  onArchive(trip.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl liquid-glass-subtle hover:bg-white/10 text-white text-left transition-all active:scale-98"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Archive size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold">Archive Trip</div>
                  <div className="text-xs text-white/50">Move to archived journals</div>
                </div>
              </button>

              <button
                id="action-delete-trip"
                onClick={() => {
                  playHapticClick();
                  onDelete(trip.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-left transition-all active:scale-98 border border-red-500/20"
              >
                <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                  <Trash2 size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-red-400">Delete Trip</div>
                  <div className="text-xs text-red-400/60">Permanently remove from device</div>
                </div>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
