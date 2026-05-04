import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5193,
    proxy: {
      '/v1': {
        target: 'http://localhost:8201',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8201',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setupTests.js',
  },
})
