---
sidebar_position: 1
---

# The basics

## Prerequisites

You’ll need to have familiarity with HTML, CSS, modern JavaScript, and React (and React Hooks) to fully understand react-mindee and how it works. In this tutorial, we’re using arrow functions, let, const, spread syntax and destructuring.

**React mindee components are built on top of [KonvaJs](https://konvajs.org) (HTML5 2d canvas js library for desktop and mobile applications)**

## Usage

You only need an image (URL or base64) and a valid list of shapes to get started.

First of all make sure to keep your annotation data (image, shapes and orientation) in a separated state
to optimize canvas rendering.

```tsx
const Example = () => {
  const [data] = useState({
    image: dummyImage,
    shapes: dummyShapes,
    orientation: 0,
  })
  return <AnnotationViewer data={data} />
}
```

To build your list of shapes you need to give each shape a unique ID and the path of the polygon to be drawn on the image. If your have three points, you define **coordinates** field as `[[x1, y1], [x2, y2], [x3,y3]]`

> Note that (x,y) point coordinates should be relative to the image size (should be between 0 and 1)

```tsx
[
    {
      id: 'unique_id',
      coordinates: [
        [0.481, 0.181],
        [0.613, 0.181],
        [0.613, 0.208],
        [0.481, 0.208],
      ],
    },
    ...
]
```

### Full example

<iframe 
style={{
    width:"100%", height:"80vh", border:0, borderRadius: 4, overflow:"hidden" }}
 src="https://codesandbox.io/embed/react-mindee-js-simple-example-with-image-1g8gl?fontsize=14&hidenavigation=1&theme=dark"  title="react-mindee-js - Canvas + Basic form Example" allow="accelerometer, ambient-light-sensor, camera, encrypted-media, geolocation, gyroscope, hid, microphone, midi, payment, usb, vr, xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>
