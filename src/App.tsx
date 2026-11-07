import { useState } from 'react';
import { Book, GraduationCap, LayoutGrid } from 'lucide-react';
import type { AppTab } from './types';
import { Header } from './components/common/Header';
import { SymbolInspector } from './components/inspector/SymbolInspector';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('inspector');

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col font-sans selection:bg-gold/30 selection:text-gold-light">
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="flex-1 flex flex-col">
        <div className={activeTab === 'inspector' ? 'block' : 'hidden'}>
          <SymbolInspector />
        </div>

        {activeTab === 'library' && (
          <div className="max-w-4xl mx-auto my-auto p-12 text-center border border-gold/20 rounded-xl bg-obsidian-surface/60 mt-12">
            <Book className="h-10 w-10 text-gold mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-serif font-semibold text-gold-light mb-2">
              Card Encyclopedia Library
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
              Switch to Visual Inspector to inspect cards and active symbolism hotspots.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('inspector')}
              className="px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-lg text-xs font-medium"
            >
              Open Visual Inspector
            </button>
          </div>
        )}

        {activeTab === 'study' && (
          <div className="max-w-4xl mx-auto my-auto p-12 text-center border border-gold/20 rounded-xl bg-obsidian-surface/60 mt-12">
            <GraduationCap className="h-10 w-10 text-gold mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-serif font-semibold text-gold-light mb-2">
              Study &amp; Active Recall Engine
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
              Flashcard drilling and randomized tarot quizzes with local progress tracking.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('inspector')}
              className="px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-lg text-xs font-medium"
            >
              Explore Card Symbolism First
            </button>
          </div>
        )}

        {activeTab === 'spreads' && (
          <div className="max-w-4xl mx-auto my-auto p-12 text-center border border-gold/20 rounded-xl bg-obsidian-surface/60 mt-12">
            <LayoutGrid className="h-10 w-10 text-gold mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-serif font-semibold text-gold-light mb-2">
              Spread Layout Reference
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
              Interactive layout diagrams for 3-Card, 5-Card, and Celtic Cross spreads.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('inspector')}
              className="px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-lg text-xs font-medium"
            >
              Back to Inspector
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-gold/10 py-6 text-center text-xs text-slate-400 bg-obsidian-surface/40">
        <p>Rider-Waite-Smith Reference Visualizer &bull; Built with React, Vite &amp; Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
