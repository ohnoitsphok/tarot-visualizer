# Graph Report - tarot-visualizer  (2026-11-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 142 nodes · 158 edges · 11 communities (7 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- tarot.ts
- package.json
- compilerOptions
- App.tsx
- compilerOptions
- study.ts
- scripts
- tailwind.config.js

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 13 edges
3. `scripts` - 8 edges
4. `vitest` - 4 edges
5. `CardOrientation` - 3 edges
6. `vite` - 3 edges
7. `@vitejs/plugin-react` - 3 edges
8. `lucide-react` - 3 edges
9. `react` - 3 edges
10. `react-dom` - 3 edges

## Surprising Connections (you probably didn't know these)
- `QuizQuestion` --references--> `CardOrientation`  [EXTRACTED]
  src/types/study.ts → src/types/tarot.ts

## Import Cycles
- None detected.

## Communities (11 total, 4 thin omitted)

### Community 0 - "tarot.ts"
Cohesion: 0.07
Nodes (27): Arcana, ARCANA_TYPES, CardMeanings, CardNumerology, CardRank, CARDS_PER_SUIT, COURT_RANKS, CourtRank (+19 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (21): devDependencies, autoprefixer@^10.4.20, postcss@^8.4.49, tailwindcss@^3.4.17, @types/react@^18.3.12, @types/react-dom@^18.3.1, typescript@~5.6.2, vite@^6.0.5 (+13 more)

### Community 2 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 3 - "App.tsx"
Cohesion: 0.13
Nodes (15): AppTab, CardStudyRecord, INITIAL_STUDY_PROGRESS, MASTERY_LEVELS, MasteryLevel, QUIZ_QUESTION_TYPES, QuizQuestion, QuizQuestionType (+7 more)

### Community 4 - "compilerOptions"
Cohesion: 0.16
Nodes (11): dependencies, lucide-react@^0.468.0, react@^18.3.1, react-dom@^18.3.1, lucide-react, react, react-dom, App() (+3 more)

### Community 5 - "study.ts"
Cohesion: 0.13
Nodes (14): compilerOptions, allowSyntheticDefaultImports, composite, emitDeclarationOnly, lib, module, moduleResolution, noEmit (+6 more)

### Community 7 - "tailwind.config.js"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, preview, test, typecheck, verify

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `compilerOptions` to `package.json`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `tarot.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `tailwind.config.js` to `package.json`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._