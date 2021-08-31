import { KONVA_REFS } from '@/common/constants'
import Konva from 'konva'

import { AnnotationShape, AnnotationViewerOptions } from '@/common/types'
import { Layer } from 'konva/lib/Layer'
import { KonvaEventObject } from 'konva/lib/Node'
import { Rect } from 'konva/lib/shapes/Rect'
import { Stage } from 'konva/lib/Stage'
import { Line } from 'konva/lib/shapes/Line'

export const createSelectionRect = (options: AnnotationViewerOptions) =>
  new Konva.Rect({
    visible: false,
    ...options.selectionRectConfig,
  })

export const onSelectionStart = (
  event?: KonvaEventObject<Stage>,
  layer?: Layer,
  rect?: Rect,
  selectionEnabled?: boolean
) => {
  if (!selectionEnabled || !layer || !rect || !event) {
    return
  }
  const stage = layer.getStage()
  const pointerPosition = stage.getPointerPosition()
  if (!stage || event.target !== stage || !pointerPosition) {
    return
  }
  const x = stage.x()
  const y = stage.y()
  const scale = stage.scaleX()
  const x1 = (pointerPosition.x - x) / scale
  const y1 = (pointerPosition.y - y) / scale

  rect.setAttrs({ x1, y1 })
  rect.visible(true)
  rect.width(0)
  rect.height(0)
  layer.draw()
}

export const onSelectionMove = (layer?: Layer, rect?: Rect) => {
  const stage = layer?.getStage()
  const pointerPosition = stage?.getPointerPosition()
  if (!stage || !pointerPosition || !rect || !layer) {
    return
  }
  const x = stage.x()
  const y = stage.y()
  const scale = stage.scaleX()
  // no nothing if we didn't start selection
  if (!rect.visible()) {
    return
  }
  const x2 = (pointerPosition.x - x) / scale
  const y2 = (pointerPosition.y - y) / scale
  const { x1, y1 } = rect.getAttrs()
  rect.setAttrs({
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  })
  layer.batchDraw()
}

export const onSelectionEnd = (
  layer?: Layer,
  rect?: Rect,
  onShapeMultiSelect?: (shapes: AnnotationShape[]) => void
) => {
  // no nothing if we didn't start selection
  const stage = layer?.getStage()
  if (!rect || !rect.visible() || !layer || !stage) {
    return
  }
  // update visibility in timeout, so we can check it in click event
  setTimeout(() => {
    rect.visible(false)
    layer.batchDraw()
  })

  const shapes = (stage.find(`.${KONVA_REFS.shape}`) || []) as Line[]
  const box = rect.getClientRect()
  const selected = shapes
    .filter((shape: Konva.Shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    )
    .map((shape: Konva.Shape) => shape.getAttr('shape'))
  if (selected.length) {
    onShapeMultiSelect?.(selected)
  }

  layer.batchDraw()
}
