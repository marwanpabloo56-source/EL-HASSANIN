import React, { useEffect, useState } from 'react';
import { EMBLEM_LOGO_IMG } from '../data/menuData';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 1100);

    const timer2 = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060F1E] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient gold aura */}
      <div className="absolute w-80 h-80 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative flex flex-col items-center space-y-4 text-center px-4">
        {/* Ornate Gold Emblem */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#99732B] via-[#F3E5AB] to-[#D4AF37] shadow-2xl shadow-[#D4AF37]/30 animate-in zoom-in-95 duration-500">
          <img
            src={EMBLEM_LOGO_IMG}
            alt="شعار فسخاني الحسانين"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Brand Name & Slogan */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-white font-amiri tracking-tight">
            فسخاني <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#F3E5AB] via-[#D4AF37] to-[#B38E44]">الحسانين</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#C5A059] font-medium tracking-wide">
            أصالة الطعم.. حكاية من زمان
          </p>
        </div>

        {/* Delicate golden loader bar */}
        <div className="w-36 h-1 bg-[#0D1F38] rounded-full overflow-hidden border border-[#D4AF37]/30 mt-3">
          <div className="w-full h-full bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#C5A059] animate-[marquee_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
