import React from 'react';
import { Palette, Shapes, Eye, Image as ImageIcon, Sliders } from 'lucide-react';
import { CustomizationTabKey } from '../types';

interface MobileFloatingNavProps {
  activeTab: CustomizationTabKey;
  onSelectTab: (tab: CustomizationTabKey) => void;
  hasLogo?: boolean;
}

interface NavItem {
  id: CustomizationTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'colors', label: 'Colour', icon: Palette },
  { id: 'patterns', label: 'Pattern', icon: Shapes },
  { id: 'eyes', label: 'Eyes', icon: Eye },
  { id: 'logo', label: 'Logo', icon: ImageIcon },
  { id: 'quality', label: 'Quality', icon: Sliders },
];

export const MobileFloatingNav: React.FC<MobileFloatingNavProps> = ({
  activeTab,
  onSelectTab,
  hasLogo = false,
}) => {
  const handleClick = (id: CustomizationTabKey) => {
    onSelectTab(id);

    // Smoothly scroll to the customization panel so the user sees the active options
    const panelEl = document.getElementById('customization-panel');
    if (panelEl) {
      panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="Mobile and Tablet Customization Navigation"
      className="fixed bottom-2.5 inset-x-2.5 sm:inset-x-6 max-w-md sm:max-w-lg mx-auto z-40 lg:hidden pb-[max(0px,env(safe-area-inset-bottom))]"
    >
      <div className="w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xl shadow-zinc-950/15 dark:shadow-black/50 p-1 transition-all">
        <div className="grid grid-cols-5 gap-0.5 sm:gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`floating-nav-${item.id}`}
                type="button"
                onClick={() => handleClick(item.id)}
                className={`relative flex flex-col items-center justify-center gap-1 min-h-[42px] sm:min-h-[46px] py-1.5 px-0.5 rounded-xl text-center transition-all active:scale-95 focus:outline-none ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-medium'
                }`}
                title={`Customize ${item.label}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'}`} />
                <span className="text-[10px] sm:text-[11px] leading-tight tracking-tight whitespace-nowrap">
                  {item.label}
                </span>

                {item.id === 'logo' && hasLogo && (
                  <span
                    className={`absolute top-1 right-1.5 sm:right-2 w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-white' : 'bg-red-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
