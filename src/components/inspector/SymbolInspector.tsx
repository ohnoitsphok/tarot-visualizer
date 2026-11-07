import React, { useState, useMemo } from 'react';
import { CARDS } from '../../data/cards';
import type { CardOrientation, TarotCard } from '../../types';
import { TarotCardView } from '../common/TarotCardView';
import { RotateCw, Sparkles, BookOpen, Search, Eye } from 'lucide-react';

export const SymbolInspector: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<string>('the-fool');
  const [orientation, setOrientation] = useState<CardOrientation>('upright');
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedCard: TarotCard = useMemo(() => {
    return CARDS.find((c) => c.id === selectedCardId) ?? CARDS[0]!;
  }, [selectedCardId]);

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return CARDS;
    const q = searchQuery.toLowerCase();
    return CARDS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.archetype.toLowerCase().includes(q) ||
        c.astrology.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'upright' ? 'reversed' : 'upright'));
  };

  const currentMeaning = orientation === 'upright' ? selectedCard.upright : selectedCard.reversed;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar: Selector & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-obsidian-surface/80 border border-gold/20 p-4 rounded-xl shadow-lg">
        {/* Card Select Dropdown */}
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label htmlFor="card-selector" className="text-xs font-serif uppercase tracking-wider text-gold-light shrink-0">
            Inspect Card:
          </label>
          <div className="relative flex-1 max-w-xs">
            <select
              id="card-selector"
              value={selectedCardId}
              onChange={(e) => {
                setSelectedCardId(e.target.value);
                setActiveHotspotId(null);
              }}
              className="w-full appearance-none bg-obsidian-elevated border border-gold/30 rounded-lg px-3 py-2 text-sm text-slate-100 font-serif focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <optgroup label="Major Arcana">
                {filteredCards.filter((c) => c.arcana === 'major').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.numerology.numeral}. {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Minor Arcana">
                {filteredCards.filter((c) => c.arcana === 'minor').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Search quick filter */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter deck..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian-elevated border border-gold/20 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>

      {/* Main Grid: Card Viewer on Left, Symbolism & Lore on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Card Viewer & Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4 lg:sticky lg:top-6">
          <div className="w-full max-w-[320px] sm:max-w-[360px]">
            <TarotCardView
              card={selectedCard}
              orientation={orientation}
              showHotspots={true}
              activeHotspotId={activeHotspotId}
              onSelectHotspot={(spot) => setActiveHotspotId(spot?.id ?? null)}
              className="w-full"
            />
          </div>

          {/* Viewer Controls */}
          <div className="w-full max-w-[360px] flex items-center justify-between gap-3 bg-obsidian-surface border border-gold/20 p-2.5 rounded-lg shadow">
            <button
              type="button"
              onClick={toggleOrientation}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                orientation === 'reversed'
                  ? 'bg-red-950/80 text-red-200 border border-red-700/50'
                  : 'bg-gold/10 text-gold-light border border-gold/30 hover:bg-gold/20'
              }`}
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>{orientation === 'upright' ? 'Invert to Reversed' : 'Reset to Upright'}</span>
            </button>

            {selectedCard.hotspots.length > 0 && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 px-2">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {selectedCard.hotspots.length} Symbols
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-center max-w-xs">
            Hover or tap glowing pins on the card art to inspect symbolic meanings.
          </p>
        </div>

        {/* Right Column: Deep Symbolism & Card Lore (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Overview Card */}
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
                <span className="text-xs text-slate-400 capitalize block">{selectedCard.element} Element</span>
                <span className="text-xs font-mono text-purple-300">{selectedCard.astrology}</span>
              </div>
            </div>

            {/* Archetype & Numerological Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="bg-obsidian-elevated/70 border border-gold/10 p-3 rounded-lg">
                <span className="text-[10px] tracking-wider uppercase text-slate-400 block mb-0.5">
                  Archetype
                </span>
                <p className="text-sm text-slate-200 font-serif italic">
                  {selectedCard.archetype}
                </p>
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

            {/* Meaning Section (Upright or Reversed) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-serif uppercase tracking-wider text-gold flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  {orientation === 'upright' ? 'Upright Interpretation' : 'Reversed Interpretation'}
                </h3>
                <span className="text-[10px] text-slate-400 capitalize">
                  Keywords: {currentMeaning.keywords.join(', ')}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed bg-obsidian/50 p-3.5 rounded-lg border border-gold/10">
                {currentMeaning.fullMeaning}
              </p>
            </div>
          </div>

          {/* Interactive Symbolism Breakdown Panel */}
          <div className="bg-obsidian-surface border border-gold/25 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h3 className="text-sm font-serif font-semibold text-gold-light tracking-wide flex items-center gap-2">
                <Eye className="h-4 w-4 text-gold" />
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
                    <div
                      key={spot.id}
                      onClick={() => setActiveHotspotId(isSelected ? null : spot.id)}
                      className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? 'border-gold bg-gold/10 shadow-lg ring-1 ring-gold'
                          : 'border-gold/15 bg-obsidian-elevated/40 hover:bg-obsidian-elevated hover:border-gold/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-serif text-sm font-medium text-slate-100 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                          {spot.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded capitalize bg-obsidian border border-gold/20 text-slate-300 font-mono">
                          {spot.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-2">
                        {spot.summary}
                      </p>
                      <div className="bg-obsidian/60 p-2.5 rounded border border-gold/10">
                        <span className="text-[10px] tracking-wider uppercase text-gold block mb-0.5">
                          Esoteric &amp; Psychological Meaning
                        </span>
                        <p className="text-xs text-slate-400 italic">
                          &ldquo;{spot.esotericMeaning}&rdquo;
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Select a Major Arcana card to inspect detailed visual symbolism breakdowns.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
