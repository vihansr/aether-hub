/**
 * Core Domain Types & Interfaces for Aether Hub
 * 
 * Defines data structures used across the Unified Life Protocol dashboard,
 * including tasks, notes, calendar events, fitness activities, nutrition, and sleep logs.
 */

/**
 * Represents a single task item in the Todo protocol.
 */
export interface Todo {
  /** Unique identifier for the task item */
  id: string;
  /** Description or label of the task */
  text: string;
  /** Whether the task has been marked completed */
  completed: boolean;
  /** Optional due date string in YYYY-MM-DD format */
  dueDate?: string;
  /** Urgency level of the task */
  priority: 'low' | 'medium' | 'high';
}

/**
 * Represents a note entry within the Notes Vault.
 * Supports flexible multi-format entries including rich links, interactive checklists, and code snippets.
 */
export interface Note {
  /** Unique identifier for the note */
  id: string;
  /** Title or headline of the note */
  title: string;
  /** Main textual content or description */
  content: string;
  /** Tailwind background accent theme color (e.g., 'violet', 'emerald') */
  color: string;
  /** ISO timestamp representing when the note was created */
  createdAt: string;
  /** Categorical tags associated with the note */
  tags: string[];
  /** Structural format type of the note */
  type?: 'text' | 'link' | 'list' | 'code';
  /** External URL when type is 'link' */
  url?: string;
  /** Interactive checklist items when type is 'list' */
  listItems?: { id: string; text: string; completed: boolean }[];
  /** Programming language identifier when type is 'code' */
  language?: string;
}

/**
 * Represents a scheduled event or activity on the user's daily calendar.
 */
export interface CalendarEvent {
  /** Unique identifier for the event */
  id: string;
  /** Event headline or summary */
  title: string;
  /** Date of the event in YYYY-MM-DD format */
  date: string;
  /** Optional time of the event in HH:MM format */
  time?: string;
  /** Domain classification of the event */
  type: 'general' | 'fitness' | 'meal' | 'sleep' | 'todo' | 'note';
  /** Additional notes or description for the event */
  description?: string;
}

/**
 * Represents a physical fitness or workout session log.
 */
export interface FitnessLog {
  /** Unique identifier for the workout entry */
  id: string;
  /** Date of the workout in YYYY-MM-DD format */
  date: string;
  /** Categorical activity description (e.g., Strength Training, Running) */
  activityType: string;
  /** Duration of the workout in minutes */
  duration: number;
  /** Estimated calories burned during the session */
  caloriesBurned: number;
  /** Perceived exertion level */
  intensity: 'low' | 'medium' | 'high';
  /** Optional notes or workout details */
  notes?: string;
}

/**
 * Represents a single meal entry logged during the day.
 */
export interface Meal {
  /** Unique identifier for the meal entry */
  id: string;
  /** Name or description of the meal item */
  name: string;
  /** Estimated caloric intake */
  calories: number;
  /** Time consumed in HH:MM format */
  time: string;
  /** Meal classification */
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

/**
 * Daily aggregation of hydration and nutritional intake.
 */
export interface FoodWaterLog {
  /** ISO date string YYYY-MM-DD serving as the dictionary key */
  date: string;
  /** Daily water intake goal in milliliters (default 2500ml) */
  waterTarget: number;
  /** Total water consumed so far in milliliters */
  waterIntake: number;
  /** List of meals logged for this specific day */
  meals: Meal[];
}

/**
 * Represents a nightly sleep recovery log.
 */
export interface SleepLog {
  /** Unique identifier for the sleep record */
  id: string;
  /** Date representing the waking morning in YYYY-MM-DD format */
  date: string;
  /** Total sleep duration in hours */
  duration: number;
  /** Subjective sleep quality rating from 1 to 5 stars */
  quality: number;
  /** Time went to bed in HH:MM format */
  sleepTime: string;
  /** Time woke up in HH:MM format */
  wakeTime: string;
  /** Optional notes regarding rest quality or dreams */
  notes?: string;
}

/**
 * Valid domain category identifiers for the navigation and radial menu.
 */
export type CategoryType = 'todo' | 'notes' | 'calendar' | 'fitness' | 'food_water' | 'sleep';

/**
 * Metadata configuration for each radial menu category option.
 */
export interface CategoryInfo {
  /** Category identifier */
  id: CategoryType;
  /** Display label */
  label: string;
  /** Subtitle or brief description */
  description: string;
  /** Lucide icon name */
  iconName: string;
  /** Tailwind color name */
  color: string;
  /** Hex accent color used in canvas animations */
  accentColor: string;
}
