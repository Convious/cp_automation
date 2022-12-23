import { test, expect, Page } from '@playwright/test';

const { slug, discount_pool, discount_page, discount_code, codes_tab } = process.env;

// delay is needed for order change as otherwise it throws an error
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

test.beforeEach(async ({ page }) => {
 await page.goto('/');
});
 
test.describe('Control Panel', () => {

    test('Create Discount Code Pool', async ({ page }) => {

      // Expand the client select drop-down
      await page.locator('.fa-chevron-down').nth(0).click();

      // Click text=text=Convious Marketing | Demo Check-Out
      await page.locator(slug).first().click();

      // Click Orders
      await page.locator('nav >> text=Venue').first().click();

      // Click nav >> text=Orders
      await page.locator('nav >> text=Codes').first().click();

      // Create new discount pool
      await page.getByRole('link', { name: 'Discount codes' }).click()
      await page.getByRole('button', { name: 'Add new' }).click()
      await page.getByLabel('Pool name').fill(discount_pool)
      await page.getByRole('button', { name: 'Add new pool' }).click()
      await page.getByRole('button', { name: 'Cancel' }).first().click()

      // Without the delay the clicks are performed too fast and the pool is not deleted
      await delay(1500)

      // TODO need to look for a better solution to delete the added pool
      await page.locator('.sc-eEVmNe > .sc-dFRpbK').first().click()

      // Without the delay the clicks are performed too fast and the pool is not deleted
      await delay(1000)

      await page.getByRole('button', { name: 'Delete' }).first().click()

      // Giving some time for the delete task to complete as closing too fast causes the record to not be deleted
      await delay(1000)
        
    });

    test('Add and check discount code', async ({ page }) => {
  
      // go to the Discount pools page
      await page.goto(discount_page)

      // Add a new discount code
      await page.getByRole('button', { name: '+ Add Codes' }).first().click()
      await page.getByPlaceholder('Give your codes a name').fill(discount_code)
      await page.getByLabel('Reduction-%€').fill('15')
      await page.locator('form').getByRole('button', { name: 'Add Codes' }).click()

      // go to the Codes tab
      await page.goto(codes_tab)

      // search for the added discount code and check it's attributes
      await page.getByPlaceholder('Search').fill(discount_code)
      await expect(page.getByText(discount_code)).toBeVisible()
      await expect(page.getByRole('cell', { name: 'Cart' })).toBeVisible()
      await expect(page.getByRole('cell', { name: 'Valid' })).toBeVisible()
      await expect(page.getByRole('cell', { name: 'Unlimited' })).toBeVisible()
      await expect(page.getByRole('cell', { name: '15%' })).toBeVisible()
        
    });
  });