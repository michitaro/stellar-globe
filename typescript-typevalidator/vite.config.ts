import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

export default defineConfig({
  plugins: [
    ...VitePluginNode({
      adapter: 'express', // I don't use express, but some value is required
      appPath: './src/cli.ts',
    })
  ],
})
