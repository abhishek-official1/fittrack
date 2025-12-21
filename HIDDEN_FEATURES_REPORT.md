# Hidden Features Analysis Report

**Date:** 2025-12-21
**Analyzer:** Droid (Factory.ai)

---

## 1. Executive Summary

A comprehensive scan of the API routes (`src/app/api`) versus the User Interface components (`Header.tsx`, `BottomNav.tsx`) reveals several "Hidden Features". These are functional backend endpoints that have **no direct link or button** in the main navigation dashboard, effectively making them invisible to the average user unless they know the specific URL.

---

## 2. Hidden Features Identified

The following features have robust backend support but are **missing from the Header/BottomNav**:

### 🛡️ High Risk (Security/Admin)
*   **Export Data** (`/api/export`):
    *   **Status:** Hidden.
    *   **Function:** Allows users to export their entire data history.
    *   **Risk:** Users cannot exercise their GDPR/Data Portability rights easily.

### 🧪 Experimental / Beta
*   **PR Predictions** (`/api/pr-predictions`):
    *   **Status:** Hidden.
    *   **Function:** AI/Algo-driven prediction of personal records.
    *   **State:** Likely a "Shadow Feature" meant for future release.

*   **Year in Review** (`/api/year-review`):
    *   **Status:** Hidden.
    *   **Function:** Spotify Wrapped-style summary.
    *   **State:** Seasonal feature, currently dormant in UI.

### 🍽️ Core Domain (Missing UI)
*   **Nutrition Tracking** (`/api/nutrition`):
    *   **Status:** Hidden.
    *   **Function:** Logging meals and macros.
    *   **Gap:** API exists, but no "Nutrition" tab in the dashboard.

*   **Templates** (`/api/templates`):
    *   **Status:** Hidden (Partial).
    *   **Function:** Creating workout routines.
    *   **Gap:** "Start Workout" exists, but a dedicated "Manage Templates" page is missing from the main nav.

*   **Feed** (`/api/feed`):
    *   **Status:** Hidden.
    *   **Function:** Social feed of friends' workouts.
    *   **Gap:** No "Social" or "Feed" icon in the navigation.

---

## 3. Exposed vs Hidden Map

| Feature | Backend API | Frontend Link | Status |
| :--- | :--- | :--- | :--- |
| **Dashboard** | `/api/user/stats` | Header `BarChart3` | ✅ Exposed |
| **Workouts** | `/api/workouts` | Header `Dumbbell` | ✅ Exposed |
| **Guilds** | `/api/guilds` | Header `Shield` | ✅ Exposed |
| **Rankings** | `/api/exercise-leaderboards` | Header `Medal` | ✅ Exposed |
| **Party** | `/api/workout-parties` | Header `PartyPopper` | ✅ Exposed |
| **Achievements** | `/api/achievements` | Header `Trophy` | ✅ Exposed |
| **Nutrition** | `/api/nutrition` | **NONE** | ❌ **HIDDEN** |
| **Social Feed** | `/api/feed` | **NONE** | ❌ **HIDDEN** |
| **Templates** | `/api/templates` | **NONE** | ❌ **HIDDEN** |
| **PR Predictions**| `/api/pr-predictions` | **NONE** | ❌ **HIDDEN** |
| **Data Export** | `/api/export` | **NONE** | ❌ **HIDDEN** |

---

## 4. Recommendation

1.  **For Admin:** Decide if "Nutrition" and "Social Feed" should be launched. If so, add them to `Header.tsx`.
2.  **For Developers:** The `PR Predictions` and `Year in Review` endpoints should probably remain hidden behind feature flags if they are not ready for prime time.
3.  **For Compliance:** The `Export Data` feature should be exposed in the **Profile Settings** page immediately.
