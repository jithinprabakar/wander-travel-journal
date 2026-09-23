import React, { useState } from 'react';
import { 
  Cloud, 
  Download, 
  Bell, 
  Users, 
  Moon, 
  LogOut, 
  Sparkles, 
  ChevronRight, 
  Check, 
  Shield, 
  Crown,
  Plus,
  Pencil,
  Camera,
  User,
  RotateCcw
} from 'lucide-react';
import { UserProfile, Trip } from '../types';
import { playHapticClick } from '../utils/audio';
import { AppScreen } from './AppScreen';
import { useViewport } from '../context/ViewportContext';
import { getUserInitials, demoUser, defaultEmptyUser } from '../utils/user';
import { AvatarPickerModal } from './AvatarPickerModal';
import { EditProfileModal } from './EditProfileModal';

interface AccountScreenProps {
  user: UserProfile;
  trips: Trip[];
  onTriggerPaywall: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenAddMoment?: () => void;
  footerContent?: React.ReactNode;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  user,
  trips,
  onTriggerPaywall,
  onUpdateUser,
  onOpenAddMoment,
  footerContent,
}) => {
  const { isDesktop } = useViewport();
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const totalMoments = trips.reduce((acc, t) => acc + t.moments.length, 0);
  const uniqueCountries = new Set(trips.map((t) => t.country)).size;
  const initials = getUserInitials(user.name);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2800);
  };

  const handleExportAllData = () => {
    playHapticClick();
    const backupData = {
      profile: user,
      trips,
      exportTimestamp: new Date().toISOString(),
      appVersion: 'Wander 2.4.0',
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Wander_Backup_${(user.name || 'Explorer').replace(/\s+/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    triggerToast('All journal archives exported successfully');
  };

  const handleToggleCloudBackup = () => {
    playHapticClick();
    const nextVal = !user.cloudBackup;
    onUpdateUser({ cloudBackup: nextVal });
    triggerToast(nextVal ? 'iCloud & Drive backup enabled' : 'Cloud backup paused');
  };

  const handleToggleNotifications = () => {
    playHapticClick();
    const nextVal = !user.notifications;
    onUpdateUser({ notifications: nextVal });
    triggerToast(nextVal ? 'Memory reminders turned on' : 'Notifications muted');
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    onUpdateUser({ avatar: avatarUrl, isSetupComplete: true });
    localStorage.setItem('wander_user_edited', 'true');
    triggerToast(avatarUrl ? 'Profile photo updated' : 'Profile photo removed');
  };

  const handleProfileSave = (updated: { name: string; handle: string; bio: string }) => {
    onUpdateUser({ ...updated, isSetupComplete: true });
    localStorage.setItem('wander_user_edited', 'true');
    triggerToast('Passport profile saved');
  };

  const handleResetToEmpty = () => {
    playHapticClick();
    onUpdateUser(defaultEmptyUser);
    localStorage.removeItem('wander_user_edited');
    triggerToast('Reset to first-run profile state');
  };

  const handleLoadDemoProfile = () => {
    playHapticClick();
    onUpdateUser(demoUser);
    localStorage.setItem('wander_user_edited', 'true');
    triggerToast('Sample profile (Elena Rostova) loaded');
  };

  const headerContent = (
    <div className="w-full flex items-center justify-between">
      <h2 className="text-sm font-bold text-white tracking-tight">Passport & Account</h2>
      <span className="text-[11px] font-mono text-[#FF6B4A] font-semibold">
        {user.handle || '@newtraveler'}
      </span>
    </div>
  );

  const floatingAction =
    !isDesktop && onOpenAddMoment ? (
      <button
        id="floating-add-moment-account"
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

  const isFirstRun = !user.isSetupComplete && (!user.name || user.name.trim() === '');

  return (
    <>
      <AppScreen
        id="screen-account"
        headerContent={headerContent}
        footerContent={footerContent}
        floatingAction={floatingAction}
        hasFab={!isDesktop && !!onOpenAddMoment}
      >
        {/* Toast Notification */}
        {showToast && (
          <div className="p-3 rounded-2xl bg-[#FF6B4A]/20 border border-[#FF6B4A]/40 text-xs text-white flex items-center gap-2 shadow-lg animate-fade-in mb-3">
            <Check size={14} className="text-[#FF6B4A]" />
            <span>{showToast}</span>
          </div>
        )}

        {/* First-Run / Onboarding Prompt Banner */}
        {isFirstRun && (
          <div
            id="onboarding-profile-banner"
            className="mb-4 rounded-[28px] p-4 md:p-5 liquid-glass border border-[#FF6B4A]/40 shadow-xl relative overflow-hidden animate-fade-in"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 107, 74, 0.18) 0%, rgba(20, 18, 26, 0.95) 100%)',
            }}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A]/25 text-[#FF6B4A] flex items-center justify-center shrink-0 shadow-md">
                <Sparkles size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6B4A] font-bold">
                    Profile Setup
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                  Personalize Your Travel Passport
                </h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Add your name and photo to personalize your journal. Your identity will appear across all your destination archives, shared trips, and moments.
                </p>
                <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
                  <button
                    id="onboarding-setup-profile-button"
                    onClick={() => {
                      playHapticClick();
                      setIsEditProfileOpen(true);
                    }}
                    className="py-2 px-4 rounded-xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/30 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pencil size={13} strokeWidth={2.5} />
                    <span>Set Up Profile</span>
                  </button>
                  <button
                    id="onboarding-choose-photo-button"
                    onClick={() => {
                      playHapticClick();
                      setIsAvatarPickerOpen(true);
                    }}
                    className="py-2 px-3.5 rounded-xl liquid-glass-subtle border border-white/20 text-white/90 hover:text-white text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera size={13} />
                    <span>Choose Photo</span>
                  </button>
                  <button
                    id="onboarding-load-demo-button"
                    onClick={handleLoadDemoProfile}
                    className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 text-[11px] font-mono transition-all ml-auto cursor-pointer"
                  >
                    Quick Demo Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout on Tablet & Desktop */}
        <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-8 items-start">
          {/* Left Column: Profile Card & Pro Perks */}
          <div className="md:col-span-5 space-y-4">
            {/* Passport Header Card */}
            <div
              id="passport-profile-card"
              className="rounded-[32px] liquid-glass p-5 border border-white/15 flex flex-col items-center text-center relative overflow-hidden shadow-2xl"
            >
              {/* Top Corner Edit Pencil Button */}
              <button
                id="passport-card-edit-button"
                onClick={() => {
                  playHapticClick();
                  setIsEditProfileOpen(true);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all active:scale-90 cursor-pointer shadow-sm"
                title="Edit profile"
                aria-label="Edit profile"
              >
                <Pencil size={15} />
              </button>

              {/* Tappable Avatar Circle with Camera/Pencil Overlay */}
              <div className="relative mb-3 group cursor-pointer" onClick={() => {
                playHapticClick();
                setIsAvatarPickerOpen(true);
              }}>
                <div
                  id="passport-avatar-button"
                  className="w-22 h-22 rounded-full overflow-hidden border-2 border-white/25 group-hover:border-[#FF6B4A] transition-all duration-200 shadow-xl flex items-center justify-center bg-white/5 group-hover:ring-4 group-hover:ring-[#FF6B4A]/25"
                  title="Tap to change profile photo"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User avatar'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#FF6B4A]/30 to-[#ff8f75]/15 text-white font-black text-2xl tracking-wider">
                      {initials || <User size={34} className="text-white/60" />}
                    </div>
                  )}
                </div>

                {/* Pencil/Camera Overlay Badge */}
                <div
                  id="avatar-edit-overlay-badge"
                  className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#FF6B4A] text-white shadow-lg border-2 border-[#121118] group-hover:scale-110 group-hover:bg-[#ff5733] transition-all flex items-center justify-center"
                  title="Change photo"
                >
                  <Camera size={13} strokeWidth={2.5} />
                </div>

                {user.tier === 'pro' && (
                  <div
                    className="absolute -top-1 -right-1 p-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#FF6B4A] text-white shadow-lg border-2 border-[#121118]"
                    title="Wander Pro Member"
                  >
                    <Crown size={11} strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {/* Display Name & Handle */}
              <h3 className="text-lg font-bold text-white tracking-tight">
                {user.name || 'Unnamed Explorer'}
              </h3>
              <p className="text-xs font-mono text-[#FF6B4A] font-medium mt-0.5">
                {user.handle || '@newtraveler'}
              </p>

              {/* Bio */}
              <p className="text-xs text-white/70 mt-2 mb-3 max-w-[260px] leading-relaxed">
                {user.bio || 'No bio added yet. Tap Edit Profile to customize your traveler note.'}
              </p>

              {/* Dedicated "Edit Profile" Button */}
              <button
                id="passport-edit-profile-action"
                onClick={() => {
                  playHapticClick();
                  setIsEditProfileOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-2xl liquid-glass border border-white/20 hover:border-[#FF6B4A]/70 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md mb-3.5 group cursor-pointer"
              >
                <Pencil size={13} className="text-[#FF6B4A] group-hover:scale-110 transition-transform" />
                <span>Edit Profile</span>
              </button>

              {/* Membership Tier Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${
                    user.tier === 'pro'
                      ? 'bg-gradient-to-r from-[#FF6B4A]/30 to-[#FF8A65]/30 text-[#FF6B4A] border-[#FF6B4A]/40'
                      : 'bg-white/10 text-white/70 border-white/15'
                  }`}
                >
                  {user.tier === 'pro'
                    ? '★ Wander Pro Lifetime'
                    : user.planTier || 'Free Explorer'}
                </span>
              </div>

              {/* Dynamic Stats Pill */}
              <div className="w-full grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl liquid-glass-subtle border border-white/10 text-center">
                <div>
                  <span className="block text-sm font-bold text-white">{trips.length}</span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider">Journals</span>
                </div>
                <div className="border-x border-white/10">
                  <span className="block text-sm font-bold text-white">{totalMoments}</span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider">Moments</span>
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">{uniqueCountries}</span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider">Countries</span>
                </div>
              </div>
            </div>

            {/* Upgrade to Pro Banner (if not pro) */}
            {user.tier === 'free' && (
              <div
                onClick={onTriggerPaywall}
                className="rounded-[28px] liquid-glass p-4 border border-[#FF6B4A]/50 relative overflow-hidden cursor-pointer shadow-xl active:scale-[0.98] transition-transform"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 107, 74, 0.25) 0%, rgba(30, 20, 25, 0.9) 100%)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B4A] uppercase tracking-wider">
                      <Sparkles size={13} />
                      <span>Upgrade to Wander Pro</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      Unlock Unlimited Trips & Audio Memos
                    </h4>
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      High-fidelity offline sync, audio wave transcription & multi-device sync.
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Settings Groups & Actions */}
          <div className="md:col-span-7 space-y-4 mt-4 md:mt-0">
            {/* Settings Groups */}
            <div className="rounded-[32px] liquid-glass p-3 border border-white/15 shadow-xl space-y-1.5">
              {/* Cloud backup toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/80">
                    <Cloud size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">iCloud & Drive Backup</div>
                    <div className="text-[10px] text-white/50">Auto-sync photos and audio notes</div>
                  </div>
                </div>
                <button
                  onClick={handleToggleCloudBackup}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    user.cloudBackup ? 'bg-[#FF6B4A]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      user.cloudBackup ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Memory notifications toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/80">
                    <Bell size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Daily Memory Flashbacks</div>
                    <div className="text-[10px] text-white/50">"On this day" push notifications</div>
                  </div>
                </div>
                <button
                  onClick={handleToggleNotifications}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    user.notifications ? 'bg-[#FF6B4A]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      user.notifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Collaborators row */}
              <div
                onClick={() => {
                  playHapticClick();
                  setShowCollaboratorsModal(true);
                }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/80">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Trip Collaborators</div>
                    <div className="text-[10px] text-white/50">2 friends currently sharing journals</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-white/40" />
              </div>

              {/* Export JSON archive */}
              <div
                onClick={handleExportAllData}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/80">
                    <Download size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Export Journal Archive</div>
                    <div className="text-[10px] text-white/50">Download complete offline JSON</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">
                  JSON
                </span>
              </div>

              {/* Appearance Row */}
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/80">
                    <Moon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Appearance</div>
                    <div className="text-[10px] text-white/50">OLED Luxury Liquid Dark</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">
                  OLED ON
                </span>
              </div>
            </div>

            {/* Profile State Management & Reset Options */}
            <div className="p-3 rounded-2xl liquid-glass-subtle border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                  Profile State Testing
                </span>
                <span className="text-[10px] text-white/30 font-mono">
                  Local Storage Synced
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  id="reset-to-first-run-button"
                  onClick={handleResetToEmpty}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                >
                  <RotateCcw size={12} className="text-[#FF6B4A]" />
                  <span>Reset to First-Run State</span>
                </button>
                <button
                  type="button"
                  id="load-sample-profile-button"
                  onClick={handleLoadDemoProfile}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                >
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Load Sample (Elena)</span>
                </button>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-2 px-2">
              <button
                onClick={() => {
                  playHapticClick();
                  handleResetToEmpty();
                }}
                className="text-xs text-white/40 hover:text-white/70 transition-colors py-2 px-3 rounded-full active:scale-95 flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <LogOut size={13} />
                <span>Reset Profile Session</span>
              </button>
              <span className="text-[10px] text-white/30 font-mono">
                Wander v2.4.0 • Passport Sync
              </span>
            </div>
          </div>
        </div>
      </AppScreen>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarPickerOpen}
        currentAvatar={user.avatar}
        userName={user.name}
        onClose={() => setIsAvatarPickerOpen(false)}
        onSelectAvatar={handleAvatarSelect}
      />

      {/* Edit Profile Form Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        user={user}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleProfileSave}
        onOpenAvatarPicker={() => {
          setIsAvatarPickerOpen(true);
        }}
      />

      {/* Collaborators Modal */}
      {showCollaboratorsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-[340px] rounded-3xl liquid-glass-dark border border-white/20 p-5 shadow-2xl">
            <h4 className="text-sm font-bold text-white mb-1">Trip Collaborators</h4>
            <p className="text-xs text-white/60 mb-4">
              Invite friends to contribute photos, audio memos, and pin locations to shared journals.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs text-white">
                <span>Liam Vance (@liam.travel)</span>
                <span className="text-[10px] text-[#FF6B4A]">Editor</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs text-white">
                <span>Sofia Lin (@sofia_wander)</span>
                <span className="text-[10px] text-white/40">Viewer</span>
              </div>
            </div>
            <button
              onClick={() => setShowCollaboratorsModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#FF6B4A] text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
