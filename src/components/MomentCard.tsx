import React, { forwardRef, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, Volume2, Play, Pause, MoreHorizontal } from 'lucide-react';
import { Moment } from '../types';
import { playHapticClick } from '../utils/audio';

export interface MomentCardProps {
  moment: Moment;
  index?: number;
  isHighlighted?: boolean;
  isPlaying?: boolean;
  audioProgress?: number;
  onTogglePlayAudio?: (momentId: string) => void;
  onOpenMenu?: (moment: Moment) => void;
  hasFabClearance?: boolean;
}

/**
 * MomentCard - Atomic Card Component
 *
 * Encapsulates a complete moment (photos/voice waveform, caption, metadata) as a single
 * atomic visual unit. It is never split across render boundaries and never interrupted
 * by day dividers.
 */
export const MomentCard = forwardRef<HTMLDivElement, MomentCardProps>(
  (
    {
      moment,
      index = 0,
      isHighlighted = false,
      isPlaying = false,
      audioProgress = 0,
      onTogglePlayAudio,
      onOpenMenu,
      hasFabClearance = false,
    },
    ref
  ) => {
    const isVoice = moment.isVoiceNote;
    const isSinglePhoto = moment.photos?.length === 1;
    const longPressTimerRef = useRef<number | null>(null);

    const handleTouchStart = () => {
      if (!onOpenMenu) return;
      longPressTimerRef.current = window.setTimeout(() => {
        playHapticClick();
        onOpenMenu(moment);
      }, 450);
    };

    const handleTouchEnd = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };

    return (
      <motion.article
        ref={ref}
        id={`moment-card-${moment.id}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
        className={`rounded-[24px] liquid-glass p-3.5 border transition-all shadow-xl overflow-hidden relative group ${
          isHighlighted
            ? 'ring-2 ring-[#FF6B4A] scale-[1.02] border-[#FF6B4A]/60'
            : 'border-white/15 hover:border-white/25'
        }`}
      >
        {/* 1. Content: Audio Voice Note OR Photos */}
        {isVoice ? (
          <div className="py-1">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <Volume2 size={14} className="text-[#FF6B4A]" />
                <span className="font-semibold text-[11px] tracking-wide">Audio Journal Note</span>
              </div>
              <span className="text-[10px] font-mono text-white/50">
                {moment.audioDuration || '0:42'}
              </span>
            </div>

            {/* Liquid Glass Waveform Player */}
            <div className="p-3 rounded-2xl liquid-glass-subtle border border-white/10 flex items-center gap-3">
              <button
                onClick={() => onTogglePlayAudio?.(moment.id)}
                className="w-10 h-10 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#FF6B4A]/30 active:scale-90 transition-all"
                aria-label={isPlaying ? 'Pause audio note' : 'Play audio note'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>

              {/* Waveform graphic bars with playback fill */}
              <div className="flex-1 flex items-center gap-1 h-8">
                {(
                  moment.waveform || [
                    30, 50, 80, 40, 90, 60, 45, 75, 95, 30, 70, 50, 85, 40, 60, 30,
                  ]
                ).map((barH, bIdx) => {
                  const barPercent = (bIdx / (moment.waveform?.length || 16)) * 100;
                  const isFilled = isPlaying && audioProgress >= barPercent;

                  return (
                    <div
                      key={bIdx}
                      style={{ height: `${Math.max(20, barH)}%` }}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isFilled
                          ? 'bg-[#FF6B4A]'
                          : isPlaying
                          ? 'bg-white/40'
                          : 'bg-white/20'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Clip duration */}
              <span className="font-mono text-[10px] font-semibold text-white/80 shrink-0 px-2 py-0.5 rounded-md bg-white/10">
                {moment.audioDuration || '0:42'}
              </span>
            </div>
          </div>
        ) : (
          moment.photos?.length > 0 && (
            <div className="mb-3">
              {isSinglePhoto ? (
                <div className="rounded-2xl overflow-hidden h-52 w-full relative">
                  <img
                    src={moment.photos[0]}
                    alt={moment.location}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                /* 2-up atomic photo grid */
                <div className="grid grid-cols-2 gap-2 h-44 rounded-2xl overflow-hidden">
                  {moment.photos.slice(0, 2).map((photoUrl, pIdx) => (
                    <div key={pIdx} className="relative h-full w-full overflow-hidden rounded-xl">
                      <img
                        src={photoUrl}
                        alt={`Moment photo ${pIdx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {/* 2. Caption in deliberate warm journal voice (italic serif) */}
        <p className="font-['Playfair_Display',Georgia,serif] italic text-white/90 text-sm leading-relaxed mb-3">
          "{moment.caption}"
        </p>

        {/* 3. Bottom Metadata Row: Location, Pin, Timestamp & Tags */}
        <div
          className={`flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-white/50 ${
            hasFabClearance ? 'pr-12' : ''
          }`}
        >
          <div className="flex items-center gap-1.5 truncate max-w-[190px]">
            <MapPin size={11} className="text-[#FF6B4A] shrink-0" />
            <span className="truncate text-white/80 font-medium">{moment.location}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {moment.tags?.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[9px] text-white/70">
                {moment.tags[0]}
              </span>
            )}
            <span className="text-[10px] font-mono text-white/50">{moment.time}</span>

            {onOpenMenu && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playHapticClick();
                  onOpenMenu(moment);
                }}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all active:scale-90 ml-0.5"
                aria-label="Moment options"
                title="Options for this moment"
              >
                <MoreHorizontal size={13} />
              </button>
            )}
          </div>
        </div>
      </motion.article>
    );
  }
);

MomentCard.displayName = 'MomentCard';
