import React, { useMemo } from 'react';

interface FloralBackgroundProps {
  showPetals?: boolean;
}

export const FloralBackground: React.FC<FloralBackgroundProps> = ({ showPetals = true }) => {
  // Diverse attractive flowers (marigold/गेंदा, rose/गुलाब, lotus/कमल petals)
  const petals = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const left = Math.floor(Math.random() * 92) + 4;
      const duration = 10 + (i % 5) * 3;
      const delay = (i * 1.2) % 10;
      const size = 20 + (i % 4) * 6;
      const rotation = (i * 61) % 360;
      // Vibrant flower colors: marigold orange, golden yellow, rose pink, royal crimson
      const flowerType = i % 3; // 0 = marigold petal, 1 = rose, 2 = lotus pink
      const color = flowerType === 0 ? '#f59e0b' : flowerType === 1 ? '#e11d48' : '#ec4899';
      return { id: i, left, duration, delay, size, rotation, color, flowerType };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft warm festive gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fffbeb] via-[#fff1f2]/60 to-[#fdf4ff]" />

      {/* Decorative Ornate Floral Corner Vines */}
      <div className="absolute -top-16 -left-16 w-64 h-64 opacity-25 text-amber-500 blur-[0.5px]">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <circle cx="60" cy="60" r="35" fill="#f59e0b" />
          <circle cx="100" cy="40" r="25" fill="#e11d48" />
          <circle cx="40" cy="100" r="25" fill="#ec4899" />
        </svg>
      </div>

      <div className="absolute -top-16 -right-16 w-64 h-64 opacity-25 text-rose-500 blur-[0.5px]">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <circle cx="140" cy="60" r="35" fill="#e11d48" />
          <circle cx="100" cy="40" r="25" fill="#f59e0b" />
          <circle cx="160" cy="100" r="25" fill="#ec4899" />
        </svg>
      </div>

      <div className="absolute -bottom-20 -right-20 w-72 h-72 opacity-20 text-pink-500 blur-[0.5px]">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <circle cx="120" cy="120" r="50" fill="#f43f5e" />
          <circle cx="80" cy="140" r="40" fill="#fbbf24" />
        </svg>
      </div>

      {/* Drifting Flower Petals */}
      {showPetals && (
        <div className="absolute inset-0">
          {petals.map((p) => (
            <div
              key={p.id}
              className="floating-petal"
              style={{
                left: `${p.left}%`,
                top: '-35px',
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                width: `${p.size}px`,
                height: `${p.size * 1.3}px`,
                opacity: 0.55,
              }}
            >
              <svg
                viewBox="0 0 32 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-xs"
                style={{ transform: `rotate(${p.rotation}deg)` }}
              >
                <path
                  d="M16 2C24 6 30 16 28 26C26 34 20 38 16 38C12 38 6 34 4 26C2 16 8 6 16 2Z"
                  fill={p.color}
                />
                <path
                  d="M16 6C19 12 21 22 17 32"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
