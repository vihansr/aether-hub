# Aether Hub — Activity Tracker Dashboard Codebase Context

## 1. Project Overview

**Aether Hub** (`activity-tracker-dashboard`) is a single-page React + TypeScript web application designed as a **Unified Life Protocol Dashboard**. It provides an interactive, aesthetic, and responsive interface for tracking six primary life pillars:

1. **To-Do List** (`todo`) — Daily task checklists with priorities and due dates.
2. **Notes & Ideas** (`notes`) — Tagged, color-coded quick notes with search and inline editing.
3. **Calendar** (`calendar`) — Event scheduling categorized by activity type.
4. **Fitness Log** (`fitness`) — Exercise tracking including duration, calories burned, and intensity.
5. **Food & Water** (`food_water`) — Daily hydration tracking against targets and meal logging.
6. **Sleep Tracker** (`sleep`) — Sleep duration, sleep/wake cycles, and 5-star quality ratings.

At the core of the dashboard is an interactive **CSGO-style Radial Quick-Navigation Menu** ([RadialMenu.tsx](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/components/RadialMenu.tsx)) that displays live summary statistics, ambient SVG wheel segments, and a real-time clock.

---

## 2. Technology Stack & Dependencies

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | React 19 (`^19.0.1`) | Functional components with React hooks (`useState`, `useEffect`, `useMemo`). |
| **Language** | TypeScript (`~5.8.2`) | Strict typing across all components and state models. |
| **Build Tool & Bundler** | Vite 6 (`^6.2.3`) | Fast development server and production bundler configured via [vite.config.ts](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/vite.config.ts). |
| **Styling** | Tailwind CSS v4 (`^4.1.14`) | Utility-first styling with `@tailwindcss/vite` plugin and custom theme fonts configured in [src/index.css](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/index.css). |
| **Animations** | Motion / React (`^12.23.24`) | Used for page transitions (`AnimatePresence`, `motion.div`) and interactive UI micro-animations. |
| **Icons** | Lucide React (`^0.546.0`) | Consistent iconography across menu sectors and module interfaces. |
| **Persistence** | Browser `localStorage` | Client-side persistence synchronized automatically on state updates. |

---

## 3. Directory Structure & File Mapping

```
activity-tracker-dashboard/
├── index.html                 # Entry HTML file
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite configuration with Tailwind v4 & React plugins
├── metadata.json              # Application metadata
├── README.md                  # Project instructions
└── src/
    ├── main.tsx               # Root DOM mounting entry point
    ├── index.css              # Font imports and custom Tailwind v4 @theme variables
    ├── types.ts               # Centralized TypeScript domain interfaces & types
    ├── App.tsx                # Main container, global state management, and view router
    └── components/
        ├── RadialMenu.tsx     # Interactive SVG wheel menu & quick-access cards
        ├── TodoSection.tsx    # Task management view
        ├── NotesSection.tsx   # Color-coded note taking view
        ├── CalendarSection.tsx # Date picker & event scheduling view
        ├── FitnessSection.tsx # Exercise log view
        ├── FoodWaterSection.tsx # Daily hydration & meal log view
        └── SleepSection.tsx   # Sleep quality & schedule log view
```

---

## 4. Domain Data Models ([types.ts](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/types.ts))

All core entities are strongly typed in [src/types.ts](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/types.ts):

- **`Todo`**: `{ id, text, completed, dueDate?, priority: 'low' | 'medium' | 'high' }`
- **`Note`**: `{ id, title, content, color, createdAt, tags: string[] }`
- **`CalendarEvent`**: `{ id, title, date, time?, type: 'general' | 'fitness' | 'meal' | 'sleep' | 'todo' | 'note', description? }`
- **`FitnessLog`**: `{ id, date, activityType, duration, caloriesBurned, intensity: 'low' | 'medium' | 'high', notes? }`
- **`Meal`**: `{ id, name, calories, time, type: 'breakfast' | 'lunch' | 'dinner' | 'snack' }`
- **`FoodWaterLog`**: `{ date, waterTarget, waterIntake, meals: Meal[] }` (keyed by `YYYY-MM-DD`)
- **`SleepLog`**: `{ id, date, duration, quality, sleepTime, wakeTime, notes? }`
- **`CategoryType`**: `'todo' | 'notes' | 'calendar' | 'fitness' | 'food_water' | 'sleep'`
- **`CategoryInfo`**: Metadata for the radial menu (`id`, `label`, `description`, `iconName`, `color`, `accentColor`).

---

## 5. Key Architecture & Components

### A. Central State Controller — [App.tsx](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/App.tsx)
- **State Initialization & Persistence**: Maintains lazy-initialized React state for each module (`todos`, `notes`, `events`, `fitnessLogs`, `sleepLogs`, `foodWaterLogs`) backed by local storage keys (`hub_todos`, `hub_notes`, etc.).
- **Initial Seed Data**: Provides mock initial entries (`getInitialTodos`, `getInitialNotes`, etc.) if local storage is empty or when the user invokes the **Erase Data** action.
- **Computed Module Statistics**: Aggregates live counts (`todosRemaining`, `notesCount`, `todayEventsCount`, `todayWorkoutsCount`, `waterIntake`, `sleepHours`) into `statsSummary` passed to the wheel menu.
- **Header & Navigation**: Features a persistent breadcrumb navigation bar and quick category switcher when a module view is active.

### B. CSGO-Style Wheel Menu — [RadialMenu.tsx](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/components/RadialMenu.tsx)
- **SVG Donut Geometry**: Uses `getSectorPath(cx, cy, rInner, rOuter, startAngle, endAngle)` to render 6 interactive SVG sectors spanning 60° each.
- **Live Center Display**: Shows an active digital clock and date by default, dynamically transitioning to module statistics when a user hovers over any SVG sector or quick-link card.
- **Quick-Access Grid**: Below the wheel, displays a responsive 2/3-column card grid summarizing each category with its description and current stat badge.

### C. Module Views (`src/components/`)
1. **[TodoSection.tsx](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/components/TodoSection.tsx)**: Supports task creation with priority levels, due date assignment, status filtering (`All`, `Active`, `Completed`), and batch clearing of completed items.
2. **[NotesSection.tsx](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/components/NotesSection.tsx)**: Provides 6 aesthetic color presets (`Muted Cream`, `Warm Gold`, `Fresh Emerald`, `Cool Sky`, `Soft Rose`, `Luxe Violet`), multi-tag support, real-time query search across titles/content/tags, and inline note editing.
3. **[CalendarSection.tsx](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/components/CalendarSection.tsx)**: Interactive date selection with color-coded event types and daily event lists.
4. **[FitnessSection.tsx](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/components/FitnessSection.tsx)**: Standard workout presets (`Strength Training`, `Running / Jogging`, `Cardio / HIIT`, `Cycling`, etc.) alongside custom activity entry, tracking duration, intensity, and calories.
5. **[FoodWaterSection.tsx](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/components/FoodWaterSection.tsx)**: Date-scoped water intake tracking with quick +250ml/+500ml increments or custom intake logging against a configurable daily goal (default `2500ml`), plus meal logging sorted by meal type.
6. **[SleepSection.tsx](file:///c:/Users/vihan/Downloads/activity-tracker-dashboard/src/components/SleepSection.tsx)**: Tracks sleep duration, sleep/wake timestamps, recovery notes, and interactive 5-star quality indicators.

---

## 6. Design System & Aesthetics

- **Color Palette**: Warm parchment theme featuring `#faf8f5` background, `#2d2a26` primary text, and `#b08b46` antique gold accents.
- **Typography**:
  - Sans-serif UI: `Inter`
  - Display & Headings: `Cormorant Garamond` (serif italic accents)
  - Numeric / Badges: `JetBrains Mono`
