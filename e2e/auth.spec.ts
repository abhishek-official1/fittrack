import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.describe('Sign Up', () => {
    test('should display signup form correctly', async ({ page }) => {
      await page.goto('/auth/signup')
      
      await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()
      await expect(page.getByLabel(/name/i)).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/^password$/i)).toBeVisible()
      await expect(page.getByLabel(/confirm password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
    })

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/auth/signup')
      
      await page.getByRole('button', { name: /create account/i }).click()
      
      // HTML5 validation should prevent submission
      const nameInput = page.getByLabel(/name/i)
      await expect(nameInput).toHaveAttribute('required')
    })

    test('should show error for password mismatch', async ({ page }) => {
      await page.goto('/auth/signup')
      
      await page.getByLabel(/name/i).fill('Test User')
      await page.getByLabel(/email/i).fill('test@example.com')
      await page.getByLabel(/^password$/i).fill('Password123')
      await page.getByLabel(/confirm password/i).fill('DifferentPassword123')
      
      await page.getByRole('button', { name: /create account/i }).click()
      
      await expect(page.getByText(/passwords don't match/i)).toBeVisible()
    })

    test('should successfully register new user', async ({ page }) => {
      await page.goto('/auth/signup')
      
      const uniqueEmail = `test${Date.now()}@example.com`
      
      await page.getByLabel(/name/i).fill('Test User')
      await page.getByLabel(/email/i).fill(uniqueEmail)
      await page.getByLabel(/^password$/i).fill('Password123')
      await page.getByLabel(/confirm password/i).fill('Password123')
      
      await page.getByRole('button', { name: /create account/i }).click()
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    })

    test('should show error for duplicate email', async ({ page }) => {
      // First, create a user
      await page.goto('/auth/signup')
      const email = `duplicate${Date.now()}@example.com`
      
      await page.getByLabel(/name/i).fill('Test User')
      await page.getByLabel(/email/i).fill(email)
      await page.getByLabel(/^password$/i).fill('Password123')
      await page.getByLabel(/confirm password/i).fill('Password123')
      await page.getByRole('button', { name: /create account/i }).click()
      
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
      
      // Logout
      await page.goto('/auth/signup')
      
      // Try to register with same email
      await page.getByLabel(/name/i).fill('Test User 2')
      await page.getByLabel(/email/i).fill(email)
      await page.getByLabel(/^password$/i).fill('Password123')
      await page.getByLabel(/confirm password/i).fill('Password123')
      await page.getByRole('button', { name: /create account/i }).click()
      
      await expect(page.getByText(/email already registered/i)).toBeVisible()
    })

    test('should navigate to login page', async ({ page }) => {
      await page.goto('/auth/signup')
      
      await page.getByRole('link', { name: /sign in/i }).click()
      
      await expect(page).toHaveURL('/auth/login')
    })
  })

  test.describe('Login', () => {
    test('should display login form correctly', async ({ page }) => {
      await page.goto('/auth/login')
      
      await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/login')
      
      await page.getByLabel(/email/i).fill('nonexistent@example.com')
      await page.getByLabel(/password/i).fill('WrongPassword123')
      
      await page.getByRole('button', { name: /sign in/i }).click()
      
      await expect(page.getByText(/invalid email or password/i)).toBeVisible()
    })

    test('should successfully login existing user', async ({ page }) => {
      // First create a user
      const email = `login${Date.now()}@example.com`
      const password = 'Password123'
      
      await page.goto('/auth/signup')
      await page.getByLabel(/name/i).fill('Login Test')
      await page.getByLabel(/email/i).fill(email)
      await page.getByLabel(/^password$/i).fill(password)
      await page.getByLabel(/confirm password/i).fill(password)
      await page.getByRole('button', { name: /create account/i }).click()
      
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
      
      // Logout by clearing cookies and going to login
      await page.context().clearCookies()
      await page.goto('/auth/login')
      
      // Now login
      await page.getByLabel(/email/i).fill(email)
      await page.getByLabel(/password/i).fill(password)
      await page.getByRole('button', { name: /sign in/i }).click()
      
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    })

    test('should navigate to signup page', async ({ page }) => {
      await page.goto('/auth/login')
      
      await page.getByRole('link', { name: /sign up/i }).click()
      
      await expect(page).toHaveURL('/auth/signup')
    })
  })

  test.describe('Logout', () => {
    test('should successfully logout user', async ({ page }) => {
      // Create and login user
      const email = `logout${Date.now()}@example.com`
      
      await page.goto('/auth/signup')
      await page.getByLabel(/name/i).fill('Logout Test')
      await page.getByLabel(/email/i).fill(email)
      await page.getByLabel(/^password$/i).fill('Password123')
      await page.getByLabel(/confirm password/i).fill('Password123')
      await page.getByRole('button', { name: /create account/i }).click()
      
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
      
      // Click logout button
      await page.getByRole('button', { name: /logout/i }).click()
      
      // Should redirect to login
      await expect(page).toHaveURL('/auth/login', { timeout: 10000 })
    })
  })

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated user from dashboard', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Should redirect to login
      await expect(page).toHaveURL('/auth/login', { timeout: 10000 })
    })

    test('should redirect unauthenticated user from workouts', async ({ page }) => {
      await page.goto('/workouts')
      
      await expect(page).toHaveURL('/auth/login', { timeout: 10000 })
    })

    test('should redirect unauthenticated user from exercises', async ({ page }) => {
      await page.goto('/exercises')
      
      await expect(page).toHaveURL('/auth/login', { timeout: 10000 })
    })
  })
})
