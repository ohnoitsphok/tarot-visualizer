import React, { useState } from 'react';
import type { SymbolHotspot } from '../../types';

export interface HotspotOverlayProps {
  readonly hotspots: readonly SymbolHotspot[];
  readonly activeHotspotId?: string | null;
  readonly isReversed?: boolean;
  readonly onSelectHotspot?: (hotspot: SymbolHotspot | null) => void;
}

const CATEGORY_STYLES: Record<string, { badge: string; ring: string }> = {
  figure: { badge: 'bg-amber-950/90 text-amber-300 border-amber-700/60', ring: 'ring-amber-400' },
  object: { badge: 'bg-sky-950/90 text-sky-300 border-sky-700/60', ring: 'ring-sky-400' },
  nature: { badge: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60', ring: 'ring-emerald-400' },
  architecture: { badge: 'bg-slate-900/90 text-slate-300 border-slate-600/60', ring: 'ring-slate-300' },
  color: { badge: 'bg-rose-950/90 text-rose-300 border-rose-700/60', ring: 'ring-rose-400' },
  esoteric: { badge: 'bg-purple-950/90 text-purple-300 border-purple-700/60', ring: 'ring-purple-400' },
};

export const HotspotOverlay: React.FC<HotspotOverlayProps> = ({
  hotspots,
  activeHotspotId = null,
  isReversed = false,
  onSelectHotspot,
}) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<SymbolHotspot | null>(null);

  const displayedHotspot = hotspots.find((h) => h.id === activeHotspotId) || hoveredHotspot;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Hotspot Pins */}
      {hotspots.map((spot) => {
        const isActive = spot.id === activeHotspotId;

        return (
          <button
            key={spot.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectHotspot?.(isActive ? null : spot);
            }}
            onMouseEnter={() => setHoveredHotspot(spot)}
            onMouseLeave={() => setHoveredHotspot(null)}
            onFocus={() => setHoveredHotspot(spot)}
            onBlur={() => setHoveredHotspot(null)}
            aria-label={`Symbol: ${spot.label}`}
            className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 group focus:outline-none focus:ring-2 focus:ring-gold rounded-full transition-transform duration-200 ${
              isReversed ? 'rotate-180' : ''
            }`}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              {/* Outer pulsing beacon */}
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-gold`}
              />
              {/* Core Pin */}
              <span
                className={`relative inline-flex rounded-full h-3.5 w-3.5 border border-white/60 bg-gold shadow-md shadow-black transition-transform group-hover:scale-125 ${
                  isActive ? 'ring-4 ring-gold-light scale-125 bg-white' : ''
                }`}
              />
            </span>
          </button>
        );
      })}

      {/* Floating Tooltip Card */}
      {displayedHotspot && (
        <div
          className={`absolute pointer-events-auto z-30 transition-all duration-200 w-56 rounded-lg border border-gold/40 bg-obsidian-elevated/95 p-3 shadow-2xl backdrop-blur-md text-left ${
            isReversed ? 'rotate-180' : ''
          }`}
          style={{
            // Keep tooltip safely in viewport bounds
            left: `${Math.min(Math.max(displayedHotspot.x, 20), 80)}%`,
            top: displayedHotspot.y > 60 ? `${displayedHotspot.y - 18}%` : `${displayedHotspot.y + 12}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <h4 className="font-serif text-xs font-semibold text-gold-light tracking-wide truncate">
              {displayedHotspot.label}
            </h4>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded border capitalize tracking-wider font-mono ${
                CATEGORY_STYLES[displayedHotspot.category]?.badge ?? 'bg-purple-950 text-purple-300'
              }`}
            >
              {displayedHotspot.category}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-1.5 line-clamp-3">
            {displayedHotspot.summary}
          </p>
          <div className="pt-1.5 border-t border-gold/15">
            <p className="text-[10px] text-gold/90 italic leading-snug line-clamp-2">
              &ldquo;{displayedHotspot.esotericMeaning}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
