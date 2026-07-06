import { test, expect } from '@playwright/test'

test('landing page renders with Enter Studio CTA', async ({ page }) => {
    await page.goto('/')
    // Navbar's button is display:none below the sm breakpoint; Hero's is always visible.
    await expect(
        page.getByRole('button', { name: 'Enter Studio' }).filter({ visible: true }).first()
    ).toBeVisible()
})

test('auth modal opens with Google and email sign-in', async ({ page }) => {
    await page.goto('/')
    await page
        .getByRole('button', { name: 'Enter Studio' })
        .filter({ visible: true })
        .first()
        .click()
    await expect(page.getByText('Welcome to Designature')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible()
    await expect(page.getByPlaceholder('Email address')).toBeVisible()
})

test('workspace page loads without crashing', async ({ page }) => {
    await page.goto('/workspace')
    await expect(page).toHaveURL(/\/workspace/)
    await expect(page.getByRole('heading', { name: /DESIGNATURE/ })).toBeVisible()
    await expect(page.locator('body')).not.toContainText('Application error')
})
