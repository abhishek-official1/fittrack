# Prompt: Generate Comprehensive Project Documentation

## Objective

Create a detailed `PROJECT.md` file that serves as the single source of truth for the FitTrack workout tracker application. This documentation should enable any developer (human or AI) to understand, run, modify, and extend the project without additional context.

---

## Instructions

Analyze the entire codebase and generate documentation covering ALL of the following sections:

---

## 1. Project Overview

- **Name**: Project name and tagline
- **Description**: 2-3 paragraph summary of what the app does
- **Live URL**: Production deployment URL
- **Repository**: GitHub repository URL
- **Tech Stack Summary**: One-line summary (e.g., "Next.js 14 + PostgreSQL + Prisma + Tailwind CSS")
- **Status**: Current development status (MVP, Beta, Production, etc.)

---

## 2. Features List

Create a comprehensive feature inventory organized by category:

### 2.1 Core Features
- List each feature with a brief description
- Mark completion status: ✅ Implemented | 🚧 In Progress | 📋 Planned

### 2.2 User Authentication
- Authentication methods supported
- Session management approach

### 2.3 Workout Tracking
- Workout creation and logging capabilities
- Exercise library features
- Set/rep tracking mechanisms

### 2.4 Analytics & Progress
- Charts and visualizations available
- Personal records tracking
- Progress metrics

### 2.5 Gamification
- Achievement system details
- XP and leveling mechanics
- Streak tracking

### 2.6 Social Features
- Follow system
- Likes and comments
- Leaderboards
- Feed functionality

### 2.7 Smart Features
- Muscle recovery tracking
- Progressive overload suggestions
- Workout recommendations

### 2.8 Mobile & PWA
- Responsive design details
- PWA capabilities
- Offline support

---

## 3. Technology Stack

### 3.1 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| (List all frontend dependencies with versions and purposes)

### 3.2 Backend
| Technology | Version | Purpose |
|------------|---------|---------|

### 3.3 Database
| Technology | Version | Purpose |
|------------|---------|---------|

### 3.4 Infrastructure
| Service | Purpose | Tier |
|---------|---------|------|
| (List hosting, database hosting, CDN, etc.)

### 3.5 Development Tools
| Tool | Purpose |
|------|---------|

---

## 4. Project Structure

```
workout-tracker/
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma       # (describe what models exist)
│   └── seed.ts             # (describe what data is seeded)
├── public/                 # Static assets
│   ├── icons/              # (PWA icons)
│   └── manifest.json       # (PWA manifest)
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── api/            # API routes (list all endpoints)
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Main dashboard
│   │   └── ...             # (list all page routes)
│   ├── components/         # React components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   ├── layout/         # Layout components
│   │   ├── gamification/   # Achievement, level, streak components
│   │   ├── recovery/       # Muscle recovery components
│   │   ├── progression/    # Progressive overload components
│   │   └── workout/        # Workout-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── prisma.ts       # Database client
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── achievements.ts # Achievement logic
│   │   ├── recovery.ts     # Recovery calculations
│   │   └── ...
│   ├── styles/             # Global styles
│   └── types/              # TypeScript type definitions
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
└── ...config files
```

For each directory, provide:
- Purpose of the directory
- Key files and their responsibilities
- Any patterns or conventions used

---

## 5. Database Schema

### 5.1 Entity Relationship Diagram
(Describe or provide ASCII diagram of table relationships)

### 5.2 Models
For each Prisma model, document:
- **Model Name**
- **Purpose**: What this model represents
- **Key Fields**: List important fields with types
- **Relations**: How it connects to other models
- **Indexes**: Any indexes defined

Models to document:
- User
- UserProfile
- UserStats
- Workout
- WorkoutExercise
- ExerciseSet
- Exercise
- WorkoutTemplate
- TemplateExercise
- PersonalRecord
- Achievement
- UserAchievement
- Follow
- WorkoutLike
- WorkoutComment
- MuscleRecovery
- NutritionLog

---

## 6. API Reference

### 6.1 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/signup | Create new account | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/auth/logout | Logout user | Yes |
| GET | /api/auth/me | Get current user | Yes |

### 6.2 Workout Endpoints
(Document all workout-related endpoints)

### 6.3 Exercise Endpoints
(Document all exercise-related endpoints)

### 6.4 Analytics Endpoints
(Document analytics endpoints)

### 6.5 Social Endpoints
(Document feed, follow, like, comment endpoints)

### 6.6 Gamification Endpoints
(Document achievement, stats, leaderboard endpoints)

### 6.7 Export Endpoints
(Document data export endpoints)

For each endpoint, provide:
- HTTP Method
- URL Path
- Description
- Request Body (if applicable)
- Response Format
- Error Codes
- Example Request/Response

---

## 7. Environment Variables

```bash
# Database
DATABASE_URL=                # PostgreSQL connection string (required)

# Authentication
JWT_SECRET=                  # Secret for JWT signing (required)
JWT_EXPIRES_IN=              # Token expiration (default: "7d")

# Application
NEXT_PUBLIC_APP_URL=         # Public app URL
NODE_ENV=                    # development | production

# Optional Services
# (list any optional integrations)
```

For each variable:
- Name
- Required/Optional
- Description
- Example value format
- Where to obtain (for third-party services)

---

## 8. Getting Started

### 8.1 Prerequisites
- Node.js version required
- npm/yarn/pnpm version
- PostgreSQL or Neon account
- Any other requirements

### 8.2 Installation Steps
```bash
# Step-by-step commands to get the project running locally
```

### 8.3 Database Setup
```bash
# Commands for database initialization
```

### 8.4 Running the Application
```bash
# Development server
# Production build
# Other scripts
```

### 8.5 Running Tests
```bash
# Test commands
```

---

## 9. Deployment

### 9.1 Vercel Deployment
- Step-by-step deployment guide
- Environment variables to configure
- Build settings

### 9.2 Database Setup (Neon)
- Account creation
- Database provisioning
- Connection string configuration

### 9.3 Post-Deployment
- Database seeding in production
- Verification steps

---

## 10. Architecture Decisions

### 10.1 Why Next.js App Router?
- Rationale for choosing this architecture

### 10.2 Why PostgreSQL over SQLite?
- Scalability considerations

### 10.3 Why Prisma?
- ORM choice rationale

### 10.4 Authentication Approach
- Why JWT cookies vs other methods

### 10.5 State Management
- How state is managed (React state, context, etc.)

### 10.6 Styling Approach
- Tailwind CSS + shadcn/ui rationale

---

## 11. Key Algorithms & Business Logic

### 11.1 Achievement System
- How achievements are checked and unlocked
- XP calculation formula
- Level progression formula

### 11.2 Muscle Recovery Calculation
- Recovery time algorithm
- Factors affecting recovery

### 11.3 Progressive Overload Detection
- How trends are analyzed
- Weight increase suggestions logic

### 11.4 Leaderboard Ranking
- How rankings are calculated
- Time period filtering

### 11.5 One Rep Max Calculation
- Formula used (Epley, Brzycki, etc.)

---

## 12. Component Library

### 12.1 Base UI Components (shadcn/ui)
List all UI components with:
- Component name
- Props accepted
- Usage example

### 12.2 Custom Components
Document custom components:
- Purpose
- Props
- Dependencies
- Example usage

---

## 13. Hooks Reference

For each custom hook:
- **Name**: useHookName
- **Purpose**: What it does
- **Parameters**: Input parameters
- **Returns**: What it returns
- **Example Usage**: Code snippet

---

## 14. Type Definitions

Document key TypeScript interfaces and types:
- User types
- Workout types
- API response types
- Component prop types

---

## 15. Testing Strategy

### 15.1 Unit Tests
- What is tested
- Testing framework used
- How to run

### 15.2 Integration Tests
- API testing approach
- Database testing

### 15.3 E2E Tests
- Playwright configuration
- Key user flows tested

---

## 16. Performance Considerations

### 16.1 Database Optimization
- Indexes used
- Query optimization

### 16.2 Frontend Optimization
- Code splitting
- Image optimization
- Lazy loading

### 16.3 Caching Strategy
- What is cached
- Cache invalidation

---

## 17. Security Measures

### 17.1 Authentication Security
- Password hashing (bcrypt)
- JWT security
- Session management

### 17.2 API Security
- Input validation
- Rate limiting (if any)
- CORS configuration

### 17.3 Data Protection
- Sensitive data handling
- Environment variable management

---

## 18. Known Limitations & Future Improvements

### 18.1 Current Limitations
- List known limitations or technical debt

### 18.2 Planned Features
- Features in the roadmap

### 18.3 Potential Improvements
- Performance improvements
- UX improvements
- Architecture improvements

---

## 19. Contributing Guidelines

### 19.1 Code Style
- ESLint configuration
- Prettier configuration
- Naming conventions

### 19.2 Git Workflow
- Branch naming
- Commit message format
- PR process

### 19.3 Adding New Features
- Where to add new components
- Where to add new API routes
- Database migration process

---

## 20. Troubleshooting

### 20.1 Common Issues
| Issue | Cause | Solution |
|-------|-------|----------|
| (List common problems developers might encounter)

### 20.2 Debug Tips
- How to debug API routes
- How to inspect database
- Useful logging

---

## 21. Changelog

### Version History
- v1.0.0 - Initial release
- (Track major changes)

---

## 22. License & Credits

- License type
- Third-party libraries acknowledgments
- Contributors

---

## Output Format Requirements

1. Use proper Markdown formatting
2. Include a table of contents with anchor links
3. Use code blocks with language hints (```typescript, ```bash, etc.)
4. Use tables for structured data
5. Include emoji status indicators where appropriate
6. Keep descriptions concise but complete
7. Include real values from the codebase (not placeholders)
8. Total length: Aim for 2000-4000 lines for comprehensive coverage

---

## Additional Instructions

1. **Be Accurate**: Only document what actually exists in the codebase
2. **Be Current**: Reflect the current state, not planned features (unless marked)
3. **Be Practical**: Include real examples that work
4. **Be Organized**: Use consistent formatting throughout
5. **Be Complete**: Don't skip sections; mark as "N/A" if not applicable

---

*Use this prompt to generate comprehensive documentation that serves as the definitive reference for the FitTrack project.*
