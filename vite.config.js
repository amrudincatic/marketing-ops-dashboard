import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is set for GitHub Pages project sites. Override at build time with
// VITE_BASE if the repo name differs.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/marketing-ops-dashboard/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
