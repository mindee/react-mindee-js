import React, { useRef, useState } from 'react'
import dummyImage from 'cypress/assets/demo.jpg'
import { dummyShapes } from 'cypress/assets/shapes'
import type { Stage } from 'konva/lib/Stage'

import type { AnnotationViewerProps, PointerPosition } from '@/common/types'

import { getZoomScale } from '@/utils/zoom'

import AnnotationViewer from './AnnotationViewer'

const containerHeight = 700
const containerWidth = 700

interface AnnotationViewerWithDynamicZoomProps {
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
    const stage = stageObject.current
    if (!stage) return
    setCustomZoomLevel(modifier * getZoomScale(stage))
  }

  const changePosition = (newPosition: PointerPosition) => {
    setCustomStagePosition(newPosition)
  }

  return (
    <div
      data-cy="AnnotationViewerWithDynamicZoom"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <button
        data-cy="same-data"
        onClick={() => {
          changeScale(1.2)
        }}
      >
        Zoom in
      </button>
      <button
        data-cy="different-image"
        onClick={() => {
          changeScale(0.8)
        }}
      >
        Zoom out
      </button>
      <button
        data-cy="different-shapes"
        onClick={() => {
          changePosition({ x: 0, y: 20 })
        }}
      >
        Up
      </button>
      <button
        data-cy="different-shapes"
        onClick={() => {
          changePosition({ x: 0, y: -20 })
        }}
      >
        Down
      </button>
      <button
        data-cy="different-shapes"
        onClick={() => {
          changePosition({ x: -20, y: 0 })
        }}
      >
        Right
      </button>
      <button
        data-cy="different-shapes"
        onClick={() => {
          changePosition({ x: 20, y: 0 })
        }}
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
