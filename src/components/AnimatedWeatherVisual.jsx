import React from 'react';

export default function AnimatedWeatherVisual({ condition = 'Cerah', icon = 'sunny', size = 'lg' }) {
  const condLower = condition.toLowerCase();

  const isThunder = condLower.includes('petir') || condLower.includes('badai');
  const isRain = condLower.includes('hujan') || icon === 'rainy' || isThunder;
  const isPartlyCloudy = condLower.includes('cerah berawan') || icon === 'partly_cloudy_day';
  const isCloudy = (condLower.includes('berawan') || condLower.includes('kabut') || icon === 'cloudy') && !isPartlyCloudy && !isRain;
  const isNight = condLower.includes('malam') || icon === 'clear_night';

  const containerSizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44'
  };

  const currentSizeClass = containerSizes[size] || containerSizes.lg;

  return (
    <div className={`relative flex items-center justify-center ${currentSizeClass} pointer-events-none select-none drop-shadow-md`}>
      {/* 1. CERAH (Sunny) */}
      {!isRain && !isCloudy && !isPartlyCloudy && !isNight && (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="1" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="1" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="1" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Rotating Sun Rays */}
          <g className="animate-sun-rotate origin-center" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" opacity="0.85">
            <line x1="60" y1="10" x2="60" y2="22" />
            <line x1="60" y1="98" x2="60" y2="110" />
            <line x1="10" y1="60" x2="22" y2="60" />
            <line x1="98" y1="60" x2="110" y2="60" />
            <line x1="24.6" y1="24.6" x2="33.1" y2="33.1" />
            <line x1="86.9" y1="86.9" x2="95.4" y2="95.4" />
            <line x1="24.6" y1="95.4" x2="33.1" y2="86.9" />
            <line x1="86.9" y1="33.1" x2="95.4" y2="24.6" />
          </g>

          {/* Glowing Sun Core */}
          <circle cx="60" cy="60" r="28" fill="url(#sunGlow)" filter="url(#glow)" className="animate-pulse" />
        </svg>
      )}

      {/* 2. CERAH BERAWAN (Partly Cloudy) */}
      {isPartlyCloudy && (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          <defs>
            <radialGradient id="sunGlowSmall" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <linearGradient id="cloudGradPartly" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <filter id="cloudShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Sun Peeking Top Right */}
          <g className="animate-sun-rotate origin-[78px_42px]" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" opacity="0.9">
            <line x1="78" y1="18" x2="78" y2="26" />
            <line x1="94" y1="42" x2="102" y2="42" />
            <line x1="89.3" y1="30.7" x2="95" y2="25" />
          </g>
          <circle cx="78" cy="42" r="18" fill="url(#sunGlowSmall)" />

          {/* Floating Volumetric Cloud Front */}
          <g className="animate-cloud-float" filter="url(#cloudShadow)">
            <path 
              d="M 32,82 L 88,82 C 96.8,82 104,74.8 104,66 C 104,57.6 97.4,50.8 89.2,50.1 C 87.2,38.6 77.2,30 65,30 C 55.4,30 47.1,35.4 43,43.3 C 40.5,41.2 37.4,40 34,40 C 26.3,40 20,46.3 20,54 C 20,55.1 20.1,56.2 20.4,57.2 C 15.5,59.3 12,64.3 12,70 C 12,76.6 17.4,82 24,82 L 32,82 Z" 
              fill="url(#cloudGradPartly)" 
            />
          </g>
        </svg>
      )}

      {/* 3. BERAWAN / KABUT (Cloudy) */}
      {isCloudy && (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          <defs>
            <linearGradient id="backCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="frontCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <filter id="shadowMain" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0F172A" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Back Drifting Cloud */}
          <g className="animate-cloud-float-slow opacity-80">
            <path 
              d="M 45,62 L 95,62 C 102,62 108,56 108,49 C 108,42.5 103,37 96.5,36.5 C 95,27 86.5,20 76,20 C 68,20 61,24.5 57.5,31 C 55.5,29.5 53,28.5 50,28.5 C 43.5,28.5 38,33.5 38,40 C 38,41 38.1,41.9 38.3,42.7 C 34.3,44.4 31.5,48.4 31.5,53 C 31.5,58 35.5,62 40.5,62 Z" 
              fill="url(#backCloudGrad)" 
            />
          </g>

          {/* Front Volumetric Cloud */}
          <g className="animate-cloud-float" filter="url(#shadowMain)">
            <path 
              d="M 30,88 L 90,88 C 98.8,88 106,80.8 106,72 C 106,63.6 99.4,56.8 91.2,56.1 C 89.2,44.6 79.2,36 67,36 C 57.4,36 49.1,41.4 45,49.3 C 42.5,47.2 39.4,46 36,46 C 28.3,46 22,52.3 22,60 C 22,61.1 22.1,62.2 22.4,63.2 C 17.5,65.3 14,70.3 14,76 C 14,82.6 19.4,88 26,88 Z" 
              fill="url(#frontCloudGrad)" 
            />
          </g>
        </svg>
      )}

      {/* 4. HUJAN & HUJAN PETIR (Rainy & Thunderstorm) */}
      {isRain && (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          <defs>
            <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <filter id="rainCloudShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#020617" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Animated Rain Drop Streams */}
          <g stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round">
            <line x1="32" y1="78" x2="28" y2="92" className="animate-rain-drop" style={{ animationDelay: '0s' }} />
            <line x1="48" y1="78" x2="44" y2="96" className="animate-rain-drop-fast" style={{ animationDelay: '0.2s' }} />
            <line x1="64" y1="78" x2="60" y2="92" className="animate-rain-drop" style={{ animationDelay: '0.4s' }} />
            <line x1="80" y1="78" x2="76" y2="96" className="animate-rain-drop-fast" style={{ animationDelay: '0.1s' }} />
            <line x1="94" y1="78" x2="90" y2="92" className="animate-rain-drop" style={{ animationDelay: '0.3s' }} />
          </g>

          {/* Thunder Lightning Strike */}
          {isThunder && (
            <path 
              d="M 64,54 L 52,74 L 62,74 L 54,94 L 74,68 L 62,68 L 72,54 Z" 
              fill="#FACC15" 
              className="animate-lightning"
            />
          )}

          {/* Dark Rain Cloud */}
          <g className="animate-cloud-float" filter="url(#rainCloudShadow)">
            <path 
              d="M 28,72 L 92,72 C 100,72 106.5,65.5 106.5,57.5 C 106.5,49.8 100.5,43.5 93,42.8 C 91.2,32.3 82,24.5 70.8,24.5 C 62,24.5 54.5,29.5 50.8,36.8 C 48.5,34.8 45.6,33.7 42.5,33.7 C 35.5,33.7 29.8,39.4 29.8,46.4 C 29.8,47.4 29.9,48.4 30.2,49.3 C 25.7,51.2 22.5,55.8 22.5,61 C 22.5,67 27.5,72 33.5,72 Z" 
              fill="url(#rainCloudGrad)" 
            />
          </g>
        </svg>
      )}

      {/* 5. MALAM (Clear Night) */}
      {isNight && (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FDE047" />
            </radialGradient>
          </defs>

          {/* Twinkling Stars */}
          <circle cx="24" cy="30" r="2" fill="#FEF08A" className="animate-twinkle" style={{ animationDelay: '0s' }} />
          <circle cx="92" cy="28" r="2.5" fill="#FEF08A" className="animate-twinkle" style={{ animationDelay: '0.4s' }} />
          <circle cx="36" cy="84" r="1.5" fill="#FEF08A" className="animate-twinkle" style={{ animationDelay: '0.8s' }} />
          <circle cx="96" cy="76" r="2" fill="#FEF08A" className="animate-twinkle" style={{ animationDelay: '0.2s' }} />

          {/* Glowing Crescent Moon */}
          <path 
            d="M 70,25 C 50,25 35,40 35,60 C 35,80 50,95 70,95 C 55,95 45,82 45,60 C 45,38 55,25 70,25 Z" 
            fill="url(#moonGlow)" 
            className="animate-pulse"
          />
        </svg>
      )}
    </div>
  );
}
