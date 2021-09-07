---
sidebar_position: 5
---

# Controlled shapes

In order to change shapes configs dynamically, you first need to get the [Stage](https://konvajs.org/api/Konva.Stage.html#Stage) object from `<AnnotationViewer />` using [getStage](/docs/API/annotation-viewer-api#getstage) prop and store it in a `ref`.

```tsx
const annotationViewerStageRef = useRef<null | Stage>(null)

const setAnnotationViewerStage = (stage: Stage) => {
  annotationViewerStageRef.current = stage
}

return (
  <AnnotationViewer
    /// other props
    getStage={setAnnotationViewerStage}
  />
)
```

Then use utils function to change shape configs and trigger canvas redraw when it's needed using [setShapeConfig](/docs/Utils/set-shape-config), [drawShape](/docs/Utils/draw-shape) and [drawLayer](/docs/Utils/draw-layer).

### Full example

<iframe 
style={{
    width:"100%", height:"80vh", border:0, borderRadius: 4, overflow:"hidden" }}
 src="https://codesandbox.io/embed/react-mindee-js-controlled-shapes-h90pg?fontsize=14&hidenavigation=1&theme=dark"  title="react-mindee-js - Canvas + Basic form Example" allow="accelerometer, ambient-light-sensor, camera, encrypted-media, geolocation, gyroscope, hid, microphone, midi, payment, usb, vr, xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>
