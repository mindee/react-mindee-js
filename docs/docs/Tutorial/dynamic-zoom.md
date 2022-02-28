---
sidebar_position: 7
---

# Controlled zoom

Use can use [customZoomLevel](/docs/API/annotation-viewer-api#customzoomlevel) to pass a custom zoomLevel to the canvas and [customStagePosition](/docs/API/annotation-viewer-api#customstageposition) to move the stage position `only when customZoomLevel > 1`.

```tsx
const [customStagePosition, setCustomStagePosition] = useState<
  PointerPosition | undefined
>()

const [customZoomLevel, setCustomZoomLevel] = useState(1)
return (
  <AnnotationViewer
    /// other props
    customZoomLevel={customZoomLevel}
    customStagePosition={customStagePosition}
  />
)
```

### Full example

<iframe
style={{
    width:"100%", height:"80vh", border:0, borderRadius: 4, overflow:"hidden" }}
 src="https://codesandbox.io/embed/react-mindee-js-custom-zoom-feature-5lsmxk?fontsize=14&hidenavigation=1&theme=dark"  title="react-mindee-js - Custom zoom feature" allow="accelerometer, ambient-light-sensor, camera, encrypted-media, geolocation, gyroscope, hid, microphone, midi, payment, usb, vr, xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>
