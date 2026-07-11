import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Moon, 
  Clock, 
  Star, 
  Sparkles, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { SleepLog } from '../types';

interface SleepSectionProps {
  sleepLogs: SleepLog[];
  onAddSleepLog: (
    duration: number,
    quality: number,
    sleepTime: string,
    wakeTime: string,
    notes?: string
  ) => void;
  onDeleteSleepLog: (id: string) => void;
}

export const SleepSection: React.FC<SleepSectionProps> = ({
  sleepLogs,
  onAddSleepLog,
  onDeleteSleepLog,
}) => {
  const [duration, setDuration] = useState('');
  const [quality, setQuality] = useState<number>(4);
  const [sleepTime, setSleepTime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration) return;

    onAddSleepLog(
      Number(duration),
      quality,
      sleepTime,
      wakeTime,
      notes.trim() || undefined
    );

    setDuration('');
    setQuality(4);
    setSleepTime('22:30');
    setWakeTime('06:30');
    setNotes('');
  };

  // Stats Calculations
  const averageDuration = sleepLogs.length === 0 
    ? 0 
    : parseFloat((sleepLogs.reduce((sum, log) => sum + log.duration, 0) / sleepLogs.length).toFixed(1));

  const averageQuality = sleepLogs.length === 0 
    ? 0 
    : parseFloat((sleepLogs.reduce((sum, log) => sum + log.quality, 0) / sleepLogs.length).toFixed(1));

  const getSleepAdvice = (avgDur: number) => {
    if (avgDur === 0) return 'Log your first sleep session to analyze habits.';
    if (avgDur < 6) return 'Under-rested: Aim for 7–9 hours of sleep for optimal recovery.';
    if (avgDur > 9) return 'Oversleeping: Try maintaining a regular schedule of 7-8 hours.';
    return 'Optimal: You are hitting the target healthy range of 7-9 hours of restful sleep!';
  };

  const getQualityLabel = (val: number) => {
    switch (val) {
      case 5: return '🌟 Excellent Rest';
      case 4: return '✨ Good Sleep';
      case 3: return '💤 Fair / Average';
      case 2: return '🥱 Disturbed Sleep';
      case 1: return '💀 Very Poor';
      default: return 'No Rating';
    }
  };

  const getQualityColor = (val: number) => {
    switch (val) {
      case 5: return 'text-[#b08b46]';
      case 4: return 'text-[#b08b46]/80';
      case 3: return 'text-[#2d2a26]/80';
      case 2: return 'text-amber-600/80';
      case 1: return 'text-rose-500';
      default: return 'text-[#2d2a26]/40';
    }
  };

  return (
    <div className="space-y-6" id="sleep-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#b08b46]/10 pb-5">
        <div>
          <h2 className="font-serif text-3xl italic font-light text-[#b08b46] flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20">
              <Moon className="w-5 h-5 fill-[#b08b46]/10" />
            </span>
            Sleep Tracker
          </h2>
          <p className="text-xs text-[#2d2a26]/60 mt-1 font-sans">
            Monitor nighttime habits, clock total sleep duration, and grade sleep recovery states.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="sleep-stats-row">
        {/* Average Duration */}
        <div className="bg-[#ffffff] border border-[#b08b46]/15 p-4.5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="p-3 bg-[#b08b46]/10 text-[#b08b46] rounded-xl border border-[#b08b46]/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-[#2d2a26]/40 font-sans font-semibold uppercase tracking-widest">Avg Duration</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-serif italic text-[#b08b46]">{averageDuration}</span>
              <span className="text-xs text-[#2d2a26]/60">hrs/night</span>
            </div>
          </div>
        </div>

        {/* Average Quality */}
        <div className="bg-[#ffffff] border border-[#b08b46]/15 p-4.5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="p-3 bg-[#b08b46]/10 text-[#b08b46] rounded-xl border border-[#b08b46]/20">
            <Star className="w-5 h-5 fill-[#b08b46]/10" />
          </div>
          <div>
            <span className="text-[9px] text-[#2d2a26]/40 font-sans font-semibold uppercase tracking-widest">Avg Quality</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-serif italic text-[#b08b46]">{averageQuality}</span>
              <span className="text-xs text-[#2d2a26]/60">/ 5.0</span>
            </div>
          </div>
        </div>

        {/* Advice Banner */}
        <div className="bg-[#ffffff] border border-[#b08b46]/15 p-4.5 rounded-2xl flex items-center gap-3 md:col-span-1 shadow-md">
          <div className="p-3 bg-[#b08b46]/10 text-[#b08b46] rounded-xl border border-[#b08b46]/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] text-[#2d2a26]/40 font-sans font-semibold uppercase tracking-widest block">Sleep Insight</span>
            <p className="text-xs text-[#2d2a26]/80 font-medium leading-relaxed truncate mt-0.5" title={getSleepAdvice(averageDuration)}>
              {getSleepAdvice(averageDuration)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sleep-workspace">
        {/* Logger Card */}
        <div className="lg:col-span-5 bg-[#ffffff] border border-[#b08b46]/15 rounded-2xl p-5 space-y-4 h-fit shadow-md" id="sleep-creator-card">
          <h3 className="font-serif italic text-base text-[#2d2a26] border-b border-[#b08b46]/10 pb-2">Log Sleep Session</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Bedtime</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-sm text-[#2d2a26] focus:outline-none transition-colors"
                  required
                  id="sleep-input-bedtime"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Wake Time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-sm text-[#2d2a26] focus:outline-none transition-colors"
                  required
                  id="sleep-input-waketime"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Duration (hours)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 7.5, 8"
                step="0.1"
                min="0.1"
                max="24"
                className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                required
                id="sleep-input-duration"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">Sleep Quality</label>
              <div className="flex items-center gap-1.5 py-1.5" id="sleep-quality-selector">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starVal = i + 1;
                  const isActive = quality >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setQuality(starVal)}
                      className="p-1.5 text-zinc-400 hover:text-[#b08b46] hover:scale-110 transition-all cursor-pointer"
                      title={getQualityLabel(starVal)}
                    >
                      <Star className={`w-6 h-6 ${isActive ? 'fill-[#b08b46] text-[#b08b46]' : 'text-zinc-200'}`} />
                    </button>
                  );
                })}
                <span className="text-xs font-mono text-[#2d2a26]/60 font-semibold ml-2 select-none">
                  ({quality}/5)
                </span>
              </div>
              <p className="text-[10px] text-[#2d2a26]/40 italic mt-0.5">
                Current selection: {getQualityLabel(quality)}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Sleep Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Woke up once, vivid dreams, felt deep..."
                className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                id="sleep-input-notes"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#b08b46] hover:bg-[#b08b46]/90 active:bg-[#b08b46]/80 text-[#ffffff] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              id="sleep-add-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Sleep
            </button>
          </form>
        </div>

        {/* Display logs */}
        <div className="lg:col-span-7 space-y-4" id="sleep-history-card">
          <h4 className="font-sans font-semibold text-[#2d2a26]/40 text-[10px] uppercase tracking-widest">
            Nightly Sleep logs
          </h4>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {sleepLogs.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-[#b08b46]/15 rounded-2xl bg-[#faf8f5]/40">
                <Moon className="w-6 h-6 text-[#b08b46]/40 mx-auto mb-2" />
                <p className="text-[#2d2a26]/70 text-xs font-semibold font-serif italic">No sleep logs recorded yet</p>
                <p className="text-[#2d2a26]/40 text-[11px] mt-1 font-sans">Consistency is key! Start logging sleep to calculate averages.</p>
              </div>
            ) : (
              [...sleepLogs].reverse().map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#ffffff] border border-[#b08b46]/10 flex items-start justify-between gap-4 shadow-sm animate-fade-in"
                  id={`sleep-item-${log.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-serif italic font-medium text-base text-[#2d2a26] flex items-center gap-1.5">
                        {log.duration} hrs sleep
                      </span>
                      <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${getQualityColor(log.quality)} border-[#b08b46]/10 bg-[#b08b46]/5`}>
                        {getQualityLabel(log.quality)}
                      </span>
                      <span className="text-[9px] text-[#2d2a26]/40 font-mono ml-auto">
                        {new Date(log.date + 'T00:00:00').toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-5 mt-2.5 text-xs text-[#2d2a26]/60 font-mono border-t border-[#b08b46]/10 pt-2.5">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#b08b46]" />
                        Bedtime: <strong className="text-[#b08b46]">{log.sleepTime}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#b08b46]" />
                        Wake time: <strong className="text-[#b08b46]">{log.wakeTime}</strong>
                      </span>
                    </div>

                    {log.notes && (
                      <p className="text-xs text-[#2d2a26]/70 mt-2 bg-[#faf8f5]/50 border border-[#b08b46]/10 p-2.5 rounded-lg italic break-words">
                        "{log.notes}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteSleepLog(log.id)}
                    className="p-1.5 text-[#2d2a26]/40 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-colors cursor-pointer"
                    id={`sleep-delete-${log.id}`}
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
