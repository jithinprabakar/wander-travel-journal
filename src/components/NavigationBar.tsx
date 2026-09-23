import React from 'react';
import { Compass, Sparkles, User } from 'lucide-react';
import { ScreenType } from '../types';
import { playHapticClick } from '../utils/audio';

interface NavigationBarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  isPro?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentScreen,
  onSelectScreen,
  isPro = false,
}) => {
  const navItems = [
    { id: 'trips' as ScreenType, label: 'Trips', icon: Compass },
    { id: 'feed' as ScreenType, label: 'Moments', icon: Sparkles },
    { id: 'account' as ScreenType, label: 'Account', icon: User, badge: isPro ? 'PRO' : undefined },
  ];

  return (
    <>
      {/* Soft dark gradient scrim behind floating nav bar: transparent to ~85% black */}
      <div 
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0a0a0c]/90 via-[#0a0a0c]/50 to-transparent z-30 lg:hidden" 
      />

      {/* Floating Bottom Nav Bar: fixed to viewport, centered, proportioned for mobile & tablet */}
      <div className="fixed bottom-5 md:bottom-6 inset-x-0 px-6 z-40 pointer-events-none flex justify-center lg:hidden">
        <nav 
          aria-label="Bottom Navigation"
          className="pointer-events-auto w-full max-w-[320px] md:max-w-[420px] h-14 md:h-16 rounded-full liquid-glass flex items-center justify-around px-4 shadow-2xl backdrop-blur-2xl"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  playHapticClick();
                  onSelectScreen(item.id);
                }}
                className={`relative flex flex-col items-center justify-center w-16 md:w-20 h-11 md:h-12 rounded-full transition-all duration-200 active:scale-90 ${
                  isActive ? 'text-[#FF6B4A]' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <div className="relative">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3 text-[8px] font-bold px-1 bg-[#FF6B4A] text-white rounded-full leading-tight">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] md:text-xs mt-0.5 tracking-tight font-medium ${isActive ? 'text-[#FF6B4A]' : 'text-white/50'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#FF6B4A] shadow-[0_0_8px_#FF6B4A]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
