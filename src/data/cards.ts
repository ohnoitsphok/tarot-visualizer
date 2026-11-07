import {
  COURT_RANKS,
  SUITS,
  type CardMeanings,
  type CardNumerology,
  type CardOrientation,
  type CardRank,
  type SymbolHotspot,
  type TarotCard,
} from '../types';
import { MAJOR_ROWS } from './majorArcana';
import { deepFreeze } from './deepFreeze';
import { MINOR_ROWS, SUIT_INFO } from './minorArcana';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const list = (csv: string): readonly string[] => csv.split(',');
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
const THEMES = ['Potential', 'Initiative', 'Duality', 'Creation', 'Structure', 'Change', 'Harmony', 'Reflection', 'Power', 'Completion'];
const COURT_THEMES = ['Learning', 'Pursuit', 'Inner mastery', 'Outer mastery'];
const RANK_NAMES = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
const EMPTY_HOTSPOTS: readonly SymbolHotspot[] = Object.freeze([]);

const digitRoot = (n: number): number => (n < 10 ? n : digitRoot([...String(n)].reduce((a, d) => a + Number(d), 0)));

function meanings(name: string, o: CardOrientation, keywords: string, fullMeaning: string): CardMeanings {
  const kw = list(keywords);
  return {
    keywords: kw,
    summary: kw.slice(0, 3).join(', '),
    fullMeaning,
    studyPrompt: `What does ${name} signal when ${o}?`,
  };
}

function hotspots(cardId: string, rows: (typeof MAJOR_ROWS)[number][9]): readonly SymbolHotspot[] {
  return rows.map(([label, x, y, category, summary, esotericMeaning]) => ({
    id: `${cardId}-${slug(label)}`,
    label,
    x,
    y,
    category,
    summary,
    esotericMeaning,
  }));
}

const major: TarotCard[] = MAJOR_ROWS.map((r, number) => {
  const [name, element, astrology, hebrewLetter, archetype, upK, upM, revK, revM, spots] = r;
  const id = slug(name);
  const numerology: CardNumerology = { value: number, numeral: ROMAN[number] ?? String(number), theme: THEMES[digitRoot(number)] ?? '' };
  return {
    id, name, arcana: 'major', suit: null, rank: null, number, element, astrology, hebrewLetter, numerology, archetype,
    imageUrl: `/cards/${id}.jpg`,
    upright: meanings(name, 'upright', upK, upM),
    reversed: meanings(name, 'reversed', revK, revM),
    hotspots: hotspots(id, spots),
  };
});

const minor: TarotCard[] = SUITS.flatMap((suit) =>
  MINOR_ROWS[suit].map(([upK, revK, upM, revM], i) => {
    const number = i + 1;
    const rankName = RANK_NAMES[i] ?? '';
    const name = `${rankName} of ${cap(suit)}`;
    const id = slug(name);
    const rank: CardRank = number <= 10 ? number : (COURT_RANKS[number - 11] ?? 'page');
    const theme = number === 10 ? 'Completion' : number < 10 ? THEMES[number] : COURT_THEMES[number - 11];
    return {
      id, name, arcana: 'minor', suit, rank, number, element: SUIT_INFO[suit].element, astrology: SUIT_INFO[suit].signs,
      numerology: { value: number, numeral: number <= 10 ? String(number) : rankName, theme: theme ?? '' },
      archetype: `${rankName} of ${cap(SUIT_INFO[suit].element)}`,
      imageUrl: `/cards/${id}.jpg`,
      upright: meanings(name, 'upright', upK, upM),
      reversed: meanings(name, 'reversed', revK, revM),
      hotspots: EMPTY_HOTSPOTS,
    } satisfies TarotCard;
  }),
);

export const CARDS: readonly TarotCard[] = deepFreeze([...major, ...minor]);
export const CARD_BY_ID: ReadonlyMap<string, TarotCard> = new Map(CARDS.map((c) => [c.id, c]));
