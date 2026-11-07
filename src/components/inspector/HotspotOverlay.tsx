import React, { memo, useId, useMemo, useState } from 'react';
import type { HotspotCategory, HotspotPoint, SymbolHotspot } from '../../types';

export interface HotspotOverlayProps {
  readonly hotspots: readonly SymbolHotspot[];
  readonly activeHotspotId?: string | null;
  readonly externalHoveredId?: string | null;
  readonly isReversed?: boolean;
  readonly showFineGrid?: boolean;
  readonly onSelectHotspot?: (hotspot: SymbolHotspot | null) => void;
  readonly onHoverHotspot?: (hotspotId: string | null) => void;
}

const CATEGORY_BADGES: Readonly<Record<HotspotCategory, string>> = Object.freeze({
  figure: 'bg-amber-950/90 text-amber-200 border-amber-700/60',
  object: 'bg-sky-950/90 text-sky-200 border-sky-700/60',
  nature: 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60',
  architecture: 'bg-slate-900/90 text-slate-200 border-slate-600/60',
  color: 'bg-rose-950/90 text-rose-200 border-rose-700/60',
  esoteric: 'bg-purple-950/90 text-purple-200 border-purple-700/60',
});

function getContourPoints(spot: SymbolHotspot, isReversed: boolean): readonly HotspotPoint[] {
  const base: readonly HotspotPoint[] =
    spot.polygon && spot.polygon.length >= 3
      ? spot.polygon
      : [
          [Math.max(spot.x - 10, 4), Math.max(spot.y - 8, 4)],
          [Math.min(spot.x + 10, 96), Math.max(spot.y - 8, 4)],
          [Math.min(spot.x + 10, 96), Math.min(spot.y + 8, 96)],
          [Math.max(spot.x - 10, 4), Math.min(spot.y + 8, 96)],
        ];

  if (!isReversed) return base;
  return base.map(([px, py]) => [100 - px, 100 - py] as const);
}

/** Converts polygon vertices into a tight, crisp contour silhouette path with rounded corners. */
function buildTightSilhouettePath(points: readonly HotspotPoint[]): string {
  const n = points.length;
  if (n === 0) return '';
  if (n < 3) {
    return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ') + ' Z';
  }

  // Exact polygon contour tracing the silhouette
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z';
}

function triggerHaptic(): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(12);
    }
  } catch {
    // Ignore unsupported vibration environments
  }
}

const HotspotOverlayBase: React.FC<HotspotOverlayProps> = ({
  hotspots,
  activeHotspotId = null,
  externalHoveredId,
  isReversed = false,
  showFineGrid = true,
  onSelectHotspot,
  onHoverHotspot,
}) => {
  const uid = useId().replace(/:/g, '');
  const [internalHoveredId, setInternalHoveredId] = useState<string | null>(null);

  const isHoverControlled = externalHoveredId !== undefined;
  const effectiveHoveredId = isHoverControlled ? externalHoveredId : internalHoveredId;

  const contourGeometryById = useMemo(() => {
    const map = new Map<
      string,
      { readonly pathData: string; readonly minY: number; readonly maxY: number }
    >();
    for (const spot of hotspots) {
      const pts = getContourPoints(spot, isReversed);
      const ys = pts.map(([, py]) => py);
      map.set(spot.id, {
        pathData: buildTightSilhouettePath(pts),
        minY: Math.min(...ys),
        maxY: Math.max(...ys),
      });
    }
    return map;
  }, [hotspots, isReversed]);

  const displayedHotspot =
    hotspots.find((h) => h.id === effectiveHoveredId) ??
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

  const displayedGeom = displayedHotspot ? contourGeometryById.get(displayedHotspot.id) : undefined;
  const minY = displayedGeom ? displayedGeom.minY : dispY;
  const maxY = displayedGeom ? displayedGeom.maxY : dispY;

  const handleHover = (id: string | null) => {
    if (!isHoverControlled) {
      setInternalHoveredId(id);
    }
    onHoverHotspot?.(id);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-xl">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-label="Card symbolism interactive contour grid"
      >
        <defs>
          {/* Global Reference Grid (Very Faint) */}
          <pattern
            id={`fine-grid-global-minor-${uid}`}
            width="2.5"
            height="2.5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 2.5 0 L 0 0 0 2.5"
              fill="none"
              stroke="rgba(212, 175, 55, 0.05)"
              strokeWidth="0.1"
            />
          </pattern>
          <pattern
            id={`fine-grid-global-major-${uid}`}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="10" fill={`url(#fine-grid-global-minor-${uid})`} />
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="rgba(212, 175, 55, 0.11)"
              strokeWidth="0.15"
            />
          </pattern>

          {/* Component-Contained Alchemical Micro-Grid (Ultra-Fine 1% Blueprint Mesh) */}
          <pattern
            id={`fine-grid-micro-mesh-${uid}`}
            width="1"
            height="1"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 1 0 L 0 0 0 1"
              fill="none"
              stroke="rgba(254, 240, 138, 0.28)"
              strokeWidth="0.08"
            />
            {/* Coordinate intersection tick */}
            <circle cx="0" cy="0" r="0.12" fill="rgba(254, 240, 138, 0.55)" />
          </pattern>

          <pattern
            id={`fine-grid-active-${uid}`}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <rect width="5" height="5" fill={`url(#fine-grid-micro-mesh-${uid})`} />
            <rect width="5" height="5" fill="rgba(212, 175, 55, 0.16)" />
            <path
              d="M 5 0 L 0 0 0 5"
              fill="none"
              stroke="rgba(254, 240, 138, 0.65)"
              strokeWidth="0.18"
            />
          </pattern>

          <filter
            id={`outline-glow-${uid}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blurNear" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blurFar" />
            <feMerge>
              <feMergeNode in="blurFar" />
              <feMergeNode in="blurNear" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Global Reference Coordinate Grid (Ultra-Subtle) */}
        {showFineGrid && (
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill={`url(#fine-grid-global-major-${uid})`}
            className="pointer-events-none"
          />
        )}

        {/* Interactive Symbol Contour Regions */}
        {hotspots.map((spot) => {
          const isActive = spot.id === activeHotspotId;
          const isHighlighted = spot.id === displayedHotspot?.id;
          const hasAnySelection = Boolean(displayedHotspot);
          const pathData = contourGeometryById.get(spot.id)?.pathData ?? '';

          return (
            <g key={spot.id} className="pointer-events-auto">
              {isHighlighted && (
                <path
                  d={pathData}
                  fill={`url(#fine-grid-active-${uid})`}
                  stroke="#d4af37"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={`url(#outline-glow-${uid})`}
                  className="pointer-events-none"
                />
              )}

              <path
                d={pathData}
                role="button"
                tabIndex={0}
                aria-label={`Symbol: ${spot.label}`}
                aria-pressed={isActive}
                data-hotspot-id={spot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic();
                  if (isActive) {
                    handleHover(null);
                    onSelectHotspot?.(null);
                  } else {
                    onSelectHotspot?.(spot);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    triggerHaptic();
                    if (isActive) {
                      handleHover(null);
                      onSelectHotspot?.(null);
                    } else {
                      onSelectHotspot?.(spot);
                    }
                  } else if (e.key === 'Escape') {
                    handleHover(null);
                    onSelectHotspot?.(null);
                  }
                }}
                onMouseEnter={() => handleHover(spot.id)}
                onMouseLeave={() => {
                  if (effectiveHoveredId === spot.id) handleHover(null);
                }}
                onFocus={() => handleHover(spot.id)}
                onBlur={() => {
                  if (effectiveHoveredId === spot.id) handleHover(null);
                }}
                fill={
                  isHighlighted
                    ? 'rgba(243, 217, 125, 0.12)'
                    : hasAnySelection
                      ? 'rgba(12, 13, 20, 0.01)'
                      : 'rgba(212, 175, 55, 0.04)'
                }
                stroke={
                  isHighlighted
                    ? '#fef08a'
                    : hasAnySelection
                      ? 'rgba(212, 175, 55, 0.24)'
                      : 'rgba(212, 175, 55, 0.55)'
                }
                strokeWidth={isHighlighted ? '0.85' : '0.45'}
                strokeDasharray={isHighlighted ? undefined : '1.8 1.2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="cursor-pointer focus:outline-none"
                style={{ pointerEvents: 'all' }}
              />
            </g>
          );
        })}
      </svg>

      {displayedHotspot && (
        <div
          role="status"
          className="absolute pointer-events-none z-30 -translate-x-1/2 w-56 max-w-[calc(100%-1rem)] rounded-lg border border-gold/50 bg-obsidian-elevated/95 p-3 shadow-2xl backdrop-blur-md text-left"
          style={{
            left: `clamp(min(50%, 7.5rem), ${dispX}%, max(50%, calc(100% - 7.5rem)))`,
            ...(dispY > 52
              ? { bottom: `calc(${Math.min(Math.max(100 - minY, 16), 72)}% + 10px)` }
              : { top: `calc(${Math.min(Math.max(maxY, 16), 72)}% + 10px)` }),
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
