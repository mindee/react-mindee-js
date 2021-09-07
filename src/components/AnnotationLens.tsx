import React, { useEffect, useRef } from 'react'
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
  ImageBoundingBox,
  ImageData,
  AnnotationLensProps,
} from '@/common/types'

import { mapShapesToPolygons } from '@/utils/canvas'
import { rotateImage } from '@/utils/orientation'
import { handleLensZoom } from '@/utils/zoom'
import { handleResizeImage } from '@/utils/image'
import { clearLayers } from '@/utils/layer'

export default function AnnotationLens({
  id: containerId = uuidv4(),
  zoomLevel = DEFAULT_LENS_ZOOM_LEVEL,
  pointerPosition = DEFAULT_POINTER_POSITION,
  getStage,
  style = {},
  options: customOptions = {},
  data = DEFAULT_DATA,
}: AnnotationLensProps) {
  const options = {
    ...DEFAULT_ANNOTATION_LENS_OPTIONS,
    ...customOptions,
  }
  const annotationData = useRef(DEFAULT_DATA)
  const imageDataObject = useRef<ImageData>({
    element: new Image(),
    shape: new Konva.Image({ image: new Image() }),
  })
  const containerRef = useRef<HTMLDivElement | null>(null)

  const layersObject = useRef({
    shapes: new Konva.Layer({ id: KONVA_REFS.shapesLayer, listening: false }),
    image: new Konva.Layer({ listening: false }),
  })
  const stageObject = useRef<Konva.Stage | null>(null)
  const imageBoundingBoxObject = useRef<ImageBoundingBox | null>(null)
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
    layersObject.current.image.add(imageDataObject.current.shape)
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
    if (!data.image) {
      clearLayers(layersObject.current)
      imageDataObject.current.element = new Image()
      imageDataObject.current.shape.image(imageDataObject.current.element)
      annotationData.current = data
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
    imageDataObject.current.element.onload = () => {
      imageDataObject.current.shape.image(imageDataObject.current.element)
      resizeImage()
    }
    if (annotationData.current.orientation) {
      try {
        const image = await rotateImage(annotationData.current)
        imageDataObject.current.element.src = image
      } catch (error) {
        console.error(error)
      }
    } else {
      imageDataObject.current.element.src = annotationData.current.image!
    }
  }

  const drawShapes = () => {
    layersObject.current.shapes.destroyChildren()
    if (!annotationData.current.shapes) {
      return
    }
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
    const imageBoundingBox = handleResizeImage(
      stageObject.current,
      containerRef.current,
      imageDataObject.current
    )
    if (imageBoundingBox) {
      imageBoundingBoxObject.current = imageBoundingBox
      onZoomChange()
      drawShapes()
    }
  }

  return (
    <div
      style={{ ...DEFAULT_STYLE, ...style }}
      id={containerId}
      ref={containerRef}
    ></div>
  )
}
