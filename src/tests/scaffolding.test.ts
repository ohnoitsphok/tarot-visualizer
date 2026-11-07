import { describe, expect, it } from 'vitest';
import {
  APP_TABS,
  CARDS_PER_SUIT,
  ELEMENTS,
  INITIAL_STUDY_PROGRESS,
  MAJOR_ARCANA_COUNT,
  MINOR_ARCANA_COUNT,
  STUDY_SCHEMA_VERSION,
  SUITS,
  TOTAL_RWS_CARDS,
} from '../types';

describe('Phase 1 foundational domain & state invariants', () => {
  it('enforces Rider-Waite-Smith 78-card structural counts', () => {
    expect(MAJOR_ARCANA_COUNT).toBe(22);
    expect(SUITS).toHaveLength(4);
    expect(CARDS_PER_SUIT).toBe(14);
    expect(MINOR_ARCANA_COUNT).toBe(SUITS.length * CARDS_PER_SUIT);
    expect(TOTAL_RWS_CARDS).toBe(MAJOR_ARCANA_COUNT + MINOR_ARCANA_COUNT);
  });

  it('defines expected elemental and navigation taxonomies', () => {
    expect(ELEMENTS).toEqual(['fire', 'water', 'air', 'earth', 'spirit']);
    expect(APP_TABS).toEqual(['library', 'inspector', 'study', 'spreads']);
  });

  it('initializes clean versioned study progress state', () => {
    expect(INITIAL_STUDY_PROGRESS.schemaVersion).toBe(STUDY_SCHEMA_VERSION);
    expect(INITIAL_STUDY_PROGRESS.bookmarks).toEqual([]);
    expect(INITIAL_STUDY_PROGRESS.records).toEqual({});
    expect(INITIAL_STUDY_PROGRESS.quizHistory).toEqual([]);
    expect(INITIAL_STUDY_PROGRESS.currentStreak).toBe(0);
    expect(INITIAL_STUDY_PROGRESS.lastStudyDate).toBeNull();
    expect(Object.isFrozen(INITIAL_STUDY_PROGRESS)).toBe(true);
    expect(Object.isFrozen(INITIAL_STUDY_PROGRESS.bookmarks)).toBe(true);
    expect(Object.isFrozen(INITIAL_STUDY_PROGRESS.records)).toBe(true);
    expect(Object.isFrozen(INITIAL_STUDY_PROGRESS.quizHistory)).toBe(true);
  });
});
