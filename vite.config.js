import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Configuración de proxy mejorada
      '/gs/': {
        target: 'https://script.google.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/gs/, ''),
        configure: (proxy, options) => {
          // Opciones adicionales para resolver problemas de DNS
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending request to:', proxyReq.path);
          });
        }
      }
    }
  }
});
