import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['./tests/**/*.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['html'],
      reportsDirectory: './coverage'
    },
  },
})
