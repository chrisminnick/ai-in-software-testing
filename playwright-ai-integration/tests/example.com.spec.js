import { test, expect } from '@playwright/test';

test('Go to httpbin.org/forms/post, fill in the customer name field with John Doe, and submit the form', async ({
  page,
}) => {
  await page.goto('http://httpbin.org/forms/post');
  await page.fill('input[name="custname"]', 'John Doe');
  await page.click('input[type="submit"]');
});
