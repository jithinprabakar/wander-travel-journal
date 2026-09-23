import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, ChevronRight, Check } from 'lucide-react';
import { Trip } from '../types';
import { playHapticClick } from '../utils/audio';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  trips,
  onSelectTrip,
}) => {
  const [selectedYear, setSelectedYear] = useState('2025');

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full rounded-3xl liquid-glass-dark border border-white/20 p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-[#FF6B4A]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Travel Timeline Index</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          {['2025', '2024', 'All Years'].map((year) => (
            <button
              key={year}
              onClick={() => {
                playHapticClick();
                setSelectedYear(year);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedYear === year
                  ? 'bg-[#FF6B4A] text-white shadow'
                  : 'bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Trip Chronological Entries */}
        <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => {
                playHapticClick();
                onSelectTrip(trip);
                onClose();
              }}
              className="p-3 rounded-2xl liquid-glass-subtle hover:bg-white/10 cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{trip.title}, {trip.country}</h4>
                  <span className="text-[10px] text-[#FF6B4A] font-mono">{trip.dates}</span>
                </div>
              </div>
              <ChevronRight size={15} className="text-white/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
