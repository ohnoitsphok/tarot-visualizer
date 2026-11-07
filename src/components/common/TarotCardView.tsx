import React, { useState } from 'react';
import type { CardOrientation, SymbolHotspot, TarotCard } from '../../types';
import { HotspotOverlay } from '../inspector/HotspotOverlay';

export interface TarotCardViewProps {
  readonly card: TarotCard;
  readonly orientation?: CardOrientation;
  readonly isFlipped?: boolean;
  readonly showHotspots?: boolean;
  readonly activeHotspotId?: string | null;
  readonly onSelectHotspot?: (hotspot: SymbolHotspot | null) => void;
  readonly onFlip?: () => void;
  readonly className?: string;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  orientation = 'upright',
  isFlipped = false,
  showHotspots = true,
  activeHotspotId = null,
  onSelectHotspot,
  onFlip,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const isReversed = orientation === 'reversed';

  return (
    <div
      className={`relative select-none perspective-1000 ${className}`}
      style={{ aspectRatio: '4 / 7' }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 preserve-3d rounded-xl shadow-2xl shadow-black/80 ${
          isFlipped ? 'rotate-y-180' : 'rotate-y-0'
        }`}
      >
        {/* FRONT FACE (Card Art / SVG Fallback) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden border border-gold/40 bg-obsidian-surface flex flex-col transition-transform duration-500 ${
            isReversed ? 'rotate-180' : ''
          }`}
        >
          {/* Card Imagery or Procedural Fallback */}
          {!imageError ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-b from-obsidian-elevated via-obsidian-surface to-obsidian border-2 border-gold/30 text-center relative overflow-hidden">
              {/* Sacred geometry corner accents */}
              <div className="absolute top-2 left-2 text-gold/40 text-xs">✦</div>
              <div className="absolute top-2 right-2 text-gold/40 text-xs">✦</div>
              <div className="absolute bottom-2 left-2 text-gold/40 text-xs">✦</div>
              <div className="absolute bottom-2 right-2 text-gold/40 text-xs">✦</div>

              {/* Card Top: Numeral & Astrology */}
              <div className="pt-2">
                <span className="font-serif text-gold-light tracking-widest text-sm uppercase">
                  {card.numerology.numeral}
                </span>
                <p className="text-[10px] tracking-wider text-slate-400 uppercase mt-0.5">
                  {card.astrology}
                </p>
              </div>

              {/* Card Center: Symbolic Motif */}
              <div className="my-auto flex flex-col items-center justify-center py-4">
                <div className="w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5 relative mb-3">
                  <div className="w-14 h-14 rounded-full border border-dashed border-gold/30 flex items-center justify-center">
                    <span className="text-xl text-gold">
                      {card.arcana === 'major' ? '❂' : '✦'}
                    </span>
                  </div>
                </div>
                <h3 className="font-serif text-lg font-medium text-slate-100 tracking-wide px-2">
                  {card.name}
                </h3>
                <span className="text-xs text-gold/80 italic mt-1 max-w-[200px]">
                  {card.archetype}
                </span>
              </div>

              {/* Card Bottom: Element & Suit */}
              <div className="pb-2 border-t border-gold/20 pt-2 flex items-center justify-between px-3 text-[11px] text-slate-400">
                <span className="capitalize">{card.element}</span>
                <span>{card.hebrewLetter ? `Letter: ${card.hebrewLetter}` : (card.suit ? `Suit of ${card.suit}` : '')}</span>
              </div>
            </div>
          )}

          {/* Hotspots Overlay (only in front face) */}
          {showHotspots && card.hotspots.length > 0 && (
            <HotspotOverlay
              hotspots={card.hotspots}
              activeHotspotId={activeHotspotId}
              isReversed={isReversed}
              onSelectHotspot={onSelectHotspot}
            />
          )}

          {/* Orientation indicator badge */}
          {isReversed && (
            <div className="absolute top-3 left-3 bg-red-950/90 text-red-300 border border-red-700/60 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase shadow">
              Reversed
            </div>
          )}
        </div>

        {/* BACK FACE (Decorative Tarot Card Backing) */}
        <div
          onClick={onFlip}
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden border-2 border-gold/50 bg-obsidian-surface p-3 cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="w-full h-full border border-gold/30 rounded-lg p-2 flex flex-col items-center justify-center bg-gradient-to-br from-obsidian via-obsidian-elevated to-obsidian relative">
            <div className="w-24 h-24 rounded-full border-2 border-gold/40 flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-full border border-gold/60 flex items-center justify-center">
                <span className="text-2xl text-gold animate-pulse">✧</span>
              </div>
            </div>
            <p className="mt-4 font-serif text-xs text-gold/80 tracking-widest uppercase">
              Rider-Waite-Smith
            </p>
            <span className="text-[10px] text-slate-500 mt-1">Tap to reveal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
