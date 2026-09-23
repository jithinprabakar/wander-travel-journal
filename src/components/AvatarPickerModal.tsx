import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image as ImageIcon, Check, X, Trash2, Sparkles } from 'lucide-react';
import { cameraRoll } from '../data/travelData';
import { presetAvatars, getUserInitials } from '../utils/user';
import { playHapticClick } from '../utils/audio';

interface AvatarPickerModalProps {
  isOpen: boolean;
  currentAvatar: string;
  userName?: string;
  onClose: () => void;
  onSelectAvatar: (avatarUrl: string) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  currentAvatar,
  userName = '',
  onClose,
  onSelectAvatar,
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(currentAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setSelectedUrl(url);
          playHapticClick();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    playHapticClick();
    onSelectAvatar(selectedUrl);
    onClose();
  };

  const handleRemove = () => {
    playHapticClick();
    setSelectedUrl('');
    onSelectAvatar('');
    onClose();
  };

  const initials = getUserInitials(userName);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center bg-black/80 backdrop-blur-md p-0 md:p-4">
        {/* Backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Hidden file input for device photo / camera */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-lg rounded-t-[36px] md:rounded-[36px] liquid-glass-dark border-t md:border border-white/20 p-5 md:p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto no-scrollbar"
        >
          {/* Mobile grab bar */}
          <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-4 md:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B4A]">
                Passport Photo
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Profile Avatar
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
            >
              <X size={16} />
            </button>
          </div>

          {/* Current Live Preview Box */}
          <div className="py-4 flex items-center gap-4 border-b border-white/10">
            <div className="relative w-18 h-18 rounded-full overflow-hidden border-2 border-[#FF6B4A] shadow-xl flex items-center justify-center bg-white/5 shrink-0">
              {selectedUrl ? (
                <img
                  src={selectedUrl}
                  alt="Selected avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#FF6B4A]/25 to-[#ff8f75]/10 text-white font-bold text-xl">
                  {initials || <ImageIcon size={22} className="text-white/40" />}
                </div>
              )}
            </div>

            <div className="flex-1">
              <span className="text-xs font-bold text-white block">
                {selectedUrl ? 'Selected Photo' : 'Neutral Initials Placeholder'}
              </span>
              <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">
                {selectedUrl
                  ? 'This photo will represent you across your journals, passport card, and timeline moments.'
                  : 'No photo selected. Your initials will be displayed in your passport.'}
              </p>
              {selectedUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="mt-2 text-[11px] font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} />
                  <span>Remove photo (use initials)</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary Action: Camera / Device Upload */}
          <div className="pt-4 space-y-3">
            <button
              type="button"
              id="avatar-camera-upload-button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3.5 rounded-2xl border border-white/20 hover:border-[#FF6B4A]/70 liquid-glass flex items-center justify-between group transition-all active:scale-[0.98] shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B4A]/20 text-[#FF6B4A] group-hover:bg-[#FF6B4A] group-hover:text-white flex items-center justify-center transition-colors shadow">
                  <Camera size={20} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white group-hover:text-[#FF6B4A] transition-colors block">
                    Take Photo or Upload from Device
                  </span>
                  <span className="text-[10px] text-white/50 block">
                    Choose from your photo library or camera
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80 group-hover:bg-[#FF6B4A] group-hover:text-white transition-colors">
                Browse
              </span>
            </button>

            {/* Curated Traveler Portraits Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                <Sparkles size={13} className="text-[#FF6B4A]" />
                <span>Curated Traveler Avatars</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presetAvatars.map((preset) => {
                  const isChosen = selectedUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        playHapticClick();
                        setSelectedUrl(preset.url);
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all active:scale-95 group ${
                        isChosen
                          ? 'border-[#FF6B4A] ring-2 ring-[#FF6B4A]/40 shadow-lg'
                          : 'border-white/15 hover:border-white/40'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {isChosen && (
                        <div className="absolute inset-0 bg-[#FF6B4A]/30 flex items-center justify-center">
                          <span className="w-5 h-5 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Camera Roll Photos Section */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
                From Recent Journal Photos
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {cameraRoll.slice(0, 6).map((item) => {
                  const isChosen = selectedUrl === item.url;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        playHapticClick();
                        setSelectedUrl(item.url);
                      }}
                      className={`relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border-2 transition-all active:scale-95 group ${
                        isChosen
                          ? 'border-[#FF6B4A] ring-2 ring-[#FF6B4A]/40 shadow-lg'
                          : 'border-white/15 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {isChosen && (
                        <div className="absolute inset-0 bg-[#FF6B4A]/30 flex items-center justify-center">
                          <span className="w-5 h-5 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-5 flex items-center justify-end gap-2 border-t border-white/10 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              id="avatar-save-button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white text-xs font-bold shadow-lg shadow-[#FF6B4A]/30 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check size={14} strokeWidth={2.5} />
              <span>Use This Photo</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
