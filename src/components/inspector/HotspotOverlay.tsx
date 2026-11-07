import React, { memo, useState } from 'react';
import type { HotspotCategory, SymbolHotspot } from '../../types';

export interface HotspotOverlayProps {
  readonly hotspots: readonly SymbolHotspot[];
  readonly activeHotspotId?: string | null;
  readonly isReversed?: boolean;
  readonly onSelectHotspot?: (hotspot: SymbolHotspot | null) => void;
}

const CATEGORY_BADGES: Readonly<Record<HotspotCategory, string>> = Object.freeze({
  figure: 'bg-amber-950/90 text-amber-200 border-amber-700/60',
  object: 'bg-sky-950/90 text-sky-200 border-sky-700/60',
  nature: 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60',
  architecture: 'bg-slate-900/90 text-slate-200 border-slate-600/60',
  color: 'bg-rose-950/90 text-rose-200 border-rose-700/60',
  esoteric: 'bg-purple-950/90 text-purple-200 border-purple-700/60',
});

const HotspotOverlayBase: React.FC<HotspotOverlayProps> = ({
  hotspots,
  activeHotspotId = null,
  isReversed = false,
  onSelectHotspot,
}) => {
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);

  const displayedHotspot =
    hotspots.find((h) => h.id === hoveredHotspotId) ??
    hotspots.find((h) => h.id === activeHotspotId) ??
    null;

  const dispX = displayedHotspot
    ? isReversed
      ? 100 - displayedHotspot.x
      : displayedHotspot.x
    : 50;
  const dispY = displayedHotspot
    ? isReversed
      ? 100 - displayedHotspot.y
      : displayedHotspot.y
    : 50;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {hotspots.map((spot) => {
        const isActive = spot.id === activeHotspotId;
        const pinX = isReversed ? 100 - spot.x : spot.x;
        const pinY = isReversed ? 100 - spot.y : spot.y;
        const showPing = !activeHotspotId || isActive;

        return (
          <button
            key={spot.id}
            type="button"
            aria-label={`Symbol: ${spot.label}`}
            aria-pressed={isActive}
            onClick={(e) => {
              e.stopPropagation();
              if (isActive) setHoveredHotspotId(null);
              onSelectHotspot?.(isActive ? null : spot);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setHoveredHotspotId(null);
                onSelectHotspot?.(null);
              }
            }}
            onMouseEnter={() => setHoveredHotspotId(spot.id)}
            onMouseLeave={() => setHoveredHotspotId((prev) => (prev === spot.id ? null : prev))}
            onFocus={() => setHoveredHotspotId(spot.id)}
            onBlur={() => setHoveredHotspotId((prev) => (prev === spot.id ? null : prev))}
            className="absolute pointer-events-auto h-7 w-7 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-gold rounded-full"
            style={{ left: `${pinX}%`, top: `${pinY}%` }}
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              {showPing && (
                <span
                  aria-hidden="true"
                  className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-gold"
                />
              )}
              <span
                aria-hidden="true"
                className={`relative inline-flex rounded-full h-3.5 w-3.5 border border-white/70 bg-gold shadow-md shadow-black transition-transform group-hover:scale-125 ${
                  isActive ? 'ring-4 ring-gold-light scale-125 bg-white' : ''
                }`}
              />
            </span>
          </button>
        );
      })}

      {displayedHotspot && (
        <div
          role="status"
          className="absolute pointer-events-none z-30 -translate-x-1/2 w-56 max-w-[calc(100%-1rem)] rounded-lg border border-gold/40 bg-obsidian-elevated/95 p-3 shadow-2xl backdrop-blur-md text-left"
          style={{
            left: `clamp(min(50%, 7.5rem), ${dispX}%, max(50%, calc(100% - 7.5rem)))`,
            ...(dispY > 55
              ? { bottom: `calc(${100 - dispY}% + 18px)` }
              : { top: `calc(${dispY}% + 18px)` }),
          }}
        >
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <h4 className="font-serif text-xs font-semibold text-gold-light tracking-wide truncate">
              {displayedHotspot.label}
            </h4>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded border capitalize tracking-wider font-mono ${
                CATEGORY_BADGES[displayedHotspot.category]
              }`}
            >
              {displayedHotspot.category}
            </span>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed mb-1.5 line-clamp-3">
            {displayedHotspot.summary}
          </p>
          <div className="pt-1.5 border-t border-gold/15">
            <p className="text-[10px] text-gold-light/90 italic leading-snug line-clamp-2">
              &ldquo;{displayedHotspot.esotericMeaning}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const HotspotOverlay = memo(HotspotOverlayBase);
