import React, { memo, useId } from 'react';

export interface MagicCircleBackgroundProps {
  readonly size?: number | string;
  readonly className?: string;
  readonly rotate?: boolean;
}

const OUTER_TICKS_COUNT = 48;
const MIDDLE_TICKS_COUNT = 32;
const CX = 200;
const CY = 200;

// Precompute radial ticks for outer and middle track rings
const OUTER_TICKS = Array.from({ length: OUTER_TICKS_COUNT }, (_, i) => {
  const rad = (i * 360 * Math.PI) / (OUTER_TICKS_COUNT * 180);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x1: Number((CX + 166 * cos).toFixed(2)),
    y1: Number((CY + 166 * sin).toFixed(2)),
    x2: Number((CX + 186 * cos).toFixed(2)),
    y2: Number((CY + 186 * sin).toFixed(2)),
  };
});

const MIDDLE_TICKS = Array.from({ length: MIDDLE_TICKS_COUNT }, (_, i) => {
  const rad = ((i * 360 + 11.25) * Math.PI) / (MIDDLE_TICKS_COUNT * 180);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x1: Number((CX + 102 * cos).toFixed(2)),
    y1: Number((CY + 102 * sin).toFixed(2)),
    x2: Number((CX + 114 * cos).toFixed(2)),
    y2: Number((CY + 114 * sin).toFixed(2)),
  };
});

// Build 8-pointed inner star polygon (alternating outer r=102 and inner r=50 points)
const INNER_STAR_POINTS = Array.from({ length: 16 }, (_, i) => {
  const r = i % 2 === 0 ? 102 : 50;
  const rad = (i * (360 / 16) * Math.PI) / 180;
  return `${(CX + r * Math.cos(rad)).toFixed(2)},${(CY + r * Math.sin(rad)).toFixed(2)}`;
}).join(' ');

// Build octagram diagonals connecting opposite points
const INNER_STAR_DIAGONALS = Array.from({ length: 8 }, (_, i) => {
  const rad = (i * 45 * Math.PI) / 180;
  const opp = rad + Math.PI;
  return {
    x1: Number((CX + 102 * Math.cos(rad)).toFixed(2)),
    y1: Number((CY + 102 * Math.sin(rad)).toFixed(2)),
    x2: Number((CX + 50 * Math.cos(opp)).toFixed(2)),
    y2: Number((CY + 50 * Math.sin(opp)).toFixed(2)),
  };
});

// Square 1 points (rotated 0°) and Square 2 points (rotated 45°) with double rims
function makeSquarePoints(radius: number, angleOffsetDeg: number): string {
  return [0, 90, 180, 270]
    .map((deg) => {
      const rad = ((deg + angleOffsetDeg) * Math.PI) / 180;
      return `${(CX + radius * Math.cos(rad)).toFixed(2)},${(CY + radius * Math.sin(rad)).toFixed(2)}`;
    })
    .join(' ');
}

const SQ1_OUTER = makeSquarePoints(166, 0);
const SQ1_INNER = makeSquarePoints(161, 0);
const SQ2_OUTER = makeSquarePoints(166, 45);
const SQ2_INNER = makeSquarePoints(161, 45);

const MagicCircleBackgroundBase: React.FC<MagicCircleBackgroundProps> = ({
  size = '100%',
  className = '',
  rotate = true,
}) => {
  const uid = useId().replace(/:/g, '');
  const glowId = `magic-circle-core-glow-${uid}`;

  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`pointer-events-none select-none flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 400 400"
        className={`w-full h-full text-gold transition-opacity duration-700 ${
          rotate ? 'animate-magic-circle-spin' : ''
        }`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#d4af37" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Radial Backlight */}
        <circle cx={CX} cy={CY} r="195" fill={`url(#${glowId})`} stroke="none" />

        {/* Outer Perimeter Double Rings */}
        <circle cx={CX} cy={CY} r="194" strokeWidth="1.8" strokeOpacity="0.85" />
        <circle cx={CX} cy={CY} r="188" strokeWidth="1.2" strokeOpacity="0.75" />
        <circle cx={CX} cy={CY} r="166" strokeWidth="1.2" strokeOpacity="0.75" />

        {/* Outer Crenellated Track Radial Ticks */}
        {OUTER_TICKS.map((t, idx) => (
          <line
            key={`ot-${idx}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            strokeWidth="1.1"
            strokeOpacity="0.65"
          />
        ))}

        {/* Intersecting Rotated Squares (Octagram) with Double Rim */}
        <polygon points={SQ1_OUTER} strokeWidth="1.4" strokeOpacity="0.8" />
        <polygon points={SQ1_INNER} strokeWidth="0.9" strokeOpacity="0.55" />
        <polygon points={SQ2_OUTER} strokeWidth="1.4" strokeOpacity="0.8" />
        <polygon points={SQ2_INNER} strokeWidth="0.9" strokeOpacity="0.55" />

        {/* Middle Track Double Rings */}
        <circle cx={CX} cy={CY} r="114" strokeWidth="1.2" strokeOpacity="0.75" />
        <circle cx={CX} cy={CY} r="102" strokeWidth="1.2" strokeOpacity="0.75" />

        {/* Middle Track Radial Ticks */}
        {MIDDLE_TICKS.map((t, idx) => (
          <line
            key={`mt-${idx}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            strokeWidth="1"
            strokeOpacity="0.6"
          />
        ))}

        {/* Inner 8-Pointed Star & Diagonals */}
        <polygon
          points={INNER_STAR_POINTS}
          strokeWidth="1.3"
          strokeOpacity="0.85"
          fill="rgba(212, 175, 55, 0.03)"
        />
        {INNER_STAR_DIAGONALS.map((d, idx) => (
          <line
            key={`sd-${idx}`}
            x1={d.x1}
            y1={d.y1}
            x2={d.x2}
            y2={d.y2}
            strokeWidth="0.8"
            strokeOpacity="0.45"
          />
        ))}

        {/* Inner Core Double Rings */}
        <circle cx={CX} cy={CY} r="50" strokeWidth="1.3" strokeOpacity="0.85" />
        <circle cx={CX} cy={CY} r="46" strokeWidth="0.9" strokeOpacity="0.6" />
      </svg>
    </div>
  );
};

export const MagicCircleBackground = memo(MagicCircleBackgroundBase);
