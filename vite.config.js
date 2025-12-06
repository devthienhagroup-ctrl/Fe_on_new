import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    global: 'window', // ✅ FIX SockJS global undefined
  },
  esbuild: {
    drop: ["console", "debugger"],
  },

})

