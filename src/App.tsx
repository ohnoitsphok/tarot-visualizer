import { useCallback, useState } from 'react';
import { GraduationCap, LayoutGrid } from 'lucide-react';
import type { AppTab } from './types';
import { Header } from './components/common/Header';
import { SymbolInspector, type InspectorStage } from './components/inspector/SymbolInspector';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('inspector');
  const [inspectorStage, setInspectorStage] = useState<InspectorStage>('deck');

  const handleSelectTab = useCallback((tab: AppTab) => {
    setActiveTab(tab);
    if (tab === 'inspector') {
      setInspectorStage('deck');
    } else if (tab === 'library') {
      setInspectorStage('grid');
    }
  }, []);

  const handleStageChange = useCallback((nextStage: InspectorStage) => {
    setInspectorStage(nextStage);
    setActiveTab(nextStage === 'grid' ? 'library' : 'inspector');
  }, []);

  const isDeckOrLibrary = activeTab === 'inspector' || activeTab === 'library';

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col font-sans selection:bg-gold/30 selection:text-gold-light">
      <Header activeTab={activeTab} onSelectTab={handleSelectTab} />

      <main className="flex-1 flex flex-col">
        <div className={isDeckOrLibrary ? 'block flex-1' : 'hidden'}>
          <SymbolInspector stage={inspectorStage} onStageChange={handleStageChange} />
        </div>

        {activeTab === 'study' && (
          <div className="max-w-4xl mx-auto my-auto p-12 text-center border border-gold/20 rounded-xl bg-obsidian-surface/60 mt-12">
            <GraduationCap className="h-10 w-10 text-gold mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-serif font-semibold text-gold-light mb-2">
              Study &amp; Active Recall Engine
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-4">
              Flashcard drilling and randomized tarot quizzes with local progress tracking.
            </p>
            <button
              type="button"
              onClick={() => handleSelectTab('inspector')}
              className="px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold-light border border-gold/30 rounded-lg text-xs font-medium"
            >
              Return to Deck Sanctuary
            </button>
          </div>
        )}

        {activeTab === 'spreads' && (
          <div className="max-w-4xl mx-auto my-auto p-12 text-center border border-gold/20 rounded-xl bg-obsidian-surface/60 mt-12">
            <LayoutGrid className="h-10 w-10 text-gold mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-serif font-semibold text-gold-light mb-2">
              Spread Layout Reference
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-4">
              Interactive layout diagrams for 3-Card, 5-Card, and Celtic Cross spreads.
            </p>
            <button
              type="button"
              onClick={() => handleSelectTab('inspector')}
              className="px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold-light border border-gold/30 rounded-lg text-xs font-medium"
            >
              Return to Deck Sanctuary
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-gold/10 py-5 text-center text-xs text-slate-400 bg-obsidian-surface/40">
        <p>Rider-Waite-Smith Reference Visualizer &bull; Built with React, Vite &amp; Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
