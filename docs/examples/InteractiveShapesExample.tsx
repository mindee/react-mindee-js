import React, { useState } from 'react'

import dummyImage from '@site/static/img/tutorial/demo.jpg'
import { AnnotationShape, AnnotationViewer } from 'react-mindee-js'

export const dummyShapes: AnnotationShape[] = [
  {
    id: 'date',
    coordinates: [
      [0.481, 0.181],
      [0.613, 0.181],
      [0.613, 0.208],
      [0.481, 0.208],
    ],
  },
  {
    id: 'supplier',
    coordinates: [
      [0.394, 0.078],
      [0.481, 0.078],
      [0.481, 0.098],
      [0.394, 0.098],
    ],
  },
  {
    id: 'taxes',
    coordinates: [
      [0.19, 0.414],
      [0.698, 0.414],
      [0.698, 0.442],
      [0.19, 0.442],
    ],
  },
  {
    id: 'time',
    coordinates: [
      [0.62, 0.181],
      [0.681, 0.181],
      [0.681, 0.201],
      [0.62, 0.201],
    ],
  },
  {
    id: 'total_incl',
    coordinates: [
      [0.549, 0.627],
      [0.715, 0.627],
      [0.715, 0.649],
      [0.549, 0.649],
    ],
  },
]

export default function InteractiveShapesExample() {
  // keep canvas props in a separate state to prevent unnecessary rendering
  const [annotationData, setAnnotationData] = useState({
    image: dummyImage,
    shapes: dummyShapes,
  })

  const [eventData, setEventData] = useState({})

  const onShapeMouseEnter = (shape: AnnotationShape) => {
    setEventData({
      event: 'mouseenter',
      shape,
    })
  }
  const onShapeMouseLeave = (shape: AnnotationShape) => {
    setEventData({
      event: 'mouseleave',
      shape,
    })
  }
  const onShapeClick = (shape: AnnotationShape) => {
    setEventData({
      event: 'click',
      shape,
    })
  }

  return (
    <div style={{ display: 'flex' }}>
      <AnnotationViewer
        style={{ width: 500, height: 600 }}
        data={annotationData}
        onShapeMouseLeave={onShapeMouseLeave}
        onShapeMouseEnter={onShapeMouseEnter}
        onShapeClick={onShapeClick}
      />
      <pre>{JSON.stringify(eventData, null, 2)}</pre>
    </div>
  )
}
