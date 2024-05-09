import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js', // 产生的 chunk 自定义命名
        entryFileNames: 'assets/js/[name]-[hash].js', // 指定 chunks 的入口文件匹配模式
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]' // 自定义构建结果中的静态资源名称, 资源文件像 字体, 图片等
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dirs: ['public'],
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/94list-laravel/public',
        changeOrigin: true
      }
    }
  }
})
