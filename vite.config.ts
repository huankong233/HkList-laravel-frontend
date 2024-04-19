import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     // 生产环境时移除console
    //     drop_console: true,
    //     drop_debugger: true
    //   }
    // }
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js', // 产生的 chunk 自定义命名
        entryFileNames: 'assets/js/[name]-[hash].js', // 指定 chunks 的入口文件匹配模式
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]' // 自定义构建结果中的静态资源名称，资源文件像 字体，图片等
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
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
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
