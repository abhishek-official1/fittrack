# 🏋️ Coach Plan Feature - Complete Implementation

## Overview

The Coach Plan is a comprehensive AI-powered training system that provides:
- **6-Day PPL Split** (Push A/B, Pull A/B, Legs A/B + rest day)
- **Smart Recovery Tracking** - Integrated with existing muscle recovery system
- **Progressive Overload Suggestions** - Automated weight progression recommendations
- **Daily Nutrition Guidance** - Calories, protein, and macro tracking
- **Daily Checklist** - Steps, water, sleep, and mobility tracking
- **Evening Reminders** - Browser notifications for workout and nutrition logging

## Features Implemented

### 1. Database Schema ✅
- `CoachPlan` - User-specific plan settings and targets
- `CoachPlanDay` - 6 days of workout prescriptions with JSON flexibility
- `NutritionLog` - Meal tracking with macros
- `DailyChecklist` - Daily habit tracking

### 2. API Endpoints ✅
- `GET/POST/PUT/DELETE /api/coach-plan` - Full CRUD operations
- `GET /api/coach-plan/today` - Daily brief with all data combined
- `GET/POST /api/nutrition` - Nutrition logging with date filtering
- `PUT/DELETE /api/nutrition/[id]` - Edit/delete meals
- `GET/POST/PUT /api/checklist` - Daily checklist operations

### 3. User Interface ✅

#### /coach/setup - Onboarding Page
- User information form (age, weight, height)
- Nutrition target configuration
- Daily checklist targets
- One-click Coach Plan activation

#### /coach/today - Daily Brief
- **Current Day Display** - Shows which day of the 6-day rotation
- **Recovery Status Card** - Green "good to go" or yellow "consider lighter training"
- **Start Workout Button** - Creates workout from plan in one tap
- **Warmup Protocol** - Cardio, dynamic stretches, ramp-up sets
- **Exercise List** - All exercises with sets, reps, rest, RPE targets
- **Progressive Overload Badges** - Shows weight progression suggestions per exercise
- **Substitutions** - Collapsible list for each exercise
- **Nutrition Progress** - Calories and protein vs targets with progress bars
- **Daily Checklist** - Visual completion grid for steps, water, sleep, mobility

#### /coach/plan - Plan Management
- **6-Day Tabs** - View all days with full exercise details
- **Current Day Indicator** - Badge showing active day
- **Settings Dialog** - Edit nutrition targets, checklist targets, reminders
- **Deload Mode Toggle** - Reduce volume for recovery week
- **Manual Day Advance** - Skip or advance days manually
- **Quick Actions** - Links to Today, Nutrition, Analytics

#### /nutrition - Nutrition Tracking
- **Meal Logging Form** - Meal name, time, calories, protein, carbs, fats
- **Today Tab** - Daily summary with progress bars and meal list
- **Trends Tab** - 7-day line charts for calories and protein
- **Weekly Stats** - Average calories, protein, days logged
- **Edit/Delete Meals** - Full CRUD for nutrition logs

#### /templates - Template Management
- **Coach Templates Tab** - Shows 6 PPL templates when plan is active
- **System Templates Tab** - Pre-built workout routines
- **Custom Templates Tab** - User-created templates
- **Template Cards** - Exercise list, duration, difficulty, quick start button

### 4. Reminders System ✅
- **Browser Notification API** - Native notifications at 7 PM daily
- **Permission Request** - User-friendly permission flow
- **Test Notification** - Verify notifications are working
- **Enable/Disable Toggle** - User control over reminders
- **Smart Reminders** - Context-aware messages based on workout and nutrition status

### 5. Integration with Existing Features ✅
- **Recovery System** - Uses `getMuscleRecoveryStatus()` from existing system
- **Progressive Overload** - Uses `getAllProgressionSuggestions()` for weight recommendations
- **Workout Creation** - Creates workouts via existing `/api/workouts` endpoint
- **Gamification** - XP and achievements trigger on workout completion
- **Analytics** - Coach workouts appear in existing analytics dashboard

## Getting Started

### For Users

1. **Enable Coach Plan**
   ```
   Navigate to /coach/setup
   Fill in your details (age, weight, height)
   Set your nutrition targets
   Click "Enable Coach Plan"
   ```

2. **Daily Routine**
   ```
   Visit /coach/today each morning
   Check recovery status
   Click "Start Workout" when ready
   Log sets as you complete them
   Track nutrition throughout the day
   Complete daily checklist
   ```

3. **Weekly Management**
   ```
   Visit /coach/plan to view all 6 days
   Adjust settings as needed
   Enable reminders for accountability
   Advance days manually if needed
   ```

### For Developers

#### Running the Application

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed data (optional - Coach Plan creates on-demand)
npm run db:seed

# Start development server
npm run dev
```

#### Testing Coach Plan

```bash
# 1. Create account or login
# 2. Navigate to http://localhost:3000/coach/setup
# 3. Submit setup form
# 4. Verify redirect to /coach/today
# 5. Check all data displays correctly:
#    - Day name (Push A, Pull A, etc.)
#    - Recovery status with percentage
#    - Exercise list with prescriptions
#    - Nutrition progress bars
#    - Daily checklist grid
# 6. Click "Start Workout" button
# 7. Verify workout created with correct exercises
# 8. Complete a set and save
# 9. Navigate to /nutrition and log a meal
# 10. Return to /coach/today and verify nutrition updated
```

## Technical Details

### Data Flow

```
User enables Coach Plan
  ↓
POST /api/coach-plan creates CoachPlan + 6 CoachPlanDays
  ↓
User visits /coach/today
  ↓
GET /api/coach-plan/today fetches:
  - Current day's plan
  - Recovery status (from /api/recovery)
  - Progression suggestions (from /api/progression)
  - Today's nutrition logs
  - Today's checklist
  ↓
User clicks "Start Workout"
  ↓
Creates workout via existing /api/workouts
  ↓
Exercises and sets populated from CoachPlanDay.exercises JSON
  ↓
User logs sets in workout
  ↓
Completion triggers:
  - Muscle recovery update
  - XP gain
  - Achievement checks
  - Checklist update
```

### Exercise Prescription Format

```json
{
  "name": "Barbell Bench Press",
  "sets": 4,
  "repsRange": "5-8",
  "rest": "2-3 min",
  "targetRPE": "7-8",
  "notes": "Primary strength movement. Focus on progressive overload.",
  "substitutions": ["Dumbbell Bench Press", "Machine Press"]
}
```

### Warmup Protocol Format

```json
{
  "cardio": "5 min brisk walk or cycling",
  "dynamic": [
    "Arm circles 2x15 each direction",
    "Band pull-aparts 2x20 or cable external rotations 2x15"
  ],
  "rampSets": "Main lift: 2-3 warm-up sets (empty bar → 50% → 75% working weight)"
}
```

## 6-Day PPL Rotation

### Day 1: Push A
- Barbell Bench Press 4×5-8
- Incline Dumbbell Press 3×8-12
- Seated Dumbbell Shoulder Press 3×6-10
- Lateral Raise 3×12-15
- Cable Triceps Pushdown 3×10-15

### Day 2: Pull A
- Deadlift 3×3-5
- Lat Pulldown 3×8-12
- Chest Supported Row 3×8-12
- Face Pulls 3×12-15
- EZ Bar Curl 3×10-12

### Day 3: Legs A
- Back Squat 4×5-8
- Leg Press 3×10-15
- Romanian Deadlift 3×8-12
- Leg Curl 3×10-15
- Standing Calf Raise 3×12-20
- Plank 3×30-60s

### Day 4: Push B
- Incline Barbell Bench Press 4×6-10
- Dumbbell Bench Press 3×8-12
- Cable Fly 2×12-15
- Lateral Raise 3×12-15
- Overhead Cable Triceps Extension 3×10-15

### Day 5: Pull B
- Romanian Deadlift 3×6-10
- Lat Pulldown (alt grip) 3×8-12
- One-Arm Dumbbell Row 3×8-12 each
- Rear Delt Fly 2×12-15
- Hammer Curl 3×10-12

### Day 6: Legs B + Zone 2
- Front Squat/Hack Squat/Leg Press 4×6-10
- Bulgarian Split Squat 3×8-12 each leg
- Leg Curl 3×10-15
- Standing Calf Raise 3×12-20
- Running (Zone 2 cardio) 1×12-20 min

### Day 7: Rest
- Light walking, mobility work, full recovery

## Progressive Overload Logic

The system analyzes your last 5 sessions for each exercise and provides:

- **Ready to Progress**: Averaging 10+ reps at current weight
  - Suggests +2.5kg for weights ≤20kg
  - Suggests +5kg for weights >20kg
  - Confidence: High (12+ reps) or Medium (10-11 reps)

- **Plateau**: Volume stable ±5%
  - Suggests same weight
  - Recommends focusing on adding reps

- **Declining**: Volume down >5%
  - Suggests 10% deload
  - Recommends form check and recovery

## Recovery Tracking Logic

**Base Recovery Times:**
- Chest: 48 hours
- Back: 72 hours
- Shoulders: 48 hours
- Biceps: 48 hours
- Triceps: 48 hours
- Legs: 72 hours
- Core: 24 hours

**Volume Adjustments:**
- 20+ sets: +24 hours
- 15-19 sets: +12 hours
- 10-14 sets: No adjustment
- <10 sets: -12 hours

**Status Indicators:**
- 100%+ recovered: "Good to go" (green)
- 80-99% recovered: "Ready to train" (green)
- 50-79% recovered: "Recovering" (yellow)
- <50% recovered: "Fatigued" (red)

## Nutrition Targets

**Default Values (Recomposition):**
- Calories: 2300-2400/day
- Protein: 160-190g/day
- Carbs: Moderate guidance (not strict)
- Fats: Moderate guidance (not strict)

**Customizable via Settings:**
- All targets can be adjusted
- Saved per user in CoachPlan table
- Updated via /coach/plan settings dialog

## Daily Checklist Targets

**Default Values:**
- Steps: 9000
- Water: 3.0 L
- Sleep: 7.5 hours
- Mobility: 10 minutes

**Completion Score:**
- 5 items tracked (4 checklist + workout)
- Score = (completed items / 5) × 100%
- Displayed as percentage

## Reminders System

**Functionality:**
- Checks at 7 PM daily (configurable)
- Uses browser Notification API
- Requires user permission
- Stores preference in localStorage
- Prevents duplicate notifications (once per day)

**Reminder Logic:**
```javascript
if (workout not started) {
  "Don't forget to log your workout!"
} else if (protein < 80% of target) {
  "You need Xg more protein today!"
} else {
  "Time to review your day!"
}
```

## Mobile Optimization

- **Responsive layouts** for all screen sizes
- **Touch-friendly** buttons and inputs (44px minimum)
- **Bottom navigation** integration
- **Pull-to-refresh** where applicable
- **Optimized charts** for mobile viewport
- **Stacked layouts** on small screens

## Dark Mode Support

- All new pages support dark mode
- Theme toggle in header
- Uses CSS variables for consistent theming
- Smooth transitions between modes

## Known Limitations

1. **Calendar Scheduling** - "Schedule 8 Weeks" button placeholder (manual workout creation works)
2. **Template Creation** - Coach templates not auto-created on plan enable (templates page lists them when they exist)
3. **Push Notifications** - Basic browser notifications only (no service worker for background)
4. **Meal Database** - No food search API (manual entry only)

## Future Enhancements

1. **Auto-scheduling** - Create planned workouts 4-8 weeks ahead
2. **Template generation** - Auto-create 6 Coach templates on plan enable
3. **PWA notifications** - Service worker for background reminders
4. **Food database** - Integration with nutrition API (MyFitnessPal, etc.)
5. **Form videos** - Exercise demonstration videos
6. **Superset support** - Combine exercises in workout view
7. **Rest timer auto-start** - Timer between sets
8. **Workout Party integration** - Train with Coach Plan in parties

## Troubleshooting

### Coach Plan Not Showing
- Verify you've enabled it via /coach/setup
- Check database for CoachPlan entry: `SELECT * FROM coach_plans WHERE "userId" = 'your-user-id'`
- Clear browser cache and reload

### Notifications Not Working
- Check browser notification permission
- Verify reminders are enabled in plan settings
- Test with "Test Notification" button
- Check browser console for errors

### Recovery Status Not Updating
- Complete a workout first
- Verify workout status is "completed"
- Check `/api/recovery` endpoint response
- Muscle recovery updates after workout completion

### Progressive Overload Not Showing
- Need at least 2 completed workouts for same exercise
- Check `/api/progression` endpoint response
- Suggestions only show for exercises in today's plan

## Contributing

When adding features:
1. Follow existing patterns (API routes, components, styling)
2. Use TypeScript for type safety
3. Add mobile-responsive layouts
4. Support dark mode
5. Update this documentation

## License

Part of FitTrack workout tracking application.
MIT License.

---

**Last Updated:** December 25, 2024
**Version:** 1.0.0
**Status:** Production Ready
