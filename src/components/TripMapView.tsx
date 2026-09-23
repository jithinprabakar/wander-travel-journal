import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { Moment, Trip } from '../types';
import { playHapticClick } from '../utils/audio';

interface TripMapViewProps {
  trip: Trip;
  onSelectMoment: (momentId: string) => void;
  onCloseMap: () => void;
}

export const TripMapView: React.FC<TripMapViewProps> = ({
  trip,
  onSelectMoment,
  onCloseMap,
}) => {
  const [selectedPin, setSelectedPin] = useState<Moment | null>(trip.moments[0] || null);

  // Generate SVG path connecting the moments in order
  const pathData = trip.moments.reduce((acc, m, idx) => {
    const x = m.coordinates?.x ?? (20 + idx * 20);
    const y = m.coordinates?.y ?? (30 + (idx % 2 === 0 ? 10 : 35));
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <div className="relative w-full h-full flex flex-col bg-[#07070a] overflow-hidden select-none">
      {/* Dark Map Canvas Container */}
      <div className="relative w-full flex-1 overflow-hidden">
        {/* Stylized dark-mode vector map background grid & terrain contours */}
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        >
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
            </pattern>
            <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B4A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFA38F" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill="url(#grid)" />

          {/* Stylized organic topographic contour curves */}
          <path d="M-10,30 Q30,10 60,40 T110,20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
          <path d="M-10,60 Q20,80 70,55 T110,75" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
          <path d="M-10,85 Q40,65 80,90 T110,80" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />

          {/* Glowing dashed route path connecting moments */}
          {trip.moments.length > 1 && (
            <>
              {/* Route shadow glow */}
              <path 
                d={pathData} 
                fill="none" 
                stroke="#FF6B4A" 
                strokeWidth="1.6" 
                strokeOpacity="0.25"
                strokeDasharray="2,2"
              />
              {/* Route line */}
              <path 
                d={pathData} 
                fill="none" 
                stroke="url(#routeGlow)" 
                strokeWidth="0.8" 
                strokeDasharray="1.5,1"
              />
            </>
          )}
        </svg>

        {/* Compass & Map Badge */}
        <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full liquid-glass-pill text-[10px] text-white/80 flex items-center gap-1.5 shadow">
            <Compass size={12} className="text-[#FF6B4A]" />
            <span className="font-semibold">{trip.title} Geo Trail</span>
          </div>
        </div>

        <div className="absolute top-3 right-4 z-20">
          <button
            onClick={onCloseMap}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold flex items-center gap-1 transition-all"
          >
            <span>Timeline View</span>
          </button>
        </div>

        {/* Pins Placed on Coordinates */}
        {trip.moments.map((moment, index) => {
          const x = moment.coordinates?.x ?? (20 + index * 20);
          const y = moment.coordinates?.y ?? (30 + (index % 2 === 0 ? 10 : 35));
          const isSelected = selectedPin?.id === moment.id;

          return (
            <div
              key={moment.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
              onClick={() => {
                playHapticClick();
                setSelectedPin(moment);
              }}
            >
              <div className="relative group">
                {/* Pin Pulse Animation */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-[#FF6B4A]/30 animate-ping" />
                )}

                {/* Numbered Pin Badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shadow-lg transition-all active:scale-90 ${
                    isSelected
                      ? 'bg-[#FF6B4A] text-white scale-110 shadow-[0_0_15px_#FF6B4A] border-2 border-white'
                      : 'liquid-glass text-white/90 border border-white/30 hover:scale-105'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Mini tooltip title */}
                <div className={`absolute top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[9px] text-white whitespace-nowrap pointer-events-none transition-all ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {moment.location.split(',')[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Glass Card with Selected Moment Preview */}
      {selectedPin && (
        <div className="p-4 z-40 bg-gradient-to-t from-[#0a0a0c] to-transparent">
          <div className="liquid-glass rounded-3xl p-3 border border-white/20 shadow-2xl flex items-center gap-3">
            {selectedPin.photos?.[0] ? (
              <img
                src={selectedPin.photos[0]}
                alt={selectedPin.location}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#FF6B4A] shrink-0">
                <Sparkles size={20} />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] text-[#FF6B4A] font-semibold">
                <MapPin size={10} />
                <span className="truncate">{selectedPin.date} · {selectedPin.time}</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{selectedPin.location}</h4>
              <p className="text-[11px] text-white/60 truncate">{selectedPin.caption}</p>
            </div>

            <button
              onClick={() => onSelectMoment(selectedPin.id)}
              className="w-9 h-9 rounded-2xl bg-[#FF6B4A] text-white flex items-center justify-center shrink-0 active:scale-95 shadow-md shadow-[#FF6B4A]/30"
              title="Jump to timeline"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
