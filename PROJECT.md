# FitTrack - Project Documentation

> **Complete technical documentation for the FitTrack workout tracking application**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features List](#2-features-list)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Environment Variables](#7-environment-variables)
8. [Getting Started](#8-getting-started)
9. [Deployment](#9-deployment)
10. [Architecture Decisions](#10-architecture-decisions)
11. [Key Algorithms & Business Logic](#11-key-algorithms--business-logic)
12. [Component Library](#12-component-library)
13. [Hooks Reference](#13-hooks-reference)
14. [Type Definitions](#14-type-definitions)
15. [Testing Strategy](#15-testing-strategy)
16. [Performance Considerations](#16-performance-considerations)
17. [Security Measures](#17-security-measures)
18. [Known Limitations & Future Improvements](#18-known-limitations--future-improvements)
19. [Contributing Guidelines](#19-contributing-guidelines)
20. [Troubleshooting](#20-troubleshooting)
21. [Changelog](#21-changelog)
22. [License & Credits](#22-license--credits)

---

## 1. Project Overview

### Name
**FitTrack** - Your Personal Workout Companion

### Description
FitTrack is a comprehensive, full-stack workout tracking application designed to help fitness enthusiasts log workouts, track progress, and achieve their fitness goals. Built with modern web technologies, it provides a native app-like experience through Progressive Web App (PWA) capabilities.

The application features a complete gamification system with achievements, XP, and levels to keep users motivated. Smart features like muscle recovery tracking and progressive overload suggestions help users optimize their training. Social features including follow systems, workout sharing, and leaderboards create a community-driven fitness experience.

FitTrack is designed mobile-first with responsive layouts, touch-optimized interfaces, and offline support, making it perfect for use during gym sessions. The clean, intuitive interface ensures users can focus on their workouts while the app handles the tracking.

### Links
- **Live URL**: https://fittrack-workout.vercel.app (Vercel deployment)
- **Repository**: https://github.com/abhishek-official1/fittrack
- **Tech Stack**: Next.js 14 + PostgreSQL + Prisma + Tailwind CSS + TypeScript

### Status
**Production Ready (v1.0.0)** - All core features implemented and deployed.

---

## 2. Features List

### 2.1 Core Features
| Feature | Description | Status |
|---------|-------------|--------|
| User Registration | Email/password signup with profile setup | ✅ Implemented |
| User Authentication | JWT-based login with secure cookies | ✅ Implemented |
| Dashboard | Overview of stats, recent workouts, achievements | ✅ Implemented |
| Dark/Light Mode | Theme toggle with system preference detection | ✅ Implemented |

### 2.2 User Authentication
| Feature | Description | Status |
|---------|-------------|--------|
| Email/Password Auth | bcrypt password hashing | ✅ Implemented |
| JWT Sessions | HTTP-only cookies, 7-day expiration | ✅ Implemented |
| Profile Management | Update name, goals, preferences | ✅ Implemented |
| Unit Preferences | Metric/Imperial weight support | ✅ Implemented |

### 2.3 Workout Tracking
| Feature | Description | Status |
|---------|-------------|--------|
| Create Workouts | Plan and log workout sessions | ✅ Implemented |
| Exercise Library | 47 pre-loaded exercises | ✅ Implemented |
| Custom Exercises | Add personal exercises | ✅ Implemented |
| Set Tracking | Weight, reps, RPE, rest time | ✅ Implemented |
| Workout Templates | 6 pre-built templates | ✅ Implemented |
| Custom Templates | Create personal templates | ✅ Implemented |
| Workout Timer | Track workout duration | ✅ Implemented |
| Workout Rating | Rate perceived effort (1-10 RPE) | ✅ Implemented |
| Workout Calendar | View workouts by date | ✅ Implemented |

### 2.4 Analytics & Progress
| Feature | Description | Status |
|---------|-------------|--------|
| Progress Charts | Volume, frequency, muscle distribution | ✅ Implemented |
| Personal Records | Automatic PR detection and tracking | ✅ Implemented |
| 1RM Estimation | Epley formula calculation | ✅ Implemented |
| Workout History | Full history with filtering | ✅ Implemented |
| Analytics Dashboard | 30-day trends and insights | ✅ Implemented |
| Year in Review | Spotify Wrapped-style annual summary | ✅ Implemented |

### 2.5 Gamification
| Feature | Description | Status |
|---------|-------------|--------|
| Achievement System | 38 achievements across 5 categories | ✅ Implemented |
| XP & Leveling | Earn XP, level up (level = √(totalXP/100)) | ✅ Implemented |
| Streak Tracking | Consecutive workout day tracking | ✅ Implemented |
| Level Titles | Beginner → Intermediate → Advanced → Elite → Legend | ✅ Implemented |
| Achievement Rarities | Common, Uncommon, Rare, Epic, Legendary | ✅ Implemented |

### 2.6 Social Features
| Feature | Description | Status |
|---------|-------------|--------|
| Follow System | Follow other users | ✅ Implemented |
| Workout Likes | Like public workouts | ✅ Implemented |
| Comments | Comment on workouts (500 char limit) | ✅ Implemented |
| Social Feed | Following and discover feeds | ✅ Implemented |
| Leaderboards | 5 types × 2 scopes × 3 periods | ✅ Implemented |
| User Profiles | Public profile pages | ✅ Implemented |

### 2.7 Smart Features
| Feature | Description | Status |
|---------|-------------|--------|
| Muscle Recovery Tracking | 24-72h recovery estimation per muscle | ✅ Implemented |
| Progressive Overload | Trend analysis and weight suggestions | ✅ Implemented |
| Body Diagram | Visual muscle recovery status | ✅ Implemented |
| Training Suggestions | Which muscles to train today | ✅ Implemented |

### 2.8 Mobile & PWA
| Feature | Description | Status |
|---------|-------------|--------|
| Responsive Design | Mobile-first with Tailwind CSS | ✅ Implemented |
| PWA Support | Installable, manifest, icons | ✅ Implemented |
| Bottom Navigation | Mobile-optimized nav bar | ✅ Implemented |
| Touch Targets | 44px minimum touch targets | ✅ Implemented |
| Offline Indicator | Connection status display | ✅ Implemented |
| Install Prompt | Smart PWA install banner | ✅ Implemented |

### 2.9 Data Management
| Feature | Description | Status |
|---------|-------------|--------|
| Data Export | JSON and CSV export | ✅ Implemented |
| Nutrition Logging | Basic calorie/macro tracking | ✅ Implemented |

---

## 3. Technology Stack

### 3.1 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.35 | React framework with App Router |
| React | 18.3.1 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 3.4.0 | Utility-first styling |
| Recharts | 3.6.0 | Charts and data visualization |
| Lucide React | 0.562.0 | Icon library |
| date-fns | 4.1.0 | Date manipulation |
| class-variance-authority | 0.7.1 | Component variants |
| clsx | 2.1.1 | Conditional classNames |
| tailwind-merge | 3.4.0 | Tailwind class merging |

### 3.2 Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 14.2.35 | Serverless API endpoints |
| Prisma | 5.22.0 | Database ORM |
| bcryptjs | 3.0.3 | Password hashing |
| jsonwebtoken | 9.0.3 | JWT authentication |
| zod | 3.22.0 | Schema validation |
| uuid | 13.0.0 | Unique ID generation |

### 3.3 Database
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15+ | Primary database |
| Prisma Client | 5.22.0 | Type-safe database client |

### 3.4 UI Components (Radix UI)
| Component | Version | Purpose |
|-----------|---------|---------|
| @radix-ui/react-dialog | 1.1.15 | Modal dialogs |
| @radix-ui/react-dropdown-menu | 2.1.16 | Dropdown menus |
| @radix-ui/react-select | 2.2.6 | Select inputs |
| @radix-ui/react-tabs | 1.1.13 | Tab navigation |
| @radix-ui/react-toast | 2.15 | Toast notifications |
| @radix-ui/react-switch | 1.2.6 | Toggle switches |
| @radix-ui/react-avatar | 1.1.11 | User avatars |
| @radix-ui/react-popover | 1.1.15 | Popovers |
| @radix-ui/react-slot | 1.2.4 | Slot composition |

### 3.5 Infrastructure
| Service | Purpose | Tier |
|---------|---------|------|
| Vercel | Hosting & deployment | Free |
| Neon | PostgreSQL database | Free (0.5GB) |
| GitHub | Source control | Free |

### 3.6 Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Playwright | E2E testing |
| Prisma Studio | Database GUI |
| PostCSS | CSS processing |
| Autoprefixer | CSS vendor prefixes |

---

## 4. Project Structure

```
workout-tracker/
├── prisma/
│   ├── schema.prisma          # Database schema (17 models)
│   ├── seed.js                # Database seeding script
│   └── seed-achievements.js   # Achievement seeding
│
├── public/
│   ├── icons/
│   │   └── icon.svg           # PWA icon
│   └── manifest.json          # PWA manifest
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes (25 endpoints)
│   │   │   ├── auth/          # Authentication (login, signup, logout, me)
│   │   │   ├── workouts/      # Workout CRUD + likes/comments
│   │   │   ├── exercises/     # Exercise CRUD
│   │   │   ├── templates/     # Template CRUD
│   │   │   ├── achievements/  # Achievement system
│   │   │   ├── users/         # User profiles + follow
│   │   │   ├── analytics/     # Analytics data
│   │   │   ├── recovery/      # Muscle recovery
│   │   │   ├── progression/   # Progressive overload
│   │   │   ├── leaderboards/  # Leaderboards
│   │   │   ├── feed/          # Social feed
│   │   │   ├── export/        # Data export
│   │   │   ├── year-review/   # Year in review
│   │   │   ├── profile/       # Profile management
│   │   │   ├── nutrition/     # Nutrition logging
│   │   │   └── user/stats/    # User statistics
│   │   │
│   │   ├── auth/              # Auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   │
│   │   ├── dashboard/page.tsx # Main dashboard
│   │   ├── workouts/          # Workout pages
│   │   │   ├── page.tsx       # Workout list
│   │   │   ├── new/page.tsx   # Create workout
│   │   │   └── [id]/page.tsx  # Workout detail
│   │   │
│   │   ├── exercises/page.tsx # Exercise library
│   │   ├── templates/page.tsx # Workout templates
│   │   ├── calendar/page.tsx  # Workout calendar
│   │   ├── analytics/page.tsx # Analytics dashboard
│   │   ├── achievements/page.tsx # Achievements page
│   │   ├── leaderboards/page.tsx # Leaderboards
│   │   ├── year-review/page.tsx  # Year in review
│   │   ├── profile/page.tsx   # User profile
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx         # Root layout
│   │
│   ├── components/
│   │   ├── ui/                # Base UI components (shadcn/ui style)
│   │   │   ├── button.tsx     # Button with variants
│   │   │   ├── input.tsx      # Form input
│   │   │   ├── card.tsx       # Card container
│   │   │   ├── badge.tsx      # Badge/tag
│   │   │   ├── dialog.tsx     # Modal dialog
│   │   │   ├── select.tsx     # Select dropdown
│   │   │   ├── tabs.tsx       # Tab navigation
│   │   │   ├── toast.tsx      # Toast notification
│   │   │   ├── skeleton.tsx   # Loading skeleton
│   │   │   ├── progress.tsx   # Progress bar
│   │   │   ├── switch.tsx     # Toggle switch
│   │   │   ├── textarea.tsx   # Textarea input
│   │   │   ├── avatar.tsx     # User avatar
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── loading.tsx    # Loading states
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx     # App header with nav
│   │   │   ├── BottomNav.tsx  # Mobile bottom navigation
│   │   │   ├── ThemeProvider.tsx # Dark/light mode
│   │   │   └── Toaster.tsx    # Toast container
│   │   │
│   │   ├── gamification/
│   │   │   ├── StreakWidget.tsx      # Streak display
│   │   │   ├── LevelBadge.tsx        # Level/XP display
│   │   │   ├── RecentAchievements.tsx # Recent unlocks
│   │   │   └── AchievementToast.tsx  # Unlock notification
│   │   │
│   │   ├── recovery/
│   │   │   ├── MuscleRecoveryCard.tsx # Recovery status
│   │   │   └── BodyDiagram.tsx       # SVG body diagram
│   │   │
│   │   ├── progression/
│   │   │   └── ProgressionCard.tsx   # Overload suggestions
│   │   │
│   │   ├── workout/
│   │   │   ├── NumberInput.tsx       # +/- number input
│   │   │   └── RestTimerOverlay.tsx  # Rest timer
│   │   │
│   │   ├── ErrorBoundary.tsx  # Error catching
│   │   ├── InstallPrompt.tsx  # PWA install banner
│   │   └── OfflineIndicator.tsx # Connection status
│   │
│   ├── hooks/
│   │   ├── useApi.ts          # API call with retry
│   │   ├── useTimer.ts        # Workout timer
│   │   ├── useToast.ts        # Toast notifications
│   │   ├── useLocalStorage.ts # Local storage
│   │   └── useOnlineStatus.ts # Connection status
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # Auth utilities (JWT, session)
│   │   ├── utils.ts           # General utilities
│   │   ├── validations.ts     # Zod schemas
│   │   ├── achievements.ts    # Achievement logic
│   │   ├── recovery.ts        # Recovery calculations
│   │   └── progressive-overload.ts # Progression analysis
│   │
│   ├── styles/
│   │   └── globals.css        # Global styles + Tailwind
│   │
│   └── types/
│       └── index.ts           # TypeScript interfaces
│
├── e2e/                       # Playwright E2E tests
│   └── workout.spec.ts
│
├── .env.example               # Environment template
├── .env.local                 # Local environment (gitignored)
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
└── README.md                  # Quick start guide
```

### Directory Conventions

- **API Routes**: Each endpoint in `src/app/api/` exports HTTP method handlers (GET, POST, PUT, DELETE)
- **Pages**: Each folder in `src/app/` with a `page.tsx` becomes a route
- **Components**: Organized by feature domain (ui, layout, gamification, etc.)
- **Naming**: PascalCase for components, camelCase for utilities

---

## 5. Database Schema

### 5.1 Entity Relationship Diagram

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│    User     │────<│   Workout    │────<│WorkoutExercise│
└─────────────┘     └──────────────┘     └───────────────┘
       │                   │                     │
       │                   │                     │
       ▼                   ▼                     ▼
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│ UserProfile │     │ WorkoutLike  │     │  ExerciseSet  │
└─────────────┘     └──────────────┘     └───────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  UserStats  │     │WorkoutComment│     │   Exercise    │
└─────────────┘     └──────────────┘     └───────────────┘
       │                                        │
       │                                        │
       ▼                                        ▼
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Follow    │     │  Achievement │     │PersonalRecord │
└─────────────┘     └──────────────┘     └───────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│MuscleRecov. │     │UserAchievemt │     │WorkoutTemplate│
└─────────────┘     └──────────────┘     └───────────────┘
                                                │
                                                ▼
                                         ┌───────────────┐
                                         │TemplateExerc. │
                                         └───────────────┘
```

### 5.2 Models

#### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique email |
| passwordHash | String | bcrypt hash |
| name | String | Display name |
| avatarUrl | String? | Profile picture URL |
| createdAt | DateTime | Registration date |

**Relations**: profile, workouts, exercises, templates, personalRecords, stats, achievements, followers, following, workoutLikes, workoutComments, muscleRecovery

---

#### UserProfile
| Field | Type | Description |
|-------|------|-------------|
| fitnessGoal | String | strength/hypertrophy/endurance/fat_loss/general |
| experienceLevel | String | beginner/intermediate/advanced |
| weight | Float? | Body weight in kg |
| height | Float? | Height in cm |
| preferredUnits | String | metric/imperial |
| weeklyGoal | Int | Target workouts/week |

---

#### Exercise
| Field | Type | Description |
|-------|------|-------------|
| name | String | Exercise name |
| muscleGroup | String | Target muscle |
| category | String | compound/isolation/bodyweight/cardio |
| equipment | String? | Required equipment |
| isCustom | Boolean | User-created flag |

**Muscle Groups**: chest, back, shoulders, biceps, triceps, legs, core, cardio, full_body

---

#### Workout
| Field | Type | Description |
|-------|------|-------------|
| name | String | Workout name |
| date | DateTime | Workout date |
| duration | Int? | Duration in minutes |
| status | String | planned/in_progress/completed/cancelled |
| rating | Int? | 1-5 satisfaction |
| perceivedEffort | Int? | 1-10 RPE |
| visibility | String | private/followers/public |

**Indexes**: (userId, date)

---

#### ExerciseSet
| Field | Type | Description |
|-------|------|-------------|
| setNumber | Int | Set order |
| setType | String | warmup/working/dropset/failure |
| targetReps | Int? | Target repetitions |
| actualReps | Int? | Actual completed |
| weight | Float? | Weight used |
| rpe | Int? | 1-10 effort rating |
| isCompleted | Boolean | Completion flag |
| isPR | Boolean | Personal record flag |

---

#### UserStats
| Field | Type | Description |
|-------|------|-------------|
| totalXP | Int | Total experience points |
| currentLevel | Int | Current level |
| totalWorkouts | Int | Lifetime workouts |
| totalSets | Int | Lifetime sets |
| totalReps | Int | Lifetime reps |
| totalWeight | Float | Lifetime volume (kg) |
| currentStreak | Int | Current day streak |
| longestStreak | Int | Best streak ever |
| totalPRs | Int | Personal records count |

---

#### Achievement
| Field | Type | Description |
|-------|------|-------------|
| name | String | Achievement name |
| description | String | How to unlock |
| category | String | workout/strength/consistency/volume/special |
| rarity | String | common/uncommon/rare/epic/legendary |
| requirement | Json | Unlock conditions |
| xpReward | Int | XP granted |
| isSecret | Boolean | Hidden until unlocked |

---

#### MuscleRecovery
| Field | Type | Description |
|-------|------|-------------|
| muscleGroup | String | Muscle being tracked |
| lastTrained | DateTime | Last workout date |
| totalSets | Int | Sets in last session |
| totalVolume | Float | Volume in last session |
| recoveryHours | Int | Estimated recovery time |

**Unique Index**: (userId, muscleGroup)

---

## 6. API Reference

### 6.1 Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

#### POST /api/auth/login
Authenticate user and set JWT cookie.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

#### POST /api/auth/logout
Clear authentication cookie.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### GET /api/auth/me
Get current authenticated user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "profile": { ... }
  }
}
```

---

### 6.2 Workout Endpoints

#### GET /api/workouts
List user's workouts with optional filtering.

**Query Parameters:**
- `limit` (number): Max results (default: 20)
- `offset` (number): Pagination offset
- `status` (string): Filter by status

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Push Day",
      "date": "2024-01-15T10:00:00Z",
      "duration": 60,
      "status": "completed",
      "exercises": [...]
    }
  ]
}
```

---

#### POST /api/workouts
Create a new workout.

**Request Body:**
```json
{
  "name": "Push Day",
  "date": "2024-01-15T10:00:00Z",
  "templateId": "uuid" // optional
}
```

---

#### GET /api/workouts/[id]
Get workout details with exercises and sets.

---

#### PUT /api/workouts/[id]
Update workout (status, exercises, sets).

---

#### DELETE /api/workouts/[id]
Delete a workout.

---

#### POST /api/workouts/[id]/like
Like a workout.

---

#### DELETE /api/workouts/[id]/like
Unlike a workout.

---

#### GET /api/workouts/[id]/comments
Get workout comments.

---

#### POST /api/workouts/[id]/comments
Add a comment (500 char limit).

---

### 6.3 Exercise Endpoints

#### GET /api/exercises
List all exercises (system + user custom).

**Query Parameters:**
- `muscleGroup` (string): Filter by muscle
- `category` (string): Filter by category
- `search` (string): Search by name

---

#### POST /api/exercises
Create custom exercise.

---

#### PUT /api/exercises/[id]
Update custom exercise.

---

#### DELETE /api/exercises/[id]
Delete custom exercise.

---

### 6.4 Template Endpoints

#### GET /api/templates
List workout templates.

---

#### POST /api/templates
Create custom template.

---

#### GET /api/templates/[id]
Get template with exercises.

---

#### PUT /api/templates/[id]
Update template.

---

#### DELETE /api/templates/[id]
Delete template.

---

### 6.5 Social Endpoints

#### GET /api/feed
Get social feed.

**Query Parameters:**
- `type`: "following" | "discover"
- `limit` (number): Max results
- `offset` (number): Pagination

---

#### GET /api/users/[id]
Get user profile.

---

#### POST /api/users/[id]/follow
Follow a user.

---

#### DELETE /api/users/[id]/follow
Unfollow a user.

---

#### GET /api/leaderboards
Get leaderboard rankings.

**Query Parameters:**
- `type`: "volume" | "workouts" | "streak" | "xp" | "prs"
- `scope`: "global" | "following"
- `period`: "all" | "month" | "week"

---

### 6.6 Gamification Endpoints

#### GET /api/achievements
List all achievements with user unlock status.

---

#### POST /api/achievements/check
Check and unlock new achievements.

---

#### GET /api/user/stats
Get user statistics with level info.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalXP": 1250,
    "level": 3,
    "levelTitle": "Beginner",
    "xpProgress": 50,
    "currentStreak": 5,
    "longestStreak": 12,
    "totalWorkouts": 25,
    "totalPRs": 8,
    "recentAchievements": [...]
  }
}
```

---

### 6.7 Smart Feature Endpoints

#### GET /api/recovery
Get muscle recovery status.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "muscles": [
      {
        "muscleGroup": "chest",
        "recoveryPercent": 85,
        "status": "recovering",
        "readyToTrain": true,
        "hoursRemaining": 6
      }
    ],
    "suggestedMuscles": ["back", "biceps"],
    "overallRecovery": 78
  }
}
```

---

#### GET /api/progression
Get progressive overload suggestions.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "readyToProgress": [
      {
        "exerciseName": "Bench Press",
        "currentWeight": 80,
        "suggestedWeight": 82.5,
        "trend": "improving",
        "confidence": "high"
      }
    ],
    "needsWork": [...]
  }
}
```

---

### 6.8 Analytics Endpoints

#### GET /api/analytics
Get analytics data.

**Query Parameters:**
- `period` (number): Days to analyze (default: 30)

---

#### GET /api/year-review
Get year in review data.

**Query Parameters:**
- `year` (number): Year to analyze

---

### 6.9 Export Endpoints

#### GET /api/export
Export user data.

**Query Parameters:**
- `format`: "json" | "csv"
- `type`: "workouts" | "exercises" | "prs" | "all"

---

## 7. Environment Variables

```bash
# ===========================================
# DATABASE (Required)
# ===========================================
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
# PostgreSQL connection string
# For Neon: postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"
# Direct connection URL (for migrations in serverless)

# ===========================================
# AUTHENTICATION (Required)
# ===========================================
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters"
# Secret for signing JWT tokens
# Generate: openssl rand -base64 32

JWT_EXPIRES_IN="7d"
# Token expiration time (default: 7 days)

# ===========================================
# APPLICATION (Optional)
# ===========================================
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
# Public URL for the application

NODE_ENV="development"
# Environment: development | production | test
```

### Variable Details

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection with SSL |
| DIRECT_URL | Yes* | Direct DB connection (*for Neon) |
| JWT_SECRET | Yes | Min 32 characters |
| JWT_EXPIRES_IN | No | Default: "7d" |
| NEXT_PUBLIC_APP_URL | No | For absolute URLs |
| NODE_ENV | No | Auto-set by environment |

---

## 8. Getting Started

### 8.1 Prerequisites

- **Node.js**: v18.17+ or v20.9+ (recommended)
- **npm**: v10+ (or yarn/pnpm)
- **PostgreSQL**: v15+ (or Neon account)
- **Git**: For cloning repository

### 8.2 Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/abhishek-official1/fittrack.git
cd fittrack

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit .env.local with your database credentials
# DATABASE_URL="postgresql://..."
# JWT_SECRET="your-secret-key"
```

### 8.3 Database Setup

```bash
# Option A: Using Neon (Recommended for production)
# 1. Create account at neon.tech
# 2. Create new project
# 3. Copy connection string to .env.local

# Option B: Local PostgreSQL
# 1. Install PostgreSQL
# 2. Create database: createdb fittrack
# 3. Update DATABASE_URL in .env.local

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed initial data (exercises, templates, achievements)
npm run db:seed
```

### 8.4 Running the Application

```bash
# Development server (with hot reload)
npm run dev
# → Open http://localhost:3000

# Production build
npm run build
npm start

# Lint code
npm run lint

# View database in Prisma Studio
npm run db:studio
# → Open http://localhost:5555
```

### 8.5 Running Tests

```bash
# Install Playwright browsers (first time)
npx playwright install

# Run E2E tests
npx playwright test

# Run with UI
npx playwright test --ui
```

---

## 9. Deployment

### 9.1 Vercel Deployment

1. **Connect Repository**
   - Go to vercel.com
   - Import GitHub repository
   - Select `workout-tracker` folder if monorepo

2. **Configure Environment Variables**
   ```
   DATABASE_URL = your-neon-connection-string
   DIRECT_URL = your-neon-direct-connection
   JWT_SECRET = your-production-secret
   ```

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Click Deploy
   - Wait for build to complete
   - Access your app at `https://your-app.vercel.app`

### 9.2 Database Setup (Neon)

1. **Create Account**
   - Go to neon.tech
   - Sign up with GitHub

2. **Create Project**
   - Click "New Project"
   - Select region closest to Vercel deployment
   - Copy connection strings

3. **Configure Connection**
   ```bash
   # Pooled connection (for application)
   DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
   
   # Direct connection (for migrations)
   DIRECT_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

4. **Initialize Database**
   ```bash
   # Run locally after setting env vars
   npx prisma db push
   npm run db:seed
   ```

### 9.3 Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Test user registration
- [ ] Test user login
- [ ] Verify exercises are seeded
- [ ] Test workout creation
- [ ] Check PWA installation
- [ ] Test on mobile device

---

## 10. Architecture Decisions

### 10.1 Why Next.js App Router?

- **Server Components**: Reduce client JavaScript bundle
- **API Routes**: Serverless functions without separate backend
- **File-based Routing**: Intuitive page structure
- **Built-in Optimization**: Image, font, and script optimization
- **Vercel Integration**: Seamless deployment

### 10.2 Why PostgreSQL over SQLite?

- **Scalability**: Handles concurrent users
- **Production Ready**: Same database locally and in production
- **Neon Free Tier**: 0.5GB free with branching
- **Full SQL Features**: JSON fields, full-text search, indexes

### 10.3 Why Prisma?

- **Type Safety**: Auto-generated TypeScript types
- **Schema First**: Single source of truth for database
- **Migrations**: Version controlled schema changes
- **Query Builder**: Intuitive, type-safe queries
- **Studio**: Built-in database GUI

### 10.4 Authentication Approach

**JWT in HTTP-only Cookies** chosen over:
- **Session Storage**: Requires persistent server
- **localStorage JWT**: XSS vulnerable
- **Third-party Auth**: Added complexity for MVP

Benefits:
- Stateless (serverless compatible)
- CSRF protection via SameSite
- XSS protection via HTTP-only
- 7-day expiration balances security/UX

### 10.5 State Management

**React State + Context** chosen over Redux/Zustand:
- **Server Components**: Data fetched server-side
- **Simple State**: No complex client state
- **URL State**: Filters in query params
- **Local Storage**: Preferences via hook

### 10.6 Styling Approach

**Tailwind CSS + shadcn/ui**:
- **Utility-first**: Fast development, small bundle
- **Design System**: Consistent with CSS variables
- **shadcn/ui**: Copy-paste components (not dependency)
- **Radix UI**: Accessible primitives
- **Dark Mode**: CSS variables + class toggle

---

## 11. Key Algorithms & Business Logic

### 11.1 Achievement System

**Checking Logic** (`src/lib/achievements.ts`):
```typescript
// Achievement requirements stored as JSON
requirement: { type: "workout_count", value: 10 }

// Check types:
// - workout_count: Total workouts completed
// - streak_days: Current streak length
// - total_weight: Lifetime volume lifted
// - pr_count: Total personal records
// - exercise_count: Unique exercises done
```

**XP Calculation**:
```typescript
// XP rewards by rarity
common: 50 XP
uncommon: 100 XP
rare: 250 XP
epic: 500 XP
legendary: 1000 XP
```

**Level Progression**:
```typescript
level = Math.floor(Math.sqrt(totalXP / 100))

// XP to next level
xpForNextLevel = (level + 1)² × 100
xpProgress = ((totalXP - level² × 100) / ((level + 1)² × 100 - level² × 100)) × 100
```

**Level Titles**:
```typescript
1-10: "Beginner"
11-25: "Intermediate"
26-50: "Advanced"
51-75: "Elite"
76+: "Legend"
```

### 11.2 Muscle Recovery Calculation

**Base Recovery Times** (`src/lib/recovery.ts`):
```typescript
chest: 48 hours
back: 72 hours
shoulders: 48 hours
biceps: 48 hours
triceps: 48 hours
legs: 72 hours
core: 24 hours
```

**Volume Adjustment**:
```typescript
if (totalSets >= 20) baseRecovery + 24 hours
if (totalSets >= 15) baseRecovery + 12 hours
if (totalSets >= 10) baseRecovery (no change)
if (totalSets < 10) baseRecovery - 12 hours
```

**Recovery Status**:
```typescript
recoveryPercent = (hoursSinceTraining / recoveryHours) × 100

status:
  >= 100%: "recovered"
  >= 50%: "recovering"
  < 50%: "fatigued"

readyToTrain: recoveryPercent >= 80%
```

### 11.3 Progressive Overload Detection

**Analysis** (`src/lib/progressive-overload.ts`):
```typescript
// Analyze last 5 sessions per exercise
// Calculate average weight and reps per session
// Determine volume trend

volumeChange = ((latestVolume - previousVolume) / previousVolume) × 100

trend:
  > 5%: "improving"
  < -5%: "declining"
  else: "plateau"
```

**Weight Suggestions**:
```typescript
// If averaging 10+ reps and not declining:
if (avgReps >= 10 && trend !== 'declining') {
  if (currentWeight <= 20kg) suggest +2.5kg
  else suggest +5kg
  confidence: avgReps >= 12 ? "high" : "medium"
}

// If struggling (< 6 reps) and declining:
suggest 10% deload
confidence: "medium"

// If plateau:
suggest same weight, focus on reps
```

### 11.4 Leaderboard Ranking

**Leaderboard Types**:
```typescript
volume: Sum of (weight × reps) for all sets
workouts: Count of completed workouts
streak: Current streak days
xp: Total XP from UserStats
prs: Total PRs from UserStats
```

**Scopes**:
```typescript
global: All users
following: Users you follow + yourself
```

**Periods**:
```typescript
all: All time
month: Last 30 days
week: Last 7 days
```

### 11.5 One Rep Max Calculation

**Epley Formula** (`src/lib/utils.ts`):
```typescript
function calculateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

// Example: 100kg × 8 reps
// 1RM = 100 × (1 + 8/30) = 100 × 1.267 = 127kg
```

---

## 12. Component Library

### 12.1 Base UI Components

#### Button
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="default">Click me</Button>

// Variants: default, destructive, outline, secondary, ghost, link, success
// Sizes: default, sm, lg, xl, icon
// Props: loading, asChild
```

#### Input
```tsx
import { Input } from '@/components/ui/input'

<Input 
  label="Email"
  type="email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

#### Select
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### 12.2 Custom Components

#### NumberInput
Large touch-friendly number input with +/- buttons.
```tsx
import { NumberInput } from '@/components/workout/NumberInput'

<NumberInput
  label="Weight"
  value={80}
  onChange={setValue}
  step={2.5}
  unit="kg"
  size="md" // sm, md, lg
/>
```

#### MuscleRecoveryCard
Displays muscle recovery status with progress bars.
```tsx
import { MuscleRecoveryCard } from '@/components/recovery/MuscleRecoveryCard'

<MuscleRecoveryCard />
// Self-contained, fetches data from /api/recovery
```

#### ProgressionCard
Shows progressive overload suggestions.
```tsx
import { ProgressionCard } from '@/components/progression/ProgressionCard'

<ProgressionCard />
// Self-contained, fetches data from /api/progression
```

#### RestTimerOverlay
Full-screen rest timer with circular progress.
```tsx
import { RestTimerOverlay } from '@/components/workout/RestTimerOverlay'

<RestTimerOverlay
  duration={90}
  onComplete={() => {}}
  onSkip={() => {}}
/>
```

---

## 13. Hooks Reference

### useApi
API call wrapper with retry logic and error handling.
```typescript
const { data, error, isLoading, refetch } = useApi<T>('/api/endpoint', {
  retries: 3,
  retryDelay: 1000
})
```

### useTimer
Workout timer with pause/resume.
```typescript
const { time, isRunning, start, pause, reset, formatTime } = useTimer()
```

### useToast
Toast notification system.
```typescript
const { toast } = useToast()

toast({
  title: "Success",
  description: "Workout saved",
  variant: "default" // default, destructive
})
```

### useLocalStorage
Persistent local storage with SSR safety.
```typescript
const [value, setValue] = useLocalStorage('key', defaultValue)
```

### useOnlineStatus
Network connection status.
```typescript
const isOnline = useOnlineStatus()
```

---

## 14. Type Definitions

### Core Types
```typescript
// src/types/index.ts

interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  profile?: UserProfile
}

interface Workout {
  id: string
  name: string
  date: string
  duration?: number
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  exercises: WorkoutExercise[]
}

interface WorkoutExercise {
  id: string
  exercise: Exercise
  order: number
  sets: ExerciseSet[]
}

interface ExerciseSet {
  id: string
  setNumber: number
  setType: 'warmup' | 'working' | 'dropset' | 'failure'
  targetReps?: number
  actualReps?: number
  weight?: number
  isCompleted: boolean
  isPR: boolean
}

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  category: string
  equipment?: string
}

interface Achievement {
  id: string
  name: string
  description: string
  category: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  isUnlocked?: boolean
  unlockedAt?: string
}
```

### API Response Types
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}
```

---

## 15. Testing Strategy

### 15.1 E2E Tests (Playwright)

**Location**: `e2e/`

**Test Suites**:
- Authentication flow (signup, login, logout)
- Workout CRUD operations
- Exercise management
- Template usage

**Running Tests**:
```bash
npx playwright test
npx playwright test --ui
npx playwright test --debug
```

### 15.2 Manual Testing Checklist

- [ ] User can register with valid email/password
- [ ] User can login and see dashboard
- [ ] User can create workout from template
- [ ] User can add exercises to workout
- [ ] User can log sets with weight/reps
- [ ] Personal records are detected
- [ ] Achievements unlock correctly
- [ ] Mobile bottom nav works
- [ ] PWA can be installed
- [ ] Dark mode toggle works

---

## 16. Performance Considerations

### 16.1 Database Optimization

**Indexes**:
```prisma
@@index([userId, date]) // Workouts
@@index([workoutId])    // WorkoutExercises, ExerciseSet
@@index([userId, exerciseId]) // PersonalRecords
@@index([followerId])   // Follows
@@index([followingId])  // Follows
```

**Query Optimization**:
- Use `select` to limit returned fields
- Use `include` sparingly
- Paginate large lists

### 16.2 Frontend Optimization

**Code Splitting**:
- Dynamic imports for heavy components
- Route-based splitting (automatic with App Router)

**Image Optimization**:
- Use `next/image` for automatic optimization
- Lazy load images below fold

**Bundle Analysis**:
```bash
ANALYZE=true npm run build
```

### 16.3 Caching Strategy

**Static Pages**: Pre-rendered at build time
**Dynamic Pages**: Server-rendered per request
**API Routes**: No caching (user-specific data)

---

## 17. Security Measures

### 17.1 Authentication Security

- **Password Hashing**: bcrypt with cost factor 10
- **JWT Security**: 
  - HTTP-only cookies (no XSS access)
  - SameSite=Lax (CSRF protection)
  - Secure flag in production
  - 7-day expiration
- **Input Validation**: Zod schemas on all inputs

### 17.2 API Security

- **Authentication Check**: All protected routes verify JWT
- **Authorization**: Users can only access own data
- **Input Sanitization**: Zod validation + Prisma parameterization
- **Error Messages**: Generic errors in production

### 17.3 Data Protection

- **Environment Variables**: Secrets in .env (gitignored)
- **Database**: SSL required for connections
- **Passwords**: Never stored or logged in plain text

---

## 18. Known Limitations & Future Improvements

### 18.1 Current Limitations

| Limitation | Impact | Priority |
|------------|--------|----------|
| No email verification | Fake signups possible | Medium |
| No password reset | Users locked out if forgotten | High |
| No image uploads | No exercise demo images | Low |
| No real-time updates | Manual refresh for social | Low |
| No push notifications | No workout reminders | Medium |

### 18.2 Planned Features

- [ ] Email verification
- [ ] Password reset flow
- [ ] Exercise demonstration images/videos
- [ ] Workout sharing via link
- [ ] Superset support
- [ ] Rest timer auto-start
- [ ] Apple Health / Google Fit sync
- [ ] Barcode scanner for nutrition

### 18.3 Technical Improvements

- [ ] Add rate limiting to API
- [ ] Implement Redis caching
- [ ] Add comprehensive unit tests
- [ ] Set up CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Implement real-time with WebSockets

---

## 19. Contributing Guidelines

### 19.1 Code Style

**ESLint**: Configured via `.eslintrc`
**Formatting**: 2-space indentation, single quotes
**Naming**:
- Components: PascalCase (`WorkoutCard.tsx`)
- Hooks: camelCase with `use` prefix (`useTimer.ts`)
- Utils: camelCase (`formatDate.ts`)
- Types: PascalCase (`interface User`)

### 19.2 Git Workflow

**Branch Naming**:
```
feature/add-exercise-search
fix/workout-timer-bug
refactor/api-error-handling
```

**Commit Messages**:
```
feat: Add exercise search functionality
fix: Resolve workout timer pause issue
refactor: Improve API error handling
docs: Update API documentation
```

**PR Process**:
1. Create feature branch
2. Make changes
3. Run `npm run lint`
4. Run `npm run build`
5. Create PR with description
6. Request review

### 19.3 Adding New Features

**New Component**:
1. Create in appropriate `components/` subdirectory
2. Export from directory index if needed
3. Add TypeScript types
4. Document props with JSDoc

**New API Route**:
1. Create `route.ts` in `app/api/`
2. Add authentication check
3. Validate input with Zod
4. Return consistent response format

**Database Changes**:
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Run `npx prisma generate`
4. Update seed if needed

---

## 20. Troubleshooting

### 20.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot connect to database" | Invalid DATABASE_URL | Check connection string format |
| "Prisma client not generated" | Missing postinstall | Run `npx prisma generate` |
| "JWT malformed" | Invalid token | Clear cookies, login again |
| "Module not found" | Missing dependency | Run `npm install` |
| Build fails with type errors | Schema mismatch | Run `npx prisma generate` |
| Exercises not loading | Database not seeded | Run `npm run db:seed` |
| PWA not installing | Missing manifest | Check `/manifest.json` exists |

### 20.2 Debug Tips

**API Routes**:
```typescript
console.log('Request:', request.method, request.url)
console.log('Body:', await request.json())
```

**Database**:
```bash
# Open Prisma Studio
npm run db:studio

# Check raw data
npx prisma db execute --sql "SELECT * FROM users"
```

**Client State**:
```typescript
// In React component
useEffect(() => {
  console.log('State changed:', state)
}, [state])
```

---

## 21. Changelog

### v1.0.0 (2024-12)
- Initial release
- Core workout tracking
- Exercise library (47 exercises)
- Workout templates (6 templates)
- User authentication
- Analytics dashboard
- Achievement system (38 achievements)
- Social features (follow, like, comment)
- Leaderboards
- Muscle recovery tracking
- Progressive overload suggestions
- Year in Review
- PWA support
- Mobile optimization

---

## 22. License & Credits

### License
MIT License - See LICENSE file

### Third-Party Libraries
- **Next.js** - Vercel
- **React** - Meta
- **Tailwind CSS** - Tailwind Labs
- **Prisma** - Prisma Data
- **Radix UI** - WorkOS
- **Recharts** - Recharts team
- **Lucide** - Lucide Contributors
- **date-fns** - date-fns contributors

### Contributors
- Initial development by project creator
- AI assistance by Claude (Anthropic)

---

*Last updated: December 2024*
*Documentation version: 1.0.0*
