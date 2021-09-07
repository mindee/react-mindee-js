---
sidebar_position: 3
---

# Mouse events

#### The **`<AnnotationViewer/>`** support mouse events.

> You can use the [`onShapeMouseEnter`](/docs/API/annotation-viewer-api#onshapemouseenter), [`onShapeMouseLeave`](/docs/API/annotation-viewer-api#onshapemouseleave) and [`onShapeClick`](/docs/API/annotation-viewer-api#onpointermove) props to bind event handlers to the `<canvas/>` shapes.

```tsx
const onShapeMouseEnter = (shape: AnnotationShape) => {
  console.log('On mouse enter', shape)
}
const onShapeMouseLeave = (shape: AnnotationShape) => {
  console.log('On mouse leave', shape)
}
const onShapeClick = (shape: AnnotationShape) => {
  console.log('On mouse click', shape)
}
return (
  <AnnotationViewer
    data={annotationData}
    onShapeMouseLeave={onShapeMouseLeave}
    onShapeMouseEnter={onShapeMouseEnter}
    onShapeClick={onShapeClick}
  />
)
```

### Full example

<iframe 
style={{
    width:"100%", height:"80vh", border:0, borderRadius: 4, overflow:"hidden" }}
 src="https://codesandbox.io/embed/react-mindee-js-simple-example-with-shape-events-mv5h5?fontsize=14&hidenavigation=1&theme=dark"  title="react-mindee-js - Canvas + Basic form Example" allow="accelerometer, ambient-light-sensor, camera, encrypted-media, geolocation, gyroscope, hid, microphone, midi, payment, usb, vr, xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>
