/**
 * Erase Data & Session Management Modal
 * 
 * Provides a reliable, browser-blocker-proof modal dialog to either
 * completely erase all session data (empty dashboard) or restore demo sample data.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, RefreshCw, X, AlertTriangle } from 'lucide-react';

export interface EraseDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEraseAll: () => void;
  onRestoreSamples: () => void;
}

export const EraseDataModal: React.FC<EraseDataModalProps> = ({
  isOpen,
  onClose,
  onEraseAll,
  onRestoreSamples
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2d2a26]/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#faf8f5] dark:bg-[#1f1d1a] border border-[#b08b46]/25 rounded-3xl p-6 md:p-8 shadow-2xl z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#b08b46]/15 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-rose-500/10 text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif italic text-lg text-[#2d2a26] dark:text-[#faf8f5]">
                    Data Session Manager
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider text-[#2d2a26]/50 dark:text-[#faf8f5]/50">
                    Local Storage Controls
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#2d2a26]/40 hover:text-[#2d2a26] dark:text-[#faf8f5]/40 dark:hover:text-[#faf8f5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#2d2a26]/75 dark:text-[#faf8f5]/75 leading-relaxed mb-6">
              Choose how you want to manage your stored protocol data. You can completely wipe all entries for a clean slate, or restore the initial demonstration sample dataset.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onEraseAll();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Erase All Data (Clean Slate)
              </button>

              <button
                onClick={() => {
                  onRestoreSamples();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#b08b46]/10 hover:bg-[#b08b46]/20 text-[#b08b46] border border-[#b08b46]/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Restore Demo Sample Data
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-[#2d2a26]/50 hover:text-[#2d2a26] dark:text-[#faf8f5]/50 dark:hover:text-[#faf8f5] text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
