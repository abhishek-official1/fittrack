import { test, expect, Page } from '@playwright/test'

// Helper function to login
async function loginUser(page: Page) {
  const email = `workout${Date.now()}@example.com`
  
  await page.goto('/auth/signup')
  await page.getByLabel(/name/i).fill('Workout Test')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/^password$/i).fill('Password123')
  await page.getByLabel(/confirm password/i).fill('Password123')
  await page.getByRole('button', { name: /create account/i }).click()
  
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
}

test.describe('Workouts', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page)
  })

  test.describe('Workout List', () => {
    test('should display workouts page correctly', async ({ page }) => {
      await page.goto('/workouts')
      
      await expect(page.getByRole('heading', { name: /workouts/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /new workout/i })).toBeVisible()
    })

    test('should show empty state when no workouts', async ({ page }) => {
      await page.goto('/workouts')
      
      await expect(page.getByText(/no workouts yet/i)).toBeVisible()
    })
  })

  test.describe('Create Workout', () => {
    test('should display new workout form', async ({ page }) => {
      await page.goto('/workouts/new')
      
      await expect(page.getByRole('heading', { name: /new workout/i })).toBeVisible()
      await expect(page.getByLabel(/workout name/i)).toBeVisible()
      await expect(page.getByLabel(/date/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /add exercise/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /save workout/i })).toBeVisible()
    })

    test('should open exercise dialog when clicking add exercise', async ({ page }) => {
      await page.goto('/workouts/new')
      
      await page.getByRole('button', { name: /add exercise/i }).click()
      
      await expect(page.getByRole('dialog')).toBeVisible()
      await expect(page.getByPlaceholder(/search exercises/i)).toBeVisible()
    })

    test('should add exercise to workout', async ({ page }) => {
      await page.goto('/workouts/new')
      
      await page.getByRole('button', { name: /add exercise/i }).click()
      
      // Search for an exercise
      await page.getByPlaceholder(/search exercises/i).fill('Bench')
      
      // Click on the first exercise result
      await page.getByText(/barbell bench press/i).first().click()
      
      // Exercise should be added to the workout
      await expect(page.getByText(/barbell bench press/i)).toBeVisible()
    })

    test('should add and remove sets', async ({ page }) => {
      await page.goto('/workouts/new')
      
      // Add an exercise
      await page.getByRole('button', { name: /add exercise/i }).click()
      await page.getByPlaceholder(/search exercises/i).fill('Squat')
      await page.getByText(/barbell squat/i).first().click()
      
      // Should have 1 set by default
      await expect(page.getByText(/^1$/)).toBeVisible()
      
      // Add another set
      await page.getByRole('button', { name: /add set/i }).click()
      
      // Should now have 2 sets
      await expect(page.getByText(/^2$/)).toBeVisible()
    })

    test('should create workout successfully', async ({ page }) => {
      await page.goto('/workouts/new')
      
      // Set workout name
      await page.getByLabel(/workout name/i).fill('Test Workout')
      
      // Add an exercise
      await page.getByRole('button', { name: /add exercise/i }).click()
      await page.getByPlaceholder(/search exercises/i).fill('Bench')
      await page.getByText(/barbell bench press/i).first().click()
      
      // Fill in set details
      await page.locator('input[placeholder="Reps"]').first().fill('10')
      await page.locator('input[placeholder="kg"]').first().fill('60')
      
      // Save workout
      await page.getByRole('button', { name: /save workout/i }).click()
      
      // Should redirect to workout detail page
      await expect(page).toHaveURL(/\/workouts\//, { timeout: 10000 })
    })

    test('should show validation error when saving without exercises', async ({ page }) => {
      await page.goto('/workouts/new')
      
      await page.getByRole('button', { name: /save workout/i }).click()
      
      // Should show error toast
      await expect(page.getByText(/add at least one exercise/i)).toBeVisible()
    })
  })

  test.describe('Workout Detail', () => {
    test('should display workout details', async ({ page }) => {
      // First create a workout
      await page.goto('/workouts/new')
      await page.getByLabel(/workout name/i).fill('Detail Test Workout')
      await page.getByRole('button', { name: /add exercise/i }).click()
      await page.getByPlaceholder(/search exercises/i).fill('Deadlift')
      await page.getByText(/deadlift/i).first().click()
      await page.getByRole('button', { name: /save workout/i }).click()
      
      await expect(page).toHaveURL(/\/workouts\//, { timeout: 10000 })
      
      // Check workout detail page
      await expect(page.getByText(/detail test workout/i)).toBeVisible()
      await expect(page.getByText(/deadlift/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /start workout/i })).toBeVisible()
    })

    test('should start workout and show timer', async ({ page }) => {
      // Create a workout
      await page.goto('/workouts/new')
      await page.getByLabel(/workout name/i).fill('Timer Test')
      await page.getByRole('button', { name: /add exercise/i }).click()
      await page.getByPlaceholder(/search exercises/i).fill('Pull')
      await page.getByText(/pull-ups/i).first().click()
      await page.getByRole('button', { name: /save workout/i }).click()
      
      await expect(page).toHaveURL(/\/workouts\//, { timeout: 10000 })
      
      // Start workout
      await page.getByRole('button', { name: /start workout/i }).click()
      
      // Timer should be visible
      await expect(page.getByText(/00:0/)).toBeVisible()
      
      // Status should change to in_progress
      await expect(page.getByText(/in progress/i)).toBeVisible()
    })

    test('should complete a set and show rest timer', async ({ page }) => {
      // Create a workout
      await page.goto('/workouts/new')
      await page.getByLabel(/workout name/i).fill('Set Test')
      await page.getByRole('button', { name: /add exercise/i }).click()
      await page.getByPlaceholder(/search exercises/i).fill('Curl')
      await page.getByText(/barbell curl/i).first().click()
      await page.getByRole('button', { name: /save workout/i }).click()
      
      await expect(page).toHaveURL(/\/workouts\//, { timeout: 10000 })
      
      // Start workout
      await page.getByRole('button', { name: /start workout/i }).click()
      
      // Fill in reps
      await page.locator('input[type="number"]').first().fill('10')
      
      // Complete the set (click check button)
      await page.getByRole('button').filter({ has: page.locator('svg.lucide-check') }).first().click()
      
      // Rest timer should appear
      await expect(page.getByText(/rest/i)).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('Delete Workout', () => {
    test('should delete workout from list', async ({ page }) => {
      // Create a workout
      await page.goto('/workouts/new')
      await page.getByLabel(/workout name/i).fill('Delete Test')
      await page.getByRole('button', { name: /add exercise/i }).click()
      await page.getByPlaceholder(/search exercises/i).fill('Squat')
      await page.getByText(/barbell squat/i).first().click()
      await page.getByRole('button', { name: /save workout/i }).click()
      
      await expect(page).toHaveURL(/\/workouts\//, { timeout: 10000 })
      
      // Go to workouts list
      await page.goto('/workouts')
      
      // Click menu button and delete
      await page.getByRole('button').filter({ has: page.locator('svg.lucide-more-vertical') }).first().click()
      
      // Handle confirmation dialog
      page.on('dialog', dialog => dialog.accept())
      
      await page.getByRole('menuitem', { name: /delete/i }).click()
      
      // Workout should be removed - check for success toast or empty state
      await expect(page.getByText(/workout deleted/i)).toBeVisible({ timeout: 5000 })
    })
  })
})
