import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { KonvaEventObject } from 'konva/lib/Node'
import { Line } from 'konva/lib/shapes/Line'
import { Rect } from 'konva/lib/shapes/Rect'
import { Stage } from 'konva/lib/Stage'

import { KONVA_REFS } from '@/common/constants'
import { AnnotationShape, AnnotationViewerOptions } from '@/common/types'

import { roundTo } from './roundTo'

export const createSelectionRect = (options: AnnotationViewerOptions) =>
  new Konva.Rect({
    visible: false,
    ...options.selectionRectConfig,
  })

export const calculateSelectionPoint = (stage: Stage) => {
  const stagePosition = stage.position()
  const pointerPosition = stage.getPointerPosition()

  if (!pointerPosition) return

  const x = roundTo((pointerPosition.x - stagePosition.x) / stage.scaleX(), 2)
  const y = roundTo((pointerPosition.y - stagePosition.y) / stage.scaleX(), 2)

  return { x, y }
}

export const onSelectionStart = (
  event?: KonvaEventObject<Stage>,
  layer?: Layer,
  rect?: Rect,
  selectionEnabled?: boolean,
) => {
  if (!selectionEnabled || !layer || !rect || !event) return

  const stage = layer.getStage()
  const firstPoint = calculateSelectionPoint(stage)

  if (!firstPoint) return

  rect.setAttrs({ x1: firstPoint.x, y1: firstPoint.y })
  rect.visible(true)
  rect.width(0)
  rect.height(0)
  layer.draw()
}

export const onSelectionMove = (layer?: Layer, rect?: Rect) => {
  const stage = layer?.getStage()

  if (!stage || !rect || !layer) return

  // no nothing if we didn't start selection
  if (!rect.visible()) return

  const { x1, y1 } = rect.getAttrs()
  const secondPoint = calculateSelectionPoint(stage)

  if (!secondPoint) return

  rect.setAttrs({
    x: Math.min(x1, secondPoint.x),
    y: Math.min(y1, secondPoint.y),
    width: Math.abs(secondPoint.x - x1),
    height: Math.abs(secondPoint.y - y1),
  })

  layer.batchDraw()
}

export const onSelectionEnd = (
  layer?: Layer,
  rect?: Rect,
  onShapeMultiSelect?: (shapes: AnnotationShape[]) => void,
) => {
  const stage = layer?.getStage()

  if (!stage || !rect || !layer) return

  // no nothing if we didn't start selection
  if (!rect.visible()) return

  // update visibility in timeout, so we can check it in click event
  setTimeout(() => {
    rect.visible(false)
    layer.batchDraw()
  })

  const shapes = (stage.find(`.${KONVA_REFS.shape}`) || []) as Line[]
  const box = rect.getClientRect()

  const selected = shapes
    .filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()))
    .map((shape) => shape.getAttr('shape'))

  if (selected.length) onShapeMultiSelect?.(selected)

  layer.batchDraw()
}
