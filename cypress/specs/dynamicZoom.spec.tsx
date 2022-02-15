import React, { useRef, useState } from 'react'
import { mount } from '@cypress/react'
import { AnnotationViewer, PointerPosition, Stage } from '../../dist'

import dummyImage from '../assets/demo.jpg'
import { dummyShapes } from '../assets/shapes'

const containerHeight = 700
const containerWidth = 700

const getStageZoomScale = (stage: Stage) => stage.getAttr('zoomScale')

const AnnotationViewerWithDynamicZoom = ({ id, data }: any) => {
  const [customStagePosition, setCustomStagePosition] = useState({ x: 0, y: 0 })
  const stageObject = useRef<Stage | null>(null)
  const [customZoomLevel, setCustomZoomLevel] = useState(1)

  const changeScale = (modifier: number) => {
    const oldZoomScale = getStageZoomScale(stageObject.current!)
    const newScale = modifier * oldZoomScale
    setCustomZoomLevel(newScale)
  }

  const changePosition = (newPosition: PointerPosition) => {
    setCustomStagePosition(newPosition)
  }

  return (
    <div
      data-cy="AnnotationViewerWithDynamicZoom"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <button data-cy="same-data" onClick={() => changeScale(1.2)}>
        Zoom in
      </button>
      <button data-cy="different-image" onClick={() => changeScale(0.8)}>
        Zoom out
      </button>
      <button
        data-cy="different-shapes"
        onClick={() => changePosition({ x: 0, y: 20 })}
      >
        Up
      </button>
      <button
        data-cy="different-shapes"
        onClick={() => changePosition({ x: 0, y: -20 })}
      >
        Down
      </button>
      <button
        data-cy="different-shapes"
        onClick={() => changePosition({ x: -20, y: 0 })}
      >
        Right
      </button>
      <button
        data-cy="different-shapes"
        onClick={() => changePosition({ x: 20, y: 0 })}
      >
        Left
      </button>
      <AnnotationViewer
        id={id}
        customZoomLevel={customZoomLevel}
        customStagePosition={customStagePosition}
        data={data}
        getStage={(stage) => (stageObject.current = stage)}
        style={{
          height: containerHeight,
          width: containerWidth,
          background: 'black',
        }}
      />
    </div>
  )
}

describe('AnnotationViewer', () => {
  it('mount correctly', () => {
    mount(
      <AnnotationViewerWithDynamicZoom
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
      />
    )
  })
})
