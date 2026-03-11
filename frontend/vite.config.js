import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy /api requests to the Spring Boot backend during development.
    // This avoids CORS issues in the browser — requests appear same-origin.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path  // no rewrite — /api stays as /api
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
