import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, Trip, Moment, UserProfile } from './types';
import { initialTrips, initialUser } from './data/travelData';
import { defaultEmptyUser } from './utils/user';
import { PhoneFrame } from './components/PhoneFrame';
import { NavigationBar } from './components/NavigationBar';
import { TripsScreen } from './components/TripsScreen';
import { TripDetailScreen } from './components/TripDetailScreen';
import { FeedScreen } from './components/FeedScreen';
import { AccountScreen } from './components/AccountScreen';
import { AddMomentSheet } from './components/AddMomentSheet';
import { ActionSheet } from './components/ActionSheet';
import { PaywallSheet } from './components/PaywallSheet';
import { CalendarModal } from './components/CalendarModal';
import { CreateTripModal } from './components/CreateTripModal';
import { MomentActionModal } from './components/MomentActionModal';
import { ViewportProvider } from './context/ViewportContext';
import { Check } from 'lucide-react';

function WanderApp() {
  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('trips');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('trips');
  
  // Data State
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('wander_trips');
    if (!saved) return initialTrips;
    try {
      const parsed: Trip[] = JSON.parse(saved);
      // Ensure the Ooty photo stuck in Kyoto is seeded if not present
      const kyotoTrip = parsed.find((t) => t.id === 'kyoto');
      if (kyotoTrip && !kyotoTrip.moments.some((m) => m.id === 'k-ooty')) {
        const ootyMoment: Moment = {
          id: 'k-ooty',
          tripId: 'kyoto',
          tripTitle: 'Kyoto',
          tripCover: kyotoTrip.coverImage,
          date: 'Day 3 — Mar 14',
          dayNumber: 3,
          time: '02:30 PM',
          location: 'Tea Estates, Ooty, India',
          coordinates: { lat: 11.4102, lng: 76.6950, x: 72, y: 80 },
          caption: 'Morning mist rolling across the emerald tea terraces of the Nilgiris hills.',
          photos: [
            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80'
          ],
          tags: ['Nature', 'Hike']
        };
        kyotoTrip.moments.push(ootyMoment);
        kyotoTrip.stats.momentsCount = kyotoTrip.moments.length;
        localStorage.setItem('wander_trips', JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return initialTrips;
    }
  });

  const [activeTrip, setActiveTrip] = useState<Trip>(trips[0] || initialTrips[0]);
  const [highlightedMomentId, setHighlightedMomentId] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wander_user');
    const isEdited = localStorage.getItem('wander_user_edited');
    if (saved && isEdited === 'true') {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Brand new user who hasn't set up a profile yet
    return defaultEmptyUser;
  });

  // Modal & Sheet States
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [actionSheetTrip, setActionSheetTrip] = useState<Trip | null>(null);
  const [isAddMomentOpen, setIsAddMomentOpen] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Moment Action Modal (Move / Delete)
  const [isMomentMenuOpen, setIsMomentMenuOpen] = useState(false);
  const [selectedMomentForMenu, setSelectedMomentForMenu] = useState<Moment | null>(null);
  const [selectedTripForMenu, setSelectedTripForMenu] = useState<Trip | null>(null);

  // Floating Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Dynamic Island Audio Indicators
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  // Synchronize to localStorage
  const updateTrips = (newTrips: Trip[]) => {
    setTrips(newTrips);
    localStorage.setItem('wander_trips', JSON.stringify(newTrips));
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    const newUser = { ...user, ...updated };
    setUser(newUser);
    localStorage.setItem('wander_user', JSON.stringify(newUser));
  };

  // Screen Navigation Handlers
  const handleNavigateTo = (screen: ScreenType) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleSelectTrip = (trip: Trip) => {
    setActiveTrip(trip);
    handleNavigateTo('trip-detail');
  };

  const handleSelectTripWithMoment = (trip: Trip, momentId: string) => {
    setActiveTrip(trip);
    setHighlightedMomentId(momentId);
    handleNavigateTo('trip-detail');
  };

  // Action Sheet Handlers
  const handleOpenActionSheet = (trip: Trip) => {
    setActionSheetTrip(trip);
    setIsActionSheetOpen(true);
  };

  const handleArchiveTrip = (tripId: string) => {
    const updated = trips.map((t) => (t.id === tripId ? { ...t, archived: !t.archived } : t));
    updateTrips(updated);
  };

  const handleDeleteTrip = (tripId: string) => {
    const updated = trips.filter((t) => t.id !== tripId);
    updateTrips(updated);
    if (activeTrip?.id === tripId) {
      setCurrentScreen('trips');
    }
  };

  // Create New Trip Handler
  const handleCreateTrip = (newTrip: Trip) => {
    const updated = [newTrip, ...trips];
    updateTrips(updated);
    setActiveTrip(newTrip);
    updateUser({
      stats: {
        ...user.stats,
        trips: user.stats.trips + 1,
      }
    });
    triggerToast(`Created "${newTrip.title}" trip archive`);
  };

  // Open Moment Menu Handler
  const handleOpenMomentMenu = (moment: Moment, trip?: Trip) => {
    const matchedTrip = trip || trips.find((t) => t.id === moment.tripId) || activeTrip;
    setSelectedMomentForMenu(moment);
    setSelectedTripForMenu(matchedTrip);
    setIsMomentMenuOpen(true);
  };

  // Move Moment Handler
  const handleMoveMoment = (momentId: string, fromTripId: string, toTripId: string) => {
    const targetTrip = trips.find((t) => t.id === toTripId);
    if (!targetTrip) return;

    let movedMoment: Moment | null = null;

    const updatedTrips = trips.map((t) => {
      if (t.id === fromTripId) {
        const found = t.moments.find((m) => m.id === momentId);
        if (found) {
          movedMoment = {
            ...found,
            tripId: targetTrip.id,
            tripTitle: targetTrip.title,
            tripCover: targetTrip.coverImage,
          };
        }
        return {
          ...t,
          moments: t.moments.filter((m) => m.id !== momentId),
          stats: {
            ...t.stats,
            momentsCount: Math.max(0, t.moments.length - 1),
          }
        };
      }
      return t;
    }).map((t) => {
      if (t.id === toTripId && movedMoment) {
        return {
          ...t,
          moments: [movedMoment, ...t.moments],
          stats: {
            ...t.stats,
            momentsCount: t.moments.length + 1,
          }
        };
      }
      return t;
    });

    updateTrips(updatedTrips);

    // Refresh activeTrip if currently viewing either trip
    if (activeTrip?.id === fromTripId) {
      const refreshed = updatedTrips.find((t) => t.id === fromTripId);
      if (refreshed) setActiveTrip(refreshed);
    } else if (activeTrip?.id === toTripId) {
      const refreshed = updatedTrips.find((t) => t.id === toTripId);
      if (refreshed) setActiveTrip(refreshed);
    }

    triggerToast(`Moved moment to "${targetTrip.title}"`);
  };

  // Delete Moment Handler
  const handleDeleteMoment = (momentId: string, tripId: string) => {
    const updatedTrips = trips.map((t) => {
      if (t.id === tripId) {
        return {
          ...t,
          moments: t.moments.filter((m) => m.id !== momentId),
          stats: {
            ...t.stats,
            momentsCount: Math.max(0, t.moments.length - 1),
          }
        };
      }
      return t;
    });

    updateTrips(updatedTrips);

    if (activeTrip?.id === tripId) {
      const refreshed = updatedTrips.find((t) => t.id === tripId);
      if (refreshed) setActiveTrip(refreshed);
    }

    updateUser({
      stats: {
        ...user.stats,
        moments: Math.max(0, user.stats.moments - 1),
      }
    });

    triggerToast('Moment deleted');
  };

  // Create Trip and Move Moment Handler
  const handleCreateTripAndMove = (moment: Moment) => {
    setIsCreateTripOpen(true);
  };

  // Add Moment Handler (Target Trip is explicitly passed!)
  const handleAddMoment = (newMoment: Moment, targetTripId: string) => {
    const targetTrip = trips.find((t) => t.id === targetTripId) || activeTrip;

    const updatedTrips = trips.map((t) => {
      if (t.id === targetTrip.id) {
        return {
          ...t,
          moments: [newMoment, ...t.moments],
          stats: {
            ...t.stats,
            momentsCount: t.moments.length + 1,
          },
        };
      }
      return t;
    });

    updateTrips(updatedTrips);
    
    // If we're currently viewing the target trip, refresh it
    if (activeTrip.id === targetTrip.id) {
      const refreshedActiveTrip = updatedTrips.find((t) => t.id === targetTrip.id);
      if (refreshedActiveTrip) {
        setActiveTrip(refreshedActiveTrip);
      }
    }

    // Update user stats
    updateUser({
      stats: {
        ...user.stats,
        moments: user.stats.moments + 1,
      },
    });

    triggerToast(`Added moment to "${targetTrip.title}"`);

    // If free user hits 50 moments, highlight paywall
    if (user.tier !== 'pro' && user.stats.moments >= 50) {
      setTimeout(() => setIsPaywallOpen(true), 800);
    }
  };

  const handleUpgradeSuccess = () => {
    updateUser({
      isPro: true,
      tier: 'pro',
      planTier: 'Wander Pro',
      renewalDate: 'Oct 14, 2026',
    });
  };

  const navBar = (
    <NavigationBar
      currentScreen={currentScreen}
      onSelectScreen={handleNavigateTo}
      isPro={user.tier === 'pro'}
    />
  );

  return (
    <PhoneFrame
      isPlayingAudio={isPlayingAudio}
      isRecordingAudio={isRecordingAudio}
      currentScreen={currentScreen}
      onSelectScreen={handleNavigateTo}
      user={user}
      onOpenAddMoment={() => setIsAddMomentOpen(true)}
    >
      {/* Global Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-16 md:top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full liquid-glass-dark border border-[#FF6B4A]/50 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in pointer-events-none">
          <span className="w-4 h-4 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center">
            <Check size={11} strokeWidth={3} />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Animation Transition Container */}
      <AnimatePresence mode="wait">
        {currentScreen === 'trips' && (
          <motion.div
            key="screen-trips"
            initial={{ opacity: 0, x: previousScreen === 'trip-detail' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <TripsScreen
              trips={trips}
              onSelectTrip={handleSelectTrip}
              onOpenActionSheet={handleOpenActionSheet}
              onOpenCalendarFilter={() => setIsCalendarOpen(true)}
              onOpenAddMoment={() => setIsAddMomentOpen(true)}
              onOpenCreateTrip={() => setIsCreateTripOpen(true)}
              footerContent={navBar}
            />
          </motion.div>
        )}

        {currentScreen === 'trip-detail' && (
          <motion.div
            key={`screen-detail-${activeTrip.id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <TripDetailScreen
              trip={activeTrip}
              user={user}
              onBack={() => handleNavigateTo('trips')}
              onOpenActionSheet={handleOpenActionSheet}
              onOpenAddMoment={() => setIsAddMomentOpen(true)}
              onOpenMomentMenu={(moment) => handleOpenMomentMenu(moment, activeTrip)}
              onPlayingAudioChange={setIsPlayingAudio}
              highlightedMomentId={highlightedMomentId}
              onClearHighlight={() => setHighlightedMomentId(null)}
              footerContent={navBar}
            />
          </motion.div>
        )}

        {currentScreen === 'feed' && (
          <motion.div
            key="screen-feed"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <FeedScreen
              trips={trips}
              onSelectTrip={handleSelectTrip}
              onSelectTripWithMoment={handleSelectTripWithMoment}
              onOpenAddMoment={() => setIsAddMomentOpen(true)}
              onOpenMomentMenu={(moment, trip) => handleOpenMomentMenu(moment, trip)}
              footerContent={navBar}
            />
          </motion.div>
        )}

        {currentScreen === 'account' && (
          <motion.div
            key="screen-account"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <AccountScreen
              user={user}
              trips={trips}
              onTriggerPaywall={() => setIsPaywallOpen(true)}
              onUpdateUser={updateUser}
              onOpenAddMoment={() => setIsAddMomentOpen(true)}
              footerContent={navBar}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Sheet Modal (Share / Export / Archive / Delete) */}
      <ActionSheet
        isOpen={isActionSheetOpen}
        trip={actionSheetTrip}
        onClose={() => setIsActionSheetOpen(false)}
        onArchive={handleArchiveTrip}
        onDelete={handleDeleteTrip}
        onTriggerPaywall={() => {
          setIsActionSheetOpen(false);
          setIsPaywallOpen(true);
        }}
      />

      {/* Add Moment Flow Bottom Sheet (Select Trip -> Capture -> Compose & Check Mismatch) */}
      <AddMomentSheet
        isOpen={isAddMomentOpen}
        trips={trips}
        initialTrip={currentScreen === 'trip-detail' ? activeTrip : null}
        onClose={() => setIsAddMomentOpen(false)}
        onAddMoment={handleAddMoment}
        onOpenCreateTrip={() => {
          setIsAddMomentOpen(false);
          setIsCreateTripOpen(true);
        }}
        onRecordingStateChange={setIsRecordingAudio}
      />

      {/* Create New Trip Modal */}
      <CreateTripModal
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
        onCreateTrip={handleCreateTrip}
      />

      {/* Moment Action Modal (Move / Delete) */}
      <MomentActionModal
        isOpen={isMomentMenuOpen}
        moment={selectedMomentForMenu}
        currentTrip={selectedTripForMenu}
        trips={trips}
        onClose={() => {
          setIsMomentMenuOpen(false);
          setSelectedMomentForMenu(null);
          setSelectedTripForMenu(null);
        }}
        onMoveMoment={handleMoveMoment}
        onDeleteMoment={handleDeleteMoment}
        onOpenCreateTripAndMove={(moment) => {
          setIsMomentMenuOpen(false);
          setIsCreateTripOpen(true);
        }}
      />

      {/* Paywall / Upgrade Sheet (Wander Pro) */}
      <PaywallSheet
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      {/* Calendar Timeline Index Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        trips={trips}
        onSelectTrip={handleSelectTrip}
      />
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <ViewportProvider>
      <WanderApp />
    </ViewportProvider>
  );
}

