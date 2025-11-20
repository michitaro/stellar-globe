import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['./tests/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    coverage: {
      reporter: ['html', 'text'],
      reportsDirectory: './coverage'
    },
  },
})
