import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'


export default defineConfig({
  base: './',
  root: path.resolve(__dirname, 'example'),
  plugins: [
    react(),
  ],
  build: {
    outDir: path.resolve(__dirname, 'dist-example'),
  },
})
