const { test, expect } = require('@playwright/test');

test.describe('Student Join Request Journeys', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Student should be able to submit a join request for a sport', async ({ page }) => {
        // Navigate to Sports Page
        await page.click('text=Sports');
        await expect(page).toHaveURL(/.*sports/);
        
        // Find a sport card and click join
        const joinButton = page.locator('button:has-text("Join Now")').first();
        await joinButton.click();
        
        // Fill out the join form
        await page.fill('[placeholder="John Doe"]', 'Test Student');
        await page.fill('[placeholder="IT21000000"]', 'IT21999999');
        await page.locator('form select').nth(0).selectOption('IT');
        await page.fill('[placeholder="List any previous experience or skills..."]', 'Played basketball in high school.');
        await page.fill('[placeholder="e.g. Regular player, Casual member"]', 'Regular Player');
        
        // Submit
        await page.click('button:has-text("Submit Application")');
        
        // Success alert check (Playwright handles dialogs automatically but we can wait for hidden modal)
        await expect(page.locator('text=Join Sport Request Form')).toBeHidden();
    });

    test('Student should be able to submit a membership request for a club', async ({ page }) => {
        // Navigate to Clubs Page
        await page.click('text=Clubs');
        await expect(page).toHaveURL(/.*clubs/);
        
        // Find a club card and click join
        const joinButton = page.locator('button:has-text("Join Club")').first();
        await joinButton.click();
        
        // Fill out the join form
        await page.fill('[placeholder="Jane Doe"]', 'Test Student');
        await page.fill('[placeholder="IT21000000"]', 'IT21999999');
        await page.locator('form select').nth(0).selectOption('Computing');
        await page.locator('form select').nth(1).selectOption('2nd year');
        
        // Submit
        await page.click('button:has-text("Submit Membership Request")');
        
        // Success check
        await expect(page.locator('text=Join Club Application')).toBeHidden();
    });
});
