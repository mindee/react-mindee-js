import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'

import { DEFAULT_LENS_ZOOM_LEVEL } from '@/common/constants'
import {
  AnnotationViewerOptions,
  ImageBoundingBox,
  PointerPosition,
} from '@/common/types'

import { roundTo } from '@/utils/roundTo'

export const calculateZoomScale = (
  stage: Konva.Stage,
  zoomScale: number,
  imageBoundingBox: ImageBoundingBox,
) => {
  const oldScale = stage.scaleX()

  const stagePosition = stage.position()
  const pointerPosition = {
    x: 0.5 * imageBoundingBox.width + imageBoundingBox.x,
    y: 0.5 * imageBoundingBox.height + imageBoundingBox.y,
  }

  const mousePointTo = {
    x: (pointerPosition.x - stagePosition.x) / oldScale,
    y: (pointerPosition.y - stagePosition.y) / oldScale,
  }

  const newScale = zoomScale * imageBoundingBox.scale

  const newPos = {
    x: roundTo(pointerPosition.x - mousePointTo.x * newScale, 2),
    y: roundTo(pointerPosition.y - mousePointTo.y * newScale, 2),
  }

  return { newScale: roundTo(newScale, 2), newPos }
}

export const handleZoomScale = (
  stage: Konva.Stage | null,
  zoomScale: number,
  imageBoundingBox: ImageBoundingBox | null,
) => {
  if (!stage || !imageBoundingBox) return

  const { newScale, newPos } = calculateZoomScale(
    stage,
    zoomScale,
    imageBoundingBox,
  )

  if (newScale < imageBoundingBox.scale) {
    stage.draggable(false)
    stage.scale({ x: imageBoundingBox.scale, y: imageBoundingBox.scale })
    stage.position({ x: imageBoundingBox.x, y: imageBoundingBox.y })
    stage.setAttr('zoomScale', 1)
  } else {
    stage.draggable(true)
    stage.scale({ x: newScale, y: newScale })
    stage.setAttr('zoomScale', newScale / imageBoundingBox.scale)
    stage.position(newPos)
  }

  stage.batchDraw()
}

export const calculateStageZoom = (
  stage: Konva.Stage,
  deltaY: number,
  options: AnnotationViewerOptions,
) => {
  const oldScale = stage.scaleX()

  const stagePosition = stage.position()
  const pointerPosition = stage.getPointerPosition() || { x: 0, y: 0 }

  const mousePointTo = {
    x: (pointerPosition.x - stagePosition.x) / oldScale,
    y: (pointerPosition.y - stagePosition.y) / oldScale,
  }

  const { modifier } = options.zoom!

  const newScale = deltaY < 0 ? oldScale * modifier : oldScale / modifier

  const newPos = {
    x: roundTo(pointerPosition.x - mousePointTo.x * newScale, 2),
    y: roundTo(pointerPosition.y - mousePointTo.y * newScale, 2),
  }

  return { newScale: roundTo(newScale, 2), newPos }
}

export const handleStageZoom = (
  stage: Konva.Stage | null,
  imageBoundingBox: ImageBoundingBox | null,
  event: KonvaEventObject<WheelEvent>,
  options: AnnotationViewerOptions,
) => {
  if (!stage || !imageBoundingBox) return

  event.evt.preventDefault()

  const { max } = options.zoom!

  const { newScale, newPos } = calculateStageZoom(
    stage,
    event.evt.deltaY,
    options,
  )

  if (newScale > max) return

  if (newScale < imageBoundingBox.scale) {
    stage.draggable(false)
    stage.scale({ x: imageBoundingBox.scale, y: imageBoundingBox.scale })
    stage.position({ x: imageBoundingBox.x, y: imageBoundingBox.y })
    stage.setAttr('zoomScale', 1)
  } else {
    stage.draggable(true)
    stage.scale({ x: newScale, y: newScale })
    stage.setAttr('zoomScale', newScale / imageBoundingBox.scale)
    stage.position(newPos)
  }

  stage.batchDraw()
}

export const calculateLensZoom = (
  pointerPosition: PointerPosition,
  imageBoundingBox: ImageBoundingBox,
  stage: Konva.Stage,
  zoomLevel: number,
): PointerPosition => {
  const pointerX =
    (pointerPosition.x * imageBoundingBox.width) / imageBoundingBox.scale
  const pointerY =
    (pointerPosition.y * imageBoundingBox.height) / imageBoundingBox.scale

  return {
    x: roundTo(-pointerX * zoomLevel + stage.width() / 2, 2),
    y: roundTo(-pointerY * zoomLevel + stage.height() / 2, 2),
  }
}

export const handleLensZoom = (
  stage: Konva.Stage | null,
  imageBoundingBox: ImageBoundingBox | null,
  pointerPosition: PointerPosition,
  zoomLevel = DEFAULT_LENS_ZOOM_LEVEL,
) => {
  if (!stage || !imageBoundingBox) return

  const newPos = calculateLensZoom(
    pointerPosition,
    imageBoundingBox,
    stage,
    zoomLevel,
  )

  stage.scale({ x: zoomLevel, y: zoomLevel })
  stage.position(newPos)
  stage.batchDraw()
}
