import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CRITICAL for Daytona preview:
// - host 0.0.0.0 so it's reachable from outside the sandbox
// - allow all hosts (Daytona's preview proxy uses arbitrary subdomains)
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      // HMR through Daytona's WebSocket proxy
      clientPort: 443,
      protocol: 'wss',
    },
  },
})
