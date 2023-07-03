import { defineConfig } from 'cypress'
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin'
import { defineConfig as defineViteConfig } from 'vite'

import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  viewportWidth: 1500,
  viewportHeight: 900,
  video: false,
  retries: {
    runMode: 3,
    openMode: 0,
  },

  component: {
    setupNodeEvents(on, config) {
      //   if (config.testingType === 'component')
      //     on('dev-server:start', async (options) => startDevServer({ options }))

      addMatchImageSnapshotPlugin(on, config)

      return config
    },
    specPattern: 'src/**/*.spec.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: defineViteConfig({
        plugins: [tsconfigPaths()],
      }),
    },
  },
})
