import React, { useState } from 'react'

import dummyImage from '@site/static/img/tutorial/demo.jpg'
import { AnnotationViewer } from 'react-mindee-js'

export const dummyShapes = [
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

export default function BasicExampleWithImage() {
  const [data] = useState({
    image: dummyImage,
    shapes: dummyShapes,
  })
  return <AnnotationViewer style={{ width: '100%', height: 400 }} data={data} />
}
