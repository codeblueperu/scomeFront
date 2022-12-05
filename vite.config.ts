import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from 'path'

const resolvePath = (dir: string) => {
  return path.resolve(__dirname, 'src', dir)
}

export default defineConfig({
  root: "./",
  base: "/",
  publicDir: "public",
  build: {
    outDir: "scomefatperu",
    assetsDir: "assets"
  },
  plugins: [
    vue({
      template: { 
        transformAssetUrls
      }
    }),
    quasar({
      sassVariables: 'src/assets/quasar-main.sass'
    })
  ],
  resolve:{
    alias:{
      assets: resolvePath('assets'),
      storage:resolvePath('storage'),
      components: resolvePath('components'),
      interceptors: resolvePath('interceptors'),
      interfaces: resolvePath('interfaces'),
      modules: resolvePath('modules'),
      services: resolvePath('services'),
      '@' : path.resolve(__dirname, './src')
    }
  }
})
