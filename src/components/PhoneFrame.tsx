import React from 'react';
import { useViewport } from '../context/ViewportContext';
import { DesktopNavRail } from './DesktopNavRail';
import { ScreenType, UserProfile } from '../types';

interface PhoneFrameProps {
  children: React.ReactNode;
  isPlayingAudio?: boolean;
  isRecordingAudio?: boolean;
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  user: UserProfile;
  onOpenAddMoment?: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isPlayingAudio = false,
  isRecordingAudio = false,
  currentScreen,
  onSelectScreen,
  user,
  onOpenAddMoment,
}) => {
  const { isTablet, isDesktop } = useViewport();

  // ==========================================
  // 1. DESKTOP VIEWPORT (>= 1024px)
  // Full-bleed responsive layout with persistent liquid-glass left rail
  // ==========================================
  if (isDesktop) {
    return (
      <div className="w-full h-screen min-h-screen bg-[#050507] text-white flex flex-row overflow-hidden relative selection:bg-[#FF6B4A]/30 selection:text-white">
        {/* Ambient glow backgrounds */}
        <div 
          aria-hidden="true"
          className="absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full bg-[#FF6B4A]/5 blur-[160px] pointer-events-none" 
        />
        <div 
          aria-hidden="true"
          className="absolute bottom-10 left-1/3 w-[600px] h-[600px] rounded-full bg-blue-500/4 blur-[160px] pointer-events-none" 
        />

        {/* Persistent Liquid-Glass Navigation Rail */}
        <DesktopNavRail
          currentScreen={currentScreen}
          onSelectScreen={onSelectScreen}
          user={user}
          isPlayingAudio={isPlayingAudio}
          isRecordingAudio={isRecordingAudio}
          onOpenAddMoment={onOpenAddMoment}
        />

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden relative bg-[#0a0a0c]">
          {children}
        </main>
      </div>
    );
  }

  // ==========================================
  // 2. TABLET VIEWPORT (768px - 1024px)
  // Full tablet layout, NOT a scaled-up phone screen.
  // ==========================================
  if (isTablet) {
    return (
      <div className="w-full h-screen min-h-screen bg-[#050507] text-white flex flex-col overflow-hidden relative selection:bg-[#FF6B4A]/30 selection:text-white">
        {/* Background ambient lighting */}
        <div 
          aria-hidden="true"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[#FF6B4A]/6 blur-[150px] pointer-events-none" 
        />
        <div 
          aria-hidden="true"
          className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-500/4 blur-[140px] pointer-events-none" 
        />

        {/* Tablet Full-bleed Screen Content */}
        <main className="w-full h-full overflow-hidden relative bg-[#0a0a0c]">
          {children}
        </main>
      </div>
    );
  }

  // ==========================================
  // 3. MOBILE VIEWPORT (< 768px)
  // Clean, full-bleed mobile application layout
  // Single-column content, floating glass bottom nav, floating "+" button
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-[#050507] text-white relative overflow-hidden select-none flex flex-col">
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#FF6B4A]/6 blur-[140px] pointer-events-none" 
      />
      <div 
        aria-hidden="true"
        className="absolute bottom-10 left-1/3 w-[450px] h-[450px] rounded-full bg-blue-500/4 blur-[130px] pointer-events-none" 
      />

      {/* Screen container */}
      <div 
        id="wander-mobile-container"
        className="relative bg-[#0a0a0c] overflow-hidden flex flex-col w-full h-screen [transform:translateZ(0)] isolate"
      >
        {/* Screen Content Container */}
        <div className="relative w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
