// vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React ecosystem - always needed
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Framer Motion - only needed for animated pages
          'framer': ['framer-motion'],
          
          // Recharts - only needed for pricing calculator
          'recharts': ['recharts'],
          
          // Embla carousel - only needed for ServicesShowcase
          'embla': ['embla-carousel-react'],
        },
      },
    },
  },
})
