import { defineConfig } from '@playwright/test'

const port = process.env.PORT ?? '8000'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 2 * 60 * 1000,
  },
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
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
