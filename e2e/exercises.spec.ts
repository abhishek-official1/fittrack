import { test, expect, Page } from '@playwright/test'

async function loginUser(page: Page) {
  const email = `exercise${Date.now()}@example.com`
  
  await page.goto('/auth/signup')
  await page.getByLabel(/name/i).fill('Exercise Test')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/^password$/i).fill('Password123')
  await page.getByLabel(/confirm password/i).fill('Password123')
  await page.getByRole('button', { name: /create account/i }).click()
  
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
}

test.describe('Exercises', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page)
  })

  test.describe('Exercise Library', () => {
    test('should display exercise library', async ({ page }) => {
      await page.goto('/exercises')
      
      await expect(page.getByRole('heading', { name: /exercise library/i })).toBeVisible()
      await expect(page.getByPlaceholder(/search exercises/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /add exercise/i })).toBeVisible()
    })

    test('should display pre-seeded exercises', async ({ page }) => {
      await page.goto('/exercises')
      
      // Should have exercises grouped by muscle group
      await expect(page.getByText(/barbell bench press/i)).toBeVisible({ timeout: 10000 })
      await expect(page.getByText(/barbell squat/i)).toBeVisible()
    })

    test('should filter exercises by search', async ({ page }) => {
      await page.goto('/exercises')
      
      await page.getByPlaceholder(/search exercises/i).fill('bench')
      
      // Should show bench press exercises
      await expect(page.getByText(/barbell bench press/i)).toBeVisible()
      await expect(page.getByText(/close grip bench press/i)).toBeVisible()
      
      // Should not show unrelated exercises
      await expect(page.getByText(/barbell squat/i)).not.toBeVisible()
    })

    test('should filter exercises by muscle group', async ({ page }) => {
      await page.goto('/exercises')
      
      // Click muscle group filter
      await page.getByRole('combobox').filter({ hasText: /all muscles/i }).click()
      await page.getByRole('option', { name: /chest/i }).click()
      
      // Should only show chest exercises
      await expect(page.getByText(/barbell bench press/i)).toBeVisible()
      
      // Back exercises should not be visible
      await expect(page.getByText(/deadlift/i)).not.toBeVisible()
    })

    test('should filter exercises by category', async ({ page }) => {
      await page.goto('/exercises')
      
      // Click category filter
      await page.getByRole('combobox').filter({ hasText: /all categories/i }).click()
      await page.getByRole('option', { name: /compound/i }).click()
      
      // Should show compound exercises
      await expect(page.getByText(/barbell squat/i)).toBeVisible()
      await expect(page.getByText(/deadlift/i)).toBeVisible()
    })

    test('should reset filters when selecting "all"', async ({ page }) => {
      await page.goto('/exercises')
      
      // Apply filter
      await page.getByRole('combobox').filter({ hasText: /all muscles/i }).click()
      await page.getByRole('option', { name: /chest/i }).click()
      
      // Reset filter
      await page.getByRole('combobox').filter({ hasText: /chest/i }).click()
      await page.getByRole('option', { name: /all muscles/i }).click()
      
      // All exercises should be visible again
      await expect(page.getByText(/barbell squat/i)).toBeVisible()
      await expect(page.getByText(/barbell bench press/i)).toBeVisible()
    })
  })

  test.describe('Create Custom Exercise', () => {
    test('should open create exercise dialog', async ({ page }) => {
      await page.goto('/exercises')
      
      await page.getByRole('button', { name: /add exercise/i }).click()
      
      await expect(page.getByRole('dialog')).toBeVisible()
      await expect(page.getByText(/create custom exercise/i)).toBeVisible()
    })

    test('should create custom exercise successfully', async ({ page }) => {
      await page.goto('/exercises')
      
      await page.getByRole('button', { name: /add exercise/i }).click()
      
      // Fill in form
      await page.getByLabel(/exercise name/i).fill('My Custom Exercise')
      
      // Select muscle group
      await page.locator('[role="dialog"]').getByRole('combobox').filter({ hasText: /select/i }).first().click()
      await page.getByRole('option', { name: /chest/i }).click()
      
      // Select category
      await page.locator('[role="dialog"]').getByRole('combobox').filter({ hasText: /select/i }).first().click()
      await page.getByRole('option', { name: /isolation/i }).click()
      
      // Submit
      await page.getByRole('button', { name: /create exercise/i }).click()
      
      // Exercise should appear in list
      await expect(page.getByText(/my custom exercise/i)).toBeVisible({ timeout: 10000 })
    })

    test('should show validation error for missing required fields', async ({ page }) => {
      await page.goto('/exercises')
      
      await page.getByRole('button', { name: /add exercise/i }).click()
      
      // Try to submit without filling required fields
      await page.getByRole('button', { name: /create exercise/i }).click()
      
      // Should show error
      await expect(page.getByText(/please fill in required fields/i)).toBeVisible()
    })
  })

  test.describe('Delete Custom Exercise', () => {
    test('should delete custom exercise', async ({ page }) => {
      await page.goto('/exercises')
      
      // First create an exercise
      await page.getByRole('button', { name: /add exercise/i }).click()
      await page.getByLabel(/exercise name/i).fill('To Delete Exercise')
      await page.locator('[role="dialog"]').getByRole('combobox').filter({ hasText: /select/i }).first().click()
      await page.getByRole('option', { name: /back/i }).click()
      await page.locator('[role="dialog"]').getByRole('combobox').filter({ hasText: /select/i }).first().click()
      await page.getByRole('option', { name: /compound/i }).click()
      await page.getByRole('button', { name: /create exercise/i }).click()
      
      await expect(page.getByText(/to delete exercise/i)).toBeVisible({ timeout: 10000 })
      
      // Handle confirmation dialog
      page.on('dialog', dialog => dialog.accept())
      
      // Delete the exercise (find the card with the exercise and click delete)
      const card = page.locator('text=To Delete Exercise').locator('..')
      await card.getByRole('button').filter({ has: page.locator('svg.lucide-trash-2') }).click()
      
      // Should show success message
      await expect(page.getByText(/exercise deleted/i)).toBeVisible({ timeout: 5000 })
    })

    test('should not show delete button for system exercises', async ({ page }) => {
      await page.goto('/exercises')
      
      // Find a system exercise card (like Barbell Bench Press)
      const exerciseCard = page.getByText(/barbell bench press/i).first().locator('..').locator('..')
      
      // Should not have delete button
      await expect(exerciseCard.getByRole('button').filter({ has: page.locator('svg.lucide-trash-2') })).not.toBeVisible()
    })
  })
})
