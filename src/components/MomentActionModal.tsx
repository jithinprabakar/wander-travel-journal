import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  ArrowRightLeft, 
  MapPin, 
  ChevronLeft, 
  Plus, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { Moment, Trip } from '../types';
import { playHapticClick } from '../utils/audio';

interface MomentActionModalProps {
  isOpen: boolean;
  moment: Moment | null;
  currentTrip: Trip | null;
  trips: Trip[];
  onClose: () => void;
  onMoveMoment: (momentId: string, fromTripId: string, toTripId: string) => void;
  onDeleteMoment: (momentId: string, tripId: string) => void;
  onOpenCreateTripAndMove: (moment: Moment) => void;
}

export const MomentActionModal: React.FC<MomentActionModalProps> = ({
  isOpen,
  moment,
  currentTrip,
  trips,
  onClose,
  onMoveMoment,
  onDeleteMoment,
  onOpenCreateTripAndMove,
}) => {
  const [view, setView] = useState<'menu' | 'move-trip' | 'confirm-delete'>('menu');

  if (!isOpen || !moment) return null;

  const otherTrips = trips.filter((t) => t.id !== (currentTrip?.id || moment.tripId));

  const handleClose = () => {
    setView('menu');
    onClose();
  };

  const handleSelectTargetTrip = (targetTripId: string) => {
    playHapticClick();
    const fromTripId = currentTrip?.id || moment.tripId;
    onMoveMoment(moment.id, fromTripId, targetTripId);
    handleClose();
  };

  const handleConfirmDelete = () => {
    playHapticClick();
    const tripId = currentTrip?.id || moment.tripId;
    onDeleteMoment(moment.id, tripId);
    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-[32px] liquid-glass-dark border border-white/20 p-5 md:p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              {view !== 'menu' && (
                <button
                  onClick={() => {
                    playHapticClick();
                    setView('menu');
                  }}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B4A]">
                  Moment Options
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {view === 'menu' && 'Manage Moment'}
                  {view === 'move-trip' && 'Move to Different Trip'}
                  {view === 'confirm-delete' && 'Delete Moment'}
                </h3>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Moment Card Preview Snippet */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 flex items-center gap-3">
            {moment.photos?.[0] ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/15">
                <img
                  src={moment.photos[0]}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#FF6B4A]/20 border border-[#FF6B4A]/30 flex items-center justify-center text-[#FF6B4A] shrink-0 text-xs font-bold font-mono">
                {moment.audioDuration || 'Audio'}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#FF6B4A] truncate">
                <MapPin size={11} className="shrink-0" />
                <span className="truncate">{moment.location}</span>
              </div>
              <p className="text-xs text-white/80 italic truncate mt-0.5 font-['Playfair_Display',Georgia,serif]">
                "{moment.caption}"
              </p>
              <span className="text-[10px] text-white/40 font-mono block mt-0.5">
                Currently filed under: {currentTrip?.title || moment.tripTitle}
              </span>
            </div>
          </div>

          {/* VIEW 1: MAIN MENU */}
          {view === 'menu' && (
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  playHapticClick();
                  setView('move-trip');
                }}
                className="w-full p-3.5 rounded-2xl liquid-glass border border-white/15 hover:border-white/30 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-[#FF6B4A] text-white flex items-center justify-center transition-colors">
                    <ArrowRightLeft size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Move to a Different Trip
                    </span>
                    <span className="text-[10px] text-white/50 block">
                      Reassign this moment to another destination archive
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  playHapticClick();
                  setView('confirm-delete');
                }}
                className="w-full p-3.5 rounded-2xl liquid-glass border border-red-500/20 hover:border-red-500/40 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white flex items-center justify-center transition-colors">
                    <Trash2 size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-300 block">
                      Delete Moment
                    </span>
                    <span className="text-[10px] text-red-300/60 block">
                      Permanently remove this moment from the trip
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* VIEW 2: MOVE TO A DIFFERENT TRIP */}
          {view === 'move-trip' && (
            <div className="space-y-3">
              <p className="text-xs text-white/70">
                Select an existing destination to move this moment into:
              </p>

              {/* List of existing other trips */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                {otherTrips.length === 0 && (
                  <div className="p-3 rounded-xl bg-white/5 text-center text-xs text-white/50">
                    No other existing trips found.
                  </div>
                )}

                {otherTrips.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTargetTrip(t.id)}
                    className="w-full p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-left flex items-center justify-between group transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/20">
                        <img
                          src={t.coverImage}
                          alt={t.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-white block group-hover:text-[#FF6B4A] transition-colors truncate">
                          {t.title}
                        </span>
                        <span className="text-[10px] text-white/50 font-mono block">
                          {t.country} · {t.dates}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-semibold group-hover:bg-[#FF6B4A] group-hover:text-white transition-colors">
                      Move Here
                    </span>
                  </button>
                ))}
              </div>

              {/* Start a new trip option */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    playHapticClick();
                    onOpenCreateTripAndMove(moment);
                    handleClose();
                  }}
                  className="w-full p-3 rounded-2xl border-2 border-dashed border-[#FF6B4A]/50 hover:border-[#FF6B4A] bg-[#FF6B4A]/10 hover:bg-[#FF6B4A]/20 flex items-center justify-center gap-2 text-xs font-bold text-white transition-all active:scale-95"
                >
                  <Plus size={16} className="text-[#FF6B4A]" />
                  <span>Start a New Trip & Move Here</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: CONFIRM DELETE */}
          {view === 'confirm-delete' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
                <AlertTriangle size={24} />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  Delete this moment?
                </h4>
                <p className="text-xs text-white/60 max-w-xs mx-auto">
                  This photo and note will be permanently removed from{' '}
                  <span className="text-white font-semibold">{currentTrip?.title || moment.tripTitle}</span>. This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playHapticClick();
                    setView('menu');
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  id="confirm-delete-moment-button"
                  className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Delete Moment</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
