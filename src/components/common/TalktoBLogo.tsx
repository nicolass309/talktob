import React from 'react';

interface TalktoBLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export const TalktoBLogo: React.FC<TalktoBLogoProps> = ({ size = 'md', showSubtext = false }) => {
  const height = size === 'sm' ? 36 : size === 'lg' ? 68 : 48;

  return (
    <div className="talktob-logo-container" style={{ height: `${height}px` }}>
      <svg
        viewBox="0 0 280 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="talktob-svg-element"
      >
        {/* LSCH 3 HAND GESTURES - Clean Crisp Vector Line-Art (Exact match to official TalktoB logo) */}
        <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* HAND 1: Two fingers up (Index + Middle) + closed fist with thumb curve */}
          <g transform="translate(72, 10)">
            {/* Palm & Base outline */}
            <path d="M 6 26 C 6 40, 26 40, 26 26" />
            {/* Index Finger */}
            <path d="M 11 26 L 11 8 C 11 4, 15 4, 15 8 L 15 26" fill="#FFFFFF" />
            {/* Middle Finger */}
            <path d="M 17 26 L 17 8 C 17 4, 21 4, 21 8 L 21 26" fill="#FFFFFF" />
            {/* Curved Thumb across palm */}
            <path d="M 6 22 C 2 22, 2 34, 14 34 C 22 34, 24 28, 24 22" strokeWidth="5" />
          </g>

          {/* HAND 2: Two fingers up (Index + Middle) + closed fist with thumb curve */}
          <g transform="translate(122, 10)">
            {/* Palm & Base outline */}
            <path d="M 6 26 C 6 40, 26 40, 26 26" />
            {/* Index Finger */}
            <path d="M 11 26 L 11 8 C 11 4, 15 4, 15 8 L 15 26" fill="#FFFFFF" />
            {/* Middle Finger */}
            <path d="M 17 26 L 17 8 C 17 4, 21 4, 21 8 L 21 26" fill="#FFFFFF" />
            {/* Curved Thumb across palm */}
            <path d="M 6 22 C 2 22, 2 34, 14 34 C 22 34, 24 28, 24 22" strokeWidth="5" />
          </g>

          {/* HAND 3: Four fingers up + open thumb curve */}
          <g transform="translate(172, 6)">
            {/* Index Finger */}
            <path d="M 5 24 L 5 8 C 5 5, 8 5, 8 8 L 8 24" fill="#FFFFFF" />
            {/* Middle Finger */}
            <path d="M 10 24 L 10 5 C 10 2, 13 2, 13 5 L 13 24" fill="#FFFFFF" />
            {/* Ring Finger */}
            <path d="M 15 24 L 15 7 C 15 4, 18 4, 18 7 L 18 24" fill="#FFFFFF" />
            {/* Pinky Finger */}
            <path d="M 20 24 L 20 10 C 20 7, 23 7, 23 10 L 23 24" fill="#FFFFFF" />
            {/* Palm Base & Curved Thumb */}
            <path d="M 5 24 C 5 38, 23 38, 23 24" />
            <path d="M 5 22 C 1 22, 1 32, 12 33 C 20 34, 23 28, 23 22" strokeWidth="5" />
          </g>
        </g>

        {/* BRAND WORDMARK: "Talk" (White) + "to" (Cyan #00b2e3) + "B" (White) */}
        <text
          x="140"
          y="98"
          textAnchor="middle"
          fontFamily="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="48"
          letterSpacing="-1px"
        >
          <tspan fill="#FFFFFF">Talk</tspan>
          <tspan fill="#00b2e3">to</tspan>
          <tspan fill="#FFFFFF">B</tspan>
        </text>

        {/* SUBTEXT: PLATA FORMA LSCH (Official Tagline) */}
        {showSubtext && (
          <text
            x="140"
            y="120"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', -apple-system, sans-serif"
            fontWeight="800"
            fontSize="12"
            fill="#00b2e3"
            letterSpacing="3px"
          >
            PLATA FORMA LSCH
          </text>
        )}
      </svg>

      <style>{`
        .talktob-logo-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        .talktob-svg-element {
          height: 100%;
          width: auto;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
        }
      `}</style>
    </div>
  );
};
