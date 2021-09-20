import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path = require('path');

function resolve (dir) {
  return path.join(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    fs: {

      allow: ['.']
    }
  },
  resolve: {
    alias: {
      "@": resolve("src"),
    }
  },
  plugins: [vue()],
  
})