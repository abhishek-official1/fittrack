# Coach Plan Implementation Status

## ✅ Completed (4 Commits)

### Commit 1: Database Schema
- ✅ Added `CoachPlan` model with user settings, rotation modes, nutrition/checklist targets
- ✅ Added `CoachPlanDay` model for 6-day PPL rotation
- ✅ Added `NutritionLog` model for meal tracking
- ✅ Added `DailyChecklist` model for habit tracking
- ✅ Database pushed successfully to Neon PostgreSQL

### Commit 2: Coach Plan Seed Data
- ✅ Created `prisma/seed-coach-plan.js` with 6 days of training data:
  - Day 1: Push A
  - Day 2: Pull A
  - Day 3: Legs A
  - Day 4: Push B
  - Day 5: Pull B
  - Day 6: Legs B + Zone 2
- ✅ Includes warmup protocols, exercise prescriptions, rep ranges, RPE targets, substitutions

### Commit 3: API Routes
- ✅ `/api/coach-plan` (GET, POST, PUT, DELETE) - Coach plan management
- ✅ `/api/coach-plan/today` (GET) - Daily brief with all data combined
- ✅ `/api/nutrition` (GET, POST) - Nutrition logging with date filtering
- ✅ `/api/nutrition/[id]` (PUT, DELETE) - Edit/delete nutrition logs
- ✅ `/api/checklist` (GET, POST, PUT) - Daily checklist tracking
- ✅ Integration with existing recovery (`/api/recovery`) and progression (`/api/progression`) APIs

### Commit 4: Today Page & Setup
- ✅ `/coach/today` page - Daily Brief UI showing:
  - Current day's workout plan
  - Recovery status integration
  - Progressive overload suggestions per exercise
  - Nutrition progress (calories & protein)
  - Daily checklist completion
  - One-tap "Start Workout" button
  - Warmup protocol display
  - Exercise substitutions
- ✅ `/coach/setup` page - Initial onboarding for Coach Plan
- ✅ Updated Header navigation with "Coach" link

---

## 🚧 Remaining Work

### Phase 5: Coach Plan Management Page
**File:** `src/app/coach/plan/page.tsx`

**Requirements:**
- Display all 6 days with full details (exercises, sets, reps, RPE)
- Edit plan settings (nutrition targets, checklist targets, reminder time)
- Toggle deload mode
- Change rotation mode (calendar-based vs next-workout)
- View which day is active
- Button to advance/skip days manually

### Phase 6: Calendar Scheduling
**File:** `src/app/api/coach-plan/schedule/route.ts` and UI component

**Requirements:**
- "Schedule Next 4-8 Weeks" button
- Create Planned workouts in calendar using rotation
- Handle rest days (day 7)
- Support two modes:
  - **Calendar-based:** Assign day index by date
  - **Next-workout:** Advance only when workout completed (recommended)

### Phase 7: Nutrition UI
**File:** `src/app/nutrition/page.tsx`

**Requirements:**
- Daily log form (meal name, time, calories, protein, carbs, fats)
- List today's meals with edit/delete
- Daily totals summary
- 7-day and 30-day trends view (line charts)
- Quick-add protein button
- Compliance indicators (on/off target)

### Phase 8: Templates Management Page
**File:** `src/app/templates/page.tsx`

**Requirements:**
- List all templates (system + custom + coach)
- View template details
- Edit custom templates
- Delete custom templates
- "Add Template" button
- Filter by category

### Phase 9: Reminders & Notifications
**Options:**

**A. PWA Push Notifications (Preferred):**
1. Add service worker with notification permission request
2. Create `/api/notifications/subscribe` endpoint
3. Store push subscription in database
4. Implement server-side push via web-push library
5. Schedule evening reminders (19:00 default)

**B. In-App Local Notifications (Fallback):**
1. Use browser Notification API with `localStorage` for scheduling
2. Check on page load if reminders needed
3. Show browser notifications
4. Add settings toggle in Coach Plan

**Implementation Guide:**
```typescript
// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  const permission = await Notification.requestPermission()
}

// Schedule reminder
if (Notification.permission === 'granted') {
  new Notification('FitTrack Reminder', {
    body: 'Time to log your workout and nutrition!',
    icon: '/icons/icon.svg'
  })
}
```

### Phase 10: Create Coach Templates in Database
When user enables Coach Plan, create 6 workout templates:
- Coach Push A
- Coach Pull A
- Coach Legs A
- Coach Push B
- Coach Pull B
- Coach Legs B

This allows users to start workouts from templates easily.

---

## 🧪 QA Checklist

### Setup & Configuration
- [ ] User can access `/coach/setup` when no plan exists
- [ ] Setup form accepts all user inputs (age, weight, height, targets)
- [ ] Creating plan redirects to `/coach/today`
- [ ] Default values are pre-filled (21 years, 90kg, 165cm, etc.)

### Today Page (/coach/today)
- [ ] Page loads without errors
- [ ] Shows correct day name (Push A, Pull A, etc.)
- [ ] Recovery status card displays with percentage
- [ ] Recovery status shows "Good to go" or "Consider lighter training"
- [ ] If muscles need rest, they are listed by name
- [ ] "Start Workout" button creates workout with correct exercises
- [ ] Clicking "Start Workout" redirects to `/workouts/[id]` in progress
- [ ] Warmup protocol displays with 3 sections (cardio, dynamic, ramp-up)
- [ ] All exercises display with sets, reps, rest, RPE
- [ ] Progressive overload badge shows for exercises with suggestions
- [ ] Substitutions are collapsible and show when clicked
- [ ] Nutrition card shows consumed vs targets
- [ ] Nutrition progress bars render correctly
- [ ] Daily checklist shows 4 items (steps, water, sleep, mobility)
- [ ] Completed checklist items show green border
- [ ] "View Full Plan" and "View Progress" links work

### API Endpoints
- [ ] `GET /api/coach-plan` returns user's plan or null
- [ ] `POST /api/coach-plan` creates plan with defaults
- [ ] `PUT /api/coach-plan` updates plan settings
- [ ] `DELETE /api/coach-plan` removes plan
- [ ] `GET /api/coach-plan/today` returns comprehensive daily data
- [ ] `GET /api/nutrition?date=YYYY-MM-DD` returns nutrition logs
- [ ] `POST /api/nutrition` creates new nutrition log
- [ ] `PUT /api/nutrition/[id]` updates existing log
- [ ] `DELETE /api/nutrition/[id]` removes log
- [ ] `GET /api/checklist?date=YYYY-MM-DD` returns daily checklist
- [ ] `POST /api/checklist` creates/updates checklist with completion score

### Integration Testing
- [ ] Recovery status pulls from existing `/api/recovery`
- [ ] Progressive overload suggestions pull from `/api/progression`
- [ ] Creating workout from Coach Plan includes all exercises
- [ ] Created workout sets have correct target reps and RPE
- [ ] Completing workout updates daily checklist `workoutCompleted`
- [ ] Header "Coach" link is visible and works
- [ ] Dark mode works on all new pages
- [ ] Mobile responsive on phones (< 768px)

### Data Integrity
- [ ] Coach plan days are numbered 1-6
- [ ] Each day has correct muscle groups
- [ ] Exercises match names in database (check seed warnings)
- [ ] Nutrition totals calculate correctly (sum of all meals)
- [ ] Checklist completion score is 0-100%
- [ ] User can only have one active coach plan

### Error Handling
- [ ] Accessing `/coach/today` without plan redirects to setup
- [ ] API returns proper error messages (401, 404, 500)
- [ ] Missing exercises show graceful fallback
- [ ] Failed workout creation shows error message

---

## 📝 Next Steps for Completion

### Step 1: Test Current Implementation
```bash
# Start development server
cd /teamspace/studios/this_studio/workout-tracker
npm run dev

# In browser:
# 1. Login or create account
# 2. Navigate to /coach/setup
# 3. Fill form and enable coach plan
# 4. Verify redirect to /coach/today
# 5. Check all data displays correctly
# 6. Click "Start Workout" and verify workout creation
```

### Step 2: Fix Exercise Name Mismatches
The seed script showed warnings for:
- "Chest-Supported Row" → Check if exists or replace with "Chest Supported Row"
- "Incline Barbell Press" → Replace with "Incline Barbell Bench Press"
- "Overhead Triceps Extension" → Replace with "Overhead Cable Triceps Extension"
- "Incline Treadmill Walk" → Add cardio exercise or use "Running"

Update `prisma/seed-coach-plan.js` with correct names and re-seed if needed.

### Step 3: Implement Nutrition UI (High Priority)
```bash
# Create nutrition page
touch src/app/nutrition/page.tsx
```

**Key Components Needed:**
1. Nutrition log form
2. Today's meals list
3. Daily totals card
4. Trends chart (7/30 days)
5. Quick-add protein button

### Step 4: Implement Coach Plan Management Page
```bash
# Create plan management page
touch src/app/coach/plan/page.tsx
```

**Features:**
1. Display all 6 days in tabs or accordion
2. Settings panel (nutrition, checklist, reminders)
3. Current day indicator
4. Deload mode toggle
5. Manual day advance button

### Step 5: Add Calendar Scheduling
```bash
# Create scheduling endpoint
touch src/app/api/coach-plan/schedule/route.ts
```

**Logic:**
1. Take start date + number of weeks
2. Loop through days creating Planned workouts
3. Respect rotation mode
4. Handle rest day (day 7)

### Step 6: Implement Templates Page
```bash
touch src/app/templates/page.tsx
```

Reuse API endpoint `/api/templates` which already exists.

### Step 7: Add Reminders
Choose between PWA push notifications or in-app notifications based on complexity preference.

---

## 🔧 Helpful Commands

```bash
# Install dependencies
npm install

# Database operations
npm run db:push          # Push schema changes
npm run db:generate      # Regenerate Prisma client
npm run db:seed          # Seed default data
npm run db:studio        # Open Prisma Studio

# Development
npm run dev              # Start dev server on :3000
npm run build            # Production build
npm run lint             # Check for linting errors

# Testing
npm run test             # Run tests (if configured)
```

---

## 📚 Key Files Reference

**Database:**
- `prisma/schema.prisma` - Database schema
- `prisma/seed-coach-plan.js` - Coach plan data

**API:**
- `src/app/api/coach-plan/route.ts` - CRUD operations
- `src/app/api/coach-plan/today/route.ts` - Daily brief
- `src/app/api/nutrition/route.ts` - Nutrition logging
- `src/app/api/checklist/route.ts` - Daily checklist

**Pages:**
- `src/app/coach/today/page.tsx` - Daily brief UI
- `src/app/coach/setup/page.tsx` - Onboarding
- `src/components/layout/Header.tsx` - Navigation

**Libraries:**
- `src/lib/recovery.ts` - Recovery calculations
- `src/lib/progressive-overload.ts` - Progression analysis
- `src/lib/auth.ts` - Authentication utilities

---

## 🎯 Success Criteria

The Coach Plan feature is complete when:
1. ✅ User can enable Coach Plan via setup page
2. ✅ Today page displays daily plan, recovery, nutrition, checklist
3. ✅ One-tap workout start creates workout from plan
4. ✅ Recovery status integrates with existing system
5. ✅ Progressive overload suggestions appear per exercise
6. ⏳ Nutrition UI allows daily logging and tracking
7. ⏳ Plan management page allows editing settings
8. ⏳ Calendar scheduling creates planned workouts
9. ⏳ Templates page shows all templates
10. ⏳ Reminders notify user in evening

---

## 💡 Tips

- Use existing components from `src/components/ui/` for consistency
- Follow existing patterns in `src/app/dashboard/page.tsx` for layout
- Reuse recovery card from `src/components/recovery/MuscleRecoveryCard.tsx`
- Check `src/lib/utils.ts` for formatting helpers
- Test on mobile viewport (Chrome DevTools)
- Dark mode should work automatically with existing theme provider

---

## 🐛 Known Issues

1. Some exercise names don't match database - need to update seed script
2. No template creation when enabling coach plan - need to add
3. No way to advance to next day after completing workout - need logic
4. Nutrition UI completely missing - needs implementation
5. No reminders system - needs implementation

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs (`npm run dev` output)
3. Verify database connection in `.env` file
4. Run `npm run db:studio` to inspect database
5. Check Prisma logs for query errors

---

**Last Updated:** December 25, 2024
**Implementation Status:** 60% Complete (Core features done, UI enhancements pending)
