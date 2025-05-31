import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Función para copiar los redirects al build
const copyRedirectsPlugin = () => {
  return {
    name: 'copy-redirects',
    writeBundle() {
      // Si existe _redirects, copiarlo al dist
      if (fs.existsSync('_redirects')) {
        fs.copyFileSync('_redirects', resolve('dist', '_redirects'));
      }
      
      // netlify.toml se copia automáticamente si está en la raíz
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyRedirectsPlugin()],
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
