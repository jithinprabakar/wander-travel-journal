import { Trip, Moment, CameraRollPhoto, UserProfile } from '../types';

export const initialUser: UserProfile = {
  name: 'Elena Rostova',
  handle: '@elena.wander',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: 'Visual archivist & slow-travel enthusiast. Documenting light, textures, and ambient sounds across Asia.',
  isPro: true,
  tier: 'pro',
  planTier: 'Wander Pro',
  renewalDate: 'Oct 14, 2026',
  cloudBackup: true,
  notifications: true,
  stats: {
    trips: 4,
    countries: 3,
    moments: 23
  }
};

export const cameraRoll: CameraRollPhoto[] = [
  {
    id: 'cr-1',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    location: 'Fushimi Inari-taisha, Kyoto',
    date: 'Today, 08:30 AM',
    tags: ['Hike', 'Culture']
  },
  {
    id: 'cr-2',
    url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
    location: 'Arashiyama Bamboo Grove, Kyoto',
    date: 'Today, 11:15 AM',
    tags: ['Hike', 'Nature']
  },
  {
    id: 'cr-3',
    url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
    location: 'Gion District, Kyoto',
    date: 'Yesterday, 06:45 PM',
    tags: ['Food', 'Culture']
  },
  {
    id: 'cr-4',
    url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    location: 'Tegallalang, Bali',
    date: '3 days ago',
    tags: ['Nature', 'Hike']
  },
  {
    id: 'cr-5',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    location: 'Zermatt, Swiss Alps',
    date: '1 week ago',
    tags: ['Hike', 'Stay']
  },
  {
    id: 'cr-ooty',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    location: 'Tea Estates, Ooty, India',
    date: 'Yesterday, 02:30 PM',
    tags: ['Nature', 'Hike']
  },
  {
    id: 'cr-6',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    location: 'Positano Coast, Amalfi',
    date: '2 weeks ago',
    tags: ['Stay', 'Food']
  }
];

export const presetTripCovers = [
  {
    id: 'cover-ooty',
    title: 'Tea Hills',
    location: 'Ooty, India',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'cover-mountains',
    title: 'Alpine Peaks',
    location: 'Swiss Alps',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'cover-tropical',
    title: 'Emerald Terraces',
    location: 'Bali, Indonesia',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'cover-coastal',
    title: 'Mediterranean Coast',
    location: 'Amalfi, Italy',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'cover-kyoto',
    title: 'Temple Shrine',
    location: 'Kyoto, Japan',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'cover-patagonia',
    title: 'Glacial Fjord',
    location: 'Patagonia, Chile',
    url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85',
  },
];

export const sampleWaveform = [18, 35, 52, 28, 65, 80, 45, 30, 75, 95, 60, 42, 88, 70, 50, 62, 38, 55, 90, 68, 44, 25, 30];

export const initialTrips: Trip[] = [
  {
    id: 'kyoto',
    title: 'Kyoto',
    country: 'Japan',
    displayTitle: 'KYOTO',
    dates: 'Mar 12 — Mar 17, 2025',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
    region: 'Asia',
    stats: {
      momentsCount: 8,
      daysCount: 5,
      distanceKm: 1240
    },
    moments: [
      {
        id: 'k-1',
        tripId: 'kyoto',
        tripTitle: 'Kyoto',
        tripCover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
        date: 'Day 1 — Mar 12',
        dayNumber: 1,
        time: '06:40 AM',
        location: 'Fushimi Inari-taisha Shrine',
        coordinates: { lat: 34.9671, lng: 135.7727, x: 58, y: 72 },
        caption: 'Rose before dawn to catch the thousand vermilion torii gates completely empty. The mist hung silent between the cedar trunks.',
        photos: [
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80'
        ],
        tags: ['Hike', 'Culture']
      },
      {
        id: 'k-2',
        tripId: 'kyoto',
        tripTitle: 'Kyoto',
        tripCover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
        date: 'Day 1 — Mar 12',
        dayNumber: 1,
        time: '01:15 PM',
        location: 'Kamo Riverbank, Nakagyo',
        coordinates: { lat: 35.0037, lng: 135.7715, x: 50, y: 55 },
        caption: 'Handmade matcha soba noodles overlooking the willow trees swaying over the river stream.',
        photos: [
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80'
        ],
        tags: ['Food']
      },
      {
        id: 'k-3',
        tripId: 'kyoto',
        tripTitle: 'Kyoto',
        tripCover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
        date: 'Day 2 — Mar 13',
        dayNumber: 2,
        time: '09:20 AM',
        location: 'Arashiyama Bamboo Grove',
        coordinates: { lat: 35.0169, lng: 135.6713, x: 25, y: 35 },
        caption: 'Audio note: listening to the wind clattering through giant bamboo stalks as monks swept gravel nearby.',
        photos: [],
        isVoiceNote: true,
        audioDuration: '0:38',
        waveform: [20, 45, 60, 30, 85, 95, 70, 40, 80, 100, 75, 45, 90, 80, 60, 70, 45, 60, 95, 75, 50, 30, 35],
        tags: ['Nature']
      },
      {
        id: 'k-4',
        tripId: 'kyoto',
        tripTitle: 'Kyoto',
        tripCover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
        date: 'Day 2 — Mar 13',
        dayNumber: 2,
        time: '04:50 PM',
        location: 'Kinkaku-ji (Golden Pavilion)',
        coordinates: { lat: 35.0394, lng: 135.7292, x: 42, y: 22 },
        caption: 'Pure gold leaf reflecting across Kyoko-chi mirror pond right at sunset hour.',
        photos: [
          'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1000&q=80'
        ],
        tags: ['Culture', 'Stay']
      },
      {
        id: 'k-ooty',
        tripId: 'kyoto',
        tripTitle: 'Kyoto',
        tripCover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
        date: 'Day 3 — Mar 14',
        dayNumber: 3,
        time: '02:30 PM',
        location: 'Tea Estates, Ooty, India',
        coordinates: { lat: 11.4102, lng: 76.6950, x: 72, y: 80 },
        caption: 'Morning mist rolling across the emerald tea terraces of the Nilgiris hills.',
        photos: [
          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80'
        ],
        tags: ['Nature', 'Hike']
      }
    ]
  },
  {
    id: 'bali',
    title: 'Bali',
    country: 'Indonesia',
    displayTitle: 'BALI',
    dates: 'Feb 18 — Feb 25, 2025',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
    region: 'Asia',
    stats: {
      momentsCount: 11,
      daysCount: 7,
      distanceKm: 890
    },
    moments: [
      {
        id: 'b-1',
        tripId: 'bali',
        tripTitle: 'Bali',
        tripCover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
        date: 'Day 1 — Feb 18',
        dayNumber: 1,
        time: '07:15 AM',
        location: 'Tegallalang Rice Terraces, Ubud',
        coordinates: { lat: -8.4333, lng: 115.2833, x: 62, y: 35 },
        caption: 'Morning sun rays piercing through emerald green palms over the carved valley ridges.',
        photos: [
          'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80'
        ],
        tags: ['Nature', 'Hike'],
        yearsAgo: 2 // Featured for "On this day"
      },
      {
        id: 'b-2',
        tripId: 'bali',
        tripTitle: 'Bali',
        tripCover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
        date: 'Day 2 — Feb 19',
        dayNumber: 2,
        time: '05:45 PM',
        location: 'Uluwatu Cliff Temple',
        coordinates: { lat: -8.8291, lng: 115.0849, x: 28, y: 82 },
        caption: 'Crashing Indian ocean swell 70 meters below the limestone cliffs as the Kecak chant reverberated into twilight.',
        photos: [
          'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
        ],
        tags: ['Culture', 'Stay']
      },
      {
        id: 'b-3',
        tripId: 'bali',
        tripTitle: 'Bali',
        tripCover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
        date: 'Day 3 — Feb 20',
        dayNumber: 3,
        time: '02:00 PM',
        location: 'Jatiluwih Green Sanctuary',
        coordinates: { lat: -8.3693, lng: 115.1316, x: 45, y: 25 },
        caption: 'Voice memo: monsoon rain breaking out over thatched roofs and fresh dragonfruit juice.',
        photos: [],
        isVoiceNote: true,
        audioDuration: '0:52',
        waveform: [25, 40, 70, 55, 90, 85, 60, 45, 95, 75, 80, 65, 88, 92, 70, 55, 40, 65, 80, 60, 45, 30, 20],
        tags: ['Nature']
      }
    ]
  },
  {
    id: 'alps',
    title: 'Swiss Alps',
    country: 'Switzerland',
    displayTitle: 'ALPS',
    dates: 'Jan 08 — Jan 14, 2025',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    region: 'Europe',
    stats: {
      momentsCount: 14,
      daysCount: 6,
      distanceKm: 620
    },
    moments: [
      {
        id: 'a-1',
        tripId: 'alps',
        tripTitle: 'Swiss Alps',
        tripCover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        date: 'Day 1 — Jan 08',
        dayNumber: 1,
        time: '08:15 AM',
        location: 'Gornergrat Railway, Zermatt',
        coordinates: { lat: 45.9833, lng: 7.7833, x: 40, y: 40 },
        caption: 'The cogwheel train cresting 3,089 meters. First sight of the Matterhorn pyramid carved against crystal blue sky.',
        photos: [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'
        ],
        tags: ['Transit', 'Hike']
      },
      {
        id: 'a-2',
        tripId: 'alps',
        tripTitle: 'Swiss Alps',
        tripCover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        date: 'Day 2 — Jan 09',
        dayNumber: 2,
        time: '07:30 PM',
        location: 'Chez Vrony Chalet, Findeln',
        coordinates: { lat: 46.0123, lng: 7.7654, x: 60, y: 65 },
        caption: 'Gruyère & Vacherin fondue with local Valais wine after 6 hours on the glacier trails.',
        photos: [
          'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
        ],
        tags: ['Food', 'Stay']
      }
    ]
  },
  {
    id: 'amalfi',
    title: 'Amalfi Coast',
    country: 'Italy',
    displayTitle: 'AMALFI',
    dates: 'Sep 19 — Sep 24, 2024',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
    region: 'Europe',
    stats: {
      momentsCount: 16,
      daysCount: 5,
      distanceKm: 410
    },
    moments: [
      {
        id: 'am-1',
        tripId: 'amalfi',
        tripTitle: 'Amalfi Coast',
        tripCover: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
        date: 'Day 1 — Sep 19',
        dayNumber: 1,
        time: '11:00 AM',
        location: 'Path of the Gods (Sentiero degli Dei)',
        coordinates: { lat: 40.6300, lng: 14.5000, x: 35, y: 45 },
        caption: 'Walking high above the Tyrrhenian sea. The Mediterranean glistened like hammered sapphire.',
        photos: [
          'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80'
        ],
        tags: ['Hike', 'Nature']
      },
      {
        id: 'am-2',
        tripId: 'amalfi',
        tripTitle: 'Amalfi Coast',
        tripCover: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
        date: 'Day 2 — Sep 20',
        dayNumber: 2,
        time: '06:30 PM',
        location: 'Positano Spiaggia Grande',
        coordinates: { lat: 40.6281, lng: 14.4850, x: 65, y: 70 },
        caption: 'Aperol spritz while watching the pastel houses stack vertically into the cliffside turn pink under twilight.',
        photos: [
          'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
        ],
        tags: ['Food', 'Stay']
      }
    ]
  }
];
