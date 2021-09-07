---
sidebar_position: 6
---

# Lens

You can link the [AnnotationLens](/docs/API/annotation-lens-api) component to [AnnotationView](/docs/API/annotation-viewer-api) to get a magnified vision that change based on pointer position.
You should pass the same data props to the **AnnotationLens** to make sure the same data are shared between the two canvases.

Keep the pointer position provided by the **AnnotationViewer** in a state to pass it later to **AnnotationLens**.

```tsx
const [pointerPosition, setPointerPosition] = useState<PointerPosition | null>(null)

return (
  <AnnotationViewer
    ...
    getPointerPosition={(pointerPosition: PointerPosition) => setPointerPosition(pointerPosition)}
  />
  <AnnotationLens
    ...
    pointerPosition={pointerPosition}
  />
)
```

### Full example

<iframe 
style={{
    width:"100%", height:"80vh", border:0, borderRadius: 4, overflow:"hidden" }}
 src="https://codesandbox.io/embed/react-mindee-js-lens-feature-10q2k?fontsize=14&hidenavigation=1&theme=dark"  title="react-mindee-js - Canvas + Basic form Example" allow="accelerometer, ambient-light-sensor, camera, encrypted-media, geolocation, gyroscope, hid, microphone, midi, payment, usb, vr, xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>
