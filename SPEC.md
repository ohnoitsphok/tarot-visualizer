# Tarot Reference & Visualizer Specification (`SPEC.md`)

## 1. Product Role & Core Constraints
- **Reference-First Encyclopedia**: Comprehensive study companion, visual symbolism explorer, and interactive memorization tool. Explicitly **not** an automated fortune-telling or reading generator.
- **Deck System**: Complete 78-card Rider-Waite-Smith (RWS) standard deck (22 Major Arcana + 56 Minor Arcana across Wands, Cups, Swords, Pentacles).
- **Zero Backend**: 100% client-side Single Page Application (SPA) with offline-safe SVG card fallbacks alongside public-domain high-resolution RWS card imagery.
- **Persistence**: `localStorage` persistence with schema versioning (`STUDY_SCHEMA_VERSION`) for card mastery status, bookmarks, and quiz history.
- **Aspect Ratio & Hotspot Invariant**: Cards render at a locked `1:1.75` aspect ratio; visual symbolism hotspots store normalized coordinates (`x: 0..100`, `y: 0..100` percentages) calibrated to that frame.

## 2. Technology Stack
- **Runtime & UI**: React 18 + TypeScript (strict mode) + Vite
- **Styling**: Tailwind CSS 3 (obsidian/slate dark theme, antique gold `#d4af37`, ethereal violet `#8b5cf6`, 3D CSS perspective utilities)
- **Icons**: `lucide-react`
- **Testing**: `vitest`

## 3. Core Architecture & Module Layout
- `src/types/tarot.ts`: Domain contracts (`TarotCard`, `Arcana`, `Suit`, `Element`, `CardOrientation`, `SymbolHotspot`, `SpreadDefinition`, `SpreadPosition`, `UsageGuideSection`, `LibraryFilterState`).
- `src/types/study.ts`: Active recall & persistence contracts (`MasteryLevel`, `CardStudyRecord`, `QuizQuestion`, `QuizSessionResult`, `StudyProgressState`, `AppTab`).
- `src/data/`: Static datasets (`cards.ts`, `symbols.ts`, `spreads.ts`, `usageGuide.ts`).
- `src/hooks/`: State & storage hooks (`useLocalStorage.ts`, `useStudyProgress.ts`).
- `src/components/common/`: Shared UI primitives (`Header.tsx`, `TarotCardView.tsx`, `Modal.tsx`).
- `src/components/library/`: Encyclopedia browser & cross-reference matrix (`CardLibrary.tsx`, `FilterBar.tsx`, `CardDetailModal.tsx`).
- `src/components/inspector/`: Deep visual symbolism breakdown (`SymbolInspector.tsx`, `HotspotOverlay.tsx`).
- `src/components/study/`: Active recall study engine (`StudyHub.tsx`, `Flashcards.tsx`, `QuizMode.tsx`, `ProgressDashboard.tsx`).
- `src/components/spreads/`: Interactive spread diagrams & reading dynamics reference (`SpreadGuide.tsx`, `SpreadDiagram.tsx`, `UsageReference.tsx`).

## 4. Implementation Phases
1. **Phase 1 — Foundational Scaffolding & Core Types**: Directory layout, Vite/TS/Tailwind/Vitest configs, core domain & study interfaces, base verification suite, and AST codebase graph (`graphify`).
2. **Phase 2 — Complete 78-Card Dataset & Reference Content**: Authoritative 78-card RWS encyclopedia dataset, calibrated symbolism hotspots, spread layouts, usage dynamics guide, and data integrity tests.
3. **Phase 3 — Visual Card Viewer & Symbol Inspector**: Responsive `1:1.75` card renderer with SVG fallback, 3D upright/reversed flip, and interactive hotspot pin inspector.
4. **Phase 4 — Card Library & Cross-Reference Matrix**: Instant search, multi-tag filtering (Arcana, Suit, Element, Rank, Bookmarks), and full card encyclopedia modal.
5. **Phase 5 — Active Recall Study Hub**: `localStorage` mastery engine, keyboard-accessible flashcards, randomized multi-mode quizzes, and progress dashboard.
6. **Phase 6 — Spread Reference, App Shell Integration & Final Polish**: Interactive clickable spread diagrams (3-Card, 5-Card Cross, 10-Card Celtic Cross), usage manual, navigation shell, and full accessibility/performance audit.
