import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Map, Infinity, X, Check, ShieldCheck } from 'lucide-react';
import { playHapticClick } from '../utils/audio';

interface PaywallSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const PaywallSheet: React.FC<PaywallSheetProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    playHapticClick();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeSuccess();
      onClose();
    }, 1200);
  };

  const features = [
    {
      icon: Infinity,
      title: 'Unlimited trips & moments',
      subtitle: 'Never hit a cap on your world memories',
    },
    {
      icon: Sparkles,
      title: 'AI-generated trip recaps',
      subtitle: 'Synthesize stories, audio memos, and highlights',
    },
    {
      icon: Map,
      title: 'Offline maps & PDF export',
      subtitle: 'Interactive route pins and print-ready albums',
    },
  ];

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-t-[40px] liquid-glass-dark p-6 pb-8 border-t-2 border-[#FF6B4A] shadow-2xl z-10 overflow-hidden"
        >
          {/* Subtle coral ambient glow inside */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#FF6B4A]/15 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors z-20"
          >
            <X size={16} />
          </button>

          {/* Oversized 96px Clipped Display Headline */}
          <div className="relative overflow-hidden pt-2 mb-4 pointer-events-none">
            <h1 className="text-[72px] leading-[0.85] font-black tracking-tighter text-white/10 select-none uppercase truncate">
              WANDER PRO
            </h1>
            <div className="absolute inset-0 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest text-[#FF6B4A] font-bold">Membership Tier</span>
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Wander Pro</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#FF6B4A] text-white font-bold">
                  UNLIMITED
                </span>
              </h2>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="space-y-3.5 my-5">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B4A]/15 border border-[#FF6B4A]/30 flex items-center justify-center text-[#FF6B4A] shrink-0 mt-0.5">
                    <Icon size={16} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white tracking-tight leading-snug">
                      {item.title}
                    </p>
                    <p className="text-xs text-white/50">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Toggle Chips */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 my-4">
            <button
              onClick={() => {
                playHapticClick();
                setBillingCycle('monthly');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white/20 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>Monthly</span>
              <span className="block text-[11px] font-normal text-white/70">$4.99 / mo</span>
            </button>

            <button
              onClick={() => {
                playHapticClick();
                setBillingCycle('yearly');
              }}
              className={`relative py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white/20 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="absolute -top-2 right-1 text-[9px] font-bold bg-[#FF6B4A] text-white px-1.5 py-0.5 rounded-full shadow-md">
                SAVE 30%
              </span>
              <span>Yearly</span>
              <span className="block text-[11px] font-normal text-white/70">$39.99 / yr</span>
            </button>
          </div>

          {/* Primary CTA */}
          <button
            id="paywall-primary-cta"
            disabled={isProcessing}
            onClick={handleUpgrade}
            className="w-full py-3.5 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5733] text-white text-sm font-bold tracking-wide shadow-lg shadow-[#FF6B4A]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Unlocking Pro Access...
              </span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Start 7-day free trial</span>
              </>
            )}
          </button>

          {/* Fine print */}
          <p className="text-[10px] text-white/30 text-center mt-3 tracking-wide">
            Renews at {billingCycle === 'yearly' ? '$39.99/yr' : '$4.99/mo'} after 7-day trial. Cancel anytime in App Store settings.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
