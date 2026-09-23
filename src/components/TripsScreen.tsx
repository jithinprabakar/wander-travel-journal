import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronDown, MoreHorizontal, MapPin, Sparkles, Filter, Compass, Plus } from 'lucide-react';
import { Trip, RegionType } from '../types';
import { playHapticClick } from '../utils/audio';
import { AppScreen } from './AppScreen';
import { useViewport } from '../context/ViewportContext';

interface TripsScreenProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onOpenActionSheet: (trip: Trip) => void;
  onOpenCalendarFilter?: () => void;
  onOpenAddMoment?: () => void;
  onOpenCreateTrip?: () => void;
  footerContent?: React.ReactNode;
}

export const TripsScreen: React.FC<TripsScreenProps> = ({
  trips,
  onSelectTrip,
  onOpenActionSheet,
  onOpenCalendarFilter,
  onOpenAddMoment,
  onOpenCreateTrip,
  footerContent,
}) => {
  const { isDesktop } = useViewport();
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('Asia');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  // Long press tracking for cards
  const longPressTimerRef = useRef<number | null>(null);
  const [pressedTripId, setPressedTripId] = useState<string | null>(null);
  const isLongPressedTriggered = useRef(false);

  const touchStartY = useRef(0);

  const regions: RegionType[] = ['Asia', 'Europe', 'Americas', 'All'];

  const filteredTrips = trips.filter((t) => {
    if (selectedRegion === 'All') return !t.archived;
    return t.region === selectedRegion && !t.archived;
  });

  // Pull to refresh simulation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0 && e.currentTarget.scrollTop <= 0) {
      setPullDistance(Math.min(diff * 0.4, 70));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 45) {
      setIsRefreshing(true);
      playHapticClick();
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 900);
    } else {
      setPullDistance(0);
    }
  };

  // Card touch handlers for long press (300ms)
  const handleCardTouchStart = (trip: Trip) => {
    isLongPressedTriggered.current = false;
    setPressedTripId(trip.id);
    longPressTimerRef.current = window.setTimeout(() => {
      isLongPressedTriggered.current = true;
      playHapticClick();
      onOpenActionSheet(trip);
      setPressedTripId(null);
    }, 320);
  };

  const handleCardTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setPressedTripId(null);
  };

  const handleCardClick = (trip: Trip) => {
    if (!isLongPressedTriggered.current) {
      playHapticClick();
      onSelectTrip(trip);
    }
  };

  const headerContent = (
    <div className="w-full flex items-center justify-between">
      {/* Mobile: Dropdown Pill. Tablet/Desktop: Inline Region Filter Pills */}
      <div className="flex items-center gap-2">
        {/* Mobile Dropdown */}
        <div className="relative md:hidden">
          <button
            onClick={() => {
              playHapticClick();
              setIsRegionDropdownOpen(!isRegionDropdownOpen);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-subtle border border-white/15 text-xs font-semibold text-white tracking-wide active:scale-95 transition-all shadow-sm"
          >
            <span>{selectedRegion}</span>
            <ChevronDown size={13} className={`text-white/60 transition-transform ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isRegionDropdownOpen && (
            <div className="absolute top-10 left-0 w-32 rounded-2xl liquid-glass-dark border border-white/20 p-1.5 shadow-2xl z-50">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    playHapticClick();
                    setSelectedRegion(region);
                    setIsRegionDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedRegion === region
                      ? 'bg-[#FF6B4A] text-white font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tablet & Desktop Inline Region Pills */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full liquid-glass-subtle border border-white/10">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => {
                playHapticClick();
                setSelectedRegion(region);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedRegion === region
                  ? 'bg-[#FF6B4A] text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Center brand mark on mobile and tablet */}
      <div className="text-center lg:hidden">
        <span className="text-[13px] font-black tracking-widest text-white/90 uppercase">
          Wander
        </span>
      </div>

      {/* Desktop Title & Subtitle */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-white/40">
          Showing {filteredTrips.length} Destinations
        </span>
      </div>

      {/* Right Controls: Calendar Filter Icon & New trip */}
      <div className="flex items-center gap-2">
        {onOpenCreateTrip && (
          <button
            onClick={() => {
              playHapticClick();
              onOpenCreateTrip();
            }}
            id="header-create-trip-button"
            className="h-8 px-3 rounded-full bg-[#FF6B4A]/20 hover:bg-[#FF6B4A]/30 border border-[#FF6B4A]/40 flex items-center gap-1.5 text-xs text-[#FF6B4A] hover:text-white active:scale-95 transition-all shadow-sm font-semibold"
            title="Start a new trip"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span className="font-semibold text-[11px]">New Trip</span>
          </button>
        )}

        <button
          onClick={() => {
            playHapticClick();
            onOpenCalendarFilter?.();
          }}
          className="h-8 px-3 rounded-full liquid-glass-subtle border border-white/15 flex items-center gap-1.5 text-xs text-white/80 hover:text-white active:scale-95 transition-all shadow-sm"
          title="Timeline filter"
        >
          <Calendar size={14} className="text-[#FF6B4A]" />
          <span className="hidden sm:inline font-medium text-[11px]">Timeline Index</span>
        </button>
      </div>
    </div>
  );

  const floatingAction = !isDesktop && onOpenAddMoment ? (
    <button
      id="floating-add-moment-trips"
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
      id="screen-trips"
      headerContent={headerContent}
      footerContent={footerContent}
      floatingAction={floatingAction}
      hasFab={!isDesktop && !!onOpenAddMoment}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Ripple Effect */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          style={{ height: `${pullDistance}px` }}
          className="flex items-center justify-center transition-all duration-200 overflow-hidden"
        >
          <div className="w-10 h-10 rounded-full liquid-glass border border-white/25 flex items-center justify-center shadow-lg">
            <span className={`w-3 h-3 rounded-full bg-[#FF6B4A] transition-all ${isRefreshing ? 'animate-ping' : 'scale-100'}`} />
          </div>
        </div>
      )}

      {/* 
        RESPONSIVE DESTINATION CARDS GRID:
        - Mobile (< 768px): 1 column
        - Tablet (768px - 1024px): 2 columns
        - Desktop (>= 1024px): 3 or 4 columns
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredTrips.map((trip, index) => {
          const isPressed = pressedTripId === trip.id;

          return (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.12 + index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`relative w-full h-80 md:h-[350px] lg:h-[380px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-300 group ${
                isPressed ? 'scale-[0.98]' : 'hover:scale-[1.015] hover:shadow-2xl'
              }`}
              style={{
                boxShadow: '0 12px 35px -8px rgba(0, 0, 0, 0.7)',
              }}
              onTouchStart={() => handleCardTouchStart(trip)}
              onTouchEnd={handleCardTouchEnd}
              onMouseDown={() => handleCardTouchStart(trip)}
              onMouseUp={handleCardTouchEnd}
              onClick={() => handleCardClick(trip)}
            >
              {/* Cover Image Background */}
              <img
                src={trip.coverImage}
                alt={trip.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Sophisticated Dark Gradient Wash */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 group-hover:from-black/90 transition-colors" />

              {/* 88px Display Typography anchored to bottom of 80px container */}
              <div className="absolute top-0 inset-x-0 h-[80px] overflow-hidden pointer-events-none px-4 flex items-end">
                <h2 className="text-[88px] leading-none font-black tracking-tighter text-white/18 uppercase select-none whitespace-nowrap group-hover:text-white/25 transition-colors">
                  {trip.displayTitle || trip.title}
                </h2>
              </div>

              {/* Top Card Pills & Menu */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full liquid-glass-pill text-[10px] font-semibold text-white/90 shadow">
                  {trip.country}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playHapticClick();
                    onOpenActionSheet(trip);
                  }}
                  className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/90 hover:text-white shadow active:scale-90 transition-transform"
                  aria-label="Trip options"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-5 inset-x-5 z-10">
                <div className="flex items-center gap-1.5 text-[11px] text-[#FF6B4A] font-semibold uppercase tracking-wider mb-1">
                  <MapPin size={12} />
                  <span>{trip.dates}</span>
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                  {trip.title}
                </h3>

                {/* Card Stats Pills */}
                <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
                  <div className="px-2.5 py-1 rounded-full liquid-glass-subtle border border-white/15 text-white/80 text-[11px]">
                    <span className="font-semibold text-white">{trip.moments.length}</span> moments
                  </div>
                  <div className="px-2.5 py-1 rounded-full liquid-glass-subtle border border-white/15 text-white/80 text-[11px]">
                    <span className="font-semibold text-white">{trip.stats.daysCount || 5}</span> days
                  </div>
                  <div className="px-2.5 py-1 rounded-full liquid-glass-subtle border border-white/15 text-white/80 text-[11px]">
                    <span className="font-semibold text-white">{trip.stats.distanceKm}</span> km
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Dedicated "+ New Trip" card alongside existing destination cards */}
        {onOpenCreateTrip && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: filteredTrips.length * 0.05 }}
            onClick={() => {
              playHapticClick();
              onOpenCreateTrip();
            }}
            id="create-new-trip-grid-card"
            className="group relative h-80 md:h-[350px] lg:h-[380px] rounded-[32px] overflow-hidden border-2 border-dashed border-white/20 hover:border-[#FF6B4A]/70 liquid-glass p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-white/[0.04] active:scale-[0.98] shadow-lg"
          >
            <div className="w-16 h-16 rounded-full bg-[#FF6B4A]/15 border border-[#FF6B4A]/30 text-[#FF6B4A] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#FF6B4A] group-hover:text-white transition-all shadow-lg shadow-[#FF6B4A]/20">
              <Plus size={30} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF6B4A] mb-1">
              New Destination
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              Start a New Trip
            </h3>
            <p className="text-xs text-white/50 max-w-[200px] leading-relaxed">
              Create a fresh journal archive with dates, country & moments
            </p>
            <div className="mt-5 px-4 py-1.5 rounded-full liquid-glass-subtle border border-white/15 text-white/70 text-xs font-semibold group-hover:border-[#FF6B4A]/50 group-hover:text-white transition-colors">
              + Create Trip
            </div>
          </motion.div>
        )}
      </div>
    </AppScreen>
  );
};
