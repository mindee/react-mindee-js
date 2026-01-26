# CHANGELOG

## v1.6.8 (26/01/2026)

### Changes

- bump the supported React to v19

## v1.6.7 (25/06/2025)

### Changes

- bump the supported React to v18

## v1.6.6 (31/03/2025)

### Changes

- :children_crossing: updated to support dragging on shapes in annotation viewer

## v1.6.5 (16/10/2023)

### Changes

- :arrow_down: downgrade pdfjs-dist to support older browser versions

## v1.6.4 (15/10/2023)

### Changes

- remove beta tag

## v1.6.3 (15/10/2023)

### Changes

- use legacy build of pdfjs-dist

## v1.6.2 (10/10/2023)

### Changes

- :arrow_up: update pdfjs-dist to v4.10.38

## v1.6.1 (10/10/2023)

### Changes

- 🔇 remove console.log

## v1.6.0 (05/10/2023)

### Changes

- 🔨 disable cache when fetching annotation image

## v1.5.1 (05/09/2023)

### New

- ✨ Add support to HEIC and TIFF formats

## v1.4.0 (31/07/2023)

### New

- :construction_worker: add lint & publish workflow with GA

### Changes

- :wrench: move to vite
- :white_check_mark: improve test coverage
- :arrow_up: update typescript, react and cypress
- :wrench: migrate from yarn to pnpm
- :white_check_mark: rework tests
- :label: remove unnecessary any types
- :wrench: update eslint and prettier configs

## v1.3.9 (19/08/2022)

### Fixes

- 🐛 handle getImagesFromPDF exceptions

## v1.3.8 (20/07/2022)

### Fixes

- 🐛 :bug: fix multi-selection behavior

## v1.3.7 (12/05/2022)

### Fixes

- 🐛 rework getImagesFromPDF function to filter rejected pages

## v1.3.4 (22/04/2022)

### New

- :page_facing_up: change license to MIT

## v1.3.3 (04/04/2022)

### New

- ✨ add dynamic zoom

### Fixes

- 🐛 add image cross origin header

## v1.3.2 (06/01/2022)

### New

- ✨ add toBase64 utility function

### Changes

chg: 🚸 AnnotationViewer - add OS X support to multi selection event key

## v1.3.0 (07/09/2021)

### Changes

- 💥 replace web-components by pure React components
- 💥 Change AnnotationViewer & AnnotationLens props
- ♻️ refactor utility functions code
- ⚡️ improve canvas rendering performance
- 📝 replace docs library - use docusaurus

### New

- ✅ add visual testing using cypress
- 👷 add github test workflow

## v1.2.1 (31/08/2021)

### Changes

- :memo: change the website docs url in README

## v1.2.0 (20/08/2021)

### New

- 🎉 1.2.0 official release

## v1.2.0-rc3 (16/02/2021)

### Changes

- 🔧 update configuration files
- 📦 update packages
- 📝 change docs

## v1.2.0-rc2 (16/12/2020)

### New

- ✨ add AnnotationForm
- 🙈 add .gitignore and .eslintignore
- 🚸 add typescript support

### Change

- 💥 re-create base components using mindee-js
- 💥 change components API
- 📝 update documentation
- 🔥 delete legacy files

## v1.1.4 (14/10/2020)

### Change

- :children_crossing: update generateImagesFromShapes resolution

## v1.1.2 (05/08/2020)

### Fix

- 🐛 Rework promises in getImagesFromPDF function

## v1.1.1 (28/07/2020)

### Change

- 🚸 AnnotationSidebar - prevent event propagation on item click

## v1.1.0 (24/07/2020)

### New

- 🚸 Add more options for user
- 🚸 Add "active" className to annotationExplorer items

### Fix

- 🐛 AnnotationViewer should resize correctly

### Changes

- ⚡️ Fire resize event on canvas on fullscreen change
- ⚡️ Allow drag with zomm outside canvas

## v1.0.0 (20/07/2020)

- 🎉 First release
