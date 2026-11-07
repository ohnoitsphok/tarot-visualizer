import React, { memo } from 'react';
import { Book, Compass, GraduationCap, LayoutGrid, Sparkles } from 'lucide-react';
import { APP_TABS, type AppTab } from '../../types';

export interface HeaderProps {
  readonly activeTab: AppTab;
  readonly onSelectTab: (tab: AppTab) => void;
}

const TAB_CONFIG: Readonly<
  Record<AppTab, { label: string; icon: React.FC<{ className?: string }> }>
> = Object.freeze({
  inspector: { label: 'Visual Inspector', icon: Compass },
  library: { label: 'Card Encyclopedia', icon: Book },
  study: { label: 'Study & Memorize', icon: GraduationCap },
  spreads: { label: 'Spread Reference', icon: LayoutGrid },
});

const DISPLAY_ORDER: readonly AppTab[] = Object.freeze([
  'inspector',
  ...APP_TABS.filter((t) => t !== 'inspector'),
]);

const HeaderBase: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="border-b border-gold/20 bg-obsidian-surface/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold tracking-wide text-gold-light leading-tight">
                Tarot Visualizer
              </h1>
              <p className="text-[10px] text-slate-400 font-sans tracking-wider uppercase">
                RWS Reference &amp; Study Guide
              </p>
            </div>
          </div>

          <nav aria-label="Primary navigation" className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            {DISPLAY_ORDER.map((tab) => {
              const { label, icon: Icon } = TAB_CONFIG[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onSelectTab(tab)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-gold ${
                    isActive
                      ? 'bg-gold/15 text-gold-light border border-gold/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-elevated/60 border border-transparent'
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 ${isActive ? 'text-gold' : 'text-slate-400'}`}
                  />
                  <span className="sr-only sm:not-sr-only">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderBase);
