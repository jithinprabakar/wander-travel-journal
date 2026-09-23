export type ScreenType = 'trips' | 'trip-detail' | 'feed' | 'account';

export type RegionType = 'All' | 'Asia' | 'Europe' | 'Americas';

export interface Moment {
  id: string;
  tripId: string;
  tripTitle: string;
  tripCover?: string;
  date: string;
  dayNumber: number;
  time: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number; // percentage on SVG map
    y: number; // percentage on SVG map
  };
  caption: string;
  photos: string[];
  isVoiceNote?: boolean;
  audioDuration?: string;
  waveform?: number[];
  tags: string[];
  yearsAgo?: number; // for "on this day"
}

export interface Trip {
  id: string;
  title: string;
  country: string;
  displayTitle: string; // e.g. "KYOTO" for 96px clipped typography
  dates: string;
  coverImage: string;
  region: 'Asia' | 'Europe' | 'Americas';
  stats: {
    momentsCount: number;
    daysCount: number;
    distanceKm: number;
  };
  moments: Moment[];
  archived?: boolean;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  isSetupComplete?: boolean;
  isPro: boolean;
  tier?: 'free' | 'pro';
  planTier: 'Explorer Free' | 'Wander Pro';
  renewalDate?: string;
  cloudBackup: boolean;
  notifications: boolean;
  stats: {
    trips: number;
    countries: number;
    moments: number;
  };
}

export interface CameraRollPhoto {
  id: string;
  url: string;
  location: string;
  date: string;
  tags: string[];
}
