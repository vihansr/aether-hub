/**
 * Global Top Navigation Bar Component
 * 
 * Provides top-level branding, active session category switcher breadcrumb,
 * Cloud Sync Modal launch trigger, Light/Dark theme toggle, and data reset trigger.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  CheckSquare,
  FileText,
  Calendar,
  Dumbbell,
  Droplet,
  Moon,
  Sun,
  ChevronRight,
  Database,
  Cloud
} from 'lucide-react';
import { CategoryType } from '../types';
import { CATEGORIES } from './RadialMenu';

export interface HeaderProps {
  /** Currently active session category or null when on main menu */
  activeCategory: CategoryType | null;
  /** Handler to change active category or return home */
  onSelectCategory: (category: CategoryType | null) => void;
  /** Handler to open the Cloud Sync Modal */
  onOpenSyncModal: () => void;
  /** Current active theme mode */
  theme: 'light' | 'dark';
  /** Handler to toggle between light and dark modes */
  onToggleTheme: () => void;
  /** Handler to reset all local session data */
  onClearAllData: () => void;
}

/**
 * Renders the sticky top navigation header bar.
 */
export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenSyncModal,
  theme,
  onToggleTheme,
  onClearAllData
}) => {
  const getCategoryIcon = (id: CategoryType, className: string = 'w-4 h-4') => {
    switch (id) {
      case 'todo':
        return <CheckSquare className={className} />;
      case 'notes':
        return <FileText className={className} />;
      case 'calendar':
        return <Calendar className={className} />;
      case 'fitness':
        return <Dumbbell className={className} />;
      case 'food_water':
        return <Droplet className={className} />;
      case 'sleep':
        return <Moon className={className} />;
    }
  };

  return (
    <header
      className="border-b border-[#b08b46]/10 bg-[#faf8f5]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      id="global-header"
    >
      <button
        onClick={() => onSelectCategory(null)}
        className="flex items-center gap-2 group cursor-pointer text-left"
        id="logo-button"
      >
        <div className="p-1.5 rounded-full bg-[#faf8f5] border border-[#b08b46]/30 group-hover:border-[#b08b46] transition-all">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4 text-[#b08b46]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
          </svg>
        </div>
        <div>
          <h1 className="font-serif italic font-light text-lg tracking-tight text-[#b08b46]">Aether Hub</h1>
          <span className="text-[9px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-[0.2em] block -mt-0.5">
            Unified Life Protocol
          </span>
        </div>
      </button>

      {/* Quick Switcher Bar & Utility Controls */}
      <div className="flex items-center gap-2 max-w-full">
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="hidden sm:flex items-center gap-1.5 bg-[#faf8f5] border border-[#b08b46]/15 px-2.5 py-1.5 rounded-full text-xs"
              id="quick-swapper"
            >
              <Home
                className="w-3.5 h-3.5 text-[#2d2a26]/50 cursor-pointer hover:text-[#b08b46] transition-colors"
                onClick={() => onSelectCategory(null)}
              />
              <ChevronRight className="w-3 h-3 text-[#b08b46]/40" />
              <div className="flex items-center gap-1.5 font-serif italic text-[#b08b46]">
                {getCategoryIcon(activeCategory, 'w-3.5 h-3.5 text-[#b08b46]')}
                <span className="capitalize">{activeCategory.replace('_', ' & ')}</span>
              </div>

              <div className="w-[1px] h-3.5 bg-[#b08b46]/15 mx-1.5" />

              {/* Category Mini Switcher Tabs */}
              <div className="flex items-center gap-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`p-1 rounded-full transition-colors cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#b08b46]/10 text-[#b08b46]'
                        : 'text-[#2d2a26]/45 hover:text-[#b08b46] hover:bg-[#b08b46]/5'
                    }`}
                    title={cat.label}
                  >
                    {getCategoryIcon(cat.id, 'w-3.5 h-3.5')}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cloud Sync Button */}
        <button
          onClick={onOpenSyncModal}
          className="p-1.5 rounded-lg text-[#b08b46]/60 hover:text-[#b08b46] hover:bg-[#b08b46]/5 transition-all flex items-center gap-1 text-[11px] font-semibold cursor-pointer mr-1"
          title="Cloud Sync Center"
        >
          <Cloud className="w-3.5 h-3.5 text-[#b08b46]" />
          <span className="hidden md:inline text-xs">Cloud Sync</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg text-[#b08b46]/60 hover:text-[#b08b46] hover:bg-[#b08b46]/5 transition-all flex items-center gap-1 text-[11px] font-semibold cursor-pointer mr-1"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5 text-[#b08b46]" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-[#b08b46]" />
          )}
          <span className="hidden md:inline text-xs">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        {/* Reset All Data Action */}
        <button
          onClick={onClearAllData}
          className="p-1.5 rounded-lg text-[#2d2a26]/40 hover:text-rose-500 hover:bg-rose-500/5 transition-all flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
          title="Erase All Data"
        >
          <Database className="w-3.5 h-3.5 text-[#b08b46]/60" />
          <span className="hidden md:inline text-xs">Erase Data</span>
        </button>
      </div>
    </header>
  );
};
