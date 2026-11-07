import { Sparkles } from 'lucide-react';
import { APP_TABS, TOTAL_RWS_CARDS } from './types';

export function App() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100 flex items-center justify-center p-6">
      <section className="max-w-lg w-full rounded-xl border border-gold/30 bg-obsidian-surface p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-semibold tracking-wide text-gold-light">
          Tarot Reference &amp; Visualizer
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Phase 1 scaffold ready &mdash; {TOTAL_RWS_CARDS}-card RWS schema &amp;{' '}
          {APP_TABS.length} core modules initialized.
        </p>
      </section>
    </main>
  );
}

export default App;
