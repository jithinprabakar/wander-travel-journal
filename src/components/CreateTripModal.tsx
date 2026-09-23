import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar, Globe, Image as ImageIcon, Sparkles, Plus, Camera, Upload, Check } from 'lucide-react';
import { Trip, RegionType } from '../types';
import { presetTripCovers, cameraRoll } from '../data/travelData';
import { playHapticClick } from '../utils/audio';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTrip: (newTrip: Trip) => void;
  initialDestination?: string;
  initialCountry?: string;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onCreateTrip,
  initialDestination = '',
  initialCountry = '',
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [country, setCountry] = useState(initialCountry);
  const [dates, setDates] = useState('Apr 10 — Apr 16, 2025');
  const [region, setRegion] = useState<'Asia' | 'Europe' | 'Americas'>('Asia');
  
  // Cover Photo Selection: Presets, Upload (Camera/Gallery/Camera Roll), or Custom URL
  type CoverMode = 'presets' | 'upload' | 'url';
  const [coverMode, setCoverMode] = useState<CoverMode>('presets');
  const [selectedCover, setSelectedCover] = useState(presetTripCovers[0].url);
  const [coverLabel, setCoverLabel] = useState(presetTripCovers[0].title);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [uploadedCover, setUploadedCover] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle file uploads (Camera capture or Gallery file selection)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playHapticClick();
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setUploadedCover(result);
          setSelectedCover(result);
          setCoverLabel(file.name ? `Uploaded: ${file.name}` : 'Uploaded Photo');
          setCoverMode('upload');
          if (error) setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handle selecting from the Recent Photos strip
  const handleSelectRecentPhoto = (photoUrl: string, location: string) => {
    playHapticClick();
    setUploadedCover(photoUrl);
    setSelectedCover(photoUrl);
    setCoverLabel(`Camera Roll: ${location}`);
    setCoverMode('upload');
    if (error) setError(null);
  };

  // Handle selecting from Stock Presets
  const handleSelectPreset = (presetUrl: string, presetTitle: string) => {
    playHapticClick();
    setSelectedCover(presetUrl);
    setCoverLabel(presetTitle);
    if (error) setError(null);
  };

  // Handle pasting Custom URL
  const handleCustomUrlChange = (url: string) => {
    setCustomCoverUrl(url);
    if (url.trim()) {
      setSelectedCover(url.trim());
      setCoverLabel('Custom Web URL');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playHapticClick();

    if (!destination.trim()) {
      setError('Please enter a destination name (e.g. Ooty, Kyoto).');
      return;
    }
    if (!country.trim()) {
      setError('Please enter a country (e.g. India, Japan).');
      return;
    }

    const cleanTitle = destination.trim();
    const cleanCountry = country.trim();
    const coverImage = selectedCover.trim() || presetTripCovers[0].url;

    const newTripId = `${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newTrip: Trip = {
      id: newTripId,
      title: cleanTitle,
      country: cleanCountry,
      displayTitle: cleanTitle.toUpperCase().slice(0, 10),
      dates: dates.trim() || '2025 Archive',
      coverImage: coverImage,
      region,
      stats: {
        momentsCount: 0,
        daysCount: 1,
        distanceKm: 0,
      },
      moments: [],
    };

    onCreateTrip(newTrip);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-[32px] liquid-glass-dark border border-white/20 p-6 md:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A]/20 text-[#FF6B4A] flex items-center justify-center border border-[#FF6B4A]/30">
                <Plus size={22} strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B4A]">
                  New Travel Journal
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Start a New Trip
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Destination & Country Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#FF6B4A]" />
                  <span>Destination Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Ooty, Kyoto, Amalfi"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                  <Globe size={12} className="text-[#FF6B4A]" />
                  <span>Country</span>
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. India, Japan, Italy"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>
            </div>

            {/* Dates & Region Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#FF6B4A]" />
                  <span>Travel Dates</span>
                </label>
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="e.g. Apr 10 — Apr 16, 2025"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70 block">
                  Region
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/15">
                  {(['Asia', 'Europe', 'Americas'] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRegion(r)}
                      className={`py-1.5 rounded-xl text-xs font-medium transition-all ${
                        region === r
                          ? 'bg-[#FF6B4A] text-white shadow font-semibold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cover Photo Selection (3 ways: Stock Presets, Camera & Gallery Upload, Custom URL) */}
            <div className="space-y-3 pt-1">
              {/* Hidden file inputs for Camera and Gallery */}
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                type="file"
                ref={galleryInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Section Header & 3-Way Mode Segment */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                  <ImageIcon size={13} className="text-[#FF6B4A]" />
                  <span>Trip Cover Photo</span>
                </label>

                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1 p-0.5 rounded-full liquid-glass-subtle border border-white/10 text-[10px] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      playHapticClick();
                      setCoverMode('presets');
                    }}
                    className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                      coverMode === 'presets'
                        ? 'bg-[#FF6B4A] text-white shadow'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Stock Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playHapticClick();
                      setCoverMode('upload');
                    }}
                    id="cover-mode-upload-button"
                    className={`px-2.5 py-1 rounded-full font-semibold transition-all flex items-center gap-1 ${
                      coverMode === 'upload'
                        ? 'bg-[#FF6B4A] text-white shadow'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Camera size={11} />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playHapticClick();
                      setCoverMode('url');
                    }}
                    className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                      coverMode === 'url'
                        ? 'bg-[#FF6B4A] text-white shadow'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Custom URL
                  </button>
                </div>
              </div>

              {/* Active Selected Cover Preview Card */}
              <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-white/20 shadow-lg group bg-black/40">
                <img
                  src={selectedCover}
                  alt="Trip cover preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-3">
                  <span className="px-2 py-0.5 rounded-full bg-[#FF6B4A] text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                    <Check size={10} strokeWidth={3} />
                    <span>Selected Cover</span>
                  </span>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[12px] font-bold text-white block truncate drop-shadow">
                      {destination.trim() ? destination.trim() : 'Destination'} — {coverLabel}
                    </span>
                    <span className="text-[9px] text-white/60 font-mono block">
                      Will be used as the trip's card & detail header
                    </span>
                  </div>
                </div>
              </div>

              {/* Mode 1: Upload (Camera, Gallery, and Recent Photos Strip) */}
              {coverMode === 'upload' && (
                <div className="space-y-3 pt-1 animate-fade-in">
                  {/* Camera button + Gallery button matching Add Moment flow */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      id="create-trip-camera-button"
                      onClick={() => {
                        playHapticClick();
                        cameraInputRef.current?.click();
                      }}
                      className="p-3.5 rounded-2xl liquid-glass border border-white/15 hover:border-[#FF6B4A]/60 flex items-center gap-3 transition-all active:scale-95 group text-left shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#FF6B4A]/20 text-[#FF6B4A] group-hover:bg-[#FF6B4A] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow">
                        <Camera size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white group-hover:text-[#FF6B4A] transition-colors block">
                          Camera
                        </span>
                        <span className="text-[10px] text-white/50 block">
                          Take a new photo
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="create-trip-gallery-button"
                      onClick={() => {
                        playHapticClick();
                        galleryInputRef.current?.click();
                      }}
                      className="p-3.5 rounded-2xl liquid-glass border border-white/15 hover:border-[#FF6B4A]/60 flex items-center gap-3 transition-all active:scale-95 group text-left shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#FF6B4A]/20 text-[#FF6B4A] group-hover:bg-[#FF6B4A] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow">
                        <Upload size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white group-hover:text-[#FF6B4A] transition-colors block">
                          Gallery
                        </span>
                        <span className="text-[10px] text-white/50 block">
                          Choose from device
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Recent Camera Roll Photos Strip */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                        Recent Camera Roll Photos
                      </span>
                      <span className="text-[9px] text-white/40 font-mono">
                        Tap photo to set as cover
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
                      {cameraRoll.map((photo) => {
                        const isSelected = selectedCover === photo.url;
                        return (
                          <button
                            key={photo.id}
                            type="button"
                            onClick={() => handleSelectRecentPhoto(photo.url, photo.location)}
                            className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all active:scale-95 group ${
                              isSelected
                                ? 'border-[#FF6B4A] ring-2 ring-[#FF6B4A]/50 shadow-md scale-105'
                                : 'border-white/15 hover:border-white/40'
                            }`}
                            title={photo.location}
                          >
                            <img
                              src={photo.url}
                              alt={photo.location}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isSelected ? (
                              <div className="absolute inset-0 bg-[#FF6B4A]/30 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow">
                                  <Check size={11} strokeWidth={3} />
                                </div>
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: Stock Presets Grid */}
              {coverMode === 'presets' && (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {presetTripCovers.map((preset) => {
                      const isSelected = selectedCover === preset.url;
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset.url, preset.title)}
                          className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all group ${
                            isSelected
                              ? 'border-[#FF6B4A] ring-2 ring-[#FF6B4A]/50 scale-105 shadow-md'
                              : 'border-white/15 hover:border-white/40'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                          <span className="absolute bottom-1 inset-x-1 text-[8px] font-semibold text-white truncate drop-shadow">
                            {preset.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mode 3: Custom Web URL */}
              {coverMode === 'url' && (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <input
                    type="url"
                    value={customCoverUrl}
                    onChange={(e) => handleCustomUrlChange(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#FF6B4A]"
                  />
                  <p className="text-[10px] text-white/40">
                    Paste any public image URL (Unsplash, Pexels, etc.) to use as your journal's cover.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="create-trip-submit-button"
                className="px-5 py-2.5 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white text-xs font-bold shadow-lg shadow-[#FF6B4A]/30 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Create Trip Journal</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
