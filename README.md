# FitTrack - Personal Workout Tracker

A modern, full-stack workout tracking application built with Next.js 14, TypeScript, and SQLite/PostgreSQL.

## Features

- **User Authentication**: Secure JWT-based authentication with email/password
- **Workout Logging**: Log exercises, sets, reps, weights with detailed tracking
- **Exercise Library**: 45+ pre-built exercises with custom exercise support
- **Workout Templates**: Pre-built routines (Push/Pull/Legs, Upper/Lower, Full Body)
- **Rest Timer**: Built-in countdown timer for rest periods
- **Personal Records**: Automatic PR detection with celebrations
- **Analytics Dashboard**: Track volume, frequency, streaks, and progress
- **Calendar View**: Visualize workout history and plan future sessions
- **Profile Management**: Set fitness goals, track body measurements
- **Dark/Light Mode**: Full theme support
- **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: SQLite (dev) / PostgreSQL (prod) via Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Charts**: Recharts
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd workout-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Generate Prisma client and push database:
```bash
npm run db:generate
npm run db:push
```

5. Seed the database with default exercises and templates:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with default data
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |

## Database Schema

The application uses the following main entities:

- **User**: User accounts with profile settings
- **UserProfile**: Fitness goals, measurements, preferences
- **Exercise**: Exercise library (system + custom)
- **Workout**: Individual workout sessions
- **WorkoutExercise**: Exercises within a workout
- **ExerciseSet**: Individual sets with reps, weight, RPE
- **WorkoutTemplate**: Pre-built workout routines
- **PersonalRecord**: PR tracking
- **NutritionLog**: Optional nutrition tracking

## Production Deployment

### Using PostgreSQL

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set `DATABASE_URL` to your PostgreSQL connection string

3. Run migrations:
```bash
npx prisma migrate deploy
```

### Deployment Platforms

The app is ready to deploy on:
- Vercel (recommended for Next.js)
- Railway
- Render
- DigitalOcean App Platform

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Workouts
- `GET /api/workouts` - List workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/[id]` - Get workout
- `PUT /api/workouts/[id]` - Update workout
- `DELETE /api/workouts/[id]` - Delete workout

### Exercises
- `GET /api/exercises` - List exercises
- `POST /api/exercises` - Create custom exercise
- `GET /api/exercises/[id]` - Get exercise
- `PUT /api/exercises/[id]` - Update exercise
- `DELETE /api/exercises/[id]` - Delete exercise

### Templates
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `GET /api/templates/[id]` - Get template
- `PUT /api/templates/[id]` - Update template
- `DELETE /api/templates/[id]` - Delete template

### Analytics
- `GET /api/analytics` - Get workout analytics

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

## License

MIT
