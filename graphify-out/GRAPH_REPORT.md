# Graph Report - tarot-visualizer  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 257 nodes · 351 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f23fb01a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- tarot.ts
- package.json
- compilerOptions
- App.tsx
- compilerOptions
- study.ts
- scripts
- tailwind.config.js
- postcss.config.js
- start-brave-debug.ps1
- tailwind.config.js
- tailwind.config.js
- tailwind.config.js

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 13 edges
3. `react` - 9 edges
4. `scripts` - 8 edges
5. `SymbolInspector()` - 7 edges
6. `vitest` - 5 edges
7. `major` - 5 edges
8. `lucide-react` - 5 edges
9. `deepFreeze()` - 4 edges
10. `fetch_card()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `SymbolInspector()`  [EXTRACTED]
  src/App.tsx → src/components/inspector/SymbolInspector.tsx
- `QuizQuestion` --references--> `CardOrientation`  [EXTRACTED]
  src/types/study.ts → src/types/tarot.ts
- `App()` --calls--> `Header`  [EXTRACTED]
  src/App.tsx → src/components/common/Header.tsx
- `SymbolInspector()` --calls--> `MagicCircleBackground`  [EXTRACTED]
  src/components/inspector/SymbolInspector.tsx → src/components/common/MagicCircleBackground.tsx
- `SymbolInspector()` --calls--> `TarotCardView`  [EXTRACTED]
  src/components/inspector/SymbolInspector.tsx → src/components/common/TarotCardView.tsx

## Import Cycles
- None detected.

## Communities (16 total, 3 thin omitted)

### Community 0 - "tarot.ts"
Cohesion: 0.07
Nodes (13): vitest@^2.1.8, vitest, CARD_BY_ID, CARDS, deepFreeze(), celtic, cross, Pos (+5 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (32): Arcana, ARCANA_TYPES, CardMeanings, CardNumerology, CardRank, CARDS_PER_SUIT, COURT_RANKS, CourtRank (+24 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (23): devDependencies, autoprefixer@^10.4.20, postcss@^8.4.49, tailwindcss@^3.4.17, @types/node@^26.6.6, @types/react@^18.3.12, @types/react-dom@^18.3.1, typescript@~5.6.2 (+15 more)

### Community 3 - "App.tsx"
Cohesion: 0.12
Nodes (15): cap(), COURT_THEMES, digitRoot(), EMPTY_HOTSPOTS, hotspots(), major, meanings(), minor (+7 more)

### Community 4 - "compilerOptions"
Cohesion: 0.14
Nodes (14): dependencies, lucide-react@^0.468.0, react@^18.3.1, react-dom@^18.3.1, lucide-react, react, react-dom, App() (+6 more)

### Community 5 - "study.ts"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 6 - "scripts"
Cohesion: 0.16
Nodes (13): MagicCircleBackground, TarotCardView, TarotCardViewProps, HotspotOverlay, DeckFilter, FILTER_OPTIONS, FlyOriginRect, MAJOR_CARDS (+5 more)

### Community 7 - "tailwind.config.js"
Cohesion: 0.12
Nodes (16): APP_TABS, AppTab, CardStudyRecord, INITIAL_STUDY_PROGRESS, MASTERY_LEVELS, MasteryLevel, QUIZ_QUESTION_TYPES, QuizQuestion (+8 more)

### Community 8 - "postcss.config.js"
Cohesion: 0.17
Nodes (9): buildSmoothContourPath(), CATEGORY_BADGES, getContourPoints(), HotspotOverlayBase(), HotspotOverlayProps, triggerHaptic(), HotspotRow, MAJOR_ROWS (+1 more)

### Community 9 - "start-brave-debug.ps1"
Cohesion: 0.13
Nodes (14): compilerOptions, allowSyntheticDefaultImports, composite, emitDeclarationOnly, lib, module, moduleResolution, noEmit (+6 more)

### Community 10 - "tailwind.config.js"
Cohesion: 0.17
Nodes (9): INNER_STAR_DIAGONALS, INNER_STAR_POINTS, MagicCircleBackgroundProps, MIDDLE_TICKS, OUTER_TICKS, SQ1_INNER, SQ1_OUTER, SQ2_INNER (+1 more)

### Community 11 - "tailwind.config.js"
Cohesion: 0.36
Nodes (4): build_manifest(), fetch_card(), is_valid_jpeg(), main()

### Community 12 - "tailwind.config.js"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, preview, test, typecheck, verify

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `compilerOptions` to `postcss.config.js`, `compilerOptions`, `tailwind.config.js`, `scripts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Should `tarot.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07394957983193277 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `tarot.ts` to `compilerOptions`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `compilerOptions` to `compilerOptions`, `scripts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.11333333333333333 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._