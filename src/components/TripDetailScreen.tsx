import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Map, 
  Plus,
  MapPin,
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Trip, Moment, UserProfile } from '../types';
import { TripMapView } from './TripMapView';
import { playHapticClick, playVoiceNoteTone } from '../utils/audio';
import { getUserInitials } from '../utils/user';
import { AppScreen } from './AppScreen';
import { MomentCard } from './MomentCard';
import { useViewport } from '../context/ViewportContext';

interface TripDetailScreenProps {
  trip: Trip;
  user?: UserProfile;
  onBack: () => void;
  onOpenActionSheet: (trip: Trip) => void;
  onOpenAddMoment: () => void;
  onOpenMomentMenu?: (moment: Moment) => void;
  onPlayingAudioChange?: (isPlaying: boolean) => void;
  highlightedMomentId?: string | null;
  onClearHighlight?: () => void;
  footerContent?: React.ReactNode;
}

export const TripDetailScreen: React.FC<TripDetailScreenProps> = ({
  trip,
  user,
  onBack,
  onOpenActionSheet,
  onOpenAddMoment,
  onOpenMomentMenu,
  onPlayingAudioChange,
  highlightedMomentId,
  onClearHighlight,
  footerContent,
}) => {
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [isMapView, setIsMapView] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hasClickedAddBefore, setHasClickedAddBefore] = useState(() => {
    return localStorage.getItem('wander_has_added_moment') === 'true';
  });

  // Active audio player state
  const [playingMomentId, setPlayingMomentId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioIntervalRef = useRef<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const momentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Parallax scroll listener
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  // Scroll to highlighted moment if coming from map pin
  useEffect(() => {
    if (highlightedMomentId && momentRefs.current[highlightedMomentId]) {
      setTimeout(() => {
        momentRefs.current[highlightedMomentId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);

      const timer = setTimeout(() => {
        onClearHighlight?.();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [highlightedMomentId, onClearHighlight]);

  // Audio Playback Simulation
  const handleTogglePlayAudio = (momentId: string) => {
    playHapticClick();

    if (playingMomentId === momentId) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setPlayingMomentId(null);
      setAudioProgress(0);
      onPlayingAudioChange?.(false);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setPlayingMomentId(momentId);
      setAudioProgress(0);
      onPlayingAudioChange?.(true);
      playVoiceNoteTone(520, 0.15);

      audioIntervalRef.current = window.setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            setPlayingMomentId(null);
            onPlayingAudioChange?.(false);
            return 0;
          }
          return prev + 5;
        });
      }, 200);
    }
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  const handleAddMomentClick = () => {
    playHapticClick();
    if (!hasClickedAddBefore) {
      setHasClickedAddBefore(true);
      localStorage.setItem('wander_has_added_moment', 'true');
    }
    onOpenAddMoment();
  };

  // Group moments chronologically by day
  const sortedMoments = [...trip.moments].sort((a, b) => (a.dayNumber || 1) - (b.dayNumber || 1));
  const dayGroups = sortedMoments.reduce((acc, moment) => {
    const dayNum = moment.dayNumber || 1;
    const groupKey = moment.date || `Day ${dayNum}`;
    let group = acc.find((g) => g.groupKey === groupKey);
    if (!group) {
      group = {
        groupKey,
        dayNumber: dayNum,
        dayTitle: groupKey,
        moments: [],
      };
      acc.push(group);
    }
    group.moments.push(moment);
    return acc;
  }, [] as { groupKey: string; dayNumber: number; dayTitle: string; moments: Moment[] }[]);

  const headerContent = (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playHapticClick();
            onBack();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all"
          aria-label="Go back to trips"
        >
          <ChevronLeft size={18} />
        </button>

        <div>
          <h2 className="text-sm font-bold text-white tracking-tight leading-tight flex items-center gap-2">
            <span>{trip.title}</span>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">
              {trip.country}
            </span>
          </h2>
          <span className="text-[10px] text-white/50 tracking-wider font-mono block">
            {trip.dates} · {trip.moments.length} moments
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle Map Header Button (especially handy on tablet/desktop) */}
        <button
          onClick={() => {
            playHapticClick();
            setIsMapView(!isMapView);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isMapView
              ? 'bg-[#FF6B4A] text-white shadow-md'
              : 'liquid-glass-subtle border border-white/15 text-white/80 hover:text-white'
          }`}
        >
          <Map size={13} className={isMapView ? 'text-white' : 'text-[#FF6B4A]'} />
          <span className="hidden sm:inline">{isMapView ? 'Timeline View' : 'Route Map'}</span>
        </button>

        <button
          onClick={() => {
            playHapticClick();
            onOpenActionSheet(trip);
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all"
          aria-label="Trip options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );

  const floatingAction = !isMapView ? (
    <button
      id="floating-add-moment-button"
      onClick={handleAddMomentClick}
      className={`w-14 h-14 rounded-full bg-[#FF6B4A] hover:bg-[#ff5733] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(255,107,74,0.65),0_0_20px_rgba(255,107,74,0.4)] border border-white/20 transition-transform duration-150 active:scale-90 cursor-pointer ${
        !hasClickedAddBefore ? 'animate-bounce' : ''
      }`}
      aria-label="Add new moment"
      title="Add new moment to trip"
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  ) : null;

  return (
    <AppScreen
      id={`screen-trip-detail-${trip.id}`}
      headerContent={headerContent}
      footerContent={footerContent}
      floatingAction={floatingAction}
      hasFab={!isMapView}
      scrollRef={scrollContainerRef}
      onScroll={handleScroll}
    >
      {/* MAP VIEW: Expands full width on tablet and desktop */}
      {isMapView ? (
        <div className="h-[620px] md:h-[720px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <TripMapView
            trip={trip}
            onSelectMoment={(momentId) => {
              setIsMapView(false);
              setTimeout(() => {
                momentRefs.current[momentId]?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }, 150);
            }}
            onCloseMap={() => setIsMapView(false)}
          />
        </div>
      ) : (
        /* TIMELINE VIEW: Responsive 2-column bento on tablet and desktop, single-column on mobile */
        <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT SIDEBAR (Tablet & Desktop): Cover Hero & Stats Summary */}
          {/* ========================================================= */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4 space-y-4 md:sticky md:top-20 self-start">
            {/* Cover Hero Card */}
            <div className="relative rounded-[32px] overflow-hidden liquid-glass shadow-2xl border border-white/15 h-64 lg:h-72">
              <img
                src={trip.coverImage}
                alt={trip.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* 80px Clipped Typography */}
              <div className="absolute top-0 inset-x-0 h-[72px] overflow-hidden pointer-events-none px-4 flex items-end">
                <h2 className="text-[72px] leading-none font-black tracking-tighter text-white/20 uppercase select-none whitespace-nowrap">
                  {trip.displayTitle || trip.title}
                </h2>
              </div>

              <div className="absolute bottom-4 inset-x-4">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#FF6B4A] block mb-1">
                  {trip.country} · {trip.dates}
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight drop-shadow">
                  {trip.title}
                </h3>
              </div>
            </div>

            {/* Stats Summary Bento Card */}
            <div className="rounded-3xl liquid-glass p-4 border border-white/15 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="font-mono text-white/50 uppercase text-[10px]">Journal Summary</span>
                <span className="text-[#FF6B4A] font-semibold text-[11px] font-mono">
                  {trip.region}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <div className="p-2 rounded-2xl bg-white/5">
                  <span className="block text-base font-bold text-white tracking-tight">
                    {trip.moments.length}
                  </span>
                  <span className="block text-[9px] text-white/50 uppercase tracking-wider">
                    Moments
                  </span>
                </div>
                <div className="p-2 rounded-2xl bg-white/5">
                  <span className="block text-base font-bold text-white tracking-tight">
                    {trip.stats.daysCount || 5}
                  </span>
                  <span className="block text-[9px] text-white/50 uppercase tracking-wider">
                    Days
                  </span>
                </div>
                <div className="p-2 rounded-2xl bg-white/5">
                  <span className="block text-base font-bold text-white tracking-tight">
                    {trip.stats.distanceKm}
                  </span>
                  <span className="block text-[9px] text-white/50 uppercase tracking-wider">
                    Km
                  </span>
                </div>
              </div>

              {/* Journal Author Attribution */}
              {user && (
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-[10px] text-white/50 uppercase font-mono">Archived by</span>
                  <div className="flex items-center gap-1.5">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover border border-white/25"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FF6B4A]/30 to-[#ff8f75]/15 text-[8px] font-bold text-white flex items-center justify-center">
                        {user.name ? getUserInitials(user.name) : 'EX'}
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-white/90">
                      {user.name || 'Unnamed Explorer'}
                    </span>
                  </div>
                </div>
              )}

              {/* Map Route Card Trigger */}
              <div
                onClick={() => {
                  playHapticClick();
                  setIsMapView(true);
                }}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B4A]/20 text-[#FF6B4A] flex items-center justify-center">
                    <Map size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-[#FF6B4A] transition-colors">
                      Interactive Route Map
                    </span>
                    <span className="text-[10px] text-white/50 block font-mono">
                      {trip.moments.length} geotagged stops
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-white/40 group-hover:text-white transition-colors" />
              </div>

              {/* Prominent Desktop/Tablet Add Moment button */}
              <button
                onClick={handleAddMomentClick}
                className="w-full py-3 px-4 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-[#FF6B4A]/30 transition-transform active:scale-95 cursor-pointer"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add Moment to Trip</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MOBILE ONLY: Parallax Hero & Stats Row                     */}
          {/* ========================================================= */}
          <div className="md:hidden">
            {/* Parallax Hero Photo Header */}
            <div className="relative h-[250px] w-full -mx-4 -mt-4 mb-4 overflow-hidden [width:calc(100%+32px)]">
              <div
                className="absolute inset-0 w-full h-[320px] -top-8"
                style={{
                  transform: `translateY(${scrollY * 0.4}px)`,
                }}
              >
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0c]" />
              </div>

              {/* 84px Clipped Display Typography */}
              <div className="absolute bottom-2 inset-x-0 px-5 overflow-hidden pointer-events-none">
                <h1 className="text-[84px] font-black tracking-tighter text-white/20 select-none leading-[0.8] uppercase truncate mix-blend-overlay">
                  {trip.displayTitle || trip.title}
                </h1>
                <div className="absolute bottom-3 left-6">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B4A]">
                    JOURNAL ARCHIVE
                  </span>
                  <p className="text-xl font-black text-white tracking-tight drop-shadow-md">
                    {trip.title}
                  </p>
                  {user && (
                    <div className="flex items-center gap-1.5 mt-0.5 pointer-events-auto">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || 'User'}
                          referrerPolicy="no-referrer"
                          className="w-3.5 h-3.5 rounded-full object-cover border border-white/40"
                        />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-white/20 text-[7px] font-bold text-white flex items-center justify-center">
                          {user.name ? getUserInitials(user.name) : 'EX'}
                        </div>
                      )}
                      <span className="text-[10px] text-white/80 font-mono">
                        by {user.name || 'Explorer'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="-mt-3 mb-6 relative z-10 flex items-center justify-between gap-2">
              <div className="flex-1 liquid-glass rounded-2xl py-2 px-3 flex items-center justify-around border border-white/15 shadow-xl">
                <div className="text-center">
                  <span className="block text-[11px] font-bold text-white tracking-tight">
                    {trip.moments.length}
                  </span>
                  <span className="block text-[9px] text-white/50 uppercase tracking-wider">
                    Moments
                  </span>
                </div>
                <div className="w-[1px] h-5 bg-white/15" />
                <div className="text-center">
                  <span className="block text-[11px] font-bold text-white tracking-tight">
                    {trip.stats.daysCount || 5} days
                  </span>
                  <span className="block text-[9px] text-white/50 uppercase tracking-wider">
                    Duration
                  </span>
                </div>
                <div className="w-[1px] h-5 bg-white/15" />
                <div className="text-center">
                  <span className="block text-[11px] font-bold text-white tracking-tight">
                    {trip.stats.distanceKm.toLocaleString()} km
                  </span>
                  <span className="block text-[9px] text-white/50 uppercase tracking-wider">
                    Travel
                  </span>
                </div>
              </div>

              {/* Map Toggle Button */}
              <button
                id="trip-map-toggle-button"
                onClick={() => {
                  playHapticClick();
                  setIsMapView(true);
                }}
                className="h-11 px-3.5 rounded-2xl liquid-glass flex items-center gap-1.5 text-xs text-white/90 hover:text-white border border-white/20 active:scale-95 shadow-xl shrink-0"
                title="Toggle interactive route map"
              >
                <Map size={14} className="text-[#FF6B4A]" />
                <span className="text-[11px] font-semibold">Map</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TIMELINE FEED (All Viewports): Right column on Tablet/Desktop */}
          {/* ========================================================= */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            {dayGroups.map((group) => (
              <section key={group.groupKey} className="space-y-3">
                {/* Day-Group Header: rendered ONCE as a sibling strictly ABOVE this day's moment cards */}
                <div className="flex items-center justify-between px-1 py-1.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                    <h3 className="text-xs uppercase tracking-widest text-white/80 font-bold font-mono">
                      {group.dayTitle}
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#FF6B4A] font-semibold font-mono">
                    {group.moments.length} {group.moments.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                {/* Atomic Moment Cards for this day */}
                <div className="space-y-4">
                  {group.moments.map((moment, mIdx) => (
                    <MomentCard
                      key={moment.id}
                      moment={moment}
                      index={mIdx}
                      isHighlighted={highlightedMomentId === moment.id}
                      isPlaying={playingMomentId === moment.id}
                      audioProgress={audioProgress}
                      onTogglePlayAudio={handleTogglePlayAudio}
                      onOpenMenu={onOpenMomentMenu}
                      hasFabClearance={true}
                      ref={(el) => {
                        momentRefs.current[moment.id] = el;
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </AppScreen>
  );
};
