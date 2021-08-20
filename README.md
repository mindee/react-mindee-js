![logo_mindee](https://user-images.githubusercontent.com/41388086/68026973-7858b080-fcb1-11e9-85ff-724c8d014118.png)

# react-mindee-js v1.2

#### React components built on top [mindee-js](https://www.npmjs.com/package/mindee-js) SDK

> Computer vision SDK for image segmentation and document processing on top of [mindee](https://mindee.com) APIs

[![NPM](https://img.shields.io/npm/v/react-mindee-js.svg)](https://www.npmjs.com/package/react-mindee-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![ezgif com-video-to-gif (12)](https://user-images.githubusercontent.com/41388086/87852820-92045b80-c905-11ea-808e-5a971de2b29f.gif)

**[Check out the full documentation](https://react-mindee-js.netlify.app).**

## Features

This SDK was made for building interfaces on top of Mindee document parsing APIs and more generally on top of
any computer vision detection APIs.

- Work with images and pdfs
- Display interactive shapes on images or pdfs with custom style
- Bind custom functions to shapes mouse events
- Create multi-pages pdfs navigation sidebar
- Zoom in and out in the canvas
- Move the image with the mouse
- Create a lens to zoom around the user's pointer

This SDK was primarily made for document processing but can be used for any type of computer vision interface:

![general_segmentation](https://user-images.githubusercontent.com/41388086/87301502-fb542b00-c50f-11ea-91f2-f7731c4e1a1b.gif)

## Compatibility

The React SDK is compatible with `React 16.8.0 +`

## Installation

Installing with npm

```bash
npm install --save react-mindee-js
```

installing with yarn

```
yarn add react-mindee-js
```

## Main component

> [AnnotationViewer](https://react-mindee-js.netlify.app/annotation-viewer) has a set of features to draw a list of shapes on top of a given image.

```js
import dummyImage from 'assets/image.jpg'
const dummy_shapes = [
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

const Example = () => {
  return <AnnotationViewer image={dummyImage} shapes={dummy_shapes} />
}
```

## Helpers

> **Helpers** work hand to hand with AnnotationViewer to provide a powerful tool for different use cases

- [AnnotationLens](https://react-mindee-js.netlify.app/annotation-lens) component provide a closer vision to the main canvas rendered by AnnotationViewer.

- [AnnotationForm](https://react-mindee-js.netlify.app/annotation-form) display textual data. Introduction can be fully customized and linked to AnnotationViewer through a state to create interactive behavior between shapes and fields.

- [getImagesFromPDF](https://react-mindee-js.netlify.app/get-images-from-pdf) This function returns a Promise that resolves with a list of images as base64 format . It takes pdf file (object URL).

## Contribute to this repo

Feel free to use github to submit issues, pull requests or general feedback.
You can also visit [our website](https://mindee.com) or drop us an [email](mailto:contact@mindee.com).

Please read our [Contributing section](CONTRIBUTING.md) before contributing.

## License

GPLv3 © [mindee](https://mindee.com)
