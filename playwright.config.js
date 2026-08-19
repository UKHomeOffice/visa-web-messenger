const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const port = Number(process.env.PLAYWRIGHT_PORT || 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;
const testDir = defineBddConfig({
  features: 'e2e-bdd/features/**/*.feature',
  steps: 'e2e-bdd/steps/**/*.js',
  outputDir: '.features-gen'
});

module.exports = defineConfig({
  testDir,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  timeout: 180_000,
  expect: {
    timeout: 15_000
  },
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
      command: 'yarn dev',
      port,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
  projects: [
    {
      name: 'chromium',
      grepInvert: /@history/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'chromium-history',
      grep: /@history/,
      fullyParallel: false,
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
