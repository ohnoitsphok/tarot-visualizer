import type { UsageGuideSection } from '../types';
import { deepFreeze } from './deepFreeze';

export const USAGE_GUIDE: readonly UsageGuideSection[] = deepFreeze([
  { id: 'reversals', title: 'Upright and Reversed', category: 'reversals', summary: 'A reversal shifts how a card\'s energy shows up.',
    principles: [
      { heading: 'Blocked energy', detail: 'The upright meaning exists but is delayed or obstructed.', example: 'Reversed Ace of Wands: an idea with no spark yet.' },
      { heading: 'Internal vs external', detail: 'The energy turns inward instead of showing outwardly.' },
      { heading: 'Excess or deficiency', detail: 'The quality is overdone or missing.' },
    ] },
  { id: 'elements', title: 'Elemental Dignities', category: 'elements', summary: 'Neighbouring suits strengthen or weaken each other.',
    principles: [
      { heading: 'Friendly', detail: 'Fire and Air feed each other; Water and Earth support each other.' },
      { heading: 'Hostile', detail: 'Fire and Water, and Air and Earth, oppose each other.' },
      { heading: 'Neutral', detail: 'Fire with Earth, and Water with Air, neither help nor harm.' },
    ] },
  { id: 'numerology', title: 'Numerology', category: 'numerology', summary: 'Numbers 1 to 10 trace a cycle from seed to completion.',
    principles: [
      { heading: 'Beginnings (1 to 3)', detail: 'Spark, choice and first growth.' },
      { heading: 'Middle (4 to 7)', detail: 'Structure, challenge, movement and testing.' },
      { heading: 'Completion (8 to 10)', detail: 'Mastery, near-fulfilment and the end of the cycle.' },
    ] },
  { id: 'combinations', title: 'Reading Combinations', category: 'combinations', summary: 'Cards gain meaning from their neighbours.',
    principles: [
      { heading: 'Repeated suits', detail: 'Many cards of one suit emphasise its theme.' },
      { heading: 'Major dominance', detail: 'Many Major Arcana point to significant life lessons.' },
      { heading: 'Number repeats', detail: 'Matching numbers highlight a shared stage of a cycle.' },
    ] },
]);
