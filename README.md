# Check [React mindee documentation](https://react-mindee-js.netlify.app) for docs, guides, API and more!

## Introduction

#### **React mindee** is a very opinionated JavaScript library that will help you build interactive canvas for computer vision detection use cases.

There are many powerful JavaScript frameworks and tools that can help you make an interactive canvas. But almost all of them are _low-level_. Like [KONVA](https://konvajs.org/) is a 2d canvas framework. It is good, it is powerful. But you may need to write a lot of code.

This library was made for building frontend interfaces on top of **[Mindee](https://mindee.com/)** document parsing APIs and more generally on top of any computer vision detection APIs.

[![NPM](https://img.shields.io/npm/v/react-mindee-js.svg)](https://www.npmjs.com/package/react-mindee-js/v/1.3.0) [![tests](https://github.com/mindee/react-mindee-js/actions/workflows/cypress-workflow.yml/badge.svg?branch=new-version)](https://github.com/mindee/react-mindee-js/actions/workflows/cypress-workflow.yml)

![ezgif com-video-to-gif (12)](https://user-images.githubusercontent.com/41388086/87852820-92045b80-c905-11ea-808e-5a971de2b29f.gif)

## Features

- Support for image and PDF files
- Interactive shapes with events binding
- Extensible styling API
- Controllable state props and modular architecture
- Zoom in and out feature out of the box
- Magnified/Zoomed view API

## Compatibility

The React SDK is compatible with `React 18` and `React 19`, and requires `Node.js >= 22.13` to build.

## Installation and dependencies

The easiest way to use react-select is to install it from npm and build it into your app with Webpack.

```bash
npm install --save react-mindee-js
```

or using yarn

```
yarn add react-mindee-js
```

## Usage

You only need an image and a list of shapes to get started.

```jsx
import React from 'react';
import dummyImage from 'path-to-your/file.jpg';
import { AnnotationViewer } from 'react-mindee-js';

const dummyShapes = [
  {
    id: 1,
    coordinates: [
      [0.479, 0.172],
      [0.611, 0.172],
      [0.611, 0.196],
      [0.479, 0.196],
    ],
  },
  {
    id: 2,
    coordinates: [
      [0.394, 0.068],
      [0.477, 0.068],
      [0.477, 0.087],
      [0.394, 0.087],
    ],
  },
];

const data = {
  image: dummyImage,
  shapes: dummyShapes,
};

function App() {
  return <AnnotationViewer data={data} />;
}
```

## Props

- **`data`** : include 3 properties. `image` file to draw in the canvas, `shapes` which expect a list of shapes and`orientation` of the provided image (default: 0)
- **`onShapeClick`** : return the shape object after a click event
- **`onShapeMouseEnter`** : return the shape object after a mouse enter event
- **`onShapeMouseLeave`** : return the shape object after a mouse leave event
- **`onShapeMultiSelect`** : return the selected shapes using (CTRL + MOUSE CLICK & MOVE)
- **`options`** : object of properties to customize default configs
- **`id`** : unique id, if not provided it will be automatically generated
- **`style`** : style object to change container css properties
- **`className`** : apply a className to the control

## PDF documents

PDF pages are rendered in the browser with [pdf.js](https://mozilla.github.io/pdf.js/) (the first time a PDF is processed, it's loaded lazily in a Web Worker).
Pages are now loaded by batches (5 initial pre-fetched pages, then 3 by 3 by default) to accommodate for very large documents.

### `usePDFDocument` hook

The simplest way to display a PDF in a React component:

```jsx
import { useState } from 'react';
import { AnnotationViewer, usePDFDocument } from 'react-mindee-js';

function Document({ file }) {
  const { status, numPages, pages, loading, loadPage, error } = usePDFDocument(
    file,
    { prefetch: 5, batch: 3 },
  );
  const [current, setCurrent] = useState(0);

  if (status === 'error') return <p>{error.message}</p>;
  if (status !== 'ready') return <p>Opening…</p>;

  return (
    <>
      <nav>
        {pages.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              loadPage(index);
            }}
          >
            {loading.has(index) ? '…' : index + 1}
          </button>
        ))}
      </nav>
      {pages[current] && (
        <AnnotationViewer data={{ image: pages[current], shapes: [] }} />
      )}
    </>
  );
}
```

### `openPDF` (framework-agnostic)

For custom scheduling, use the handle directly. Page numbers are **1-based**, like pdf.js.

```js
import { openPDF } from 'react-mindee-js';

const doc = await openPDF(file, { maxPages: 100 });
doc.numPages; // 5

const first = await doc.getPage(1, { priority: 'high' }); // blob: URL
for await (const { pageNumber, image } of doc.getPages(2, 4)) {
  // inclusive range, yielded as soon as each page is ready
}

await doc.destroy(); // revokes every blob: URL handed out by this handle
```

### `getPDFPageCount` / `getImagesFromPDF`

`getPDFPageCount(source)` returns the page count without rendering. `getImagesFromPDF` still works but is **deprecated**: it renders and holds every page in memory at once. Prefer `usePDFDocument` or `openPDF`.

## Browser support

React mindee supports all recent browsers and works where React works. However, you may need check the [SSR](/docs/ssr) section.

## Contribute to this repo

Feel free to use github to submit issues, pull requests or general feedback.
You can also visit [our website](https://mindee.com) or drop us an [email](mailto:contact@mindee.com).

Please read our [Contributing section](https://github.com/mindee/react-mindee-js/blob/master/CONTRIBUTING.md) before contributing.

## License

MIT © [mindee](https://mindee.com)
