import type { SpreadDefinition } from '../types';
import { deepFreeze } from './deepFreeze';

type Pos = readonly [string, string, string, number, number, number?];
const build = (id: string, rows: readonly Pos[]): SpreadDefinition['positions'] =>
  rows.map(([title, role, guidingQuestion, x, y, rotation], i) => ({
    index: i + 1, id: `${id}-${i + 1}`, title, role, guidingQuestion, x, y, rotation,
    pairingNote: i === 0 ? 'Anchor card of the spread.' : `Read against position ${i}.`,
  }));

const three: readonly Pos[] = [
  ['Past', 'Influences now fading behind you.', 'What led here?', 20, 50],
  ['Present', 'The current situation.', 'What is happening now?', 50, 50],
  ['Future', 'Likely direction if nothing changes.', 'Where is this heading?', 80, 50],
];
const cross: readonly Pos[] = [
  ['Centre', 'The heart of the matter.', 'What is the core issue?', 50, 50],
  ['Past', 'What is leaving.', 'What is behind this?', 20, 50],
  ['Future', 'What is arriving.', 'What comes next?', 80, 50],
  ['Above', 'Aim or best outcome.', 'What are you reaching for?', 50, 18],
  ['Below', 'Foundation or root cause.', 'What supports this?', 50, 82],
];
const celtic: readonly Pos[] = [
  ['Present', 'The situation at heart.', 'What is going on?', 30, 50],
  ['Challenge', 'What crosses you.', 'What is the obstacle?', 30, 50, 90],
  ['Foundation', 'Root of the matter.', 'What underlies it?', 30, 80],
  ['Recent past', 'Fading influence.', 'What just passed?', 10, 50],
  ['Crown', 'Conscious aim.', 'What do you hope for?', 30, 20],
  ['Near future', 'What comes next.', 'What approaches?', 50, 50],
  ['Self', 'Your stance.', 'How do you see yourself?', 78, 85],
  ['Environment', 'Others and surroundings.', 'What influences you externally?', 78, 62],
  ['Hopes and fears', 'Inner anticipation.', 'What do you wish or dread?', 78, 38],
  ['Outcome', 'Likely result.', 'Where does this lead?', 78, 15],
];

export const SPREADS: readonly SpreadDefinition[] = deepFreeze([
  { id: 'three-card', name: 'Three-Card (Past, Present, Future)', category: 'foundational', cardCount: 3, summary: 'A quick timeline of a situation.', readingFlow: 'Left to right, then read the three as one story.', positions: build('three-card', three) },
  { id: 'five-card-cross', name: 'Five-Card Cross', category: 'diagnostic', cardCount: 5, summary: 'Centre issue with its past, future, aim and root.', readingFlow: 'Centre, then past and future, then above and below.', positions: build('five-card-cross', cross) },
  { id: 'celtic-cross', name: 'Celtic Cross', category: 'traditional', cardCount: 10, summary: 'The classic ten-card deep reading.', readingFlow: 'Cross of six first (1 to 6), then the staff of four (7 to 10) bottom to top.', positions: build('celtic-cross', celtic) },
]);
