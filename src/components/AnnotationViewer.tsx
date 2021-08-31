import { KonvaEventObject } from 'konva/lib/Node'
import React from 'react'
import { CSSProperties, useEffect, useRef } from 'react'
import Konva from 'konva'
import { v4 as uuidv4 } from 'uuid'

import {
  onSelectionStart,
  onSelectionMove,
  onSelectionEnd,
  createSelectionRect,
} from '@/utils/selection'

import {
  AnnotationData,
  AnnotationShape,
  AnnotationViewerOptions,
  ImageBoundingBox,
  PointerPosition,
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
import { createImageShape, handleResizeImage } from '@/utils/image'
import { clearLayers } from '@/utils/layer'

interface Props {
  id?: string
  getPointerPosition?: (data: PointerPosition) => void
  data?: AnnotationData
  getStage?: (stage: Konva.Stage) => void
  onShapeMultiSelect?: (shapes: AnnotationShape[]) => void
  onShapeClick?: (shape: AnnotationShape) => void
  onShapeMouseEnter?: (shape: AnnotationShape) => void
  onShapeMouseLeave?: (shape: AnnotationShape) => void
  options?: AnnotationViewerOptions
  style?: CSSProperties
}

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
}: Props) {
  const options = {
    ...DEFAULT_ANNOTATION_VIEWER_OPTIONS,
    ...customOptions,
  }
  const annotationData = useRef(DEFAULT_DATA)
  const isSelectionActiveRef = useRef(false)
  const imageObject = useRef(new Image())
  const imageShapeObject = useRef<Konva.Image | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const selectionRectObject = useRef(createSelectionRect(options))
  const layersObject = useRef({
    shapes: new Konva.Layer({ id: KONVA_REFS.shapesLayer }),
    image: new Konva.Layer({ listening: false }),
  })
  const stageObject = useRef<Konva.Stage | undefined>()
  const imageBoundingBoxObject = useRef<ImageBoundingBox | undefined>()

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

  const initCanvas = () => {
    stageObject.current = new Konva.Stage({
      container: containerId,
    })
    getStage?.(stageObject.current)
    layersObject.current.image.listening(false)
    stageObject.current.add(
      layersObject.current.image,
      layersObject.current.shapes
    )
    stageObject.current.on('wheel', onZoom)
    getPointerPosition &&
      stageObject.current.on('mousemove', () => {
        const mousePointTo = getMousePosition(
          stageObject.current,
          imageBoundingBoxObject.current
        )
        mousePointTo && getPointerPosition(mousePointTo)
      })
    if (options.enableSelection) {
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
    if (options.enableSelection) {
      layersObject.current.shapes.add(selectionRectObject.current)
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
    imageBoundingBoxObject.current = handleResizeImage(
      stageObject.current,
      containerRef.current,
      imageObject.current,
      imageShapeObject.current as Konva.Image | undefined
    )
    layersObject.current.image.batchDraw()
    drawShapes()
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
