import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

// 自动扫描 apps 目录下的所有应用
function getApps() {
  const appsDir = resolve(__dirname, 'apps')
  const appDirs = fs.readdirSync(appsDir).filter(file => {
    return fs.statSync(resolve(appsDir, file)).isDirectory()
  })

  const inputs = {
    main: resolve(__dirname, 'index.html'),
  }

  appDirs.forEach(app => {
    inputs[app] = resolve(appsDir, app, 'index.html')
  })

  return inputs
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@shared': resolve(__dirname, 'shared'),
      '@apps': resolve(__dirname, 'apps'),
    }
  },
  build: {
    rollupOptions: {
      input: getApps(),
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    }
  },
  // 相对路径配置，适配所有部署环境
  base: './',
})
