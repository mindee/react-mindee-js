---
sidebar_position: 6
---

# Customization

##### You can use pass `options` as a props to `<AnnotationViewer />` or `<AnnotationLens />` to customize canvas default behavior

### AnnotationViewer

- `enableSelection`: enable the multi selection feature (default: false)

- `selectionRectConfig`: pass more [config](https://konvajs.org/api/Konva.Rect.html) to the selection rect used in the multi selection feature

- `onMouseLeave`: pass a function that takes as argument the [polygon](https://konvajs.org/api/Konva.Line.html#main) executed on shape mouse leave

- `onMouseEnter`: pass a function that takes as argument the [polygon](https://konvajs.org/api/Konva.Line.html#main) executed on shape mouse enter

- `onClick`: pass a function that takes as argument the [polygon](https://konvajs.org/api/Konva.Line.html#main) executed on shape click

- `shapeConfig`: shapes config applied to all shapes.

:::caution
individual shape [**config**](/docs/API/annotation-viewer-api#data) passed on each item of the list of shapes override the **shapeConfig** property
:::

- `zoom`:

##### Example

```tsx
<AnnotationViewer
  /// other props
  options={{
    enableSelection: false,
    selectionRectConfig: {
      fill: 'rgba(0,0,255,0.5)',
    },
    onMouseLeave: (polygon: Line) => {
      const layer = polygon.getLayer()
      polygon.setAttr('fill', 'transparent')
      layer?.batchDraw()
    },
    onMouseEnter: (polygon: Line) => {
      const stroke = polygon.getAttr('stroke')
      polygon.setAttr('fill', `${stroke}40`)
      polygon.draw()
    },
    shapeConfig: {
      stroke: '#FF0000',
      strokeWidth: 2,
      listening: true,
    },
    zoom: {
      modifier: 1.2,
      max: 10,
      defaultZoom: 1,
    },
  }}
/>
```

### AnnotationLens

- `shapeConfig`: shapes config applied to all shapes.

:::caution
individual shape [**config**](/docs/API/annotation-lens-api#data) passed on each item of the list of shapes override the **shapeConfig** property
:::

```tsx
<AnnotationLens
  /// other props
  options={{
    shapeConfig: {
      stroke: '#FF0000',
      strokeWidth: 1,
      listening: false,
    },
  }}
/>
```
