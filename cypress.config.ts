import { defineConfig } from 'cypress'
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
