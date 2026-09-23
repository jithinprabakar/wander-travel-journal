import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface ViewportContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  windowWidth: number;
}

const ViewportContext = createContext<ViewportContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  windowWidth: 1200,
});

export const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { isMobile, isTablet, isDesktop } = useMemo(() => {
    if (windowWidth < 768) {
      return { isMobile: true, isTablet: false, isDesktop: false };
    }
    if (windowWidth < 1024) {
      return { isMobile: false, isTablet: true, isDesktop: false };
    }
    return { isMobile: false, isTablet: false, isDesktop: true };
  }, [windowWidth]);

  return (
    <ViewportContext.Provider
      value={{
        isMobile,
        isTablet,
        isDesktop,
        windowWidth,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = () => useContext(ViewportContext);
