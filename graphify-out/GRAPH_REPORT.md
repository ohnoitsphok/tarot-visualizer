# Graph Report - tarot-visualizer  (2026-11-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 209 nodes · 283 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `417b2882`
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 13 edges
3. `react` - 8 edges
4. `scripts` - 8 edges
5. `lucide-react` - 5 edges
6. `vitest` - 5 edges
7. `major` - 5 edges
8. `App()` - 4 edges
9. `TarotCardView()` - 4 edges
10. `SymbolInspector()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `QuizQuestion` --references--> `CardOrientation`  [EXTRACTED]
  src/types/study.ts → src/types/tarot.ts
- `App()` --calls--> `Header()`  [EXTRACTED]
  src/App.tsx → src/components/common/Header.tsx
- `App()` --calls--> `SymbolInspector()`  [EXTRACTED]
  src/App.tsx → src/components/inspector/SymbolInspector.tsx
- `TarotCardView()` --calls--> `HotspotOverlay()`  [EXTRACTED]
  src/components/common/TarotCardView.tsx → src/components/inspector/HotspotOverlay.tsx
- `SymbolInspector()` --calls--> `TarotCardView()`  [EXTRACTED]
  src/components/inspector/SymbolInspector.tsx → src/components/common/TarotCardView.tsx

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "tarot.ts"
Cohesion: 0.06
Nodes (31): Arcana, ARCANA_TYPES, CardMeanings, CardNumerology, CardRank, CARDS_PER_SUIT, COURT_RANKS, CourtRank (+23 more)

### Community 1 - "package.json"
Cohesion: 0.13
Nodes (18): dependencies, lucide-react@^0.468.0, react@^18.3.1, react-dom@^18.3.1, lucide-react, react, react-dom, App() (+10 more)

### Community 2 - "compilerOptions"
Cohesion: 0.09
Nodes (10): vitest@^2.1.8, vitest, CARDS, deepFreeze(), celtic, cross, Pos, SPREADS (+2 more)

### Community 3 - "App.tsx"
Cohesion: 0.10
Nodes (18): cap(), CARD_BY_ID, COURT_THEMES, digitRoot(), hotspots(), major, meanings(), minor (+10 more)

### Community 4 - "compilerOptions"
Cohesion: 0.12
Nodes (21): devDependencies, autoprefixer@^10.4.20, postcss@^8.4.49, tailwindcss@^3.4.17, @types/react@^18.3.12, @types/react-dom@^18.3.1, typescript@~5.6.2, vite@^6.0.5 (+13 more)

### Community 5 - "study.ts"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 6 - "scripts"
Cohesion: 0.12
Nodes (16): APP_TABS, AppTab, CardStudyRecord, INITIAL_STUDY_PROGRESS, MASTERY_LEVELS, MasteryLevel, QUIZ_QUESTION_TYPES, QuizQuestion (+8 more)

### Community 7 - "tailwind.config.js"
Cohesion: 0.13
Nodes (14): compilerOptions, allowSyntheticDefaultImports, composite, emitDeclarationOnly, lib, module, moduleResolution, noEmit (+6 more)

### Community 8 - "postcss.config.js"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, preview, test, typecheck, verify

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `package.json` to `compilerOptions`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `tarot.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `compilerOptions` to `compilerOptions`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12643678160919541 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `postcss.config.js` to `compilerOptions`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.0896551724137931 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0960591133004926 - nodes in this community are weakly interconnected._