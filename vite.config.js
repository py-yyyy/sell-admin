import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 

export default defineConfig({
  plugins: [react(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  base: '/sell-admin/',
  // server: {
  //   port: 5173, // 你的本地端口
  //   proxy: {
  //     '/users': {
  //       target: 'http://8.137.157.16:9002',
  //       changeOrigin: true,
  //       rewrite: (path) => path
  //     }
  //   }
  // }
})