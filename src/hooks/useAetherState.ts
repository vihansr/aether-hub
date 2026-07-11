/**
 * Consolidated Aether Hub Application State Hook
 * 
 * Houses all local storage state slices, business action handlers,
 * and statistical aggregates for the Unified Life Protocol dashboard.
 */

import { useMemo } from 'react';
import {
  Todo,
  Note,
  CalendarEvent,
  FitnessLog,
  SleepLog,
  FoodWaterLog,
  Meal
} from '../types';
import { useLocalStorage } from './useLocalStorage';
import {
  getInitialTodos,
  getInitialNotes,
  getInitialEvents,
  getInitialFitness,
  getInitialSleep,
  getInitialFoodWater
} from '../lib/initialData';
import { getTodayDateString } from '../lib/dateUtils';

/**
 * Consolidates all Aether Hub domain state and CRUD mutations.
 */
export function useAetherState() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('hub_todos', getInitialTodos);
  const [notes, setNotes] = useLocalStorage<Note[]>('hub_notes', getInitialNotes);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('hub_events', getInitialEvents);
  const [fitnessLogs, setFitnessLogs] = useLocalStorage<FitnessLog[]>('hub_fitness', getInitialFitness);
  const [sleepLogs, setSleepLogs] = useLocalStorage<SleepLog[]>('hub_sleep', getInitialSleep);
  const [foodWaterLogs, setFoodWaterLogs] = useLocalStorage<Record<string, FoodWaterLog>>(
    'hub_food_water',
    getInitialFoodWater
  );

  /**
   * Retrieves today's food & water record or defaults to empty daily goal.
   */
  const todayFoodWater = useMemo((): FoodWaterLog => {
    const todayStr = getTodayDateString();
    if (!foodWaterLogs[todayStr]) {
      return {
        date: todayStr,
        waterTarget: 2500,
        waterIntake: 0,
        meals: []
      };
    }
    return foodWaterLogs[todayStr];
  }, [foodWaterLogs]);

  // Todo Handlers
  const handleAddTodo = (text: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => {
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      text,
      completed: false,
      priority,
      dueDate
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleClearCompletedTodos = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  // Note Handlers
  const handleAddNote = (
    title: string,
    content: string,
    color: string,
    tags: string[],
    type?: Note['type'],
    url?: string,
    listItems?: Note['listItems'],
    language?: string
  ) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      content,
      color,
      createdAt: new Date().toISOString(),
      tags,
      type,
      url,
      listItems,
      language
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => (note.id === id ? { ...note, ...updates } : note)));
  };

  // Calendar Handlers
  const handleAddEvent = (
    title: string,
    date: string,
    time?: string,
    type?: CalendarEvent['type'],
    description?: string
  ) => {
    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title,
      date,
      time,
      type: type || 'general',
      description
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Fitness Handlers
  const handleAddFitnessLog = (
    activityType: string,
    duration: number,
    caloriesBurned: number,
    intensity: FitnessLog['intensity'],
    notesText?: string
  ) => {
    const newLog: FitnessLog = {
      id: `fit-${Date.now()}`,
      date: getTodayDateString(),
      activityType,
      duration,
      caloriesBurned,
      intensity,
      notes: notesText
    };
    setFitnessLogs(prev => [...prev, newLog]);
  };

  const handleDeleteFitnessLog = (id: string) => {
    setFitnessLogs(prev => prev.filter(log => log.id !== id));
  };

  // Food & Water Handlers
  const handleUpdateWater = (amount: number) => {
    const todayStr = getTodayDateString();
    setFoodWaterLogs(prev => {
      const todayLog = prev[todayStr] || { date: todayStr, waterTarget: 2500, waterIntake: 0, meals: [] };
      return {
        ...prev,
        [todayStr]: {
          ...todayLog,
          waterIntake: Math.max(0, todayLog.waterIntake + amount)
        }
      };
    });
  };

  const handleAddMeal = (name: string, calories: number, mealType: Meal['type'], time: string) => {
    const todayStr = getTodayDateString();
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name,
      calories,
      time,
      type: mealType
    };
    setFoodWaterLogs(prev => {
      const todayLog = prev[todayStr] || { date: todayStr, waterTarget: 2500, waterIntake: 0, meals: [] };
      return {
        ...prev,
        [todayStr]: {
          ...todayLog,
          meals: [...todayLog.meals, newMeal]
        }
      };
    });
  };

  const handleDeleteMeal = (id: string) => {
    const todayStr = getTodayDateString();
    setFoodWaterLogs(prev => {
      const todayLog = prev[todayStr];
      if (!todayLog) return prev;
      return {
        ...prev,
        [todayStr]: {
          ...todayLog,
          meals: todayLog.meals.filter(meal => meal.id !== id)
        }
      };
    });
  };

  const handleResetFoodWater = () => {
    const todayStr = getTodayDateString();
    setFoodWaterLogs(prev => ({
      ...prev,
      [todayStr]: {
        date: todayStr,
        waterTarget: 2500,
        waterIntake: 0,
        meals: []
      }
    }));
  };

  // Sleep Handlers
  const handleAddSleepLog = (
    duration: number,
    quality: number,
    sleepTime: string,
    wakeTime: string,
    notesText?: string
  ) => {
    const newLog: SleepLog = {
      id: `sleep-${Date.now()}`,
      date: getTodayDateString(),
      duration,
      quality,
      sleepTime,
      wakeTime,
      notes: notesText
    };
    setSleepLogs(prev => [...prev, newLog]);
  };

  const handleDeleteSleepLog = (id: string) => {
    setSleepLogs(prev => prev.filter(log => log.id !== id));
  };

  // Erase all data to a clean, empty state
  const handleClearAllStorage = () => {
    const emptyTodos: Todo[] = [];
    const emptyNotes: Note[] = [];
    const emptyEvents: CalendarEvent[] = [];
    const emptyFitness: FitnessLog[] = [];
    const emptySleep: SleepLog[] = [];
    const todayStr = getTodayDateString();
    const emptyFoodWater: Record<string, FoodWaterLog> = {
      [todayStr]: {
        date: todayStr,
        waterTarget: 2500,
        waterIntake: 0,
        meals: []
      }
    };

    setTodos(emptyTodos);
    setNotes(emptyNotes);
    setEvents(emptyEvents);
    setFitnessLogs(emptyFitness);
    setSleepLogs(emptySleep);
    setFoodWaterLogs(emptyFoodWater);

    try {
      window.localStorage.setItem('hub_todos', JSON.stringify(emptyTodos));
      window.localStorage.setItem('hub_notes', JSON.stringify(emptyNotes));
      window.localStorage.setItem('hub_events', JSON.stringify(emptyEvents));
      window.localStorage.setItem('hub_fitness', JSON.stringify(emptyFitness));
      window.localStorage.setItem('hub_sleep', JSON.stringify(emptySleep));
      window.localStorage.setItem('hub_food_water', JSON.stringify(emptyFoodWater));
    } catch (e) {
      console.warn('Failed to clear local storage:', e);
    }
  };

  // Restore initial demonstration sample data
  const handleRestoreSampleData = () => {
    const sampleTodos = getInitialTodos();
    const sampleNotes = getInitialNotes();
    const sampleEvents = getInitialEvents();
    const sampleFitness = getInitialFitness();
    const sampleSleep = getInitialSleep();
    const sampleFoodWater = getInitialFoodWater();

    setTodos(sampleTodos);
    setNotes(sampleNotes);
    setEvents(sampleEvents);
    setFitnessLogs(sampleFitness);
    setSleepLogs(sampleSleep);
    setFoodWaterLogs(sampleFoodWater);

    try {
      window.localStorage.setItem('hub_todos', JSON.stringify(sampleTodos));
      window.localStorage.setItem('hub_notes', JSON.stringify(sampleNotes));
      window.localStorage.setItem('hub_events', JSON.stringify(sampleEvents));
      window.localStorage.setItem('hub_fitness', JSON.stringify(sampleFitness));
      window.localStorage.setItem('hub_sleep', JSON.stringify(sampleSleep));
      window.localStorage.setItem('hub_food_water', JSON.stringify(sampleFoodWater));
    } catch (e) {
      console.warn('Failed to restore sample local storage:', e);
    }
  };

  // Summary Metrics for the Radial Menu preview
  const remainingTodosCount = todos.filter(t => !t.completed).length;
  const notesCount = notes.length;
  const todayEventsCount = events.filter(e => e.date === getTodayDateString()).length;
  const todayWorkoutsCount = fitnessLogs.filter(f => f.date === getTodayDateString()).length;
  const todayWaterIntake = todayFoodWater.waterIntake;
  const lastNightSleepLog = sleepLogs[sleepLogs.length - 1];
  const lastNightSleepHours = lastNightSleepLog ? lastNightSleepLog.duration : 0;

  const statsSummary = {
    todosRemaining: remainingTodosCount,
    notesCount,
    todayEventsCount,
    todayWorkoutsCount,
    waterIntake: todayWaterIntake,
    sleepHours: lastNightSleepHours
  };

  return {
    // States & Setters (Setters exposed for Cloud Sync overrides)
    todos,
    setTodos,
    notes,
    setNotes,
    events,
    setEvents,
    fitnessLogs,
    setFitnessLogs,
    sleepLogs,
    setSleepLogs,
    foodWaterLogs,
    setFoodWaterLogs,
    todayFoodWater,
    statsSummary,

    // Action Handlers
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleClearCompletedTodos,
    handleAddNote,
    handleDeleteNote,
    handleUpdateNote,
    handleAddEvent,
    handleDeleteEvent,
    handleAddFitnessLog,
    handleDeleteFitnessLog,
    handleUpdateWater,
    handleAddMeal,
    handleDeleteMeal,
    handleResetFoodWater,
    handleAddSleepLog,
    handleDeleteSleepLog,
    handleClearAllStorage,
    handleRestoreSampleData
  };
}
