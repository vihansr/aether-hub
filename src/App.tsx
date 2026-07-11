/**
 * Root Application Orchestrator (Aether Hub)
 * 
 * Orchestrates application-wide theme state, domain state management,
 * navigation header, radial overview menu, active category views, and cloud sync.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare,
  FileText,
  Calendar,
  Dumbbell,
  Droplet,
  Moon,
  ArrowLeft
} from 'lucide-react';

import { CategoryType } from './types';
import { useTheme } from './hooks/useTheme';
import { useAetherState } from './hooks/useAetherState';
import { Header } from './components/Header';
import { CloudSyncModal } from './components/CloudSyncModal';
import { RadialMenu, CATEGORIES } from './components/RadialMenu';
import { TodoSection } from './components/TodoSection';
import { NotesSection } from './components/NotesSection';
import { CalendarSection } from './components/CalendarSection';
import { FitnessSection } from './components/FitnessSection';
import { FoodWaterSection } from './components/FoodWaterSection';
import { SleepSection } from './components/SleepSection';

/**
 * Main Application Viewport
 */
export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Application Hooks
  const { theme, toggleTheme } = useTheme();
  const state = useAetherState();

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

  const getCategoryBorderClass = () => {
    return 'border-[#b08b46]/20 bg-[#b08b46]/5 text-[#b08b46]';
  };

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-[#2d2a26] flex flex-col font-sans selection:bg-[#b08b46]/20 selection:text-[#2d2a26]"
      id="app-viewport"
    >
      {/* Global Top Navigation Bar */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onClearAllData={state.handleClearAllStorage}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col justify-center" id="main-content-area">
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            /* Main Radial Overview Menu */
            <motion.div
              key="radial-menu-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              id="landing-radial-view"
            >
              <RadialMenu onSelectCategory={setActiveCategory} stats={state.statsSummary} />
            </motion.div>
          ) : (
            /* Selected Category Activity View */
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#ffffff]/90 border border-[#b08b46]/15 rounded-3xl p-6 md:p-8 shadow-[0_4px_30px_rgba(176,139,70,0.06)] backdrop-blur-md relative"
              id="active-category-container"
            >
              {/* Back breadcrumb overlay */}
              <div className="flex items-center justify-between gap-2 mb-8 border-b border-[#b08b46]/10 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="px-3.5 py-1.5 rounded-full bg-[#faf8f5]/80 border border-[#b08b46]/15 hover:border-[#b08b46]/45 text-[#2d2a26]/75 hover:text-[#2d2a26] transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer group"
                    id="back-to-menu-btn"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#b08b46]" />
                    Home Hub
                  </button>
                  <div className="text-[#b08b46]/30 text-xs font-mono select-none">/</div>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getCategoryBorderClass()}`}
                  >
                    {getCategoryIcon(activeCategory, 'w-3.5 h-3.5 text-[#b08b46]')}
                    <span className="font-serif italic font-medium">
                      {CATEGORIES.find(c => c.id === activeCategory)?.label}
                    </span>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="font-serif text-[#b08b46] italic text-base">Aether Protocol</span>
                  <span className="block text-[8px] tracking-[0.2em] uppercase text-[#2d2a26]/30 -mt-1">
                    Active Session
                  </span>
                </div>
              </div>

              {/* Individual category render router */}
              {activeCategory === 'todo' && (
                <TodoSection
                  todos={state.todos}
                  onAddTodo={state.handleAddTodo}
                  onToggleTodo={state.handleToggleTodo}
                  onDeleteTodo={state.handleDeleteTodo}
                  onClearCompleted={state.handleClearCompletedTodos}
                />
              )}

              {activeCategory === 'notes' && (
                <NotesSection
                  notes={state.notes}
                  onAddNote={state.handleAddNote}
                  onDeleteNote={state.handleDeleteNote}
                  onUpdateNote={state.handleUpdateNote}
                />
              )}

              {activeCategory === 'calendar' && (
                <CalendarSection
                  events={state.events}
                  onAddEvent={state.handleAddEvent}
                  onDeleteEvent={state.handleDeleteEvent}
                />
              )}

              {activeCategory === 'fitness' && (
                <FitnessSection
                  fitnessLogs={state.fitnessLogs}
                  onAddFitnessLog={state.handleAddFitnessLog}
                  onDeleteFitnessLog={state.handleDeleteFitnessLog}
                />
              )}

              {activeCategory === 'food_water' && (
                <FoodWaterSection
                  foodWaterLog={state.todayFoodWater}
                  onUpdateWater={state.handleUpdateWater}
                  onAddMeal={state.handleAddMeal}
                  onDeleteMeal={state.handleDeleteMeal}
                  onResetFoodWater={state.handleResetFoodWater}
                />
              )}

              {activeCategory === 'sleep' && (
                <SleepSection
                  sleepLogs={state.sleepLogs}
                  onAddSleepLog={state.handleAddSleepLog}
                  onDeleteSleepLog={state.handleDeleteSleepLog}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Aesthetic Footer */}
      <footer className="border-t border-[#b08b46]/10 bg-[#faf8f5] text-center py-5 text-[#2d2a26]/30 text-xs" id="footer-pane">
        <p className="font-sans uppercase tracking-[0.25em] text-[8px]">
          © 2026 Aether Hub • Unified Life Protocol • Local Session Active
        </p>
      </footer>

      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        currentData={{
          todos: state.todos,
          notes: state.notes,
          events: state.events,
          fitnessLogs: state.fitnessLogs,
          sleepLogs: state.sleepLogs,
          foodWaterLogs: state.foodWaterLogs
        }}
        onLoadData={data => {
          if (data.todos) state.setTodos(data.todos);
          if (data.notes) state.setNotes(data.notes);
          if (data.events) state.setEvents(data.events);
          if (data.fitnessLogs) state.setFitnessLogs(data.fitnessLogs);
          if (data.sleepLogs) state.setSleepLogs(data.sleepLogs);
          if (data.foodWaterLogs) state.setFoodWaterLogs(data.foodWaterLogs);
        }}
      />
    </div>
  );
}
