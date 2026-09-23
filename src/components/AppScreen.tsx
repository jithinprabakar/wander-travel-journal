import React from 'react';
import { useViewport } from '../context/ViewportContext';

export interface AppScreenProps {
  id?: string;
  headerContent: React.ReactNode;
  footerContent?: React.ReactNode;
  floatingAction?: React.ReactNode;
  hasFab?: boolean;
  className?: string;
  scrollRef?: React.RefObject<HTMLDivElement>;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
  onTouchMove?: React.TouchEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

/**
 * AppScreen - Shared Structural Layout Component
 *
 * Responsively adapts between:
 * 1. Mobile (< 768px): 56px header flush at top-0, floating bottom nav,
 *    floating "+" button, and single-column layout.
 * 2. Tablet (768px - 1024px): 64px header flush at top-0, centered floating bottom nav,
 *    multi-column layout clearance.
 * 3. Desktop (>= 1024px): 64px header flush at top-0 spanning content area,
 *    persistent left navigation rail, bottom nav omitted, expansive width clearance.
 */
export const AppScreen: React.FC<AppScreenProps> = ({
  id,
  headerContent,
  footerContent,
  floatingAction,
  hasFab = false,
  className = '',
  scrollRef,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onScroll,
  children,
}) => {
  const { isMobile, isTablet, isDesktop } = useViewport();

  return (
    <div id={id} className={`relative w-full h-full bg-[#0a0a0c] overflow-hidden select-none ${className}`}>
      {/* 
        FIXED HEADER REGION: 
        Pinned permanently to the very top of the viewport with no mockup status bar chrome.
        Mobile: 56px (h-14) flush at top-0.
        Tablet & Desktop: 64px (h-16) flush at top-0.
      */}
      <header
        className={`fixed top-0 z-30 flex items-center bg-[#0a0a0c]/90 backdrop-blur-2xl border-b border-white/10 shadow-lg pointer-events-auto transition-all ${
          isDesktop
            ? 'left-64 lg:left-72 right-0 h-16'
            : isTablet
              ? 'inset-x-0 h-16'
              : 'inset-x-0 h-14'
        }`}
      >
        {/* Screen Title & Action Bar */}
        <div
          className="w-full px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between h-full"
        >
          {headerContent}
        </div>
      </header>

      {/* 
        SCROLLABLE CONTENT REGION:
      */}
      <div
        ref={scrollRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onScroll={onScroll}
        className={`w-full h-full overflow-y-auto no-scrollbar max-w-7xl mx-auto ${
          isMobile
            ? `pt-16 px-4 space-y-4 ${hasFab ? 'pb-[180px]' : 'pb-[130px]'}`
            : isTablet
              ? `pt-20 px-6 md:px-8 space-y-6 ${hasFab ? 'pb-[150px]' : 'pb-[110px]'}`
              : 'pt-20 px-8 lg:px-12 space-y-6 pb-16'
        }`}
      >
        {children}

        {/* Structural End Spacer */}
        <div
          className={`${
            isMobile
              ? hasFab ? 'h-36' : 'h-24'
              : isTablet
                ? hasFab ? 'h-28' : 'h-16'
                : 'h-10'
          } w-full shrink-0 pointer-events-none`}
          aria-hidden="true"
        />
      </div>

      {/* 
        FLOATING ACTION BUTTON:
      */}
      {floatingAction && (
        <div
          className={`fixed z-40 pointer-events-auto transition-all ${
            isDesktop
              ? 'bottom-8 right-10 lg:right-14'
              : isTablet
                ? 'bottom-24 right-8 md:right-12'
                : 'bottom-24 right-5'
          }`}
        >
          {floatingAction}
        </div>
      )}

      {/* 
        FIXED FOOTER (BOTTOM NAV):
        Only rendered on Mobile and Tablet. On Desktop, persistent left rail is used!
      */}
      {footerContent && !isDesktop && (
        <footer className="fixed bottom-0 inset-x-0 z-30 pointer-events-none">
          {footerContent}
        </footer>
      )}
    </div>
  );
};
