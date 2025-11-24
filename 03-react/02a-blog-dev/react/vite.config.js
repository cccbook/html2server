import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 當前端呼叫 /list, /post 時，自動轉發到後端 8000 port
      '/list': 'http://127.0.0.1:8000',
      '/post': 'http://127.0.0.1:8000',
    }
  }
})