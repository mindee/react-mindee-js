---
sidebar_position: 5
---

# Migration

## From v1.x to v2.0

### Requirements

- `Node.js >= 22.13` to build. The published package targets modern browsers and is compatible with React 18 and 19.
- The package is ESM only. pdf.js and the HEIC decoder are loaded lazily as separate chunks, so your bundler must support dynamic `import()` (every mainstream bundler does).

### `zoom.max` is now relative to the fitted image

Previously `options.zoom.max` was compared against the absolute canvas scale, so the reachable magnification depended on the pixel size of the image. It is now a factor relative to the image **fitted in the container** (`1` = fits). If you relied on the old behaviour, lower large values (a `max` of `10` now means "ten times the fitted size").

### PDF helpers

| v1                                           | v2                                                                                                                         |
|:---------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------|
| `getImagesFromPDF(url)` renders every page   | **Deprecated.** Use [usePDFDocument](/docs/Utils/use-pdf-document) or [openPDF](/docs/Utils/open-pdf) to render on demand  |
| `getImagesFromPDF(url, maxPages, onSuccess)` | Still supported, now also accepts a `File`/`Blob`/`ArrayBuffer` and a trailing `resolution`                                |
| `getPDFPageCount(url)`                       | Unchanged, also accepts a `File`/`Blob`/`ArrayBuffer`                                                                      |
| URL string required                          | Any `PDFSource`; `URL.createObjectURL()` is no longer needed for a `File`                                                  |
| Pages returned as base64 data URLs           | New APIs return `blob:` object URLs by default (lighter, revoked on `destroy()`); pass `{ output: 'data-url' }` for base64 |

### Image formats

- HEIC/HEIF files are now detected by every HEIF MIME type (`image/heic`, `image/heif` and their `-sequence` variants); previously only `image/heic` was converted.
- The HEIC decoder (`heic2any`) is loaded lazily, only when such a file is displayed.

### Removed

- `loadPdfDocument` (internal pdf.js loader) is no longer exported. Use `openPDF`.

## From v1.2 to v1.3

> Version 1.3 API becomes simpler. Here is the changes :

| Version 1.2                         |                 Version 1.3                 | description                                                                                                                                                                                                   |
| :---------------------------------- | :-----------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image`, `orientation` and `shapes` | `data` : {`image`, `orientation`, `shapes`} | The 3 main props has been placed inside **data** props to keep the canvas state consistent between outer state changes. This update was necessary to avoid some performance issues noticed on some use cases. |
| `styles`                            |                   `style`                   |                                                                                                                                                                                                               |
