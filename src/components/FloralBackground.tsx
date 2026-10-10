import React, { useMemo } from 'react';

interface FloralBackgroundProps {
  showPetals?: boolean;
}

export const FloralBackground: React.FC<FloralBackgroundProps> = ({ showPetals = true }) => {
  // Generate stable random petals
  const petals = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const left = Math.floor(Math.random() * 96) + 2; // 2% to 98%
      const duration = 7 + (i % 7) * 2; // 7s to 19s
      const delay = (i * 0.9) % 10;
      const size = 16 + (i % 5) * 6; // 16px to 40px
      const opacity = 0.45 + (i % 4) * 0.12;
      const rotation = (i * 47) % 360;
      const color = i % 3 === 0 ? '#e11d48' : i % 3 === 1 ? '#fb7185' : '#f43f5e';
      return { id: i, left, duration, delay, size, opacity, rotation, color };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft warm floral ambient gradient */}
      <div className="absolute inset-0 bg-radial from-rose-100/40 via-rose-50/30 to-amber-50/20" />

      {/* Decorative Ornate Rose Border Accents */}
      <div className="absolute -top-16 -left-16 w-64 h-64 opacity-25 text-rose-500 blur-[0.5px]">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M40 0 C70 40, 20 80, 50 110 C80 140, 40 180, 0 200 C0 100, 0 50, 40 0 Z" />
          <circle cx="90" cy="50" r="18" fill="#fda4af" opacity="0.6" />
          <circle cx="120" cy="90" r="14" fill="#fb7185" opacity="0.5" />
        </svg>
      </div>

      <div className="absolute -bottom-20 -right-20 w-80 h-80 opacity-20 text-rose-600 blur-[0.5px]">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="70" fill="#f43f5e" opacity="0.3" />
          <path d="M100 20 C120 70, 180 80, 150 130 C120 180, 80 150, 40 170 C20 120, 60 80, 100 20 Z" />
        </svg>
      </div>

      {/* Floating Rose Petals */}
      {showPetals && (
        <div className="absolute inset-0">
          {petals.map((p) => (
            <div
              key={p.id}
              className="floating-petal"
              style={{
                left: `${p.left}%`,
                top: '-40px',
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                width: `${p.size}px`,
                height: `${p.size * 1.3}px`,
                opacity: p.opacity,
              }}
            >
              {/* Detailed SVG Rose Petal */}
              <svg
                viewBox="0 0 32 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-sm filter"
                style={{ transform: `rotate(${p.rotation}deg)` }}
              >
                <path
                  d="M16 2C24 6 30 16 28 26C26 34 20 38 16 38C12 38 6 34 4 26C2 16 8 6 16 2Z"
                  fill={p.color}
                />
                {/* Petal Inner Vein / Shading */}
                <path
                  d="M16 6C19 12 21 22 17 32"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                />
                <path
                  d="M14 10C10 16 8 22 13 30"
                  stroke="#be123c"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
