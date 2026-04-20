// vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React ecosystem - always needed
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Embla carousel - only needed for ServicesShowcase
          'embla': ['embla-carousel-react'],
        },
      },
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'e2e/', 'tests/', 'scripts/', 'dist/'],
    },
  },
}))
