import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';  // Adjust if not React

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // Local dev proxy to backend
    }
  }
});