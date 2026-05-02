import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { createTsconfigAlias } from './vite.alias'


export default defineConfig({
  base: './',
  root: resolve(__dirname, 'demo'),
  resolve: {
    alias: createTsconfigAlias(),
  },
  build: {
    outDir: resolve(__dirname, 'dist-demo'),
  },
})
