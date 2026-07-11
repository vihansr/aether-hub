import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  FileText, 
  Calendar, 
  Dumbbell, 
  Droplet, 
  Moon, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { CategoryType, CategoryInfo } from '../types';

interface RadialMenuProps {
  onSelectCategory: (category: CategoryType) => void;
  stats: {
    todosRemaining: number;
    notesCount: number;
    todayEventsCount: number;
    todayWorkoutsCount: number;
    waterIntake: number;
    sleepHours: number;
  };
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'todo',
    label: 'To-Do List',
    description: 'Manage tasks and daily checklists',
    iconName: 'CheckSquare',
    color: 'emerald',
    accentColor: '#10b981',
  },
  {
    id: 'notes',
    label: 'Notes & Ideas',
    description: 'Jot down thoughts, ideas, and tags',
    iconName: 'FileText',
    color: 'amber',
    accentColor: '#f59e0b',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    description: 'Schedule and manage calendar events',
    iconName: 'Calendar',
    color: 'indigo',
    accentColor: '#6366f1',
  },
  {
    id: 'fitness',
    label: 'Fitness Log',
    description: 'Record workouts and calorie burn',
    iconName: 'Fitness', // Custom handled
    color: 'rose',
    accentColor: '#f43f5e',
  },
  {
    id: 'food_water',
    label: 'Food & Water',
    description: 'Track meals, calories, and hydration',
    iconName: 'Droplet',
    color: 'sky',
    accentColor: '#0ea5e9',
  },
  {
    id: 'sleep',
    label: 'Sleep Tracker',
    description: 'Monitor sleep patterns and quality',
    iconName: 'Moon',
    color: 'violet',
    accentColor: '#8b5cf6',
  },
];

// Helper to draw SVG Donut Segment Path
function getSectorPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number
): string {
  // Convert angles to radians
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1_inner = cx + rInner * Math.cos(startRad);
  const y1_inner = cy + rInner * Math.sin(startRad);
  const x1_outer = cx + rOuter * Math.cos(startRad);
  const y1_outer = cy + rOuter * Math.sin(startRad);

  const x2_inner = cx + rInner * Math.cos(endRad);
  const y2_inner = cy + rInner * Math.sin(endRad);
  const x2_outer = cx + rOuter * Math.cos(endRad);
  const y2_outer = cy + rOuter * Math.sin(endRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return `
    M ${x1_inner} ${y1_inner}
    L ${x1_outer} ${y1_outer}
    A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2_outer} ${y2_outer}
    L ${x2_inner} ${y2_inner}
    A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x1_inner} ${y1_inner}
    Z
  `.trim();
}

export const RadialMenu: React.FC<RadialMenuProps> = ({ onSelectCategory, stats }) => {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryType | null>(null);
  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const size = 390;
  const cx = size / 2;
  const cy = size / 2;
  const rInner = 82;
  const rOuter = 175;
  const gap = 3; // Gap in degrees between segments

  // Map Category to Lucide Icon
  const renderCategoryIcon = (id: CategoryType, className: string = 'w-6 h-6') => {
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

  // Get active stats message
  const getCategoryStat = (id: CategoryType) => {
    switch (id) {
      case 'todo':
        return stats.todosRemaining === 0 
          ? 'All caught up!' 
          : `${stats.todosRemaining} task${stats.todosRemaining > 1 ? 's' : ''} left to-do`;
      case 'notes':
        return `${stats.notesCount} saved note${stats.notesCount !== 1 ? 's' : ''}`;
      case 'calendar':
        return stats.todayEventsCount === 0 
          ? 'No events scheduled today' 
          : `${stats.todayEventsCount} event${stats.todayEventsCount > 1 ? 's' : ''} today`;
      case 'fitness':
        return stats.todayWorkoutsCount === 0 
          ? 'No workouts logged today' 
          : `${stats.todayWorkoutsCount} workout${stats.todayWorkoutsCount > 1 ? 's' : ''} complete`;
      case 'food_water':
        return `Water: ${stats.waterIntake} ml logged today`;
      case 'sleep':
        return stats.sleepHours === 0 
          ? 'No sleep logged yet' 
          : `${stats.sleepHours} hours logged last night`;
    }
  };

  const getAccentBgColor = (category: CategoryType) => {
    return 'bg-[#b08b46]/10 text-[#b08b46] border-[#b08b46]/20';
  };

  const getAccentHoverClass = (category: CategoryType, isHovered: boolean) => {
    if (!isHovered) return 'fill-[#ffffff]/90 stroke-[#b08b46]/25 hover:stroke-[#b08b46]/50';
    return 'fill-[#b08b46]/10 stroke-[#b08b46] filter drop-shadow-[0_2px_12px_rgba(176,139,70,0.15)]';
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4" id="radial-menu-root">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-5xl font-light italic text-[#b08b46] tracking-tight mb-2">
          Aether Hub
        </h1>
      </div>

      {/* Main Wheel Area */}
      <div className="relative w-[390px] h-[390px] flex items-center justify-center select-none" id="wheel-container">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none select-none">
          <div className="w-[520px] h-[520px] border border-[#b08b46] rounded-full absolute" />
          <div className="w-[420px] h-[420px] border border-[#b08b46] rounded-full absolute" />
          <div className="w-[280px] h-[280px] border border-[#b08b46] rounded-full absolute" />
          <div className="w-[1px] h-[580px] bg-[#b08b46] absolute" />
          <div className="h-[1px] w-[580px] bg-[#b08b46] absolute" />
        </div>

        {/* Ambient Outer Ring Glow */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-[0.04] transition-colors duration-500"
          style={{
            backgroundColor: '#b08b46'
          }}
        />

        {/* Outer Circular Bounds */}
        <div className="absolute w-[350px] h-[350px] rounded-full border border-[#b08b46]/15 pointer-events-none" />
        <div className="absolute w-[164px] h-[164px] rounded-full border border-[#b08b46]/15 pointer-events-none" />

        {/* SVG Wheel segments */}
        <svg 
          width={size} 
          height={size} 
          className="absolute top-0 left-0 overflow-visible transform rotate-0"
          id="wheel-svg"
        >
          <g>
            {CATEGORIES.map((cat, idx) => {
              // 6 segments, 60 degrees each
              const startAngle = -90 + idx * 60 + gap / 2;
              const endAngle = -90 + (idx + 1) * 60 - gap / 2;
              const isHovered = hoveredCategory === cat.id;

              return (
                <path
                  key={cat.id}
                  d={getSectorPath(cx, cy, rInner, rOuter, startAngle, endAngle)}
                  className={`transition-all duration-200 cursor-pointer stroke-[1.2] ${getAccentHoverClass(cat.id, isHovered)}`}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => onSelectCategory(cat.id)}
                  id={`sector-${cat.id}`}
                />
              );
            })}
          </g>
        </svg>

        {/* Category Icons Over Segments */}
        {CATEGORIES.map((cat, idx) => {
          const midAngle = -90 + idx * 60 + 30; // Center of the 60 degree segment
          const midAngleRad = (midAngle * Math.PI) / 180;
          // Position icon at average radius
          const rIcon = (rInner + rOuter) / 2;
          const x = cx + rIcon * Math.cos(midAngleRad);
          const y = cy + rIcon * Math.sin(midAngleRad);
          
          const isHovered = hoveredCategory === cat.id;

          return (
            <div
              key={cat.id}
              className="absolute pointer-events-none flex flex-col items-center justify-center transition-all duration-200"
              style={{
                left: `${x - 20}px`,
                top: `${y - 20}px`,
                width: '40px',
                height: '40px',
                transform: isHovered ? 'scale(1.15)' : 'scale(1)',
              }}
              id={`icon-container-${cat.id}`}
            >
              <div className={`p-1.5 rounded-full transition-all duration-200 ${
                isHovered 
                  ? 'bg-[#faf8f5] shadow-lg border border-[#b08b46] text-[#b08b46]' 
                  : 'text-[#2d2a26]/70'
              }`}>
                {renderCategoryIcon(cat.id, 'w-4 h-4')}
              </div>
            </div>
          );
        })}

        {/* Center Hollow Details */}
        <div 
          className="absolute w-[156px] h-[156px] rounded-full bg-[#ffffff] border-2 border-[#b08b46]/80 shadow-[0_4px_25px_rgba(176,139,70,0.1)] flex flex-col items-center justify-center text-center p-3 z-10 pointer-events-none"
          id="wheel-center-pane"
        >
          <AnimatePresence mode="wait">
            {hoveredCategory ? (
              <motion.div
                key={hoveredCategory}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="flex flex-col items-center justify-center"
              >
                <div className={`mb-1 p-1 rounded-md ${getAccentBgColor(hoveredCategory)}`}>
                  {renderCategoryIcon(hoveredCategory, 'w-3.5 h-3.5')}
                </div>
                <span className="font-serif text-sm italic text-[#b08b46]">
                  {CATEGORIES.find(c => c.id === hoveredCategory)?.label}
                </span>
                <span className="text-[9px] text-[#2d2a26]/60 mt-1 line-clamp-2 px-1 font-sans leading-tight">
                  {getCategoryStat(hoveredCategory)}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="clock"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center"
              >
                <Clock className="w-3.5 h-3.5 text-[#b08b46] mb-1" />
                <span className="font-sans text-sm font-light text-[#2d2a26] tracking-tight">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.2em] text-[#b08b46]/75 mt-1">
                  {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid of Categories below the wheel for quick desktop/mobile access & descriptions */}
      <div className="w-full max-w-4xl mt-12 grid grid-cols-2 md:grid-cols-3 gap-4" id="quick-links-grid">
        {CATEGORIES.map((cat) => {
          const isHovered = hoveredCategory === cat.id;
          const getBorderClass = (category: CategoryType) => {
            return 'border-[#b08b46]/10 hover:border-[#b08b46]/40 hover:bg-[#b08b46]/5';
          };

          const getIconBadgeClass = (category: CategoryType) => {
            return 'bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20';
          };

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`p-4 rounded-xl bg-[#ffffff]/90 border text-left transition-all duration-300 flex items-start gap-4 group relative cursor-pointer ${getBorderClass(cat.id)} ${
                isHovered ? 'ring-1 ring-[#b08b46]/30 bg-[#fbfaf7]' : ''
              }`}
              id={`quick-btn-${cat.id}`}
            >
              <div className={`p-2 rounded-full transition-transform group-hover:scale-105 ${getIconBadgeClass(cat.id)}`}>
                {renderCategoryIcon(cat.id, 'w-4 h-4')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif italic font-medium text-sm text-[#2d2a26]">
                    {cat.label}
                  </h3>
                  <ChevronRight className="w-3.5 h-3.5 text-[#b08b46] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[10px] text-[#2d2a26]/50 truncate mt-0.5 font-sans">
                  {cat.description}
                </p>
                <p className="text-[10px] font-semibold text-[#b08b46]/85 mt-1 font-mono uppercase tracking-wider">
                  {getCategoryStat(cat.id)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
