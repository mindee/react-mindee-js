import React, { useRef, useState } from 'react'
import {
  AnnotationShape,
  AnnotationViewer,
  drawLayer,
  drawShape,
  setShapeConfig,
} from 'react-mindee-js'

import dummyImage from '@site/static/img/tutorial/demo.jpg'
import { Stage } from 'konva/lib/Stage'

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

export default function BasicExampleWithControlledShapes() {
  // keep canvas props in a separate state to prevent unnecessary  rendering
  const [annotationData] = useState({
    image: dummyImage,
    shapes: dummyShapes,
  })

  const annotationViewerStageRef = useRef<null | Stage>(null)

  const onFieldMouseEnter = (shape: AnnotationShape) => {
    // when the field is hovered we can change the style of the desired shape by passing a config objet as a third argument
    // this function update the shape configs and redraw only that specific shape in the canvas.
    drawShape(annotationViewerStageRef.current, shape.id, {
      fill: 'green',
    })
  }
  const onFieldMouseLeave = (shape: AnnotationShape) => {
    // note that here we need to use setShapeConfig first to update the shape config without redrawing it the canvas
    setShapeConfig(annotationViewerStageRef.current, shape.id, {
      fill: 'transparent',
    })
    // when the update changes are done we can trigger one-time canvas redraw
    // this is useful to avoid performance issues
    drawLayer(annotationViewerStageRef.current)
  }

  const setAnnotationViewerStage = (stage: Stage) => {
    annotationViewerStageRef.current = stage
  }

  return (
    <div style={{ display: 'flex', columnGap: 10 }}>
      <AnnotationViewer
        style={{ width: 500, height: 600 }}
        data={annotationData}
        getStage={setAnnotationViewerStage}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 5 }}>
        {annotationData.shapes.map((shape, key) => (
          <pre
            key={key}
            onMouseEnter={() => onFieldMouseEnter(shape)}
            onMouseLeave={() => onFieldMouseLeave(shape)}
            style={{ fontSize: 10, cursor: 'pointer' }}
          >
            {JSON.stringify(shape, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  )
}
