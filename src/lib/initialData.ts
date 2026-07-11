/**
 * Initial Default Datasets for Aether Hub
 * 
 * Provides well-structured, realistic sample data when a user starts
 * a fresh session or performs a data reset.
 */

import {
  Todo,
  Note,
  CalendarEvent,
  FitnessLog,
  SleepLog,
  FoodWaterLog
} from '../types';
import { getTodayDateString, getPastDateString } from './dateUtils';

/**
 * Generates initial default task items.
 */
export const getInitialTodos = (): Todo[] => [
  {
    id: 'todo-1',
    text: 'Plan weekly lunch prep containers',
    completed: false,
    priority: 'medium',
    dueDate: getTodayDateString()
  },
  {
    id: 'todo-2',
    text: 'Log 45 minutes of hypertrophy strength training',
    completed: true,
    priority: 'high',
    dueDate: getTodayDateString()
  },
  {
    id: 'todo-3',
    text: 'Review evening journal notes and plan goals',
    completed: false,
    priority: 'low'
  }
];

/**
 * Generates initial default notes across standard text format.
 */
export const getInitialNotes = (): Note[] => [
  {
    id: 'note-1',
    title: '💡 Self-Improvement Goals',
    content: '1. Keep sleep above 7.5 hrs daily.\n2. Hit 2500ml water target consistently.\n3. Keep resistance training scheduled 4x/week.',
    color: 'violet',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    tags: ['goals', 'habits'],
    type: 'text'
  },
  {
    id: 'note-2',
    title: '🛒 Weekly High-Protein Groceries',
    content: '• Chicken breast, Salmon\n• Greek yogurt, Eggs\n• Oats, Chia seeds, Avocado\n• Spinach, Blueberries, Broccoli',
    color: 'emerald',
    createdAt: new Date().toISOString(),
    tags: ['diet', 'shopping'],
    type: 'text'
  }
];

/**
 * Generates initial default calendar schedule events.
 */
export const getInitialEvents = (): CalendarEvent[] => [
  {
    id: 'evt-1',
    title: 'Strength Training Session',
    date: getTodayDateString(),
    time: '08:00',
    type: 'fitness',
    description: 'Upper body focus: bench press and rows.'
  },
  {
    id: 'evt-2',
    title: 'Nutrition Assessment / Weekly Prep',
    date: getTodayDateString(),
    time: '13:00',
    type: 'meal',
    description: 'Portion chicken and rice.'
  }
];

/**
 * Generates initial default physical activity logs.
 */
export const getInitialFitness = (): FitnessLog[] => [
  {
    id: 'fit-1',
    date: getTodayDateString(),
    activityType: 'Strength Training',
    duration: 45,
    caloriesBurned: 350,
    intensity: 'high',
    notes: 'Upper body hypertrophy: Bench press, Pullups, Shoulder press.'
  },
  {
    id: 'fit-2',
    date: getPastDateString(1),
    activityType: 'Running / Jogging',
    duration: 30,
    caloriesBurned: 280,
    intensity: 'medium',
    notes: 'Zone 2 steady-state jog.'
  }
];

/**
 * Generates initial default sleep quality logs.
 */
export const getInitialSleep = (): SleepLog[] => [
  {
    id: 'sleep-1',
    date: getTodayDateString(),
    duration: 7.8,
    quality: 4,
    sleepTime: '22:45',
    wakeTime: '06:33',
    notes: 'Woke up feeling recovered. Slight soreness in arms.'
  },
  {
    id: 'sleep-2',
    date: getPastDateString(1),
    duration: 8.2,
    quality: 5,
    sleepTime: '22:15',
    wakeTime: '06:27',
    notes: 'Fantastic deep sleep. Minimal disturbance.'
  }
];

/**
 * Generates default nutrition & hydration log for today.
 */
export const getInitialFoodWater = (): Record<string, FoodWaterLog> => {
  const today = getTodayDateString();
  return {
    [today]: {
      date: today,
      waterTarget: 2500,
      waterIntake: 1250,
      meals: [
        {
          id: 'meal-1',
          name: 'Eggs, Spinach & Toast',
          calories: 420,
          time: '08:30',
          type: 'breakfast'
        },
        {
          id: 'meal-2',
          name: 'Whey Protein & Banana',
          calories: 250,
          time: '10:45',
          type: 'snack'
        }
      ]
    }
  };
};
