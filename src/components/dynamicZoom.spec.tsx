import React, { useRef, useState } from 'react'
import dummyImage from 'cypress/assets/demo.jpg'
import { dummyShapes } from 'cypress/assets/shapes'
import { Stage } from 'konva/lib/Stage'

import { AnnotationViewerProps, PointerPosition } from '@/common/types'

import AnnotationViewer from './AnnotationViewer'

const containerHeight = 700
const containerWidth = 700

const getStageZoomScale = (stage: Stage) => stage.getAttr('zoomScale')

type AnnotationViewerWithDynamicZoomProps = {
  id: AnnotationViewerProps['id']
  data: AnnotationViewerProps['data']
}

const AnnotationViewerWithDynamicZoom = ({
  id,
  data,
}: AnnotationViewerWithDynamicZoomProps) => {
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
    cy.mount(
      <AnnotationViewerWithDynamicZoom
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
      />,
    )
  })
})
