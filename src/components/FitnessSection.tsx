import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Activity, 
  Flame, 
  Clock, 
  TrendingUp, 
  Award,
  ListFilter
} from 'lucide-react';
import { FitnessLog } from '../types';

interface FitnessSectionProps {
  fitnessLogs: FitnessLog[];
  onAddFitnessLog: (
    activityType: string,
    duration: number,
    caloriesBurned: number,
    intensity: FitnessLog['intensity'],
    notes?: string
  ) => void;
  onDeleteFitnessLog: (id: string) => void;
}

const FITNESS_ACTIVITIES = [
  'Strength Training',
  'Running / Jogging',
  'Cardio / HIIT',
  'Cycling',
  'Yoga & Stretching',
  'Swimming',
  'Walking',
  'Other / Custom',
];

export const FitnessSection: React.FC<FitnessSectionProps> = ({
  fitnessLogs,
  onAddFitnessLog,
  onDeleteFitnessLog,
}) => {
  const [activity, setActivity] = useState(FITNESS_ACTIVITIES[0]);
  const [customActivity, setCustomActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [intensity, setIntensity] = useState<FitnessLog['intensity']>('medium');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actType = activity === 'Other / Custom' ? customActivity.trim() || 'Custom Workout' : activity;
    const durMins = Number(duration) || 30;
    const calBurned = Number(calories) || Math.round(durMins * (intensity === 'high' ? 10 : intensity === 'medium' ? 7 : 4));

    onAddFitnessLog(actType, durMins, calBurned, intensity, notes.trim() || undefined);

    setDuration('');
    setCalories('');
    setNotes('');
    setCustomActivity('');
  };

  // Stats Calculations
  const totalWorkouts = fitnessLogs.length;
  const totalMinutes = fitnessLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalCalories = fitnessLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);

  // Intensity distribution count
  const intensityStats = fitnessLogs.reduce(
    (acc, log) => {
      acc[log.intensity] = (acc[log.intensity] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 } as Record<string, number>
  );

  const getIntensityBadge = (i: FitnessLog['intensity']) => {
    switch (i) {
      case 'high': return 'bg-rose-950/40 text-rose-400 border border-rose-500/20';
      case 'medium': return 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20';
      case 'low': return 'bg-[#e0dcd0]/5 text-[#e0dcd0]/70 border border-[#e0dcd0]/10';
    }
  };

  return (
    <div className="space-y-6" id="fitness-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#b08b46]/10 pb-5">
        <div>
          <h2 className="font-serif text-3xl italic font-light text-[#b08b46] flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20">
              <Activity className="w-5 h-5" />
            </span>
            Fitness Logger
          </h2>
          <p className="text-xs text-[#2d2a26]/60 mt-1 font-sans">
            Track daily calorie burn, exercises, workouts, and track duration trends.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="fitness-stats-row">
        {/* Total Calories */}
        <div className="bg-[#ffffff] border border-[#b08b46]/15 p-4.5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="p-3 bg-[#b08b46]/10 text-[#b08b46] rounded-xl border border-[#b08b46]/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-[#2d2a26]/40 font-sans font-semibold uppercase tracking-widest">Total Burned</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-serif italic text-[#b08b46]">{totalCalories}</span>
              <span className="text-xs text-[#2d2a26]/60">kcal</span>
            </div>
          </div>
        </div>

        {/* Total Duration */}
        <div className="bg-[#ffffff] border border-[#b08b46]/15 p-4.5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="p-3 bg-[#b08b46]/10 text-[#b08b46] rounded-xl border border-[#b08b46]/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-[#2d2a26]/40 font-sans font-semibold uppercase tracking-widest">Active Time</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-serif italic text-[#b08b46]">{totalMinutes}</span>
              <span className="text-xs text-[#2d2a26]/60">mins</span>
            </div>
          </div>
        </div>

        {/* Total Workouts */}
        <div className="bg-[#ffffff] border border-[#b08b46]/15 p-4.5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="p-3 bg-[#b08b46]/10 text-[#b08b46] rounded-xl border border-[#b08b46]/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-[#2d2a26]/40 font-sans font-semibold uppercase tracking-widest">Workouts</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-serif italic text-[#b08b46]">{totalWorkouts}</span>
              <span className="text-xs text-[#2d2a26]/60">sessions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="fitness-workspace">
        {/* Logger panel */}
        <div className="lg:col-span-5 bg-[#ffffff] border border-[#b08b46]/15 rounded-2xl p-5 space-y-4 h-fit shadow-md" id="fitness-creator-card">
          <h3 className="font-serif italic text-base text-[#2d2a26] border-b border-[#b08b46]/10 pb-2">Log New Workout</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Activity Type</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2.5 text-sm text-[#2d2a26] focus:outline-none transition-colors cursor-pointer"
                id="fitness-input-activity"
              >
                {FITNESS_ACTIVITIES.map((act) => (
                  <option key={act} value={act} className="bg-[#ffffff]">
                    {act}
                  </option>
                ))}
              </select>
            </div>

            {activity === 'Other / Custom' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Custom Activity Name</label>
                <input
                  type="text"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  placeholder="e.g., Pilates, Rowing, Boxing"
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                  required
                  id="fitness-input-custom-activity"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Duration (mins)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  min="1"
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2 text-sm text-[#2d2a26] focus:outline-none transition-colors"
                  required
                  id="fitness-input-duration"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Calories (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Est. automatically"
                  min="1"
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2 text-sm text-[#2d2a26] focus:outline-none transition-colors"
                  id="fitness-input-calories"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">Workout Intensity</label>
              <div className="grid grid-cols-3 gap-2" id="fitness-intensity-buttons">
                {(['low', 'medium', 'high'] as const).map((lvl) => {
                  const isActive = intensity === lvl;
                  const intensityStyles = 
                    lvl === 'high' 
                      ? 'border-rose-500 text-rose-600 bg-rose-50' 
                      : lvl === 'medium' 
                      ? 'border-[#b08b46] text-[#b08b46] bg-[#b08b46]/10'
                      : 'border-[#2d2a26]/30 text-[#2d2a26]/80 bg-[#2d2a26]/5';
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setIntensity(lvl)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        isActive 
                          ? intensityStyles + ' ring-1 ring-[#b08b46] ring-offset-2 ring-offset-[#ffffff]' 
                          : 'border-[#b08b46]/10 text-[#2d2a26]/40 hover:text-[#2d2a26] hover:border-[#b08b46]/30 bg-[#faf8f5]'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Session Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you feel? Cardio rate, weights..."
                className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                id="fitness-input-notes"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#b08b46] hover:bg-[#b08b46]/90 active:bg-[#b08b46]/80 text-[#ffffff] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              id="fitness-add-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Workout
            </button>
          </form>
        </div>

        {/* Display logs */}
        <div className="lg:col-span-7 flex flex-col gap-4" id="fitness-history-card">
          <div className="flex items-center justify-between">
            <h4 className="font-sans font-semibold text-[#2d2a26]/40 text-[10px] uppercase tracking-widest flex items-center gap-1">
              <ListFilter className="w-3.5 h-3.5 text-[#b08b46]" />
              Workout History logs
            </h4>

            {/* Micro breakdown indicators */}
            <div className="flex items-center gap-2.5 text-[9px] font-mono text-[#2d2a26]/40">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Low: {intensityStats.low}</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#b08b46]" /> Med: {intensityStats.medium}</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> High: {intensityStats.high}</span>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {fitnessLogs.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-[#b08b46]/15 rounded-2xl bg-[#ffffff]/30">
                <Activity className="w-6 h-6 text-[#b08b46]/40 mx-auto mb-2" />
                <p className="text-[#2d2a26]/70 text-xs font-semibold font-serif italic">No workout logs recorded yet</p>
                <p className="text-[#2d2a26]/40 text-[11px] mt-1 font-sans">Get sweating and log your first workout session!</p>
              </div>
            ) : (
              [...fitnessLogs].reverse().map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#ffffff] border border-[#b08b46]/10 flex items-start justify-between gap-4 shadow-sm"
                  id={`fitness-item-${log.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-serif italic font-medium text-base text-[#2d2a26]">
                        {log.activityType}
                      </span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${getIntensityBadge(log.intensity)}`}>
                        {log.intensity} Intensity
                      </span>
                      <span className="text-[9px] text-[#2d2a26]/40 font-mono ml-auto">
                        {new Date(log.date + 'T00:00:00').toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-5 mt-2.5 text-xs text-[#2d2a26]/60 font-mono border-t border-[#b08b46]/10 pt-2.5">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#b08b46]" />
                        Duration: <strong className="text-[#b08b46]">{log.duration}m</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#b08b46]" />
                        Burned: <strong className="text-[#b08b46]">{log.caloriesBurned} kcal</strong>
                      </span>
                    </div>

                    {log.notes && (
                      <p className="text-xs text-[#2d2a26]/70 mt-2 bg-[#faf8f5]/50 border border-[#b08b46]/10 p-2.5 rounded-lg italic break-words">
                        "{log.notes}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteFitnessLog(log.id)}
                    className="p-1.5 text-[#2d2a26]/40 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-colors cursor-pointer"
                    id={`fitness-delete-${log.id}`}
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
