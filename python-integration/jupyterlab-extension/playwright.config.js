const { defineConfig } = require('@playwright/test')

const rawBaseURL = process.env.JUPYTERLAB_SMOKE_BASE_URL ?? 'http://127.0.0.1:8888'
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`
const captureSuccessScreenshots = process.env.JUPYTERLAB_SMOKE_SUCCESS_SCREENSHOTS === '1'
const reporter = process.env.JUPYTERLAB_SMOKE_HTML_REPORT === '1'
  ? [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ]
  : [['list']]

module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['jupyterlab.smoke.spec.js'],
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
