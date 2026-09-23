import React from 'react';
import { Compass, Sparkles, User, Plus, Volume2, Mic, MapPin, Crown, Shield } from 'lucide-react';
import { ScreenType, UserProfile } from '../types';
import { playHapticClick } from '../utils/audio';
import { getUserInitials } from '../utils/user';

interface DesktopNavRailProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  user: UserProfile;
  isPlayingAudio?: boolean;
  isRecordingAudio?: boolean;
  onOpenAddMoment?: () => void;
}

export const DesktopNavRail: React.FC<DesktopNavRailProps> = ({
  currentScreen,
  onSelectScreen,
  user,
  isPlayingAudio = false,
  isRecordingAudio = false,
  onOpenAddMoment,
}) => {
  const navItems = [
    {
      id: 'trips' as ScreenType,
      label: 'Destinations & Trips',
      shortLabel: 'Trips',
      icon: Compass,
      description: 'Active journals & archives',
    },
    {
      id: 'feed' as ScreenType,
      label: 'Timeline Stream',
      shortLabel: 'Feed',
      icon: Sparkles,
      description: 'Live memory feed',
    },
    {
      id: 'account' as ScreenType,
      label: 'Passport & Account',
      shortLabel: 'Account',
      icon: User,
      badge: user.tier === 'pro' ? 'PRO' : undefined,
      description: 'Profile & cloud sync',
    },
  ];

  return (
    <nav aria-label="Desktop Navigation Rail" className="w-64 lg:w-72 h-full shrink-0 flex flex-col justify-between p-5 liquid-glass-dark border-r border-white/10 z-30 select-none">
      {/* Top Header & Brand */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B4A] to-[#ff8f75] flex items-center justify-center shadow-lg shadow-[#FF6B4A]/30">
              <Compass size={18} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-black tracking-widest text-white uppercase block leading-none">
                Wander
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/50 block mt-0.5">
                TRAVEL JOURNAL
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/60">
            v2.4
          </span>
        </div>

        {/* Live Audio Activity Card (if recording or playing) */}
        {(isPlayingAudio || isRecordingAudio) && (
          <div className="p-3 rounded-2xl liquid-glass border border-[#FF6B4A]/40 shadow-lg space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#FF6B4A] font-semibold">
                {isRecordingAudio ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-mono text-[10px] text-red-400">RECORDING NOTE</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={13} className="animate-pulse" />
                    <span className="font-mono text-[10px]">PLAYING AUDIO NOTE</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 h-4">
              {[40, 75, 30, 90, 60, 45, 80, 50, 95, 40, 70, 30, 85].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1 rounded-full bg-[#FF6B4A] animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                id={`desktop-nav-item-${item.id}`}
                onClick={() => {
                  playHapticClick();
                  onSelectScreen(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-200 text-left group ${
                  isActive
                    ? 'bg-[#FF6B4A] text-white shadow-lg shadow-[#FF6B4A]/25'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 group-hover:text-white'
                    }`}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.4 : 1.8} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">
                      {item.shortLabel}
                    </span>
                    <span
                      className={`text-[10px] block leading-tight transition-colors ${
                        isActive ? 'text-white/80' : 'text-white/40 group-hover:text-white/60'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive ? 'bg-white text-[#FF6B4A]' : 'bg-[#FF6B4A] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Quick Add Button & User Passport Card */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        {onOpenAddMoment && (
          <button
            onClick={() => {
              playHapticClick();
              onOpenAddMoment();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-[#FF6B4A]/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Record New Moment</span>
          </button>
        )}

        {/* User Passport Pill */}
        <div
          onClick={() => {
            playHapticClick();
            onSelectScreen('account');
          }}
          className="p-2.5 rounded-2xl liquid-glass-subtle border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User avatar'}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-white/25"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B4A]/25 to-[#ff8f75]/10 border border-white/25 flex items-center justify-center text-xs font-bold text-white">
                  {user.name ? getUserInitials(user.name) : <User size={14} className="text-white/70" />}
                </div>
              )}
              {user.tier === 'pro' && (
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#FF6B4A] text-white shadow">
                  <Crown size={10} />
                </div>
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-[#FF6B4A] transition-colors leading-tight">
                {user.name || 'Unnamed Explorer'}
              </span>
              <span className="text-[10px] text-white/50 block font-mono leading-tight">
                {user.handle || '@newtraveler'}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#FF6B4A] bg-[#FF6B4A]/15 px-2 py-0.5 rounded-full border border-[#FF6B4A]/30">
            {user.tier === 'pro' ? 'PRO' : 'FREE'}
          </span>
        </div>
      </div>
    </nav>
  );
};
