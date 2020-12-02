![logo_mindee](https://user-images.githubusercontent.com/41388086/68026973-7858b080-fcb1-11e9-85ff-724c8d014118.png)


# react-mindee-js

> Computer vision SDK for image segmentation and document processing on top of [mindee](https://mindee.com) APIs

[![NPM](https://img.shields.io/npm/v/react-mindee-js.svg)](https://www.npmjs.com/package/react-mindee-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![ezgif com-video-to-gif (12)](https://user-images.githubusercontent.com/41388086/87852820-92045b80-c905-11ea-808e-5a971de2b29f.gif)

Check out the full documentation on [storybook](https://publicMindee.github.io/react-mindee-js/?path=/docs).

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

> react-mindee-js has one main component has a set of features to draw a list of shapes on top of a given image.

```
<AnnotationViewer />
```

## Helpers

> **Helpers** work hand to hand with AnnotationViewer to provide a powerful tool for different use cases

- AnnotationLens component provide a closer vision to the main canvas rendered by AnnotationViewer.

- AnnotationForm display textual data. Introduction can be fully customized and linked
  to AnnotationViewer through a state to create interactive behavior between shapes
  and fields.

- getImagesFromPDFis a async function that takes a pdf file as an argument and return all
  pages as a list of base64 images.

## Contribute to this repo

Feel free to use github to submit issues, pull requests or general feedback.
You can also visit [our website](https://mindee.com) or drop us an [email](mailto:contact@mindee.com).

Please read our [Contributing section](CONTRIBUTING.md) before contributing.

## License

GPLv3 © [mindee](https://mindee.com)
