import React, { CSSProperties, useEffect, useRef } from 'react'
import Konva from 'konva'
import { v4 as uuidv4 } from 'uuid'

import {
  KONVA_REFS,
  DEFAULT_STYLE,
  DEFAULT_POINTER_POSITION,
  DEFAULT_LENS_ZOOM_LEVEL,
  DEFAULT_DATA,
  DEFAULT_ANNOTATION_LENS_OPTIONS,
} from '@/common/constants'

import {
  PointerPosition,
  ImageBoundingBox,
  AnnotationData,
  AnnotationLensOptions,
} from '@/common/types'

import { mapShapesToPolygons } from '@/utils/canvas'
import { rotateImage } from '@/utils/orientation'
import { handleLensZoom } from '@/utils/zoom'
import { createImageShape, handleResizeImage } from '@/utils/image'
import { clearLayers } from '@/utils/layer'

interface Props {
  id?: string
  zoomLevel?: number
  data?: AnnotationData
  pointerPosition?: PointerPosition
  getStage?: (stage: Konva.Stage) => void
  style?: CSSProperties
  options?: AnnotationLensOptions
}

export default function AnnotationLens({
  id: containerId = uuidv4(),
  zoomLevel = DEFAULT_LENS_ZOOM_LEVEL,
  pointerPosition = DEFAULT_POINTER_POSITION,
  getStage,
  style = {},
  options: customOptions = {},
  data = DEFAULT_DATA,
}: Props) {
  const options = {
    ...DEFAULT_ANNOTATION_LENS_OPTIONS,
    ...customOptions,
  }
  const annotationData = useRef(DEFAULT_DATA)
  const imageObject = useRef(new Image())
  const imageShapeObject = useRef<Konva.Image | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const layersObject = useRef({
    shapes: new Konva.Layer({ id: KONVA_REFS.shapesLayer, listening: false }),
    image: new Konva.Layer({ listening: false }),
  })
  const stageObject = useRef<Konva.Stage>()
  const imageBoundingBoxObject = useRef<ImageBoundingBox>()

  useEffect(() => {
    stageObject.current = new Konva.Stage({
      container: containerId,
      listening: false,
    })
    getStage?.(stageObject.current)
    stageObject.current.add(
      layersObject.current.image,
      layersObject.current.shapes
    )
  }, [])

  const onZoomChange = () => {
    handleLensZoom(
      stageObject.current,
      imageBoundingBoxObject.current,
      pointerPosition,
      zoomLevel
    )
  }

  useEffect(() => {
    onZoomChange()
  }, [pointerPosition, zoomLevel])

  useEffect(() => {
    // if image is null or undefined, we should clear everything and wait for the next state change
    if (!data.image) {
      clearLayers(layersObject.current)
      imageObject.current = new Image()
      return
    }
    if (
      annotationData.current.image !== data.image ||
      data.orientation !== annotationData.current.orientation
    ) {
      annotationData.current = data
      loadImage()
    } else {
      annotationData.current = data
      drawShapes()
    }
  }, [data])

  const loadImage = async () => {
    imageObject.current.onload = () => {
      layersObject.current.image.destroyChildren()
      imageShapeObject.current = createImageShape(imageObject.current)
      layersObject.current.image.add(imageShapeObject.current!)
      resizeImage()
    }
    if (annotationData.current.orientation) {
      try {
        const image = await rotateImage(annotationData.current)
        imageObject.current.src = image
      } catch (error) {
        console.error(error)
      }
    } else {
      imageObject.current.src = annotationData.current.image!
    }
  }

  const drawShapes = () => {
    layersObject.current.shapes.destroyChildren()
    mapShapesToPolygons(
      layersObject.current.shapes,
      annotationData.current.shapes,
      false,
      imageBoundingBoxObject.current,
      options
    )

    layersObject.current.shapes.batchDraw()
  }

  const resizeImage = () => {
    imageBoundingBoxObject.current = handleResizeImage(
      stageObject.current,
      containerRef.current,
      imageObject.current,
      imageShapeObject.current as Konva.Image | undefined
    )
    layersObject.current.image.batchDraw()
    onZoomChange()
    drawShapes()
  }

  return (
    <div
      style={{ ...DEFAULT_STYLE, ...style }}
      id={containerId}
      ref={containerRef}
    ></div>
  )
}
