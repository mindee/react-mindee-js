---
sidebar_position: 1
---

# Introduction

#### **React mindee** is a very opinionated JavaScript library that will help you build interactive canvas for computer vision detection use cases.

There are many powerful JavaScript frameworks and tools that can help you make an interactive canvas. But almost all of them are _low-level_. Like **[KONVA](https://konvajs.org/)** is a 2d canvas framework. It is good, it is powerful. But you may need to write a lot of code.

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

The React SDK is compatible with `React 16.8.0 +`

## Installation and dependencies

The easiest way to use react-select is to install it from npm and build it into your app with Webpack.

```bash
npm install --save react-mindee-js@1.3.0
```

or using yarn

```
yarn add react-mindee-js@1.3.0
```

## Usage

You only need an image and a list of shapes to get started.

```jsx
import React from 'react'
import { AnnotationViewer } from 'react-mindee-js'

import dummyImage from 'path-to-your/file.jpg'

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
]

const data = {
  image: dummyImage,
  shapes: dummyShapes,
}

function App() {
  return <AnnotationViewer data={data} />
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

## Browser support

React mindee supports all recent browsers and works where React works. However, you may need check the [SSR](/docs/ssr) section.

## Contribute to this repo

Feel free to use github to submit issues, pull requests or general feedback.
You can also visit [our website](https://mindee.com) or drop us an [email](mailto:contact@mindee.com).

Please read our [Contributing section](https://github.com/publicMindee/react-mindee-js/blob/master/CONTRIBUTING.md) before contributing.

## License

GPLv3 © [mindee](https://mindee.com)
