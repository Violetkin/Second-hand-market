import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Use '.' instead of process.cwd() to resolve the environment directory.
  // This avoids the TypeScript error: Property 'cwd' does not exist on type 'Process'.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // This is necessary to make process.env.API_KEY work in the browser for the SDK
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})