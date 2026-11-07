# Tarot Reference & Visualizer Design System (`DESIGN.md`)

## 1. Visual Identity & Atmosphere
- **Archetype & Tone**: Esoteric scholarship, illuminated manuscript meets modern dark observatory. Dignified, legible, restrained — avoiding cartoonish witchcraft or garish neon purple.
- **Palette Tokens**:
  - `obsidian`: `#0c0d14` (Deep space canvas)
  - `obsidian-surface`: `#141622` (Card backings, panels, drawers)
  - `obsidian-elevated`: `#1d2030` (Tooltips, active states, modals)
  - `gold`: `#d4af37` (Antique gold accents, active pins, borders)
  - `gold-light`: `#f3d97d` (High-contrast illuminated headers)
  - `gold-muted`: `#a68829` (Subtle borders, inactive glyphs)
  - `ethereal`: `#8b5cf6` (Cosmic accent, Major Arcana distinction)
  - `slate-100`: `#f1f5f9` (Primary text, high contrast >= 12:1 against obsidian)
  - `slate-300`: `#cbd5e1` (Body copy, >= 7:1 contrast)
  - `slate-400`: `#94a3b8` (Muted labels, >= 4.5:1 contrast)

## 2. Typography & Layout Hierarchy
- **Primary Body Font**: System UI Sans (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`) for crisp legibility across numbers, keywords, and symbol descriptions.
- **Display Headings**: Serifs / Elegant display with tracked capitals (`tracking-wide` or `tracking-widest`, max -0.02em to +0.05em).
- **Measure**: 60–75ch for explanatory text; compact 2-column or 3-column metadata grids.

## 3. Card Geometry & 3D Mechanics
- **Aspect Ratio**: Locked `4 : 7` (`1 : 1.75`), strictly matching traditional Rider-Waite-Smith proportions.
- **Elevation**: Single 1px border (`border-gold/30`) with soft deep shadow (`shadow-2xl shadow-black/80`).
- **3D Transform**: Smooth CSS 3D perspective flip (`perspective: 1000px`, `transform-style: preserve-3d`, `backface-visibility: hidden`).
- **Hotspot Pins**:
  - Normalized `0..100%` anchor coordinates.
  - Interactive pulse indicator with ambient ring (`ring-1 ring-gold/40 hover:ring-gold`).
  - Accessible focus ring and tooltip popover that clamps inside card boundary.

## 4. Craft Floor Constraints
- Minimum contrast ratio >= 4.5:1 for all informative text.
- No unstyled raw text overflows; responsive wrapping at desktop (1280px), tablet (768px), and mobile (375px).
- SVG fallback cards generated procedurally if remote raster images fail or network is offline.
