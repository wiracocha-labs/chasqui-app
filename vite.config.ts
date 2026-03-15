import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env variables from the frontend directory
  const env = loadEnv(mode, path.resolve(process.cwd(), './frontend'), '')

  // Require env var for target proxy to ensure it's explicitly configured
  const proxyTarget = env.VITE_PROXY_TARGET
  if (!proxyTarget) {
    throw new Error('VITE_PROXY_TARGET is not defined. Please set it in your environment variables.')
  }

  const wsTarget = proxyTarget.replace(/^http/, 'ws')

  return {
    plugins: [vue(), tailwindcss()],
    root: './frontend',
    publicDir: 'public',
    build: {
      outDir: '../dist',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './frontend/src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          ws: true
        },
        '/ws': {
          target: wsTarget,
          ws: true
        }
      }
    }
  }
})