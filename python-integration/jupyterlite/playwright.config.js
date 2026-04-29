import { defineConfig } from '@playwright/test'

const port = process.env.PORT ?? '8000'
const rawBaseURL = process.env.JUPYTERLITE_E2E_BASE_URL ?? `http://127.0.0.1:${port}/`
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`
const captureSuccessScreenshots = process.env.JUPYTERLITE_E2E_SUCCESS_SCREENSHOTS === '1'
const reporter = process.env.JUPYTERLITE_E2E_HTML_REPORT === '1'
  ? [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ]
  : [['list']]

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  outputDir: './test-results',
  reporter,
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 2 * 60 * 1000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: captureSuccessScreenshots ? 'on' : 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: [
            '--use-gl=swiftshader',
            '--enable-webgl',
            '--ignore-gpu-blocklist',
            '--disable-dev-shm-usage',
            '--no-sandbox',
          ],
        },
      },
    },
  ],
})
