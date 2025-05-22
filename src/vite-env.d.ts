// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Все запросы, начинающиеся с /api, будут перенаправлены
      '/api': {
        target: 'http://localhost:8003', // Адрес твоего бэкенда
        changeOrigin: true,
        // Можно оставить secure: false, если у бэкенда самоподписанный SSL в разработке
        // rewrite: (path) => path.replace(/^\/api/, '') // Если бэкенд не ожидает /api после прокси
      }
    }
  }
})