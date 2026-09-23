import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin, Clock, Volume2, ChevronRight, Play, Heart, Compass, Plus, MoreHorizontal } from 'lucide-react';
import { Moment, Trip } from '../types';
import { playHapticClick, playVoiceNoteTone } from '../utils/audio';
import { AppScreen } from './AppScreen';
import { useViewport } from '../context/ViewportContext';

interface FeedScreenProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onSelectTripWithMoment?: (trip: Trip, momentId: string) => void;
  onOpenAddMoment?: () => void;
  onOpenMomentMenu?: (moment: Moment, trip: Trip) => void;
  footerContent?: React.ReactNode;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({
  trips,
  onSelectTrip,
  onSelectTripWithMoment,
  onOpenAddMoment,
  onOpenMomentMenu,
  footerContent,
}) => {
  const { isDesktop } = useViewport();
  const [likedMoments, setLikedMoments] = useState<string[]>(['b-1']);
  const [activeVoicePlaying, setActiveVoicePlaying] = useState<string | null>(null);

  // Compile all moments from all active trips into reverse chronological order
  const allMoments: { moment: Moment; trip: Trip }[] = [];
  trips.forEach((trip) => {
    trip.moments.forEach((moment) => {
      allMoments.push({ moment, trip });
    });
  });

  // Find "On this day" candidate (Bali moment with yearsAgo: 2)
  const onThisDayItem = allMoments.find((item) => item.moment.yearsAgo && item.moment.yearsAgo > 0) || allMoments[0];

  const handleLike = (id: string) => {
    playHapticClick();
    setLikedMoments((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleToggleVoice = (id: string) => {
    playHapticClick();
    if (activeVoicePlaying === id) {
      setActiveVoicePlaying(null);
    } else {
      setActiveVoicePlaying(id);
      playVoiceNoteTone(400, 0.15);
      setTimeout(() => setActiveVoicePlaying(null), 3000);
    }
  };

  const headerContent = (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-pulse" />
        <h2 className="text-sm font-bold text-white tracking-tight">Timeline Stream</h2>
      </div>
      <span className="text-[11px] text-white/50 font-mono uppercase tracking-wider">
        {allMoments.length} Captured Memories
      </span>
    </div>
  );

  const floatingAction = !isDesktop && onOpenAddMoment ? (
    <button
      id="floating-add-moment-feed"
      onClick={() => {
        playHapticClick();
        onOpenAddMoment();
      }}
      className="w-14 h-14 rounded-full bg-[#FF6B4A] hover:bg-[#ff5733] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(255,107,74,0.65),0_0_20px_rgba(255,107,74,0.4)] border border-white/20 transition-transform duration-150 active:scale-90 cursor-pointer"
      aria-label="Add new moment"
      title="Add new moment to trip"
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  ) : null;

  return (
    <AppScreen
      id="screen-feed"
      headerContent={headerContent}
      footerContent={footerContent}
      floatingAction={floatingAction}
      hasFab={!isDesktop && !!onOpenAddMoment}
    >
      <div className="space-y-6">
        {/* 'On this day' Module pinned to top */}
        {onThisDayItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="rounded-[32px] liquid-glass p-5 md:p-6 border border-[#FF6B4A]/50 shadow-xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 107, 74, 0.14) 0%, rgba(20, 20, 26, 0.85) 100%)',
            }}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B4A]/25 border border-[#FF6B4A]/50 text-[#FF6B4A] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles size={12} />
                <span>On This Day Flashback</span>
              </div>
              <span className="text-xs font-mono text-white/70">
                {onThisDayItem.moment.yearsAgo || 2} years ago in {onThisDayItem.trip.title}
              </span>
            </div>

            <div className="md:grid md:grid-cols-12 md:gap-5 items-center">
              {/* Photo */}
              {onThisDayItem.moment.photos?.[0] && (
                <div 
                  onClick={() => onSelectTripWithMoment ? onSelectTripWithMoment(onThisDayItem.trip, onThisDayItem.moment.id) : onSelectTrip(onThisDayItem.trip)}
                  className="md:col-span-6 relative h-48 md:h-56 rounded-2xl overflow-hidden mb-3 md:mb-0 cursor-pointer group shadow-lg"
                >
                  <img
                    src={onThisDayItem.moment.photos[0]}
                    alt={onThisDayItem.moment.location}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-semibold drop-shadow">{onThisDayItem.moment.location}</span>
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-6 space-y-3">
                <p className="font-['Playfair_Display',Georgia,serif] italic text-sm md:text-base text-white/95 leading-relaxed">
                  "{onThisDayItem.moment.caption}"
                </p>

                <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-[#FF6B4A]">
                    <Clock size={12} />
                    <span>Memory from {onThisDayItem.trip.dates}</span>
                  </div>
                  <button
                    onClick={() => onSelectTrip(onThisDayItem.trip)}
                    className="text-white hover:text-[#FF6B4A] transition-colors font-semibold flex items-center gap-1"
                  >
                    <span>Open Journal</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 
          MULTI-COLUMN RESPONSIVE FEED GRID:
          - Mobile (< 768px): 1 column
          - Tablet (768px - 1024px): 2 columns
          - Desktop (>= 1024px): 3 columns
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
          {allMoments.slice(1).map(({ moment, trip }, index) => {
            const isLiked = likedMoments.includes(moment.id);
            const isVoicePlaying = activeVoicePlaying === moment.id;

            return (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="rounded-[28px] liquid-glass p-4 md:p-5 border border-white/15 shadow-xl space-y-3.5 hover:border-white/25 transition-all duration-300"
              >
                {/* Author / Trip Header */}
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => onSelectTripWithMoment ? onSelectTripWithMoment(trip, moment.id) : onSelectTrip(trip)}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-[#FF6B4A] transition-colors">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-white/50">
                        <MapPin size={10} className="text-[#FF6B4A]" />
                        <span>{moment.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-white/40">
                    {moment.time}
                  </span>
                </div>

                {/* Media Content */}
                {moment.isVoiceNote ? (
                  <div className="p-3 rounded-2xl liquid-glass-subtle border border-white/10 flex items-center gap-3">
                    <button
                      onClick={() => handleToggleVoice(moment.id)}
                      className="w-10 h-10 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#FF6B4A]/30 active:scale-90 transition-transform"
                    >
                      <Play size={16} className={`ml-0.5 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
                    </button>
                    <div className="flex-1 flex items-center gap-1 h-7">
                      {[25, 45, 80, 50, 90, 60, 40, 70, 85, 30, 60, 45, 90, 40, 30].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isVoicePlaying ? 'bg-[#FF6B4A]' : 'bg-white/25'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-white/60">
                      {moment.audioDuration || '0:35'}
                    </span>
                  </div>
                ) : (
                  moment.photos?.[0] && (
                    <div 
                      onClick={() => onSelectTripWithMoment ? onSelectTripWithMoment(trip, moment.id) : onSelectTrip(trip)}
                      className="rounded-2xl overflow-hidden h-52 md:h-56 w-full relative cursor-pointer group shadow"
                    >
                      <img
                        src={moment.photos[0]}
                        alt={moment.location}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {moment.photos.length > 1 && (
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-white border border-white/20">
                          +{moment.photos.length - 1} more
                        </span>
                      )}
                    </div>
                  )
                )}

                {/* Caption */}
                <p className="font-['Playfair_Display',Georgia,serif] italic text-xs sm:text-sm text-white/90 leading-relaxed">
                  "{moment.caption}"
                </p>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs text-white/60">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {moment.tags?.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(moment.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        isLiked ? 'text-[#FF6B4A]' : 'text-white/40 hover:text-white'
                      }`}
                      aria-label="Favorite moment"
                    >
                      <Heart size={14} fill={isLiked ? '#FF6B4A' : 'none'} />
                      <span className="text-[10px] font-mono">{isLiked ? 1 : 0}</span>
                    </button>

                    {onOpenMomentMenu && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playHapticClick();
                          onOpenMomentMenu(moment, trip);
                        }}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all active:scale-90"
                        aria-label="Moment options"
                        title="Move or delete moment"
                      >
                        <MoreHorizontal size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skeleton Shimmer Loading */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/30 uppercase tracking-wider py-1 font-mono">
            <span>All Archived Journals Loaded</span>
          </div>
        </div>
      </div>
    </AppScreen>
  );
};
