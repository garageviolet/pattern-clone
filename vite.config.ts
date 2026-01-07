import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // Proxy API requests to bypass CORS restrictions
    proxy: {
      '/api': {
        target: 'https://pattern.swarma.org',
        changeOrigin: true,
        secure: false,
      },
      // WordPress API proxy for swarma.org content
      '/swarma_org_proxy': {
        target: 'https://pattern.swarma.org',
        changeOrigin: true,
        secure: false,
      },
      // api.swarma.org proxy for learn_paths
      '/swarma_api': {
        target: 'https://api.swarma.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/swarma_api/, '/api'),
      },
    },
  },
})
