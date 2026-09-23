import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Check, X, User, AtSign, FileText, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { getUserInitials } from '../utils/user';
import { playHapticClick } from '../utils/audio';

interface EditProfileModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onSave: (updated: { name: string; handle: string; bio: string }) => void;
  onOpenAvatarPicker: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
  onOpenAvatarPicker,
}) => {
  const [name, setName] = useState(user.name || '');
  const [handle, setHandle] = useState(() => {
    const raw = user.handle || '';
    return raw.startsWith('@') ? raw.slice(1) : raw;
  });
  const [bio, setBio] = useState(user.bio || '');

  const [nameError, setNameError] = useState<string | null>(null);
  const [handleError, setHandleError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(user.name || '');
      const raw = user.handle || '';
      setHandle(raw.startsWith('@') ? raw.slice(1) : raw);
      setBio(user.bio || '');
      setNameError(null);
      setHandleError(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    let isValid = true;

    // Validate Name
    if (!name.trim()) {
      setNameError('Display name is required');
      isValid = false;
    } else {
      setNameError(null);
    }

    // Validate Username / Handle
    const cleanHandle = handle.trim();
    if (!cleanHandle) {
      setHandleError('Username is required');
      isValid = false;
    } else if (/\s/.test(cleanHandle)) {
      setHandleError('Username cannot contain spaces');
      isValid = false;
    } else if (!/^[a-zA-Z0-9._-]+$/.test(cleanHandle)) {
      setHandleError('Only letters, numbers, dots, dashes, and underscores');
      isValid = false;
    } else {
      setHandleError(null);
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    playHapticClick();
    const formattedHandle = handle.trim().startsWith('@')
      ? handle.trim()
      : `@${handle.trim()}`;

    onSave({
      name: name.trim(),
      handle: formattedHandle,
      bio: bio.trim(),
    });
    onClose();
  };

  const initials = getUserInitials(name || user.name);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center bg-black/80 backdrop-blur-md p-0 md:p-4">
        {/* Backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-lg rounded-t-[36px] md:rounded-[36px] liquid-glass-dark border-t md:border border-white/20 p-5 md:p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Mobile pull indicator */}
          <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-4 md:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B4A]">
                Account Settings
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Edit Passport Profile
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Avatar Row / Quick Change Photo */}
            <div className="flex items-center gap-4 p-3 rounded-2xl liquid-glass border border-white/10">
              <button
                type="button"
                onClick={() => {
                  playHapticClick();
                  onOpenAvatarPicker();
                }}
                className="relative group shrink-0"
                title="Change profile photo"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/25 group-hover:border-[#FF6B4A] transition-colors flex items-center justify-center bg-white/5 shadow-md">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={name || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#FF6B4A]/25 to-[#ff8f75]/10 text-white font-bold text-lg">
                      {initials || <User size={22} className="text-white/40" />}
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow-lg border border-[#0f0e13] group-hover:scale-110 transition-transform">
                  <Camera size={11} strokeWidth={2.5} />
                </div>
              </button>

              <div className="flex-1">
                <span className="text-xs font-bold text-white block">
                  Profile Photo
                </span>
                <p className="text-[11px] text-white/50 leading-relaxed mb-1.5">
                  Tap avatar or button below to take a photo, upload an image, or pick from curated avatars.
                </p>
                <button
                  type="button"
                  id="change-avatar-button"
                  onClick={() => {
                    playHapticClick();
                    onOpenAvatarPicker();
                  }}
                  className="px-3 py-1 rounded-full liquid-glass-subtle border border-white/20 text-[#FF6B4A] hover:text-white hover:border-[#FF6B4A] text-[11px] font-semibold transition-all active:scale-95"
                >
                  Change Photo
                </button>
              </div>
            </div>

            {/* Field: Display Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                <User size={13} className="text-[#FF6B4A]" />
                <span>Display Name <span className="text-[#FF6B4A]">*</span></span>
              </label>
              <input
                type="text"
                id="edit-profile-name-input"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="e.g. Elena Rostova or Liam Vance"
                className={`w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border text-white text-xs placeholder:text-white/30 focus:outline-none transition-colors ${
                  nameError ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#FF6B4A]'
                }`}
              />
              {nameError && (
                <div className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                  <AlertCircle size={12} />
                  <span>{nameError}</span>
                </div>
              )}
            </div>

            {/* Field: Username (@handle) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                <AtSign size={13} className="text-[#FF6B4A]" />
                <span>Username <span className="text-[#FF6B4A]">*</span></span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-mono text-[#FF6B4A] select-none font-bold">
                  @
                </span>
                <input
                  type="text"
                  id="edit-profile-handle-input"
                  value={handle}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^@/, '');
                    setHandle(val);
                    if (handleError) setHandleError(null);
                  }}
                  placeholder="wanderer.notes"
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-2xl bg-white/5 border text-white text-xs font-mono placeholder:text-white/30 focus:outline-none transition-colors ${
                    handleError ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#FF6B4A]'
                  }`}
                />
              </div>
              {handleError ? (
                <div className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                  <AlertCircle size={12} />
                  <span>{handleError}</span>
                </div>
              ) : (
                <span className="text-[10px] text-white/40 block">
                  Must be unique, without spaces. Letters, numbers, and dots.
                </span>
              )}
            </div>

            {/* Field: Bio */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                  <FileText size={13} className="text-[#FF6B4A]" />
                  <span>Traveler Bio & Tagline (Optional)</span>
                </label>
                <span className="text-[10px] text-white/40 font-mono">
                  {bio.length}/160
                </span>
              </div>
              <textarea
                id="edit-profile-bio-input"
                value={bio}
                maxLength={160}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Visual archivist & slow-travel enthusiast. Documenting light, textures, and ambient sounds..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#FF6B4A] transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-profile-button"
                className="px-5 py-2.5 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white text-xs font-bold shadow-lg shadow-[#FF6B4A]/30 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Check size={14} strokeWidth={2.5} />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
