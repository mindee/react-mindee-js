import { KonvaEventObject } from 'konva/lib/Node'
import React from 'react'
import { useEffect, useRef } from 'react'
import Konva from 'konva'
import { v4 as uuidv4 } from 'uuid'

import {
  onSelectionStart,
  onSelectionMove,
  onSelectionEnd,
  createSelectionRect,
} from '@/utils/selection'

import {
  AnnotationViewerProps,
  ImageBoundingBox,
  ImageData,
} from '@/common/types'

import {
  KONVA_REFS,
  DEFAULT_STYLE,
  DEFAULT_DATA,
  DEFAULT_ANNOTATION_VIEWER_OPTIONS,
} from '@/common/constants'

import { getMousePosition, mapShapesToPolygons } from '@/utils/canvas'
import { rotateImage } from '@/utils/orientation'
import { handleStageZoom } from '@/utils/zoom'
import useMultiSelection from '@/utils/useMultiSelection'
import { handleResizeImage } from '@/utils/image'
import { clearLayers } from '@/utils/layer'

export default function AnnotationViewer({
  id: containerId = uuidv4(),
  getPointerPosition,
  onShapeMouseEnter,
  onShapeMultiSelect,
  onShapeMouseLeave,
  getStage,
  style = {},
  onShapeClick,
  options: customOptions = {},
  data = DEFAULT_DATA,
}: AnnotationViewerProps) {
  const options = {
    ...DEFAULT_ANNOTATION_VIEWER_OPTIONS,
    ...customOptions,
  }
  const annotationData = useRef(DEFAULT_DATA)
  const isSelectionActiveRef = useRef(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const selectionRectObject = useRef(createSelectionRect(options))
  const imageDataObject = useRef<ImageData>({
    element: new Image(),
    shape: new Konva.Image({ image: new Image() }),
  })
  const layersObject = useRef({
    shapes: new Konva.Layer({ id: KONVA_REFS.shapesLayer }),
    image: new Konva.Layer({ listening: false }),
  })
  const stageObject = useRef<Konva.Stage | null>(null)
  const imageBoundingBoxObject = useRef<ImageBoundingBox | null>(null)

  useMultiSelection({ stage: stageObject.current, isSelectionActiveRef })

  useEffect(() => {
    initCanvas()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', resizeImage)
    return () => {
      window.removeEventListener('resize', resizeImage)
    }
  }, [data])

  useEffect(() => {
    // if image is null or undefined, we should clear everything and wait for the next state change
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

  const initCanvas = () => {
    stageObject.current = new Konva.Stage({
      container: containerId,
    })
    getStage?.(stageObject.current)
    stageObject.current.add(
      layersObject.current.image,
      layersObject.current.shapes
    )
    stageObject.current.on('wheel', onZoom)
    layersObject.current.image.add(imageDataObject.current.shape)
    getPointerPosition &&
      stageObject.current.on('mousemove', () => {
        const mousePointTo = getMousePosition(
          stageObject.current,
          imageBoundingBoxObject.current
        )
        mousePointTo && getPointerPosition(mousePointTo)
      })
    if (options.enableSelection) {
      layersObject.current.shapes.add(selectionRectObject.current)
      stageObject.current.on('mousedown touchstart', (event) =>
        onSelectionStart(
          event,
          layersObject.current.shapes,
          selectionRectObject.current,
          isSelectionActiveRef.current
        )
      )
      stageObject.current.on('mousemove touchmove', () =>
        onSelectionMove(
          layersObject.current.shapes,
          selectionRectObject.current
        )
      )
      stageObject.current.on('mouseup touchend', () =>
        onSelectionEnd(
          layersObject.current.shapes,
          selectionRectObject.current,
          onShapeMultiSelect
        )
      )
    }
  }

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
    if (options.enableSelection) {
      layersObject.current.shapes.add(selectionRectObject.current)
    }
    if (!annotationData.current.shapes) {
      return
    }

    mapShapesToPolygons(
      layersObject.current.shapes,
      annotationData.current.shapes,
      true,
      imageBoundingBoxObject.current,
      options,
      onShapeClick,
      onShapeMouseEnter,
      onShapeMouseLeave
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
      layersObject.current.image.batchDraw()
      drawShapes()
    }
  }

  const onZoom = (event: KonvaEventObject<any>) => {
    handleStageZoom(
      stageObject.current,
      imageBoundingBoxObject.current,
      event,
      options
    )
  }
  return (
    <div
      style={{ ...DEFAULT_STYLE, ...style }}
      id={containerId}
      ref={containerRef}
    ></div>
  )
}
