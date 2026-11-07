import React, { useCallback, useMemo, useState } from 'react';
import { BookOpen, Eye, RotateCw, Search, Sparkles } from 'lucide-react';
import { CARD_BY_ID, CARDS } from '../../data/cards';
import type { CardOrientation, SymbolHotspot, TarotCard } from '../../types';
import { TarotCardView } from '../common/TarotCardView';
import { HotspotOverlay } from './HotspotOverlay';

const MAJOR_CARDS: readonly TarotCard[] = CARDS.filter((c) => c.arcana === 'major');
const MINOR_CARDS: readonly TarotCard[] = CARDS.filter((c) => c.arcana === 'minor');
const SEARCH_INDEX: ReadonlyMap<string, string> = new Map(
  CARDS.map((c) => [c.id, `${c.name}\n${c.archetype}\n${c.astrology}`.toLowerCase()]),
);

export const SymbolInspector: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<string>('the-fool');
  const [orientation, setOrientation] = useState<CardOrientation>('upright');
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedCard: TarotCard = CARD_BY_ID.get(selectedCardId) ?? CARDS[0]!;

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return { count: CARDS.length, major: MAJOR_CARDS, minor: MINOR_CARDS };
    }
    const major = MAJOR_CARDS.filter((c) => SEARCH_INDEX.get(c.id)?.includes(q));
    const minor = MINOR_CARDS.filter((c) => SEARCH_INDEX.get(c.id)?.includes(q));
    return { count: major.length + minor.length, major, minor };
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.slice(0, 80);
    setSearchQuery(next);
    const q = next.trim().toLowerCase();
    if (!q) return;
    if (!SEARCH_INDEX.get(selectedCardId)?.includes(q)) {
      const firstMatch = CARDS.find((c) => SEARCH_INDEX.get(c.id)?.includes(q));
      if (firstMatch) {
        setSelectedCardId(firstMatch.id);
        setActiveHotspotId(null);
      }
    }
  };

  const handleSelectHotspot = useCallback((spot: SymbolHotspot | null) => {
    setActiveHotspotId(spot?.id ?? null);
  }, []);

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'upright' ? 'reversed' : 'upright'));
  };

  const currentMeaning = orientation === 'upright' ? selectedCard.upright : selectedCard.reversed;

  const hotspotOverlay =
    selectedCard.hotspots.length > 0 ? (
      <HotspotOverlay
        hotspots={selectedCard.hotspots}
        activeHotspotId={activeHotspotId}
        isReversed={orientation === 'reversed'}
        onSelectHotspot={handleSelectHotspot}
      />
    ) : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar: Selector & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-obsidian-surface/80 border border-gold/20 p-4 rounded-xl shadow-lg">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label
            htmlFor="card-selector"
            className="text-xs font-serif uppercase tracking-wider text-gold-light shrink-0"
          >
            Inspect Card:
          </label>
          <div className="relative flex-1 max-w-xs">
            <select
              id="card-selector"
              value={filteredGroups.count > 0 ? selectedCardId : ''}
              onChange={(e) => {
                setSelectedCardId(e.target.value);
                setActiveHotspotId(null);
              }}
              className="w-full bg-obsidian-elevated border border-gold/30 rounded-lg px-3 py-2 text-sm text-slate-100 font-serif focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {filteredGroups.count === 0 && (
                <option value="" disabled>
                  No matching cards
                </option>
              )}
              {filteredGroups.major.length > 0 && (
                <optgroup label="Major Arcana">
                  {filteredGroups.major.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.numerology.numeral}. {c.name}
                    </option>
                  ))}
                </optgroup>
              )}
              {filteredGroups.minor.length > 0 && (
                <optgroup label="Minor Arcana">
                  {filteredGroups.minor.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            aria-label="Filter deck"
            maxLength={80}
            placeholder="Filter deck..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-obsidian-elevated border border-gold/20 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>

      {/* Main Grid: Card Viewer on Left, Symbolism & Lore on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col items-center gap-4 lg:sticky lg:top-20">
          <div className="w-full max-w-[320px] sm:max-w-[360px]">
            <TarotCardView
              card={selectedCard}
              orientation={orientation}
              overlay={hotspotOverlay}
              loading="eager"
              className="w-full"
            />
          </div>

          <div className="w-full max-w-[360px] flex items-center justify-between gap-3 bg-obsidian-surface border border-gold/20 p-2.5 rounded-lg shadow">
            <button
              type="button"
              onClick={toggleOrientation}
              aria-pressed={orientation === 'reversed'}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                orientation === 'reversed'
                  ? 'bg-red-950/80 text-red-200 border border-red-700/50'
                  : 'bg-gold/10 text-gold-light border border-gold/30 hover:bg-gold/20'
              }`}
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{orientation === 'upright' ? 'Invert to Reversed' : 'Reset to Upright'}</span>
            </button>

            {selectedCard.hotspots.length > 0 && (
              <span className="text-[11px] text-slate-300 flex items-center gap-1 shrink-0 px-2">
                <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                {selectedCard.hotspots.length} Symbols
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-400 text-center max-w-xs">
            Hover or tap glowing pins on the card art to inspect symbolic meanings.
          </p>
        </div>

        {/* Right Column: Deep Symbolism & Card Lore */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-obsidian-surface border border-gold/25 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/15 pb-4 mb-4">
              <div>
                <span className="text-xs font-serif text-gold tracking-widest uppercase">
                  {selectedCard.arcana} Arcana &bull; {selectedCard.numerology.numeral}
                </span>
                <h2 className="text-2xl font-serif font-semibold text-gold-light tracking-wide mt-0.5">
                  {selectedCard.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-300 capitalize block">
                  {selectedCard.element} Element
                </span>
                <span className="text-xs font-mono text-purple-300">{selectedCard.astrology}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="bg-obsidian-elevated/70 border border-gold/10 p-3 rounded-lg">
                <span className="text-[10px] tracking-wider uppercase text-slate-400 block mb-0.5">
                  Archetype
                </span>
                <p className="text-sm text-slate-200 font-serif italic">{selectedCard.archetype}</p>
              </div>
              <div className="bg-obsidian-elevated/70 border border-gold/10 p-3 rounded-lg">
                <span className="text-[10px] tracking-wider uppercase text-slate-400 block mb-0.5">
                  Numerology Theme
                </span>
                <p className="text-sm text-slate-200">
                  {selectedCard.numerology.theme || 'Universal Cycle'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-serif uppercase tracking-wider text-gold flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  {orientation === 'upright' ? 'Upright Interpretation' : 'Reversed Interpretation'}
                </h3>
                <span className="text-[10px] text-slate-300 capitalize">
                  Keywords: {currentMeaning.keywords.join(', ')}
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed bg-obsidian/50 p-3.5 rounded-lg border border-gold/10">
                {currentMeaning.fullMeaning}
              </p>
            </div>
          </div>

          <div className="bg-obsidian-surface border border-gold/25 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/15 pb-3">
              <h3 className="text-sm font-serif font-semibold text-gold-light tracking-wide flex items-center gap-2">
                <Eye className="h-4 w-4 text-gold" aria-hidden="true" />
                Visual Symbolism Hotspots
              </h3>
              <span className="text-xs text-slate-400">
                {selectedCard.hotspots.length > 0
                  ? 'Click a symbol to highlight pin'
                  : 'No visual hotspots registered for this card'}
              </span>
            </div>

            {selectedCard.hotspots.length > 0 ? (
              <div className="space-y-3">
                {selectedCard.hotspots.map((spot) => {
                  const isSelected = spot.id === activeHotspotId;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setActiveHotspotId(isSelected ? null : spot.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold ${
                        isSelected
                          ? 'border-gold bg-gold/10 shadow-lg ring-1 ring-gold'
                          : 'border-gold/15 bg-obsidian-elevated/40 hover:bg-obsidian-elevated hover:border-gold/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-serif text-sm font-medium text-slate-100 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gold inline-block" aria-hidden="true" />
                          {spot.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded capitalize bg-obsidian border border-gold/20 text-slate-300 font-mono">
                          {spot.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-2">{spot.summary}</p>
                      <div className="bg-obsidian/60 p-2.5 rounded border border-gold/10">
                        <span className="text-[10px] tracking-wider uppercase text-gold block mb-0.5">
                          Esoteric &amp; Psychological Meaning
                        </span>
                        <p className="text-xs text-slate-300 italic">
                          &ldquo;{spot.esotericMeaning}&rdquo;
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Select a Major Arcana card to inspect detailed visual symbolism breakdowns.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
