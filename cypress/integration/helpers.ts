import type * as Library from '@/index';

export type DistLibrary = typeof Library;

/**
 * Path of the built entry point, relative to this file.
 */
const distEntry = '../../dist/index.js';

export const CONTAINER_HEIGHT = 800;
export const CONTAINER_WIDTH = 700;
export const CONTAINER_STYLE = {
  height: CONTAINER_HEIGHT,
  width: CONTAINER_WIDTH,
};

/**
 * Loads the built library so that it is kept between tests.
 */
export const loadDist = (
  options: { fresh?: boolean } = {},
): Cypress.Chainable<DistLibrary> => {
  const specifier =
    options.fresh === true
      ? `${distEntry}?fresh=${String(Date.now())}`
      : distEntry;
  return cy.wrap(
    (import(/* @vite-ignore */ specifier) as Promise<DistLibrary>).catch(
      (error: unknown) => {
        throw new Error(
          `Could not load dist/index.js, run "pnpm build" first. ${String(error)}`,
        );
      },
    ),
  );
};

/**
 * Used to prove that a lazy chunk is only
 * downloaded once the feature that needs it is used.
 */
export const loadedResources = (
  win: Cypress.AUTWindow,
  fragment: string,
): string[] =>
  win.performance
    .getEntriesByType('resource')
    .map((entry) => entry.name)
    .filter((name) => name.includes(fragment));

/** Reads the natural dimensions of a data URL or object URL image. */
export const imageDimensions = async (
  source: string,
): Promise<{ width: number; height: number }> =>
  await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = (): void => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = (): void => {
      reject(new Error('Image could not be decoded'));
    };
    image.src = source;
  });
