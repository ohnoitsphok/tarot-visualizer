import { useCallback, useState } from 'react';
import { Compass, GraduationCap, LayoutGrid } from 'lucide-react';
import type { AppTab } from './types';
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
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col font-sans selection:bg-gold/30 selection:text-gold-light relative">
      {/* Subtle Persistent Floating Seal Button for Universal Return / Navigation */}
      <nav
        aria-label="Sanctuary Navigation"
        className="fixed top-4 left-4 z-50 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => handleSelectTab('inspector')}
          title="Return to Deck Sanctuary"
          aria-label="Return to Deck Sanctuary"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian-elevated/80 hover:bg-obsidian-surface border border-gold/30 hover:border-gold/60 text-gold-light backdrop-blur-md shadow-lg transition-all text-xs font-serif focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <Compass className="h-3.5 w-3.5 text-gold group-hover:rotate-45 transition-transform" />
          <span className="font-medium tracking-wide">Sanctuary</span>
        </button>

        {inspectorStage !== 'deck' && (
          <button
            type="button"
            onClick={() => handleStageChange('grid')}
            title="Return to Arcana Wheel"
            aria-label="Return to Arcana Wheel"
            className="px-3 py-1.5 rounded-full bg-obsidian-elevated/60 hover:bg-obsidian-surface border border-gold/20 hover:border-gold/40 text-slate-300 hover:text-gold-light backdrop-blur-md shadow-md transition-all text-xs font-serif"
          >
            Arcana Wheel
          </button>
        )}
      </nav>

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
    </div>
  );
}

export default App;
