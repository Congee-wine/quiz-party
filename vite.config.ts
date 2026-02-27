import { defineConfig } from 'vite'
import path from 'path'

import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/quizzo/',

  plugins: [
    vue(),
    checker({
      typescript: true,
      vueTsc: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      // devOptions: { enabled: true },
      workbox: { globPatterns: ['**/*'] },
      includeAssets: ['**/*'],
      manifest: {
        id: '/quizzo/',
        name: 'Quizzo',
        short_name: 'Quizzo',
        description: 'The ultimate quiz app for entertainment!',
        theme_color: '#e5383b',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
