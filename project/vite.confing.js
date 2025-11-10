import { defineConfig } from 'vite';
// Add your plugins (e.g., react)

export default defineConfig({
  // ... plugins
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Local backend port
        changeOrigin: true,
      },
    },
  },
});