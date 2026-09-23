import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Image as ImageIcon, 
  MapPin, 
  Mic, 
  MicOff, 
  Check, 
  X, 
  ChevronLeft, 
  Plus, 
  Play, 
  Volume2, 
  AlertTriangle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CameraRollPhoto, Moment, Trip } from '../types';
import { cameraRoll, sampleWaveform } from '../data/travelData';
import { playHapticClick, playVoiceNoteTone } from '../utils/audio';

interface AddMomentSheetProps {
  isOpen: boolean;
  trips: Trip[];
  initialTrip?: Trip | null;
  onClose: () => void;
  onAddMoment: (moment: Moment, targetTripId: string) => void;
  onOpenCreateTrip: () => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

const CameraRollTile: React.FC<{
  item: CameraRollPhoto;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ item, isSelected, onSelect }) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all active:scale-95 bg-white/5 ${
        isSelected ? 'border-[#FF6B4A] shadow-[0_0_12px_#FF6B4A]' : 'border-white/10 hover:border-white/30'
      }`}
    >
      {(!loaded || hasError) && (
        <div className="absolute inset-0 bg-white/10 animate-pulse flex items-center justify-center">
          <ImageIcon size={20} className="text-white/20" />
        </div>
      )}

      <img 
        src={item.url} 
        alt="" 
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          loaded && !hasError ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      {isSelected && (
        <div className="absolute inset-0 bg-[#FF6B4A]/30 flex items-center justify-center">
          <span className="w-5 h-5 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow">
            <Check size={12} strokeWidth={3} />
          </span>
        </div>
      )}
    </button>
  );
};

export const AddMomentSheet: React.FC<AddMomentSheetProps> = ({
  isOpen,
  trips,
  initialTrip,
  onClose,
  onAddMoment,
  onOpenCreateTrip,
  onRecordingStateChange,
}) => {
  // Step 0: 'select-trip', Step 1: 'capture', Step 2: 'compose'
  const [step, setStep] = useState<'select-trip' | 'capture' | 'compose'>('select-trip');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Hike']);
  const [mismatchAcknowledged, setMismatchAcknowledged] = useState(false);
  
  // Voice note recording state
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceMemo, setHasVoiceMemo] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const availableTags = ['Food', 'Hike', 'People', 'Stay', 'Transit', 'Culture'];

  // Reset to select-trip whenever the sheet is opened
  useEffect(() => {
    if (isOpen) {
      setStep('select-trip');
      setSelectedTrip(null);
      setSelectedPhotos([]);
      setCaption('');
      setLocation('');
      setMismatchAcknowledged(false);
      setHasVoiceMemo(false);
      setIsRecording(false);
      setRecordingSeconds(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper to detect destination mismatch
  const checkLocationMismatch = (loc: string, trip: Trip | null): boolean => {
    if (!trip || !loc) return false;
    const l = loc.toLowerCase();
    const tripCountry = trip.country.toLowerCase();
    const tripTitle = trip.title.toLowerCase();

    const knownLocations: { name: string; country: string }[] = [
      { name: 'ooty', country: 'india' },
      { name: 'india', country: 'india' },
      { name: 'kyoto', country: 'japan' },
      { name: 'japan', country: 'japan' },
      { name: 'bali', country: 'indonesia' },
      { name: 'tegallalang', country: 'indonesia' },
      { name: 'indonesia', country: 'indonesia' },
      { name: 'amalfi', country: 'italy' },
      { name: 'positano', country: 'italy' },
      { name: 'italy', country: 'italy' },
      { name: 'zermatt', country: 'switzerland' },
      { name: 'swiss', country: 'switzerland' },
      { name: 'switzerland', country: 'switzerland' },
      { name: 'patagonia', country: 'chile' },
      { name: 'chile', country: 'chile' },
    ];

    for (const item of knownLocations) {
      if (l.includes(item.name)) {
        if (!tripCountry.includes(item.country) && !tripTitle.includes(item.name)) {
          return true;
        }
      }
    }
    return false;
  };

  const hasMismatch = selectedTrip ? checkLocationMismatch(location, selectedTrip) : false;

  const handleSelectTrip = (trip: Trip) => {
    playHapticClick();
    setSelectedTrip(trip);
    if (!location) {
      setLocation(`${trip.title} Center`);
    }
    setStep('capture');
  };

  const toggleSelectPhoto = (url: string, autoLocation?: string) => {
    playHapticClick();
    if (selectedPhotos.includes(url)) {
      setSelectedPhotos(prev => prev.filter(p => p !== url));
    } else {
      setSelectedPhotos(prev => [...prev, url]);
      if (autoLocation) {
        setLocation(autoLocation);
        setMismatchAcknowledged(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedTrip) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setSelectedPhotos(prev => [...prev, url]);
          setLocation(`${selectedTrip.title} Center`);
          setStep('compose');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    playHapticClick();
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Voice recording simulation
  const handleToggleRecord = () => {
    playHapticClick();
    if (isRecording) {
      setIsRecording(false);
      onRecordingStateChange?.(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setHasVoiceMemo(true);
      playVoiceNoteTone(350, 0.1);

      if (!caption.trim()) {
        const sampleNotes = [
          'Audio note: The ambient afternoon breeze moving over the ancient stone pathway.',
          'Audio note: Distant temple bell ringing while we paused for green tea.',
          'Audio note: Rain splashing over tiled roofs as twilight set in.'
        ];
        const randomNote = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
        setCaption(randomNote);
      }
    } else {
      setIsRecording(true);
      onRecordingStateChange?.(true);
      setRecordingSeconds(0);
      playVoiceNoteTone(520, 0.12);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    }
  };

  const handleProceedToCompose = () => {
    playHapticClick();
    setStep('compose');
  };

  const handleConfirmAdd = () => {
    if (!selectedTrip) return;
    playHapticClick();

    const newMoment: Moment = {
      id: `m-${Date.now()}`,
      tripId: selectedTrip.id,
      tripTitle: selectedTrip.title,
      tripCover: selectedTrip.coverImage,
      date: `Day ${selectedTrip.stats.daysCount || 1} — Today`,
      dayNumber: selectedTrip.stats.daysCount || 1,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: location || `${selectedTrip.title}`,
      coordinates: {
        lat: 35.0,
        lng: 135.7,
        x: 50 + (Math.random() * 20 - 10),
        y: 50 + (Math.random() * 20 - 10)
      },
      caption: caption || 'A quiet, timeless moment captured on the trail.',
      photos: selectedPhotos.length > 0 ? selectedPhotos : (hasVoiceMemo ? [] : [cameraRoll[0].url]),
      isVoiceNote: hasVoiceMemo,
      audioDuration: hasVoiceMemo ? `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 24}` : undefined,
      waveform: hasVoiceMemo ? sampleWaveform : undefined,
      tags: selectedTags.length > 0 ? selectedTags : ['Culture']
    };

    onAddMoment(newMoment, selectedTrip.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md">
        {/* Backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Hidden file input for real device uploads */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileUpload} 
          className="hidden" 
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-2xl mx-auto rounded-t-[36px] liquid-glass-dark border-t border-x border-white/20 p-5 md:p-7 shadow-2xl z-10 max-h-[88vh] overflow-y-auto no-scrollbar"
        >
          {/* Subtle drag pill indicator */}
          <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-4" />

          {/* =========================================================================
              STEP 0: EXPLICIT TRIP SELECTION (Never silently guess or assume)
              ========================================================================= */}
          {step === 'select-trip' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B4A]">
                    Step 1 of 3 — Destination
                  </span>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Where was this captured?
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Select which trip archive this moment belongs to.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Start a new trip action card */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playHapticClick();
                    onOpenCreateTrip();
                  }}
                  id="add-moment-start-new-trip-button"
                  className="w-full p-4 rounded-2xl border-2 border-dashed border-[#FF6B4A]/50 hover:border-[#FF6B4A] bg-[#FF6B4A]/10 hover:bg-[#FF6B4A]/15 text-left flex items-center justify-between group transition-all active:scale-[0.99] shadow-md shadow-[#FF6B4A]/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A] text-white flex items-center justify-center shadow-lg shadow-[#FF6B4A]/30 shrink-0">
                      <Plus size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-[#FF6B4A] transition-colors block">
                        Start a New Trip
                      </span>
                      <span className="text-[11px] text-white/60 block">
                        Define a new destination archive (country, dates & cover)
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[#FF6B4A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Existing trips section */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
                  Existing Destination Archives
                </span>

                <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1 no-scrollbar">
                  {trips.map((trip) => {
                    const isInitial = initialTrip?.id === trip.id;
                    return (
                      <button
                        key={trip.id}
                        type="button"
                        onClick={() => handleSelectTrip(trip)}
                        className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-left flex items-center justify-between group transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                            <img
                              src={trip.coverImage}
                              alt={trip.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white group-hover:text-[#FF6B4A] transition-colors truncate">
                                {trip.title}
                              </span>
                              {isInitial && (
                                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/80">
                                  Currently Open
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-white/50 font-mono block mt-0.5">
                              {trip.country} · {trip.dates}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-[11px] text-white/50 font-mono">
                            {trip.moments.length} moments
                          </span>
                          <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#FF6B4A] text-white/70 group-hover:text-white flex items-center justify-center transition-colors">
                            <ChevronRight size={14} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 1: CAPTURE MEDIA (Selected Trip is locked in)
              ========================================================================= */}
          {step === 'capture' && selectedTrip && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playHapticClick();
                      setStep('select-trip');
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
                    title="Change Destination Trip"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B4A]">
                        Trip: {selectedTrip.title}
                      </span>
                      <button
                        onClick={() => {
                          playHapticClick();
                          setStep('select-trip');
                        }}
                        className="text-[10px] text-white/50 hover:text-white underline"
                      >
                        (Change)
                      </button>
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Capture Moment
                    </h2>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Primary Action Tiles: Camera / Upload / Voice */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl liquid-glass border border-white/15 hover:border-white/30 flex flex-col items-center justify-center gap-2 text-center group transition-all active:scale-95 shadow-md"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6B4A]/20 text-[#FF6B4A] group-hover:bg-[#FF6B4A] group-hover:text-white flex items-center justify-center transition-colors">
                    <Camera size={22} />
                  </div>
                  <span className="text-xs font-bold text-white">Camera / Upload</span>
                  <span className="text-[10px] text-white/50">Take photo or browse</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`p-4 rounded-2xl liquid-glass border flex flex-col items-center justify-center gap-2 text-center transition-all active:scale-95 shadow-md ${
                    isRecording 
                      ? 'border-red-500 bg-red-500/20 animate-pulse' 
                      : hasVoiceMemo
                        ? 'border-[#FF6B4A] bg-[#FF6B4A]/10'
                        : 'border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white' 
                      : hasVoiceMemo 
                        ? 'bg-[#FF6B4A] text-white' 
                        : 'bg-white/10 text-white/80'
                  }`}>
                    {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
                  </div>
                  <span className="text-xs font-bold text-white">
                    {isRecording ? `Recording (${recordingSeconds}s)` : hasVoiceMemo ? 'Voice Memo Attached' : 'Voice Journal Note'}
                  </span>
                  <span className="text-[10px] text-white/50">
                    {isRecording ? 'Tap to finish' : hasVoiceMemo ? 'Tap to re-record' : 'Record ambient reflection'}
                  </span>
                </button>
              </div>

              {/* Recent Camera Roll Section */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                    Recent Camera Roll Photos
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {selectedPhotos.length} selected
                  </span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
                  {cameraRoll.map((photo) => (
                    <CameraRollTile
                      key={photo.id}
                      item={photo}
                      isSelected={selectedPhotos.includes(photo.url)}
                      onSelect={() => toggleSelectPhoto(photo.url, photo.location)}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Continue Button */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleProceedToCompose}
                  className="w-full py-3 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white text-xs font-bold shadow-lg shadow-[#FF6B4A]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue to Moment Details</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: COMPOSE & VERIFY (Location Mismatch Warning banner)
              ========================================================================= */}
          {step === 'compose' && selectedTrip && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playHapticClick();
                      setStep('capture');
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B4A]">
                        Adding to: {selectedTrip.title}
                      </span>
                      <button
                        onClick={() => {
                          playHapticClick();
                          setStep('select-trip');
                        }}
                        className="text-[10px] text-white/50 hover:text-white underline"
                      >
                        (Change)
                      </button>
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      New Moment in {selectedTrip.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
                >
                  <X size={16} />
                </button>
              </div>

              {/* LOCATION MISMATCH WARNING (Critical User Requirement) */}
              {hasMismatch && !mismatchAcknowledged && (
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300 block">
                        Destination Mismatch Detected
                      </span>
                      <p className="text-[11px] text-amber-200/90 leading-relaxed mt-0.5">
                        This photo's location (<span className="font-semibold text-white">{location}</span>) does not match <span className="font-semibold text-white">{selectedTrip.title}</span>'s destination (<span className="font-semibold text-white">{selectedTrip.country}</span>) — are you sure?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 pl-7">
                    <button
                      type="button"
                      onClick={() => {
                        playHapticClick();
                        setStep('select-trip');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white font-bold text-[11px] transition-colors shadow"
                    >
                      Switch Destination Trip
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playHapticClick();
                        setMismatchAcknowledged(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-[11px] transition-colors"
                    >
                      Keep in {selectedTrip.title} Anyway
                    </button>
                  </div>
                </div>
              )}

              {/* Photo Previews or Audio Waveform */}
              {selectedPhotos.length > 0 ? (
                <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                  {selectedPhotos.map((photo, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/20 shrink-0">
                      <img src={photo} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setSelectedPhotos(prev => prev.filter(p => p !== photo))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : hasVoiceMemo ? (
                <div className="p-3 rounded-2xl liquid-glass border border-white/15 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shrink-0 shadow-md">
                    <Volume2 size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Voice Memo Attached</span>
                    <span className="text-[10px] text-white/50 font-mono">Duration: 0:{recordingSeconds || 24}</span>
                  </div>
                </div>
              ) : null}

              {/* Location Row */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-white/70 flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#FF6B4A]" />
                    <span>Location Tag</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsEditingLocation(!isEditingLocation)}
                    className="text-[10px] text-[#FF6B4A] hover:underline"
                  >
                    {isEditingLocation ? 'Done' : 'Edit Location'}
                  </button>
                </div>

                {isEditingLocation ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setMismatchAcknowledged(false);
                    }}
                    placeholder="Enter location name"
                    className="w-full px-3.5 py-2 rounded-2xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF6B4A]"
                  />
                ) : (
                  <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/90 font-medium flex items-center justify-between">
                    <span>{location || `${selectedTrip.title} Center`}</span>
                    <span className="text-[10px] text-white/40 font-mono">Auto-detected</span>
                  </div>
                )}
              </div>

              {/* Journal Caption */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 block font-['Playfair_Display',Georgia,serif] italic">
                  Journal Reflection
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Record your thoughts, smells, textures, and memories here..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#FF6B4A] resize-none font-['Playfair_Display',Georgia,serif] italic"
                />
              </div>

              {/* Activity Tags */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-white/70 block">
                  Tags
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-[#FF6B4A] text-white shadow-sm font-semibold'
                            : 'bg-white/5 hover:bg-white/10 text-white/60'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep('capture')}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  id="confirm-add-moment-button"
                  onClick={handleConfirmAdd}
                  className="flex-1 py-2.5 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white text-xs font-bold shadow-lg shadow-[#FF6B4A]/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Add Moment to {selectedTrip.title}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
