![logo_mindee](https://user-images.githubusercontent.com/41388086/68026973-7858b080-fcb1-11e9-85ff-724c8d014118.png)


# react-mindee-js

> Computer vision SDK for image segmentation and document processing on top of [mindee](https://mindee.com) APIs

[![NPM](https://img.shields.io/npm/v/react-mindee-js.svg)](https://www.npmjs.com/package/react-mindee-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![ezgif com-video-to-gif (12)](https://user-images.githubusercontent.com/41388086/87852820-92045b80-c905-11ea-808e-5a971de2b29f.gif)

Check out the [storybook](https://publicMindee.github.io/react-mindee-js).

### Features

This SDK was made for building interfaces on top of Mindee document parsing APIs and more generally on top of
any computer vision detection APIs.

* Work with images and pdfs
* Display interactive shapes on images or pdfs with custom style
* Bind custom functions to shapes mouse events
* Create multi-pages pdfs navigation sidebar
* Zoom in and out in the canvas
* Move the image with the mouse
* Create a lens to zoom around the user's pointer

This SDK was primarily made for document processing but can be used for any type of computer vision interface:

![general_segmentation](https://user-images.githubusercontent.com/41388086/87301502-fb542b00-c50f-11ea-91f2-f7731c4e1a1b.gif)

### Compatibility

The React SDK is compatible with `React 16.8.0 +`


# Contents

1. [Installation](#installation)
3. [Use cases](#use-cases)
    * [Hello world](#hello-world)
    * [Handle multi-pages pdfs navigation](#handle-multi-pages-pdfs-navigation)
    * [Add lens](#add-lens)
    * [Mindee APIs helpers](#mindee-APIs-helpers)
2. [Components](#components)
    * [<AnnotationViewer \/>](#AnnotationViewer)
    * [<AnnotationLens \/>](#AnnotationLens)
    * [<AnnotationSidebar \/>](#AnnotationSidebar)
    * [<Fullscreen \/>](#Fullscreen)
4. [Methods](#methods)
    * [formatPredictions()](#formatPredictions)
    * [getShapesWithImages()](#async-getShapesWithImages)
    * [getImagesFromPDF()](#async-getImagesFromPDF)
5. [Contribute to this repo](#contribute-to-this-repo)
6. [License](#license)


# Installation

Installing with npm
```bash
npm install --save react-mindee-js
```

installing with yarn
```
yarn add react-mindee-js
```

# Use cases

## Hello world

Display an image with one custom shape


```javascript
import {
  AnnotationViewer,
  createPolygonFromCoordinates
} from "react-mindee-js";

const HelloWorld = () => {
  const [image, setImage] = useState(null)

  const shapes = [
    {
      polygon: createPolygonFromCoordinates(
        [
          [0.66, 0.3],
          [0.12, 0.5],
          [0.52, 0.8],
          [0.82, 0.24]
        ]
      ),
      color: "#fd3246",
      data:"This is red shape",
      index: 0,
      active: {
        color: '#00f0f0',
        lineWidth: 3
      }
    }
  ]

  return (
    <div>
      <input type="file" onChange={e => setImage(URL.createObjectURL(e.target.files[0]))}/>
      {
        image && <div style={{ height: '500px', width: '400px'}}>
          <AnnotationViewer
            shapes={shapes}
            image={image}
            onShapeClick={shape => console.log('shapeClicked', shape)}
            onShapeHover={shape => console.log('shapeHovered', shape)}
          />
        </div>
      }
    </div>
  );
}
export default HelloWorld;
```

## Handle multi-pages pdfs navigation

Handle multi-pages pdfs navigation using the AnnotationSidebar component.

```javascript
import {
  AnnotationViewer,
  createPolygonFromCoordinates,
  getImagesFromPDF,
  AnnotationSidebar
} from "react-mindee-js";

const MultiPagesPdf = () => {
  const [pdfPages, setPdfPages] = useState([])
  const [currentPdfPageIndex, setCurrentPdfPageIndex] = useState(0)

  const pagesShapes = [
    [
      {
        polygon: createPolygonFromCoordinates(
          [
            [0.66, 0.3],
            [0.12, 0.5],
            [0.52, 0.8],
            [0.82, 0.24]
          ]
        ),
        color: "#fd3246",
        data: "This is first page shape",
        index: 0,
        active: {
          color: '#00f0f0',
          lineWidth: 3
        }
      }
    ],
    [
      {
        polygon: createPolygonFromCoordinates(
          [
            [0.26, 0.3],
            [0.32, 0.5],
            [0.52, 0.64],
            [0.52, 0.28]
          ]
        ),
        color: "#fd3246",
        data: "This is second page shape",
        index: 0,
        active: {
          color: '#00f0f0',
          lineWidth: 3
        }
      }
    ]
  ]

  const handleUpload = (e) => {
    getImagesFromPDF(URL.createObjectURL(e.target.files[0]))
      .then((_pdfPages) => {setPdfPages(_pdfPages)}
    )
  }

  return(
    <div>
      <input type="file" onChange={e => handleUpload(e)}/>
      {
        pdfPages.length > 0 &&
        <div style={{ height: '500px', width: '400px'}}>
          <AnnotationViewer
            image={pdfPages[currentPdfPageIndex]}
            shapes={pagesShapes[currentPdfPageIndex]}
          />
          <AnnotationSidebar
            items={pdfPages}
            activeIndex={currentPdfPageIndex}
            onChange={setCurrentPdfPageIndex}
          />
        </div>
      }
    </div>
  )
}
export default MultiPagesPdf;
```

## Add lens

Create easily a zoomed area wherever you need in your app.

```javascript
import {
  AnnotationViewer,
  createPolygonFromCoordinates,
  Point,
  AnnotationLens
 } from "react-mindee-js";

const Lens = () => {
  const [image, setImage] = useState(null)
  const [lensProps, setLensProps] = useState({
    cursorPosition: new Point(),
    selectedShape: null,
  })

  const shapes = [
    {
      polygon: createPolygonFromCoordinates(
        [
          [0.66, 0.3],
          [0.12, 0.5],
          [0.52, 0.8],
          [0.82, 0.24]
        ]
      ),
      color: "#fd3246",
      data:"This is red shape",
      index: 0,
      active: {
        color: '#00f0f0',
        lineWidth: 3
      }
    }
  ]

  return (
    <div>
      <input type="file" onChange={e => setImage(URL.createObjectURL(e.target.files[0]))}/>
      {
        image && <div style={{position: 'relative'}}>
          <div style={{ height: '500px', width: '400px'}}>
            <AnnotationViewer
              shapes={shapes}
              image={image}
              onShapeClick={shape => console.log('shapeClicked', shape)}
              onShapeHover={shape => console.log('shapeHovered', shape)}
              getLensProps={setLensProps}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: "10px",
              top: "10px",
              height: '100px',
              width: '100px'
            }}
          >
            <AnnotationLens
              image={image}
              shapes={shapes}
              {...lensProps}
            />
          </div>
        </div>
      }
    </div>
  );
}
export default Lens;
```

## Mindee APIs helpers

To help you prototype using mindee APIs, you can directly use the formatPrediction method to create shapes from a raw
Mindee API response.

There is also a fake response exported from the library so you don't have to code your API calls to get started.

```javascript
import {
  AnnotationViewer,
  fakeResponse,
  formatPrediction
} from "react-mindee-js";

const Mindee = () => {
  const [image, setImage] = useState(null)

  const shapes = formatPrediction(fakeResponse.predictions[0])

  return (
    <div>
      <input type="file" onChange={e => setImage(URL.createObjectURL(e.target.files[0]))}/>
      {
        image && <div style={{ height: '500px', width: '400px'}}>
          <AnnotationViewer
            shapes={shapes}
            image={image}
            onShapeClick={shape => console.log('shapeClicked', shape)}
            onShapeHover={shape => console.log('shapeHovered', shape)}
          />
        </div>
      }
    </div>
  );
}
export default Mindee;
```



# Components

## AnnotationViewer
```javascript
import { AnnotationViewer } from 'react-mindee-js';

<AnnotationViewer
    shapes={shapes}
    image={image}
    onShapeClick={shape => console.log('shapeClicked', shape)}
    onShapeHover={shape => console.log('shapeHovered', shape)}
/>
```

The annotation viewer is the main component on which you can feed an image or pdf, and display a list of shapes (items).

#### Props

* shapes: List of objects to display on the canvas. Each object must have the following attributes:
    * polygon: A list of relative vertices passed to createPolygonFromCoordinates
    * color: Hex color for borders and background shape
    * index: Number used for identifying the shape. When many shapes have the same index, hovering one of them will
    activate the others.
    * active: An object to set the style of the shape when hovered
        ```javascript
        active: {
          color: '#00ff00',
          lineWidth: 3
        }
        ```
    You can add any custom attributes to pass data through your shapes.
    ```javascript
    import { createPolygonFromCoordinates } from "react-mindee-js";

    const shapes = [
      {
        polygon: createPolygonFromCoordinates(
          [
            [0.66, 0.3],
            [0.12, 0.5],
            [0.52, 0.8],
            [0.82, 0.24]
          ]
        ),
        color: "#fd3246",
        data:"This is red shape",
        index: 0,
        active: {
          color: '#00ff00',
          lineWidth: 3
        }
      }
    ]
    ```
* image: Image URL or base64
* className: Container className props. The default canvas style will fill his parent height and width
* onShapeHover: Binded to onHover of a shape
* onShapeClick: Binded to onClick of a shape
* getLensProps: Returns AnnotationLens props to be passed if you use one.


## AnnotationLens

The AnnotationLens component is a zoomed window displaying the area arround the user's pointer.

It works combined with a AnnotationViewer, check out the related use case below for an example.

```javascript
<AnnotationLens
  image={image}
  shapes={shapes}
  cursorPosition={cursorPosition}
  selectedShape={selectedShape}
/>
```

#### Props

* image: The source image passed to the AnnotationViewer
* cursorPosition: Cursor position on the AnnotationViewer. You can get it using the getLensProps from the AnnotationViewer.
* selectedShape: Selected shape on the AnnotationViewer . You can get it using the getLensProps from the AnnotationViewer.
* shapes (optional): Pass the same shapes passed to the AnnotationViewer if you want them to be displayed on the Lens.


## AnnotationSidebar

The AnnotationSidebar is a vertical carousel displaying thumbnails of pdf pages.
```javascript
<AnnotationSidebar
    items={pdfPages}
    activeIndex={currentPdfPageIndex}
    onChange={setCurrentPdfPageIndex}
/>
```

#### Props

* items: List of images
* activeIndex: Active page number
* onChange: Triggered when clicking on a thumbnail



## Fullscreen

The Fullscreen component enables a fullscreen mode for its children.
![ezgif com-video-to-gif (6) (1)](https://user-images.githubusercontent.com/41388086/87300730-a9f76c00-c50e-11ea-8aee-e31e79758fef.gif)

```javascript
<Fullscreen
  customButton={(onClick) => <div onClick={onClick}>My custom Button</div>}
>
  <AnnotationViewer
    items={items}
    source={file.preview}
    type={file.type}
  />
</Fullscreen>
```

#### props

* customButton: A custom component binding the onClick method to enable the full screen mode


# Methods

## formatPredictions
This function formats raw predictions from Mindee APIs to feed the AnnotationViewer shapes easily.

```javascript
const shapes = formatPrediction(mindeeAPIResponse.predictions[0])
```


## async getShapesWithImages
This function generate sub images from a source image corresponding to shapes.

```javascript
getShapesWithImages(file.preview, styled_shapes).then(
    _shapesWithImages => {
      // Do something with shapesWithImages
    }
)
```

## async getImagesFromPDF
This function generate images from a pdf.

```javascript
getImagesFromPDF(pdfFile)
  .then((_pdfPages) => {
    // Do something with images pdf pages
  }
)

```

* pdfFile: object URL of a pdf file

# Contribute to this repo

Feel free to use github to submit issues, pull requests or general feedback.
You can also visit [our website](https://mindee.com) or drop us an [email](mailto:contact@mindee.com).

Please read our [Contributing section](CONTRIBUTING.md) before contributing.

# License

GPLv3 © [mindee](https://mindee.com)
