import { DEFAULT_LENS_ZOOM_LEVEL } from '@/common/constants'
import {
  AnnotationViewerOptions,
  ImageBoundingBox,
  PointerPosition,
} from '@/common/types'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'

export const handleStageZoom = (
  stage: Konva.Stage | null,
  imageBoundingBox: ImageBoundingBox | null,
  event: KonvaEventObject<any>,
  options: AnnotationViewerOptions
) => {
  if (!stage || !imageBoundingBox) {
    return
  }
  const { x, y, scale } = imageBoundingBox
  event.evt.preventDefault()
  const oldScale = stage.scaleX()
  const stageX = stage.x()
  const stageY = stage.y()
  const { x: pointerX, y: pointerY } = stage.getPointerPosition() || {
    x: 0,
    y: 0,
  }

  const mousePointTo = {
    x: (pointerX - stageX) / oldScale,
    y: (pointerY - stageY) / oldScale,
  }
  const { max, modifier, defaultZoom } = options.zoom!

  const newScale =
    event.evt.deltaY < 0 ? oldScale * modifier : oldScale / modifier
  if (newScale > max) {
    return
  }
  if (newScale / scale <= defaultZoom) {
    stage.draggable(false)
    stage.scale({ x: scale, y: scale })
    stage.position({ x, y })
  } else {
    stage.draggable(true)
    stage.scale({ x: newScale, y: newScale })
    const newPos = {
      x: pointerX - mousePointTo.x * newScale,
      y: pointerY - mousePointTo.y * newScale,
    }
    stage.position(newPos)
  }

  stage.batchDraw()
}

export const handleLensZoom = (
  stage: Konva.Stage | null,
  imageBoundingBox: ImageBoundingBox | null,
  pointerPosition: PointerPosition,
  zoomLevel = DEFAULT_LENS_ZOOM_LEVEL
) => {
  if (!stage || !imageBoundingBox) {
    return
  }
  const { height, width, scale } = imageBoundingBox

  const { x: _x, y: _y } = pointerPosition
  const pointerX = (_x * width) / scale
  const pointerY = (_y * height) / scale
  const newScale = zoomLevel
  stage.scale({ x: newScale, y: newScale })
  const newPos = {
    x: -pointerX * newScale + stage.width() / 2,
    y: -pointerY * newScale + stage.height() / 2,
  }
  stage.position(newPos)

  stage.batchDraw()
}
