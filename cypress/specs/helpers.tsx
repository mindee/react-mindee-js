import React, { useState } from 'react'

import dummyImage from '../assets/demo.jpg'
import anotherDummyImage from '../assets/another-demo.jpg'
import { dummyShapes } from '../assets/shapes'

import { AnnotationLens, AnnotationViewer, AnnotationData } from '../../dist'

type TesterProps = {
  containerWidth: number
  containerHeight: number
  id?: string
}
export const AnnotationLensStateTester = ({
  containerHeight,
  containerWidth,
  id = 'annotationLens',
}: TesterProps) => {
  const [data, setData] = useState<AnnotationData>({
    image: dummyImage,
    shapes: dummyShapes,
  })

  const passSameData = () => {
    setData({ image: dummyImage, shapes: dummyShapes })
  }
  const passDifferentImage = () => {
    setData({ image: anotherDummyImage, shapes: dummyShapes })
  }
  const passDifferentShapes = () => {
    setData({ image: dummyImage, shapes: dummyShapes.slice(3) })
  }
  const passDifferentOrientation = () => {
    setData({ image: dummyImage, shapes: dummyShapes, orientation: 90 })
  }
  return (
    <div
      data-cy="AnnotationViewerTester"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <button data-cy="same-data" onClick={passSameData}>
        Pass same data
      </button>
      <button data-cy="different-image" onClick={passDifferentImage}>
        Pass different Image
      </button>
      <button data-cy="different-shapes" onClick={passDifferentShapes}>
        Pass different shapes
      </button>
      <button
        data-cy="different-orientation"
        onClick={passDifferentOrientation}
      >
        Pass different orientation
      </button>
      <AnnotationLens
        id={id}
        data={data}
        style={{
          height: containerHeight,
          width: containerWidth,
          background: 'black',
        }}
      />
    </div>
  )
}

export const AnnotationViewerStateTester = ({
  containerHeight,
  containerWidth,
  id = 'AnnotationViewer',
}: TesterProps) => {
  const [data, setData] = useState<AnnotationData>({
    image: dummyImage,
    shapes: dummyShapes,
  })

  const passSameData = () => {
    setData({ image: dummyImage, shapes: dummyShapes })
  }
  const passDifferentImage = () => {
    setData({ image: anotherDummyImage, shapes: dummyShapes })
  }
  const passDifferentShapes = () => {
    setData({ image: dummyImage, shapes: dummyShapes.slice(3) })
  }
  const passDifferentOrientation = () => {
    setData({ image: dummyImage, shapes: dummyShapes, orientation: 90 })
  }

  const passEmptyImage = () => {
    setData({ shapes: dummyShapes })
  }

  return (
    <div
      data-cy="AnnotationViewerTester"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <button data-cy="same-data" onClick={passSameData}>
        Pass same data
      </button>
      <button data-cy="different-image" onClick={passDifferentImage}>
        Pass different Image
      </button>
      <button data-cy="different-shapes" onClick={passDifferentShapes}>
        Pass different shapes
      </button>
      <button
        data-cy="different-orientation"
        onClick={passDifferentOrientation}
      >
        Pass different orientation
      </button>
      <button data-cy="empty-image" onClick={passEmptyImage}>
        Pass empty image
      </button>
      <AnnotationViewer
        id={id}
        data={data}
        style={{
          height: containerHeight,
          width: containerWidth,
          background: 'black',
        }}
      />
    </div>
  )
}

export const AnnotationLensPointerPositionTester = ({
  id = 'annotationLens',
  containerHeight,
  containerWidth,
}: TesterProps) => {
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 })

  const onMove = () => {
    setPointerPosition((pointerPosition) => ({
      x: pointerPosition.x + 0.2,
      y: pointerPosition.y + 0.2,
    }))
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button data-cy="move-pointer" onClick={onMove}>
        Move pointer position
      </button>
      <AnnotationLens
        id={id}
        pointerPosition={pointerPosition}
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
      />
    </div>
  )
}
