import { defineConfig } from 'cypress'
import { defineConfig as defineViteConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  viewportWidth: 1500,
  viewportHeight: 900,
  video: false,
  screenshotOnRunFailure: false,

  retries: {
    runMode: 3,
    openMode: 0,
  },

  component: {
    setupNodeEvents(on, config) {},
    specPattern: 'cypress/integration/**/*.spec.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: defineViteConfig({
        plugins: [tsconfigPaths(), reactRefresh()],
        base: './cypress',

        // ? do I need this?
        resolve: {
          alias: {
            '@': '/src',
          },
        },
      }),
    },
  },
})
