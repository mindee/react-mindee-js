import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin';
import { defineConfig } from 'cypress';
import { defineConfig as defineViteConfig } from 'vite';

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

      addMatchImageSnapshotPlugin(on);

      return config;
    },
    specPattern: 'src/**/*.spec.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: defineViteConfig({
        assetsInclude: ['**/*.tiff', '**/*.heic'],
        resolve: { tsconfigPaths: true },
      }),
    },
  },
});
