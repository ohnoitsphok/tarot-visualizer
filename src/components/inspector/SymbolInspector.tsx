import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  Grid,
  Layers,
  RotateCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { CARD_BY_ID, CARDS } from '../../data/cards';
import { SUITS, type CardOrientation, type Suit, type SymbolHotspot, type TarotCard } from '../../types';
import { MagicCircleBackground } from '../common/MagicCircleBackground';
import { TarotCardView } from '../common/TarotCardView';
import { HotspotOverlay } from './HotspotOverlay';

export type InspectorStage = 'deck' | 'grid' | 'detail';
export type DeckFilter = 'all' | 'major' | Suit;

export interface SymbolInspectorProps {
  readonly stage?: InspectorStage;
  readonly onStageChange?: (nextStage: InspectorStage) => void;
}

interface FlyOriginRect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

const MAJOR_CARDS: readonly TarotCard[] = CARDS.filter((c) => c.arcana === 'major');
const MINOR_CARDS: readonly TarotCard[] = CARDS.filter((c) => c.arcana === 'minor');

const SEARCH_INDEX: ReadonlyMap<string, string> = new Map(
  CARDS.map((c) => [
    c.id,
    `${c.name}\n${c.archetype}\n${c.astrology}\n${c.numerology.numeral}`.toLowerCase(),
  ]),
);

const FILTER_OPTIONS: readonly { readonly id: DeckFilter; readonly label: string; readonly count: number }[] =
  Object.freeze([
    { id: 'all', label: 'Full Deck', count: 78 },
    { id: 'major', label: 'Major Arcana', count: 22 },
    ...SUITS.map((suit) => ({
      id: suit,
      label: suit.charAt(0).toUpperCase() + suit.slice(1),
      count: 14,
    })),
  ]);

function triggerHaptic(ms = 15): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(ms);
    }
  } catch {
    // Ignore unsupported vibration environments
  }
}

export const SymbolInspector: React.FC<SymbolInspectorProps> = ({
  stage: controlledStage,
  onStageChange,
}) => {
  const [internalStage, setInternalStage] = useState<InspectorStage>('deck');
  const stage = controlledStage ?? internalStage;

  const updateStage = useCallback(
    (next: InspectorStage) => {
      if (controlledStage === undefined) {
        setInternalStage(next);
      }
      onStageChange?.(next);
    },
    [controlledStage, onStageChange],
  );

  const [deckFilter, setDeckFilter] = useState<DeckFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCardId, setSelectedCardId] = useState<string>('the-fool');
  const [orientation, setOrientation] = useState<CardOrientation>('upright');
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [showFineGrid, setShowFineGrid] = useState<boolean>(true);

  const flyOriginRef = useRef<FlyOriginRect | null>(null);
  const centerCardRef = useRef<HTMLDivElement | null>(null);

  const selectedCard: TarotCard = CARD_BY_ID.get(selectedCardId) ?? CARDS[0]!;

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CARDS.filter((c) => {
      if (deckFilter === 'major' && c.arcana !== 'major') return false;
      if (deckFilter !== 'all' && deckFilter !== 'major' && c.suit !== deckFilter) return false;
      if (q && !SEARCH_INDEX.get(c.id)?.includes(q)) return false;
      return true;
    });
  }, [deckFilter, searchQuery]);

  // Execute compositor-only FLIP flying animation when card arrives in center stage from the grid
  useEffect(() => {
    if (stage !== 'detail') return;
    const origin = flyOriginRef.current;
    const el = centerCardRef.current;
    flyOriginRef.current = null;

    if (!origin || !el || typeof el.animate !== 'function') return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const dest = el.getBoundingClientRect();
    if (dest.width === 0 || dest.height === 0) return;

    const dx = origin.left + origin.width / 2 - (dest.left + dest.width / 2);
    const dy = origin.top + origin.height / 2 - (dest.top + dest.height / 2);
    const sx = Math.max(origin.width / dest.width, 0.22);
    const sy = Math.max(origin.height / dest.height, 0.22);

    const anim = el.animate(
      [
        {
          transform: `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`,
        },
        {
          transform: 'translate3d(0, 0, 0) scale(1, 1)',
        },
      ],
      {
        duration: 480,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    );
    return () => anim.cancel();
  }, [stage, selectedCardId]);

  const handleOpenDeck = () => {
    triggerHaptic(20);
    updateStage('grid');
  };

  const handleSelectCardFromGrid = (card: TarotCard, e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHaptic(18);
    const rect = e.currentTarget.getBoundingClientRect();
    flyOriginRef.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
    setSelectedCardId(card.id);
    setActiveHotspotId(null);
    setHoveredHotspotId(null);
    updateStage('detail');
  };

  const handleSelectHotspot = useCallback((spot: SymbolHotspot | null) => {
    setActiveHotspotId(spot?.id ?? null);
  }, []);

  const handleHoverHotspot = useCallback((spotId: string | null) => {
    setHoveredHotspotId(spotId);
  }, []);

  const stepCard = (delta: number) => {
    const pool = filteredCards.length > 0 ? filteredCards : CARDS;
    const idx = pool.findIndex((c) => c.id === selectedCard.id);
    const nextIdx = idx === -1 ? 0 : (idx + delta + pool.length) % pool.length;
    const nextCard = pool[nextIdx];
    if (nextCard) {
      setSelectedCardId(nextCard.id);
      setActiveHotspotId(null);
      setHoveredHotspotId(null);
    }
  };

  const isReversed = orientation === 'reversed';
  const currentMeaning = isReversed ? selectedCard.reversed : selectedCard.upright;

  const hotspotOverlay = useMemo(
    () =>
      selectedCard.hotspots.length > 0 ? (
        <HotspotOverlay
          key={selectedCard.id}
          hotspots={selectedCard.hotspots}
          activeHotspotId={activeHotspotId}
          externalHoveredId={hoveredHotspotId}
          isReversed={isReversed}
          showFineGrid={showFineGrid}
          onSelectHotspot={handleSelectHotspot}
          onHoverHotspot={handleHoverHotspot}
        />
      ) : null,
    [
      selectedCard.id,
      selectedCard.hotspots,
      activeHotspotId,
      hoveredHotspotId,
      isReversed,
      showFineGrid,
      handleSelectHotspot,
      handleHoverHotspot,
    ],
  );

  // STAGE 1: CLOSED 3D TAROT DECK WITH ROTATING MAGIC CIRCLE BACKGROUND
  if (stage === 'deck') {
    return (
      <section
        aria-label="Tarot Deck Sanctuary"
        className="w-full min-h-[calc(100vh-8.5rem)] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      >
        {/* Faint Magic Circle Pattern Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MagicCircleBackground
            size="min(88vw, 640px)"
            className="opacity-20 text-gold"
            rotate
          />
        </div>

        <div className="text-center max-w-xl mx-auto mb-8 relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-serif uppercase tracking-widest text-gold-light bg-gold/10 border border-gold/30 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-gold" aria-hidden="true" />
            Rider-Waite-Smith Sanctuary
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-semibold text-gold-light tracking-wide">
            The 78 Keys of Wisdom
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Hover over the sealed deck to attune its mystical energy. Click or tap to break the seal
            and open the cards.
          </p>
        </div>

        {/* Interactive 3D Layered Deck Button (Keeps Tremor on Deck) */}
        <button
          type="button"
          onClick={handleOpenDeck}
          aria-label="Open Tarot Deck into individual cards"
          className="group relative w-60 sm:w-68 aspect-tarot rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold mystic-hover-interactive z-10"
        >
          {/* Stacked 3D Deck Layers */}
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3.5 translate-y-3.5 rotate-3 rounded-2xl border border-gold/35 bg-obsidian-elevated shadow-2xl transition-transform duration-300 group-hover:translate-x-5 group-hover:rotate-6"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -translate-x-3 translate-y-3 -rotate-3 rounded-2xl border border-gold/35 bg-obsidian-elevated shadow-2xl transition-transform duration-300 group-hover:-translate-x-5 group-hover:-rotate-6"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-2 translate-y-2 rotate-1 rounded-2xl border border-gold/45 bg-obsidian-surface shadow-xl"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-1 translate-y-1 rounded-2xl border border-gold/55 bg-obsidian-surface shadow-lg"
          />

          {/* Top Ornate Deck Back */}
          <div className="relative inset-0 w-full h-full rounded-2xl border-2 border-gold/70 bg-gradient-to-b from-obsidian-elevated via-obsidian-surface to-obsidian p-3.5 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="w-full h-full rounded-xl border border-gold/40 p-4 flex flex-col items-center justify-between relative bg-obsidian/70">
              <span className="absolute top-2.5 left-2.5 text-gold/70 text-xs" aria-hidden="true">
                ✦
              </span>
              <span className="absolute top-2.5 right-2.5 text-gold/70 text-xs" aria-hidden="true">
                ✦
              </span>
              <span className="absolute bottom-2.5 left-2.5 text-gold/70 text-xs" aria-hidden="true">
                ✦
              </span>
              <span className="absolute bottom-2.5 right-2.5 text-gold/70 text-xs" aria-hidden="true">
                ✦
              </span>

              <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-gold/80 pt-1">
                Arcana Major &amp; Minor
              </span>

              {/* Sacred Geometry Medallion */}
              <div className="my-auto relative flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5 transition-transform duration-500 group-hover:scale-105">
                  <div className="w-24 h-24 rounded-full border border-dashed border-gold/60 flex items-center justify-center rotate-45">
                    <div className="w-16 h-16 rounded-full border border-gold/80 flex items-center justify-center -rotate-45 bg-obsidian-elevated/90 shadow-inner">
                      <Compass className="h-8 w-8 text-gold-light" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pb-1">
                <span className="block font-serif text-xs font-semibold text-gold-light tracking-widest uppercase">
                  Unseal The Deck
                </span>
                <span className="block text-[10px] text-slate-300 mt-0.5">
                  78 Cards &bull; Click to Spread
                </span>
              </div>
            </div>
          </div>
        </button>

        <div className="mt-8 flex items-center gap-4 text-xs text-slate-300 relative z-10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gold/15 bg-obsidian/50">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            22 Major Arcana with Alchemical Outlines
          </span>
          <span aria-hidden="true">&bull;</span>
          <span>56 Minor Arcana</span>
        </div>
      </section>
    );
  }

  // STAGE 2: OPENED INDIVIDUAL CARD GALLERY (SMOOTH FLOAT HOVER, ZERO TREMOR JITTER)
  if (stage === 'grid') {
    return (
      <section
        aria-label="Opened Tarot Card Gallery"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      >
        {/* Top Deck Controls & Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-obsidian-surface/90 border border-gold/25 p-4 rounded-xl shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => updateStage('deck')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gold-light bg-gold/10 hover:bg-gold/20 border border-gold/30 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <Layers className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span>Seal Deck</span>
            </button>

            <div
              role="group"
              aria-label="Filter cards by Arcana or Suit"
              className="flex flex-wrap items-center gap-1.5"
            >
              {FILTER_OPTIONS.map((opt) => {
                const isSelected = deckFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setDeckFilter(opt.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold ${
                      isSelected
                        ? 'bg-gold text-obsidian font-semibold shadow-sm'
                        : 'bg-obsidian-elevated text-slate-300 hover:text-slate-100 border border-gold/15'
                    }`}
                  >
                    {opt.label}{' '}
                    <span
                      className={`text-[10px] ${isSelected ? 'text-obsidian/80' : 'text-slate-400'}`}
                    >
                      ({opt.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative w-full lg:w-64">
            <Search
              className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Filter deck"
              maxLength={80}
              placeholder="Search card name or sign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.slice(0, 80))}
              className="w-full bg-obsidian-elevated border border-gold/25 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        {/* Card Grid with Smooth Float Hover (card-item-hover) */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-16 bg-obsidian-surface/50 rounded-xl border border-gold/15">
            <p className="text-sm text-slate-300 font-serif">
              No cards match &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDeckFilter('all');
              }}
              className="mt-3 px-3 py-1.5 rounded-lg text-xs text-gold-light bg-gold/10 border border-gold/30 hover:bg-gold/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {filteredCards.map((card, index) => (
              <button
                key={card.id}
                type="button"
                onClick={(e) => handleSelectCardFromGrid(card, e)}
                aria-label={`Inspect ${card.name}`}
                style={{ animationDelay: `${Math.min(index * 16, 320)}ms` }}
                className="group flex flex-col items-center text-center rounded-xl p-2 bg-obsidian-surface/60 border border-gold/20 hover:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold card-item-hover deck-card-deal"
              >
                <div className="w-full overflow-hidden rounded-lg">
                  <TarotCardView
                    card={card}
                    loading={index < 12 ? 'eager' : 'lazy'}
                    className="w-full"
                  />
                </div>
                <div className="mt-2.5 px-1 w-full">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-gold">
                    {card.arcana === 'major' ? `Arcana ${card.numerology.numeral}` : card.suit}
                  </span>
                  <span className="block font-serif text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-gold-light truncate mt-0.5">
                    {card.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 italic truncate">
                    {card.archetype}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    );
  }

  // STAGE 3: ORBITAL FLOATING TEXT & MENUS WRAPPING AROUND THE ROTATING MAGIC CIRCLE
  return (
    <section
      aria-label={`Detailed inspection of ${selectedCard.name}`}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative overflow-hidden"
    >
      {/* Background Rotating Magic Circle Pattern */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <MagicCircleBackground
          size="min(95vw, 780px)"
          className="opacity-20 text-gold"
          rotate
        />
      </div>

      {/* CELESTIAL TOP ARC: Floating Header, Navigation Chevrons, & Seal Buttons */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 py-2 border-b border-gold/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveHotspotId(null);
              setHoveredHotspotId(null);
              updateStage('grid');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif tracking-wider uppercase text-gold-light bg-gold/10 hover:bg-gold/20 border border-gold/40 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>Deck Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveHotspotId(null);
              setHoveredHotspotId(null);
              updateStage('deck');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs text-slate-300 hover:text-slate-100 bg-obsidian/70 border border-gold/20 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Layers className="h-3.5 w-3.5 text-gold/80" aria-hidden="true" />
            <span className="hidden sm:inline">Seal Deck</span>
          </button>
        </div>

        {/* Centered Celestial Title Orb */}
        <div className="flex items-center gap-3 text-center">
          <button
            type="button"
            onClick={() => stepCard(-1)}
            aria-label="Previous card"
            className="p-1.5 rounded-full bg-obsidian-elevated/70 border border-gold/30 text-gold hover:bg-gold/15 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-gold/90">
              {selectedCard.arcana} Arcana &bull; {selectedCard.numerology.numeral}
            </span>
            <div className="relative">
              <label htmlFor="card-selector" className="sr-only">
                Select card
              </label>
              <select
                id="card-selector"
                value={selectedCard.id}
                onChange={(e) => {
                  setSelectedCardId(e.target.value);
                  setActiveHotspotId(null);
                  setHoveredHotspotId(null);
                }}
                className="bg-transparent border-none text-base sm:text-xl font-serif font-semibold text-gold-light text-center focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer"
              >
                <optgroup label="Major Arcana">
                  {MAJOR_CARDS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-obsidian text-slate-100 font-serif">
                      {c.numerology.numeral}. {c.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Minor Arcana">
                  {MINOR_CARDS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-obsidian text-slate-100 font-serif">
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => stepCard(1)}
            aria-label="Next card"
            className="p-1.5 rounded-full bg-obsidian-elevated/70 border border-gold/30 text-gold hover:bg-gold/15 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Right Element & Astrological Celestial Pill */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs text-slate-200 capitalize font-serif">{selectedCard.element}</span>
            <span className="text-[10px] font-mono text-purple-300">{selectedCard.astrology}</span>
          </div>
          <button
            type="button"
            aria-pressed={showFineGrid}
            onClick={() => setShowFineGrid((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-serif border transition-colors focus:outline-none focus:ring-2 focus:ring-gold ${
              showFineGrid
                ? 'bg-gold/15 text-gold-light border-gold/40'
                : 'bg-obsidian/70 text-slate-300 border-gold/15'
            }`}
          >
            <Grid className="h-3 w-3 text-gold" aria-hidden="true" />
            <span>Grid {showFineGrid ? 'On' : 'Off'}</span>
          </button>
        </div>
      </header>

      {/* ORBITAL 3-COLUMN LAYOUT: West Floating Lore Arc | Center Card | East Floating Symbolism Arc */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 py-2">
        {/* WEST / LEFT ARC: Floating Archetype, Numerology & Meaning */}
        <div className="lg:col-span-4 order-2 lg:order-1 space-y-5 deck-card-deal">
          {/* Floating Archetype & Numerology Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gold">
              <span className="text-xs font-serif tracking-[0.25em] uppercase">Archetype &bull; Theme</span>
              <span className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
            </div>
            <p className="text-lg font-serif italic text-gold-light">
              &ldquo;{selectedCard.archetype}&rdquo;
            </p>
            <p className="text-xs text-slate-300">
              Numerology: <strong className="text-slate-100">{selectedCard.numerology.theme || 'Universal Cycle'}</strong>
            </p>
          </div>

          {/* Floating Meaning & Interpretation Arc */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-gold">
              <span className="text-xs font-serif tracking-[0.2em] uppercase flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                {isReversed ? 'Reversed Interpretation' : 'Upright Interpretation'}
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent ml-2" />
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {currentMeaning.fullMeaning}
            </p>

            {/* Constellation Keyword Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentMeaning.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-0.5 rounded-full text-[11px] capitalize bg-obsidian/60 border border-gold/25 text-gold-light/90 shadow-sm backdrop-blur-sm"
                >
                  ✦ {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Floating Reversal Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setOrientation((prev) => (prev === 'upright' ? 'reversed' : 'upright'))}
              aria-pressed={isReversed}
              className={`inline-flex items-center gap-2 py-2 px-4 rounded-full text-xs font-serif tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-gold backdrop-blur-sm ${
                isReversed
                  ? 'bg-red-950/80 text-red-200 border border-red-700/60 shadow-lg shadow-red-950/40'
                  : 'bg-gold/15 text-gold-light border border-gold/40 hover:bg-gold/25'
              }`}
            >
              <RotateCw className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span>{isReversed ? 'Reset to Upright' : 'Invert to Reversed'}</span>
            </button>
          </div>
        </div>

        {/* CENTER STAGE: Enlarged Flying Card in the Magic Circle Core */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center gap-3">
          <div
            ref={centerCardRef}
            className="w-full max-w-[320px] sm:max-w-[340px] relative z-20"
          >
            <TarotCardView
              card={selectedCard}
              orientation={orientation}
              overlay={hotspotOverlay}
              loading="eager"
              className="w-full shadow-2xl shadow-black/90"
            />
          </div>

          <p className="text-[11px] text-gold-light/80 text-center max-w-xs flex items-center justify-center gap-1.5 font-serif">
            <Sparkles className="h-3 w-3 text-gold shrink-0" aria-hidden="true" />
            <span>
              {selectedCard.hotspots.length > 0
                ? 'Tap or hover contoured card zones to illuminate alchemical outlines.'
                : 'Minor Arcana card — select any Major Arcana card for alchemical contours.'}
            </span>
          </p>
        </div>

        {/* EAST / RIGHT ARC: Floating Symbolism Contours & Esoteric Lore */}
        <div className="lg:col-span-4 order-3 space-y-4 deck-card-deal">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-gold">
              <span className="text-xs font-serif tracking-[0.25em] uppercase flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                Alchemical Contours
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent ml-2" />
              <span className="text-[10px] font-mono text-gold-light/80">
                {selectedCard.hotspots.length} Symbols
              </span>
            </div>

            {selectedCard.hotspots.length > 0 ? (
              <div className="space-y-2.5">
                {selectedCard.hotspots.map((spot) => {
                  const isSelected = spot.id === activeHotspotId;
                  const isHovered = spot.id === hoveredHotspotId;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        triggerHaptic(12);
                        setActiveHotspotId(isSelected ? null : spot.id);
                      }}
                      onMouseEnter={() => setHoveredHotspotId(spot.id)}
                      onMouseLeave={() =>
                        setHoveredHotspotId((prev) => (prev === spot.id ? null : prev))
                      }
                      onFocus={() => setHoveredHotspotId(spot.id)}
                      onBlur={() =>
                        setHoveredHotspotId((prev) => (prev === spot.id ? null : prev))
                      }
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold backdrop-blur-sm ${
                        isSelected || isHovered
                          ? 'border-gold bg-gold/15 shadow-[0_0_18px_rgba(212,175,55,0.35)] ring-1 ring-gold/60 translate-x-1'
                          : 'border-gold/20 bg-obsidian/60 hover:bg-obsidian-elevated/70 hover:border-gold/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-serif text-sm font-medium text-gold-light flex items-center gap-1.5">
                          <span
                            className={`text-xs transition-transform ${
                              isSelected || isHovered ? 'scale-125 text-white' : 'text-gold'
                            }`}
                            aria-hidden="true"
                          >
                            ✦
                          </span>
                          {spot.label}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full capitalize bg-obsidian-elevated border border-gold/30 text-slate-300 font-mono">
                          {spot.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed mb-1.5">{spot.summary}</p>
                      <div className="border-t border-gold/15 pt-1">
                        <p className="text-[11px] text-gold-light/90 italic">
                          &ldquo;{spot.esotericMeaning}&rdquo;
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-xs text-slate-200 space-y-2">
                <p className="leading-relaxed">
                  <strong>{selectedCard.name}</strong> belongs to the{' '}
                  <span className="capitalize text-gold-light">{selectedCard.suit}</span> suit.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCardId('the-fool');
                    setActiveHotspotId(null);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-serif text-gold-light bg-gold/15 border border-gold/35 hover:bg-gold/25"
                >
                  Return to Major Arcana
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
