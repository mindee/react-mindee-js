import type * as Library from '@/index';

export type DistLibrary = typeof Library;

/**
 * Path of the built entry point, relative to this file. It is kept in a
 * variable so that neither tsc nor Vite resolve it ahead of time: the
 * integration suite must stay type-checkable without a prior build, and the
 * browser must receive the production chunks exactly as Rolldown emitted them.
 */
const distEntry = '../../dist/index.js';

export const CONTAINER_HEIGHT = 800;
export const CONTAINER_WIDTH = 700;
export const CONTAINER_STYLE = {
  height: CONTAINER_HEIGHT,
  width: CONTAINER_WIDTH,
};

/**
 * Imports the built library (dist/) at runtime, as a consumer would, so that
 * production-only behaviour such as lazy chunks and the inlined pdf.js worker
 * is exercised rather than the TypeScript sources.
 *
 * Cypress keeps the same window for every test of a spec file, so module-level
 * state inside dist/index.js (such as the memoised pdf.js worker) survives
 * between tests. Pass `fresh: true` to cache-bust the entry point and get a
 * brand new module instance when a test asserts on first-use behaviour.
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
 * Names of the network resources fetched so far by the test window whose URL
 * contains the given fragment. Used to prove that a lazy chunk is only
 * downloaded once the feature that needs it is used.
 *
 * Resource entries accumulate for the whole spec file, so the "not yet
 * loaded" assertion is only meaningful if no earlier test in the same file
 * used the feature.
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
