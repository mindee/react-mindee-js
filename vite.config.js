import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), reactRefresh()],
  base: './cypress',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
