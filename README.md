# Aether Hub: Unified Life Protocol Dashboard

A production-grade, modular life management application engineered with React 19, TypeScript, Vite, and PostgreSQL. Designed as a unified command center for personal productivity, physical fitness, sleep recovery architecture, daily hydration, and multi-format knowledge capture.

---

## Executive Summary

Aether Hub addresses the problem of fragmented productivity tools by consolidating six core domain tracking modules into a single, cohesive dashboard:

1. **Radial Command Center**: Interactive visual telemetry overview providing real-time statistical summaries across all active domains.
2. **Multi-Format Notes Vault**: Extensible knowledge base supporting standard text reflections, clickable external bookmarks, interactive checklists, and syntax-highlighted code snippets.
3. **Fitness & Hypertrophy Tracker**: Activity logging with duration, caloric expenditure estimation, perceived exertion intensity, and session notes.
4. **Nutrition & Hydration Protocol**: Real-time water intake tracking against customizable daily targets (default 2500ml) paired with structured meal logging.
5. **Sleep Recovery Architecture**: Sleep duration monitoring, star-rated subjective recovery metrics, bed/wake timestamps, and rest notes.
6. **Task & Priority Manager**: Categorized daily task management with priority badges and completion filtering.

---

## Architectural Highlights

### 1. Separation of Concerns & Custom Hook Layer
The application adheres to strict separation between view components and state management logic:
- `useAetherState`: Centralizes domain state slices (`todos`, `notes`, `events`, `fitnessLogs`, `sleepLogs`, `foodWaterLogs`) and CRUD action handlers.
- `useLocalStorage`: A generic, type-safe persistence hook equipped with JSON serialization `try/catch` error boundaries to prevent runtime crashes from storage quota limits or corrupt cache data.
- `useTheme`: Encapsulates application-wide light and dark mode state, synchronizing local preferences with the root HTML document class (`.dark`).

### 2. Hybrid Offline-First & Cloud Persistence (`JSONB`)
Aether Hub operates offline-first using local browser storage for zero-latency UI interactions. For multi-device continuity, it integrates with a PostgreSQL backend via Supabase.

Instead of rigid relational columns that require database migrations whenever note schemas evolve, the persistence engine uses a hybrid relational and `JSONB` document schema:

```sql
CREATE TABLE IF NOT EXISTS aether_user_activities (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  activity_log JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. System Architecture Diagram

```mermaid
graph TD
    A[App Root Orchestrator] --> B[Header Navigation & Theme Controls]
    A --> C[Radial Menu Telemetry Overview]
    A --> D[Domain Section Routers]

    D --> E[Todo & Habits Module]
    D --> F[Multi-Format Notes Vault]
    D --> G[Calendar & Schedule]
    D --> H[Fitness & Activity Log]
    D --> I[Food & Water Tracker]
    D --> J[Sleep Recovery Log]

    A <--> K[useAetherState Domain Controller]
    K <--> L[useLocalStorage Offline Engine]
    K <--> M[CloudSyncModal Controller]
    M <--> N[(PostgreSQL Cloud Vault - JSONB)]
```

---

## Project Structure

```
src/
├── components/
│   ├── CalendarSection.tsx       # Daily schedule and event timeline
│   ├── CloudSyncModal.tsx        # PostgreSQL cross-device synchronization modal
│   ├── FitnessSection.tsx        # Workout and exertion log
│   ├── FoodWaterSection.tsx      # Hydration progress bar and meal breakdown
│   ├── Header.tsx                # Sticky top navigation and quick category switcher
│   ├── NotesSection.tsx          # Multi-type note creator and interactive cards
│   ├── RadialMenu.tsx            # Visual telemetry overview hub
│   ├── SleepSection.tsx          # Nightly recovery and sleep quality logger
│   └── TodoSection.tsx           # Priority task manager
├── hooks/
│   ├── useAetherState.ts         # Consolidated state orchestrator and action handlers
│   ├── useLocalStorage.ts        # Type-safe local storage persistence hook
│   └── useTheme.ts               # Light and dark mode DOM synchronization
├── lib/
│   ├── dateUtils.ts              # Timezone-consistent date string formatters
│   ├── initialData.ts            # Default domain state generators
│   └── supabase.ts               # Database client configuration
├── App.tsx                       # Application entry point and view router
├── index.css                     # Design tokens and theme variables
├── main.tsx                      # React root mount
└── types.ts                      # Complete JSDoc documented TypeScript interfaces
```

---

## Getting Started

### Prerequisites
- **Node.js**: Version 18.x or higher
- **Package Manager**: npm (included with Node.js)

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vihansr/aether-hub.git
   cd aether-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a local `.env` file in the project root with your PostgreSQL connection parameters:
   ```env
   VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   POSTGRES_URL="postgres://user:password@host:port/database"
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## Verification & Build

### Quality Assurance & Type Checking
To execute the TypeScript type checker and ESLint verification suite:
```bash
npm run lint
```

### Production Build
To generate optimized production bundle assets into the `dist/` directory:
```bash
npm run build
```

---

## Engineering Standards

- **Strict Type Safety**: All data structures, API payloads, and hook return values are strongly typed in `src/types.ts`.
- **Comprehensive Documentation**: Public interfaces and hooks are documented with standard JSDoc annotations to support developer intellisense and onboarding.
- **Zero Linter Warnings**: The codebase maintains strict adherence to clean code rules verified continuously during automated builds.

---

## License

This project is open-source and available under the MIT License.
