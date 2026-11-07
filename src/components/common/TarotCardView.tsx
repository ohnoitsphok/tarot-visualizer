import React, { memo, useState } from 'react';
import type { CardOrientation, TarotCard } from '../../types';

export interface TarotCardViewProps {
  readonly card: TarotCard;
  readonly orientation?: CardOrientation;
  readonly isFlipped?: boolean;
  readonly onFlip?: () => void;
  readonly overlay?: React.ReactNode;
  readonly loading?: 'eager' | 'lazy';
  readonly className?: string;
}

const TarotCardViewBase: React.FC<TarotCardViewProps> = ({
  card,
  orientation = 'upright',
  isFlipped = false,
  onFlip,
  overlay,
  loading = 'lazy',
  className = '',
}) => {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const resolvedImageUrl = card.imageUrl.startsWith('/')
    ? `${baseUrl.replace(/\/$/, '')}/${card.imageUrl.replace(/^\//, '')}`
    : card.imageUrl;
  const isSafeUrl = card.imageUrl.startsWith('/cards/');
  const imageError = !isSafeUrl || failedImageUrl === resolvedImageUrl;
  const isReversed = orientation === 'reversed';
  const canFlip = Boolean(onFlip) || isFlipped;

  const frontFace = (
    <div
      aria-hidden={isFlipped || undefined}
      className={`${
        canFlip ? 'absolute inset-0 backface-hidden' : 'relative'
      } w-full h-full rounded-xl overflow-hidden border border-gold/40 bg-obsidian-surface shadow-2xl shadow-black/80 flex flex-col`}
    >
      {/* Artwork wrapper rotates 180deg when reversed so badges & overlays stay upright */}
      <div
        className={`w-full h-full transition-transform duration-500 ${
          isReversed ? 'rotate-180' : ''
        }`}
      >
        {!imageError ? (
          <img
            src={resolvedImageUrl}
            alt={`${card.name} (${orientation})`}
            loading={loading}
            decoding="async"
            onLoad={() => {
              if (failedImageUrl !== null) setFailedImageUrl(null);
            }}
            onError={() => setFailedImageUrl(resolvedImageUrl)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-b from-obsidian-elevated via-obsidian-surface to-obsidian border-2 border-gold/30 text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 text-gold/40 text-xs" aria-hidden="true">✦</div>
            <div className="absolute top-2 right-2 text-gold/40 text-xs" aria-hidden="true">✦</div>
            <div className="absolute bottom-2 left-2 text-gold/40 text-xs" aria-hidden="true">✦</div>
            <div className="absolute bottom-2 right-2 text-gold/40 text-xs" aria-hidden="true">✦</div>

            <div className="pt-2">
              <span className="font-serif text-gold-light tracking-widest text-sm uppercase">
                {card.numerology.numeral}
              </span>
              <p className="text-[10px] tracking-wider text-slate-400 uppercase mt-0.5">
                {card.astrology}
              </p>
            </div>

            <div className="my-auto flex flex-col items-center justify-center py-4">
              <div className="w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5 relative mb-3">
                <div className="w-14 h-14 rounded-full border border-dashed border-gold/30 flex items-center justify-center">
                  <span className="text-xl text-gold" aria-hidden="true">
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

            <div className="pb-2 border-t border-gold/20 pt-2 flex items-center justify-between px-3 text-[11px] text-slate-400">
              <span className="capitalize">{card.element}</span>
              <span>
                {card.hebrewLetter
                  ? `Letter: ${card.hebrewLetter}`
                  : card.suit
                    ? `Suit of ${card.suit}`
                    : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      {!isFlipped && overlay}

      {isReversed && (
        <div className="absolute top-3 left-3 z-10 bg-red-950/90 text-red-200 border border-red-700/60 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase shadow">
          Reversed
        </div>
      )}
    </div>
  );

  if (!canFlip) {
    return (
      <div className={`relative select-none aspect-tarot ${className}`}>
        {frontFace}
      </div>
    );
  }

  return (
    <div className={`relative select-none aspect-tarot perspective-1000 ${className}`}>
      <div
        className={`relative w-full h-full transition-transform duration-700 preserve-3d rounded-xl ${
          isFlipped ? 'rotate-y-180' : 'rotate-y-0'
        }`}
      >
        {frontFace}

        {/* BACK FACE (mounted only when card supports 3D flip) */}
        <button
          type="button"
          onClick={onFlip}
          disabled={!onFlip}
          aria-hidden={!isFlipped || undefined}
          tabIndex={isFlipped ? 0 : -1}
          aria-label={`Reveal ${card.name}`}
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden border-2 border-gold/50 bg-obsidian-surface p-3 shadow-2xl shadow-black/80 cursor-pointer flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <div className="w-full h-full border border-gold/30 rounded-lg p-2 flex flex-col items-center justify-center bg-gradient-to-br from-obsidian via-obsidian-elevated to-obsidian relative">
            <div className="w-24 h-24 rounded-full border-2 border-gold/40 flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-full border border-gold/60 flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className={`text-2xl text-gold ${isFlipped ? 'motion-safe:animate-pulse' : ''}`}
                >
                  ✧
                </span>
              </div>
            </div>
            <p className="mt-4 font-serif text-xs text-gold/80 tracking-widest uppercase">
              Rider-Waite-Smith
            </p>
            <span className="text-[10px] text-slate-400 mt-1">Tap to reveal</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export const TarotCardView = memo(TarotCardViewBase);
