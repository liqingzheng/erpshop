import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { compression } from 'vite-plugin-compression2'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProdLike = mode === 'prod' || mode === 'uat'

  return {
    plugins: [
      react(),
      isProdLike &&
        compression({
          algorithms: ['gzip', 'brotliCompress'],
          exclude: [/\.(br)$/, /\.(gz)$/],
        }),
      isProdLike &&
        visualizer({
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: `dist-${env.VITE_APP_ENV || mode}/stats.html`,
        }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      target: 'es2015',
      outDir: `dist-${env.VITE_APP_ENV || mode}`,
      sourcemap: !isProdLike,
      cssCodeSplit: true,
      assetsInlineLimit: 8192,
      reportCompressedSize: false,
      minify: 'terser',
      terserOptions: isProdLike
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          }
        : {},
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (/react|react-dom|react-router-dom/.test(id)) return 'vendor-react'
              if (/antd|@ant-design/.test(id)) return 'vendor-antd'
              if (/echarts/.test(id)) return 'vendor-charts'
              if (/axios|dayjs|clsx|zustand/.test(id)) return 'vendor-utils'
              return 'vendor-others'
            }
          },
        },
      },
      chunkSizeWarningLimit: 1500,
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE),
    },
  }
})
