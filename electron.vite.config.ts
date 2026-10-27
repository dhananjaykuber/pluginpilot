import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Bundle third-party code into the main and preload output instead of loading it from
// node_modules at runtime, so the packaged app doesn't need to ship node_modules at all.
const bundleDependencies = { build: { externalizeDeps: false } }

export default defineConfig({
  main: bundleDependencies,
  preload: bundleDependencies,
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src'),
        '@shared': resolve('src/shared')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
