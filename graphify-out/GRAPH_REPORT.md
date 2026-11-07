# Graph Report - tarot-visualizer  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 233 nodes · 316 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c8b6d2c`
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 13 edges
3. `scripts` - 8 edges
4. `react` - 8 edges
5. `SymbolInspector()` - 5 edges
6. `major` - 5 edges
7. `vitest` - 5 edges
8. `lucide-react` - 5 edges
9. `deepFreeze()` - 4 edges
10. `digitRoot()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `SymbolInspector()`  [EXTRACTED]
  src/App.tsx → src/components/inspector/SymbolInspector.tsx
- `QuizQuestion` --references--> `CardOrientation`  [EXTRACTED]
  src/types/study.ts → src/types/tarot.ts
- `App()` --calls--> `Header`  [EXTRACTED]
  src/App.tsx → src/components/common/Header.tsx
- `SymbolInspector()` --calls--> `TarotCardView`  [EXTRACTED]
  src/components/inspector/SymbolInspector.tsx → src/components/common/TarotCardView.tsx
- `SymbolInspector()` --calls--> `HotspotOverlay`  [EXTRACTED]
  src/components/inspector/SymbolInspector.tsx → src/components/inspector/HotspotOverlay.tsx

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 0 - "tarot.ts"
Cohesion: 0.06
Nodes (31): Arcana, ARCANA_TYPES, CardMeanings, CardNumerology, CardRank, CARDS_PER_SUIT, COURT_RANKS, CourtRank (+23 more)

### Community 1 - "package.json"
Cohesion: 0.09
Nodes (9): deepFreeze(), celtic, cross, Pos, SPREADS, three, USAGE_GUIDE, __dirname (+1 more)

### Community 2 - "compilerOptions"
Cohesion: 0.10
Nodes (18): cap(), COURT_THEMES, digitRoot(), EMPTY_HOTSPOTS, hotspots(), major, meanings(), minor (+10 more)

### Community 3 - "App.tsx"
Cohesion: 0.10
Nodes (25): devDependencies, autoprefixer@^10.4.20, postcss@^8.4.49, tailwindcss@^3.4.17, @types/node@^26.6.6, @types/react@^18.3.12, @types/react-dom@^18.3.1, typescript@~5.6.2 (+17 more)

### Community 4 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 5 - "study.ts"
Cohesion: 0.16
Nodes (13): dependencies, lucide-react@^0.468.0, react@^18.3.1, react-dom@^18.3.1, lucide-react, react, react-dom, App() (+5 more)

### Community 6 - "scripts"
Cohesion: 0.15
Nodes (11): TarotCardView, TarotCardViewProps, CATEGORY_BADGES, HotspotOverlay, HotspotOverlayProps, MAJOR_CARDS, MINOR_CARDS, SEARCH_INDEX (+3 more)

### Community 7 - "tailwind.config.js"
Cohesion: 0.12
Nodes (16): APP_TABS, AppTab, CardStudyRecord, INITIAL_STUDY_PROGRESS, MASTERY_LEVELS, MasteryLevel, QUIZ_QUESTION_TYPES, QuizQuestion (+8 more)

### Community 8 - "postcss.config.js"
Cohesion: 0.13
Nodes (14): compilerOptions, allowSyntheticDefaultImports, composite, emitDeclarationOnly, lib, module, moduleResolution, noEmit (+6 more)

### Community 9 - "start-brave-debug.ps1"
Cohesion: 0.36
Nodes (4): build_manifest(), fetch_card(), is_valid_jpeg(), main()

### Community 10 - "tailwind.config.js"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, preview, test, typecheck, verify

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `study.ts` to `App.tsx`, `scripts`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `tarot.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `App.tsx` to `package.json`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08669354838709678 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `study.ts` to `App.tsx`, `scripts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.0960591133004926 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10052910052910052 - nodes in this community are weakly interconnected._