import React from 'react';
import { EMBLEM_LOGO_IMG } from '../data/menuData';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'emblem-only' | 'badge-image';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-11 h-11', text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-24 h-24', text: 'text-3xl', sub: 'text-sm' },
  };

  const { icon: iconSize, text: textSize, sub: subSize } = sizeMap[size];

  // Pure Vector Royal Emblem
  const renderVectorEmblem = () => (
    <div
      className={`relative ${iconSize} shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-[#99732B] via-[#F3E5AB] to-[#C5A059] shadow-lg shadow-[#C5A059]/20 flex items-center justify-center`}
    >
      <div className="w-full h-full rounded-full bg-[#07111E] p-1 flex items-center justify-center overflow-hidden border border-[#D4AF37]/40">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full fill-none text-[#D4AF37]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3E5AB" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#99732B" />
            </linearGradient>
            <linearGradient id="innerGlow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8C6D2B" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Ornate Circular Border */}
          <circle cx="50" cy="50" r="46" stroke="url(#goldGrad)" strokeWidth="2.5" strokeDasharray="3 1.5" />
          <circle cx="50" cy="50" r="42" stroke="url(#goldGrad)" strokeWidth="1" opacity="0.6" />

          {/* Subtle Lotus Petals at four quadrants */}
          <path d="M 50 6 C 48 11 52 11 50 14" stroke="url(#goldGrad)" strokeWidth="1.2" />
          <path d="M 50 94 C 48 89 52 89 50 86" stroke="url(#goldGrad)" strokeWidth="1.2" />
          <path d="M 6 50 C 11 48 11 52 14 50" stroke="url(#goldGrad)" strokeWidth="1.2" />
          <path d="M 94 50 C 89 48 89 52 86 50" stroke="url(#goldGrad)" strokeWidth="1.2" />

          {/* Royal Crown above fish */}
          <path
            d="M 44 26 L 47 31 L 50 25 L 53 31 L 56 26 L 56 33 L 44 33 Z"
            fill="url(#goldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="0.5"
          />

          {/* Stylized Majestic Egyptian Fish */}
          <g transform="translate(14, 28) scale(0.72)">
            {/* Fish Body */}
            <path
              d="M 20 40 C 35 15 65 20 80 40 C 65 60 35 65 20 40 Z"
              fill="url(#innerGlow)"
              stroke="url(#goldGrad)"
              strokeWidth="2.2"
            />
            {/* Fish Tail */}
            <path
              d="M 22 40 L 5 25 C 10 35 10 45 5 55 Z"
              fill="url(#goldGrad)"
              stroke="url(#goldGrad)"
              strokeWidth="1.5"
            />
            {/* Fins */}
            <path d="M 50 24 C 55 18 65 18 70 25" stroke="url(#goldGrad)" strokeWidth="1.8" fill="none" />
            <path d="M 50 56 C 55 62 65 62 70 55" stroke="url(#goldGrad)" strokeWidth="1.8" fill="none" />
            {/* Fish Eye */}
            <circle cx="70" cy="37" r="3" fill="#07111E" stroke="url(#goldGrad)" strokeWidth="1.5" />
            <circle cx="71" cy="36.5" r="1" fill="#F3E5AB" />
            {/* Gill Arc */}
            <path d="M 62 30 C 58 37 58 43 62 50" stroke="url(#goldGrad)" strokeWidth="1.5" fill="none" />
            {/* Golden Scale Texture */}
            <path d="M 40 35 C 44 32 48 37 45 42" stroke="url(#goldGrad)" strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M 46 38 C 50 35 54 40 51 45" stroke="url(#goldGrad)" strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M 36 41 C 40 38 44 43 41 48" stroke="url(#goldGrad)" strokeWidth="1.2" fill="none" opacity="0.8" />
          </g>

          {/* Stylized Nile Water Waves */}
          <path
            d="M 25 74 C 32 70 38 78 45 74 C 52 70 58 78 65 74 C 72 70 78 78 85 74"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 30 80 C 37 77 43 83 50 80 C 57 77 63 83 70 80"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
            opacity="0.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );

  // High-Fidelity Photorealistic Crest Badge
  const renderImageBadge = () => (
    <div className={`relative ${iconSize} shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-[#99732B] via-[#F3E5AB] to-[#C5A059] shadow-xl shadow-black/60 overflow-hidden`}>
      <img
        src={EMBLEM_LOGO_IMG}
        alt="شعار فسخاني الحسانين الرسمي"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );

  if (variant === 'emblem-only') {
    return (
      <div onClick={onClick} className={`inline-block ${className} ${onClick ? 'cursor-pointer' : ''}`}>
        {renderVectorEmblem()}
      </div>
    );
  }

  if (variant === 'badge-image') {
    return (
      <div onClick={onClick} className={`inline-block ${className} ${onClick ? 'cursor-pointer' : ''}`}>
        {renderImageBadge()}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 text-right group select-none ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Choice between rich crest or sharp vector */}
      <div className="relative">
        {renderImageBadge()}
        {/* Subtle royal crown indicator */}
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-amber-400 to-[#C5A059] rounded-full border border-[#07111E] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#07111E]" />
        </div>
      </div>

      <div className="flex flex-col text-right">
        <span
          className={`${textSize} font-black tracking-tight text-white font-amiri group-hover:text-[#D4AF37] transition-colors whitespace-nowrap`}
        >
          فسخاني <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#F3E5AB] via-[#D4AF37] to-[#B38E44]">الحسانين</span>
        </span>
        {variant === 'full' && (
          <span className={`${subSize} tracking-wider text-[#C5A059] font-medium whitespace-nowrap`}>
            أصالة الطعم.. حكاية من زمان
          </span>
        )}
      </div>
    </div>
  );
};
