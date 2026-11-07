export const ARCANA_TYPES = Object.freeze(['major', 'minor'] as const);
export type Arcana = (typeof ARCANA_TYPES)[number];

export const SUITS = Object.freeze([
  'wands',
  'cups',
  'swords',
  'pentacles',
] as const);
export type Suit = (typeof SUITS)[number];

export const ELEMENTS = Object.freeze([
  'fire',
  'water',
  'air',
  'earth',
  'spirit',
] as const);
export type Element = (typeof ELEMENTS)[number];

export const COURT_RANKS = Object.freeze([
  'page',
  'knight',
  'queen',
  'king',
] as const);
export type CourtRank = (typeof COURT_RANKS)[number];

export const ORIENTATIONS = Object.freeze(['upright', 'reversed'] as const);
export type CardOrientation = (typeof ORIENTATIONS)[number];

export const HOTSPOT_CATEGORIES = Object.freeze([
  'figure',
  'object',
  'nature',
  'architecture',
  'color',
  'esoteric',
] as const);
export type HotspotCategory = (typeof HOTSPOT_CATEGORIES)[number];

export const TOTAL_RWS_CARDS = 78 as const;
export const MAJOR_ARCANA_COUNT = 22 as const;
export const MINOR_ARCANA_COUNT = 56 as const;
export const CARDS_PER_SUIT = 14 as const;

export const TAROT_CARD_ASPECT_RATIO = '4 / 7' as const;
export const HOTSPOT_MIN_PERCENT = 0 as const;
export const HOTSPOT_MAX_PERCENT = 100 as const;

export function isValidHotspotCoordinate(value: number): boolean {
  return (
    Number.isFinite(value) &&
    value >= HOTSPOT_MIN_PERCENT &&
    value <= HOTSPOT_MAX_PERCENT
  );
}

export type CardRank = number | CourtRank;

export interface CardNumerology {
  readonly value: number;
  readonly numeral: string;
  readonly theme: string;
}

export interface SymbolHotspot {
  readonly id: string;
  readonly label: string;
  /** Horizontal anchor in normalized card width percentage (0..100). */
  readonly x: number;
  /** Vertical anchor in normalized card height percentage (0..100). */
  readonly y: number;
  readonly category: HotspotCategory;
  readonly summary: string;
  readonly esotericMeaning: string;
}

export interface CardMeanings {
  readonly keywords: readonly string[];
  readonly summary: string;
  readonly fullMeaning: string;
  readonly studyPrompt: string;
}

export interface TarotCard {
  readonly id: string;
  readonly name: string;
  readonly arcana: Arcana;
  readonly suit: Suit | null;
  readonly rank: CardRank | null;
  readonly number: number;
  readonly element: Element;
  readonly astrology: string;
  readonly hebrewLetter?: string;
  readonly kabbalahPath?: string;
  readonly numerology: CardNumerology;
  readonly archetype: string;
  readonly imageUrl: string;
  readonly upright: CardMeanings;
  readonly reversed: CardMeanings;
  readonly hotspots: readonly SymbolHotspot[];
  readonly relatedCardIds?: readonly string[];
}

export type RankFilterGroup = 'all' | 'ace' | 'pip' | 'court';

export interface LibraryFilterState {
  readonly query: string;
  readonly arcana: Arcana | 'all';
  readonly suit: Suit | 'all';
  readonly element: Element | 'all';
  readonly rankGroup: RankFilterGroup;
  readonly bookmarkedOnly: boolean;
}

export type SpreadCategory = 'foundational' | 'diagnostic' | 'traditional';

export interface SpreadPosition {
  readonly index: number;
  readonly id: string;
  readonly title: string;
  readonly role: string;
  readonly guidingQuestion: string;
  readonly pairingNote: string;
  /** Horizontal center in normalized canvas percentage (0..100). */
  readonly x: number;
  /** Vertical center in normalized canvas percentage (0..100). */
  readonly y: number;
  readonly rotation?: number;
  readonly relatedPositions?: readonly number[];
}

export interface SpreadDefinition {
  readonly id: string;
  readonly name: string;
  readonly category: SpreadCategory;
  readonly cardCount: number;
  readonly summary: string;
  readonly readingFlow: string;
  readonly positions: readonly SpreadPosition[];
}

export type UsageTopicCategory =
  | 'reversals'
  | 'elements'
  | 'numerology'
  | 'combinations';

export interface UsagePrinciple {
  readonly heading: string;
  readonly detail: string;
  readonly example?: string;
}

export interface UsageGuideSection {
  readonly id: string;
  readonly title: string;
  readonly category: UsageTopicCategory;
  readonly summary: string;
  readonly principles: readonly UsagePrinciple[];
}
