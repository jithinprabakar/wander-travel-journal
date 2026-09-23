import { UserProfile } from '../types';

export function getUserInitials(name?: string): string {
  if (!name || !name.trim()) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const defaultEmptyUser: UserProfile = {
  name: '',
  handle: '',
  avatar: '',
  bio: '',
  isSetupComplete: false,
  isPro: false,
  tier: 'free',
  planTier: 'Explorer Free',
  cloudBackup: false,
  notifications: true,
  stats: {
    trips: 4,
    countries: 3,
    moments: 23,
  },
};

export const demoUser: UserProfile = {
  name: 'Elena Rostova',
  handle: '@elena.wander',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Visual archivist & slow-travel enthusiast. Documenting light, textures, and ambient sounds across Asia.',
  isSetupComplete: true,
  isPro: true,
  tier: 'pro',
  planTier: 'Wander Pro',
  renewalDate: 'Oct 14, 2026',
  cloudBackup: true,
  notifications: true,
  stats: {
    trips: 4,
    countries: 3,
    moments: 23,
  },
};

export const presetAvatars = [
  {
    id: 'av-1',
    label: 'Alpine Explorer',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'av-2',
    label: 'Kyoto Traveler',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'av-3',
    label: 'Coastal Wanderer',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'av-4',
    label: 'Mountain Hiker',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'av-5',
    label: 'Desert Nomad',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'av-6',
    label: 'Nordic Backpacker',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
  },
];
