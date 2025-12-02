import { test, expect } from '@playwright/test';

const TEST_LEAD_ID = 'TEST_LEAD_ID';
const DRAFT_KEY = `quote:draft:${TEST_LEAD_ID}:installer-id`;

// Helper to read meta from localStorage
async function readMeta(page) {
  return await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw).meta; } catch { return null; }
  }, DRAFT_KEY);
}

// Navigate before each test
test.beforeEach(async ({ page }) => {
  await page.goto('/test/quote-builder');
  await expect(page.getByRole('heading', { name: /Bid Builder|Quote Builder/i })).toBeVisible();
});

test('Import workflow stamps metadata & STC zone', async ({ page }) => {
  const importBtn = page.getByRole('button', { name: /Import from Instant Quote/i });
  await expect(importBtn).toBeVisible();
  await importBtn.click();
  await expect(page.getByRole('heading', { name: /Import from Instant Quote/i })).toBeVisible();
  const acceptBtn = page.getByRole('button', { name: /Accept & Import/i });
  // Should be enabled (changes detected)
  await expect(acceptBtn).toBeEnabled();
  await acceptBtn.click();
  // After accept modal should close
  await expect(page.getByRole('heading', { name: /Import from Instant Quote/i })).toHaveCount(0);
  const meta = await readMeta(page);
  expect(meta).toBeTruthy();
  expect(meta?.importedAt).toBeTruthy();
  expect(meta?.importSource).toBe('instant-quote');
  expect(meta?.prefilledFields).toContain('pricing.stc.zone');
});

test('STC postcode caption appears', async ({ page }) => {
  // Ensure import executed
  const meta = await readMeta(page);
  if (!meta?.importedAt) {
    await page.getByRole('button', { name: /Import from Instant Quote/i }).click();
    await page.getByRole('button', { name: /Accept & Import/i }).click();
  }
  const caption = page.getByText(/Auto-detected from homeowner postcode/i);
  await expect(caption).toBeVisible();
});

test('Roof tooltips show guidance text (hover + focus)', async ({ page }) => {
  // Orientation tooltip
  const orientationInfo = page.locator('label:has-text("Array Orientations")').locator('..').getByRole('img').first();
  await orientationInfo.hover();
  await expect(page.getByText(/North-facing panels typically generate 100% efficiency/i)).toBeVisible();
  await orientationInfo.focus();
  await expect(page.getByText(/80-95% efficiency/i)).toBeVisible();

  // Pitch tooltip
  const pitchInfo = page.locator('label:has-text("Roof Pitch")').locator('..').getByRole('img').first();
  await pitchInfo.hover();
  await expect(page.getByText(/Optimal pitch.*20-30°/i)).toBeVisible();

  // Shading tooltip
  const shadingInfo = page.locator('label:has-text("Shading Level")').locator('..').getByRole('img').first();
  await shadingInfo.hover();
  await expect(page.getByText(/Minimal: <10% shading/i)).toBeVisible();
});

test('Prefilled captions appear under imported fields', async ({ page }) => {
  const meta = await readMeta(page);
  if (!meta?.importedAt) {
    await page.getByRole('button', { name: /Import from Instant Quote/i }).click();
    await page.getByRole('button', { name: /Accept & Import/i }).click();
  }
  const captionMatcher = /Prefilled from homeowner Instant Quote/i;
  // Check a sample of expected fields
  await expect(page.getByText(captionMatcher).nth(0)).toBeVisible();
});

test('Budget hint banner appears and dismisses', async ({ page }) => {
  // Import first to ensure sizing applied
  const meta = await readMeta(page);
  if (!meta?.importedAt) {
    await page.getByRole('button', { name: /Import from Instant Quote/i }).click();
    await page.getByRole('button', { name: /Accept & Import/i }).click();
  }
  const banner = page.getByText(/Current total exceeds homeowner budget/i);
  await expect(banner).toBeVisible();
  // Dismiss if button exists
  const dismissBtn = page.getByRole('button', { name: /Dismiss/i });
  if (await dismissBtn.isVisible()) {
    await dismissBtn.click();
    await expect(banner).toHaveCount(0);
  }
});

// Smoke test to ensure no console errors
test('No console errors during core interactions', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.getByRole('button', { name: /Import from Instant Quote/i }).click();
  await page.getByRole('button', { name: /Accept & Import/i }).click();
  expect(errors).toEqual([]);
});
