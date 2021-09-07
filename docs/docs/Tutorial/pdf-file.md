---
sidebar_position: 2
---

# PDF file

> If you got a PDF file in hand, you can use [getImagesFromPDF](/docs/Utils/get-images-form-pdf-api) to extract pages in base64 format and pass them to `<AnnotationViewer>` using a proper state.

```tsx
getImagesFromPDF(pdfFile).then((images: string[]) => {
  console.log(images) // ===> [base64_1, base64_2, ...]
})
```

### Full example

<iframe 
style={{
    width:"100%", height:"80vh", border:0, borderRadius: 4, overflow:"hidden" }}
 src="https://codesandbox.io/embed/react-mindee-js-simple-example-with-pdf-sts39?fontsize=14&hidenavigation=1&theme=dark"  title="react-mindee-js - Canvas + Basic form Example" allow="accelerometer, ambient-light-sensor, camera, encrypted-media, geolocation, gyroscope, hid, microphone, midi, payment, usb, vr, xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>
