import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'


export default defineConfig({
  base: './',
  root: path.resolve(__dirname, 'examples'),
  plugins: [
    react(),
  ],
  build: {
    outDir: path.resolve(__dirname, 'dist-examples'),
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'examples/index.html'),
        basicUsage: path.resolve(__dirname, 'examples/BasicUsage/index.html'),
      },
    },
  },
})
