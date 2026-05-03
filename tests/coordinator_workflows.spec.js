const { test, expect } = require('@playwright/test');

test.describe('Coordinator Access & Workflow Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Sport Coordinator should be able to login and see management buttons', async ({ page }) => {
        // Find Login button in sidebar
        await page.click('text=Coordinator Login');
        
        // Fill credentials
        await page.selectOption('select', 'Sport');
        await page.fill('input[placeholder="Enter password"]', 'sport123');
        await page.click('button:has-text("Sign In")');
        
        // Wait for redirect
        await expect(page).toHaveURL(/\/sports/);
        
        // Check for Dashboard tab - this confirms the coordinator mode is active
        await expect(page.locator('button:has-text("Dashboard")')).toBeVisible({ timeout: 10000 });
        
        // Check if management buttons are visible
        await expect(page.locator('button:has-text("Add Sport")')).toBeVisible();
        await expect(page.locator('button:has-text("Update")').first()).toBeVisible();
        
        // Ensure 'Join Now' is NOT visible for coordinators
        await expect(page.locator('button:has-text("Join Now")')).not.toBeVisible();
    });

    test('Club Coordinator should be able to login and see management buttons', async ({ page }) => {
        // Coordinator Login
        await page.click('text=Coordinator Login');
        await page.selectOption('select', 'Club');
        await page.fill('input[placeholder="Enter password"]', 'club123');
        await page.click('button:has-text("Sign In")');
        
        // Wait for redirect
        await expect(page).toHaveURL(/\/clubs/);
        
        // Check for Dashboard tab
        await expect(page.locator('button:has-text("Dashboard")')).toBeVisible({ timeout: 10000 });
        
        // Check buttons
        await expect(page.locator('button:has-text("Add Club")')).toBeVisible();
        await expect(page.locator('button:has-text("Update")').first()).toBeVisible();
        
        // Ensure 'Join Club' is NOT visible for coordinators
        await expect(page.locator('button:has-text("Join Club")')).not.toBeVisible();
    });
});
