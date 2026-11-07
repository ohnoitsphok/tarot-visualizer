import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { CARD_BY_ID, CARDS } from '../data/cards';
import { SPREADS } from '../data/spreads';
import { USAGE_GUIDE } from '../data/usageGuide';
import {
  CARDS_PER_SUIT,
  MAJOR_ARCANA_COUNT,
  SUITS,
  TOTAL_RWS_CARDS,
  isValidHotspotCoordinate,
} from '../types';

describe('Phase 2 dataset integrity', () => {
  it('has the full 78-card RWS structure', () => {
    expect(CARDS).toHaveLength(TOTAL_RWS_CARDS);
    expect(CARDS.filter((c) => c.arcana === 'major')).toHaveLength(MAJOR_ARCANA_COUNT);
    for (const s of SUITS) expect(CARDS.filter((c) => c.suit === s)).toHaveLength(CARDS_PER_SUIT);
  });

  it('has unique ids, safe local image paths, and complete meanings', () => {
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(CARDS.length);
    const publicCardsDir = path.resolve(__dirname, '../../public/cards');
    expect(fs.existsSync(publicCardsDir)).toBe(true);

    for (const c of CARDS) {
      expect(c.imageUrl).toMatch(/^\/cards\/[a-z0-9-]+\.jpg$/);
      const filePath = path.join(publicCardsDir, path.basename(c.imageUrl));
      expect(fs.existsSync(filePath), `Missing image file for ${c.id}: ${filePath}`).toBe(true);
      expect(fs.statSync(filePath).size).toBeGreaterThan(1000);

      for (const m of [c.upright, c.reversed]) {
        expect(m.keywords.length).toBeGreaterThanOrEqual(3);
        expect(m.keywords.every((k) => k.trim().length > 0)).toBe(true);
        expect(m.fullMeaning.length).toBeGreaterThan(10);
      }
      expect(c.upright.fullMeaning).not.toBe(c.reversed.fullMeaning);
    }
  });

  it('keeps hotspots and contour polygons in bounds and spatially separated; every Major has at least 2', () => {
    for (const c of CARDS) {
      if (c.arcana === 'major') {
        expect(c.hotspots.length).toBeGreaterThanOrEqual(2);
        expect(new Set(c.hotspots.map((h) => h.x)).size).toBeGreaterThan(1);
      }
      for (let i = 0; i < c.hotspots.length; i++) {
        const h = c.hotspots[i]!;
        expect(isValidHotspotCoordinate(h.x) && isValidHotspotCoordinate(h.y)).toBe(true);
        expect(h.polygon && h.polygon.length >= 4).toBe(true);
        for (const [px, py] of h.polygon ?? []) {
          expect(isValidHotspotCoordinate(px) && isValidHotspotCoordinate(py)).toBe(true);
        }
        for (let j = i + 1; j < c.hotspots.length; j++) {
          const other = c.hotspots[j]!;
          expect(Math.hypot(h.x - other.x, h.y - other.y)).toBeGreaterThanOrEqual(12);
        }
      }
    }
  });

  it('defines spreads whose positions match cardCount with unique in-bounds slots', () => {
    for (const s of SPREADS) {
      expect(s.positions).toHaveLength(s.cardCount);
      expect(new Set(s.positions.map((p) => p.index)).size).toBe(s.cardCount);
      for (const p of s.positions) expect(isValidHotspotCoordinate(p.x) && isValidHotspotCoordinate(p.y)).toBe(true);
    }
  });

  it('deep-freezes exported datasets', () => {
    const hotspotIds = CARDS.flatMap((c) => c.hotspots.map((h) => h.id));
    expect(new Set(hotspotIds).size).toBe(hotspotIds.length);
    expect(hotspotIds.every((id) => /-[a-z0-9]/.test(id) && !id.endsWith('-'))).toBe(true);
    const spreadIds = SPREADS.flatMap((s) => [s.id, ...s.positions.map((p) => p.id)]);
    expect(new Set(spreadIds).size).toBe(spreadIds.length);
    expect(CARDS.slice(0, 22).map((c) => c.number)).toEqual([...Array(22).keys()]);
    expect(CARDS.every((c) => c.numerology.theme.length > 0)).toBe(true);
    expect(Object.isFrozen(CARDS[0]?.numerology)).toBe(true);
    expect(Object.isFrozen(CARDS[0]?.upright.keywords)).toBe(true);
    expect(Object.isFrozen(CARDS[0]?.hotspots[0])).toBe(true);
    expect(Object.isFrozen(CARDS[30]?.numerology)).toBe(true);
    expect(CARDS[22]?.hotspots).toBe(CARDS[23]?.hotspots);
    expect(CARDS.every((c) => CARD_BY_ID.get(c.id) === c)).toBe(true);
    expect(Object.isFrozen(SPREADS[0]?.positions[0])).toBe(true);
    expect(Object.isFrozen(USAGE_GUIDE[0]?.principles)).toBe(true);
  });

  it('provides the four usage topics, each with principles', () => {
    expect(USAGE_GUIDE.map((u) => u.category).sort()).toEqual(['combinations', 'elements', 'numerology', 'reversals']);
    for (const u of USAGE_GUIDE) expect(u.principles.length).toBeGreaterThan(0);
  });
});
