import { test, expect } from '@playwright/test'

test('صفحه ورود در دسترس است', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('body')).toBeVisible()
})

test('صفحه پست‌ها لود می‌شود', async ({ page }) => {
  await page.goto('/posts')
  await expect(page.locator('body')).toBeVisible()
})
