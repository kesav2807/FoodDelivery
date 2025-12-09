import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5017,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://fooddelivery-1-nxvg.onrender.com',
        changeOrigin: true
      }
    }
  }
});
