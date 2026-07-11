import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Droplet, 
  Utensils, 
  Coffee, 
  Clock, 
  ChevronRight, 
  Apple,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { FoodWaterLog, Meal } from '../types';

interface FoodWaterSectionProps {
  foodWaterLog: FoodWaterLog;
  onUpdateWater: (amount: number) => void;
  onAddMeal: (name: string, calories: number, mealType: Meal['type'], time: string) => void;
  onDeleteMeal: (id: string) => void;
  onResetFoodWater: () => void;
}

export const FoodWaterSection: React.FC<FoodWaterSectionProps> = ({
  foodWaterLog,
  onUpdateWater,
  onAddMeal,
  onDeleteMeal,
  onResetFoodWater,
}) => {
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState<Meal['type']>('breakfast');
  const [mealTime, setMealTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );

  const [customWater, setCustomWater] = useState('');

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim() || !calories) return;

    onAddMeal(
      mealName.trim(),
      Number(calories),
      mealType,
      mealTime
    );

    setMealName('');
    setCalories('');
  };

  const handleCustomWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(customWater);
    if (amt > 0) {
      onUpdateWater(amt);
      setCustomWater('');
    }
  };

  // Calculations
  const totalWater = foodWaterLog.waterIntake;
  const waterTarget = foodWaterLog.waterTarget;
  const waterPercentage = Math.min(Math.round((totalWater / waterTarget) * 100), 100);

  const totalCalories = foodWaterLog.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const calorieTarget = 2000;
  const caloriePercentage = Math.min(Math.round((totalCalories / calorieTarget) * 100), 100);

  const getMealIcon = (type: Meal['type']) => {
    switch (type) {
      case 'breakfast': return <Coffee className="w-3.5 h-3.5" />;
      case 'lunch': return <Utensils className="w-3.5 h-3.5" />;
      case 'dinner': return <Utensils className="w-3.5 h-3.5" />;
      case 'snack': return <Apple className="w-3.5 h-3.5" />;
    }
  };

  const getMealTypeBadge = (type: Meal['type']) => {
    switch (type) {
      case 'breakfast': return 'bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20';
      case 'lunch': return 'bg-[#2d2a26]/5 text-[#2d2a26]/80 border border-[#2d2a26]/10';
      case 'dinner': return 'bg-[#b08b46]/15 text-[#2d2a26]/90 border border-[#b08b46]/30';
      case 'snack': return 'bg-rose-50 text-rose-600 border border-rose-200/60';
    }
  };

  return (
    <div className="space-y-6" id="food-water-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#b08b46]/10 pb-5">
        <div>
          <h2 className="font-serif text-3xl italic font-light text-[#b08b46] flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20">
              <Droplet className="w-5 h-5 fill-[#b08b46]/10" />
            </span>
            Diet & Hydration
          </h2>
          <p className="text-xs text-[#2d2a26]/60 mt-1 font-sans">
            Log water intake goals, manage daily meals, and keep check on your daily calorie targets.
          </p>
        </div>
        <div>
          <button
            onClick={onResetFoodWater}
            className="text-xs text-[#2d2a26]/70 hover:text-[#2d2a26] bg-[#ffffff] hover:bg-[#faf8f5] border border-[#b08b46]/15 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            id="reset-food-water"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#b08b46]" />
            Reset Today's Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="food-water-workspace">
        {/* Left Column: Water Tracking (Hydration) */}
        <div className="bg-[#ffffff] border border-[#b08b46]/15 rounded-2xl p-5 space-y-6 shadow-md" id="water-tracker-card">
          <div className="flex items-center justify-between">
            <h3 className="font-serif italic text-base text-[#2d2a26] flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20">
                <Droplet className="w-4 h-4 fill-[#b08b46]/10" />
              </span>
              Hydration Progress
            </h3>
            <span className="text-xs font-mono text-[#2d2a26]/40">
              Target: <strong className="text-[#b08b46]">{waterTarget} ml</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Water visual bottle filling graphic */}
            <div className="md:col-span-5 flex flex-col items-center" id="water-glass-visual">
              <div className="relative w-28 h-40 bg-[#faf8f5] border-2 border-[#b08b46]/25 rounded-b-2xl rounded-t-sm overflow-hidden flex flex-col justify-end shadow-inner">
                {/* Measuring marks */}
                <div className="absolute inset-y-0 right-2 w-2 flex flex-col justify-between text-[8px] font-mono text-[#2d2a26]/20 py-3 pointer-events-none select-none">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                {/* Animated Water Body */}
                <div 
                  className="w-full bg-[#b08b46]/35 border-t border-[#b08b46]/60 transition-all duration-500 ease-out flex items-center justify-center relative"
                  style={{ height: `${waterPercentage}%` }}
                >
                  {/* Subtle bubbles wave animation overlay */}
                  <div className="absolute inset-0 bg-[#b08b46]/10 animate-pulse" />
                  
                  {waterPercentage > 15 && (
                    <span className="text-xs font-mono font-bold text-[#ffffff] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] z-10">
                      {waterPercentage}%
                    </span>
                  )}
                </div>

                {/* 0% empty state text */}
                {waterPercentage === 0 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-[#2d2a26]/30 font-bold">
                    EMPTY
                  </span>
                )}
              </div>

              <div className="text-center mt-3">
                <p className="text-lg font-serif italic text-[#b08b46]">{totalWater} ml</p>
                <p className="text-[9px] text-[#2d2a26]/40 font-sans tracking-widest uppercase mt-0.5">Hydrated Today</p>
              </div>
            </div>

            {/* Quick add water controls */}
            <div className="md:col-span-7 space-y-4" id="water-controls">
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">Quick Hydrate</label>
                <div className="grid grid-cols-3 gap-2" id="quick-water-buttons">
                  <button
                    onClick={() => onUpdateWater(250)}
                    className="p-2.5 bg-[#faf8f5] border border-[#b08b46]/10 rounded-xl text-xs hover:border-[#b08b46] hover:bg-[#b08b46]/5 hover:text-[#b08b46] transition-all cursor-pointer flex flex-col items-center gap-1"
                    title="Add small glass"
                  >
                    <span className="font-semibold text-[11px] font-mono">+250ml</span>
                    <span className="text-[8px] text-[#2d2a26]/40 uppercase tracking-wider font-sans">Glass</span>
                  </button>

                  <button
                    onClick={() => onUpdateWater(500)}
                    className="p-2.5 bg-[#faf8f5] border border-[#b08b46]/10 rounded-xl text-xs hover:border-[#b08b46] hover:bg-[#b08b46]/5 hover:text-[#b08b46] transition-all cursor-pointer flex flex-col items-center gap-1"
                    title="Add sports bottle"
                  >
                    <span className="font-semibold text-[11px] font-mono">+500ml</span>
                    <span className="text-[8px] text-[#2d2a26]/40 uppercase tracking-wider font-sans">Bottle</span>
                  </button>

                  <button
                    onClick={() => onUpdateWater(750)}
                    className="p-2.5 bg-[#faf8f5] border border-[#b08b46]/10 rounded-xl text-xs hover:border-[#b08b46] hover:bg-[#b08b46]/5 hover:text-[#b08b46] transition-all cursor-pointer flex flex-col items-center gap-1"
                    title="Add large canteen"
                  >
                    <span className="font-semibold text-[11px] font-mono">+750ml</span>
                    <span className="text-[8px] text-[#2d2a26]/40 uppercase tracking-wider font-sans">Flask</span>
                  </button>
                </div>
              </div>

              {/* Custom water amount */}
              <form onSubmit={handleCustomWaterSubmit} className="space-y-2">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">Custom Volume</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customWater}
                    onChange={(e) => setCustomWater(e.target.value)}
                    placeholder="e.g., 350, 1000"
                    min="1"
                    className="flex-1 bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-xs text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-all"
                    id="custom-water-input"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-[#b08b46] hover:bg-[#b08b46]/90 text-[#ffffff] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                    id="custom-water-btn"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Diet Tracking & Meal Logger */}
        <div className="bg-[#ffffff] border border-[#b08b46]/15 rounded-2xl p-5 space-y-6 shadow-md" id="diet-tracker-card">
          <div className="flex items-center justify-between">
            <h3 className="font-serif italic text-base text-[#2d2a26] flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20">
                <Utensils className="w-4 h-4" />
              </span>
              Daily Meal Logs
            </h3>
            <span className="text-xs font-mono text-[#2d2a26]/40">
              Total Intake: <strong className="text-[#b08b46]">{totalCalories} / {calorieTarget} kcal</strong>
            </span>
          </div>

          {/* Calorie Progress bar */}
          <div className="space-y-1.5" id="calorie-progress-bar">
            <div className="flex items-center justify-between text-xs text-[#2d2a26]/60">
              <span>Calories Consumed</span>
              <span className="font-mono text-[#b08b46]">{caloriePercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#faf8f5] rounded-full overflow-hidden border border-[#b08b46]/10">
              <div 
                className="h-full bg-[#b08b46] transition-all duration-500"
                style={{ width: `${caloriePercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="diet-workspace-inner">
            {/* Meal Logger Form */}
            <div className="md:col-span-6 space-y-3 border-r border-[#b08b46]/10 pr-1 md:pr-4" id="meal-logger-form">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#2d2a26]/40 block">Record Meal Intake</span>
              <form onSubmit={handleMealSubmit} className="space-y-3">
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="What did you eat?"
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-xs text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                  required
                  id="meal-input-name"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Calories (kcal)"
                    min="1"
                    className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-xs text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                    required
                    id="meal-input-calories"
                  />

                  <input
                    type="time"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-xs text-[#2d2a26] focus:outline-none transition-colors"
                    required
                    id="meal-input-time"
                  />
                </div>

                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-xs text-[#2d2a26] focus:outline-none transition-colors cursor-pointer"
                  id="meal-input-type"
                >
                  <option value="breakfast" className="bg-[#ffffff]">Breakfast</option>
                  <option value="lunch" className="bg-[#ffffff]">Lunch</option>
                  <option value="dinner" className="bg-[#ffffff]">Dinner</option>
                  <option value="snack" className="bg-[#ffffff]">Snack</option>
                </select>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#b08b46] hover:bg-[#b08b46]/90 text-[#ffffff] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  id="meal-add-btn"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Log Meal
                </button>
              </form>
            </div>

            {/* Logged Meals List */}
            <div className="md:col-span-6 flex flex-col" id="logged-meals-list">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#2d2a26]/40 block mb-2">Today's Meals ({foodWaterLog.meals.length})</span>
              
              <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[170px] pr-1">
                {foodWaterLog.meals.length === 0 ? (
                  <div className="p-4 border border-dashed border-[#b08b46]/15 rounded-xl text-center bg-[#faf8f5]/40 h-full flex flex-col items-center justify-center">
                    <Apple className="w-5 h-5 text-[#b08b46]/40 mb-1" />
                    <p className="text-[10px] text-[#2d2a26]/40">No meal records logged today.</p>
                  </div>
                ) : (
                  foodWaterLog.meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="p-2 rounded-lg bg-[#faf8f5]/50 border border-[#b08b46]/10 flex items-center justify-between gap-2 text-xs shadow-sm"
                      id={`meal-item-${meal.id}`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[8px] font-mono uppercase px-1 py-0.5 rounded ${getMealTypeBadge(meal.type)} flex items-center gap-0.5`}>
                            {getMealIcon(meal.type)}
                            {meal.type}
                          </span>
                          <span className="text-[9px] text-[#2d2a26]/40 font-mono flex items-center gap-0.5 select-none">
                            <Clock className="w-2.5 h-2.5 text-[#b08b46]" />
                            {meal.time}
                          </span>
                        </div>
                        <h4 className="font-serif italic font-medium text-[#2d2a26] mt-1 truncate">
                          {meal.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#b08b46] font-semibold">{meal.calories} kcal</span>
                        <button
                          onClick={() => onDeleteMeal(meal.id)}
                          className="p-1 text-[#2d2a26]/40 hover:text-rose-500 hover:bg-rose-500/5 rounded transition-colors cursor-pointer"
                          id={`meal-delete-${meal.id}`}
                          title="Delete meal log"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
