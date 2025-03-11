import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['https://guaranteed-conferencing-scanner-referral.trycloudflare.com'],
    host: true, // Ensures Vite binds to all network interfaces
    port: 5173, // Change if necessary
  }
  
})
