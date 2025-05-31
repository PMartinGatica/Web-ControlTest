import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Plugin para asegurarse que el _redirects se incluya en el build
const copyRedirectsPlugin = () => {
  return {
    name: 'copy-redirects',
    closeBundle() {
      // Esta función se ejecuta cuando el build está completo
      const redirectsContent = '/gs/*   https://script.google.com/:splat   200';
      writeFileSync(resolve(__dirname, 'dist', '_redirects'), redirectsContent);
      console.log('✅ Archivo _redirects generado correctamente');
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
