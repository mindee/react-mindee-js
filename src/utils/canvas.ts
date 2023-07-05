import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Line } from 'konva/lib/shapes/Line'

import { KONVA_REFS } from '@/common/constants'
import {
  AnnotationLensOptions,
  AnnotationShape,
  AnnotationViewerOptions,
  ImageBoundingBox,
  PointerPosition,
} from '@/common/types'

export const mapShapesToPolygons = (
  shapesLayer: Layer,
  shapes: AnnotationShape[] = [],
  useEvents = true,
  imageBoundingBox: ImageBoundingBox | null,
  options: AnnotationLensOptions | AnnotationViewerOptions,
  onClick?: (shape: AnnotationShape) => void,
  onShapeMouseEnter?: (shape: AnnotationShape) => void,
  onShapeMouseLeave?: (shape: AnnotationShape) => void,
) => {
  if (!imageBoundingBox) {
    return
  }
  shapes.forEach((shape: AnnotationShape) => {
    const polygon = new Konva.Line({
      id: shape.id,
      name: KONVA_REFS.shape,
      points: mapCoordinatesToPoints(shape.coordinates, imageBoundingBox),
      closed: true,

      ...(options?.shapeConfig || {}),
      ...shape.config,
      shape,
    })
    shapesLayer.add(polygon)
    if (useEvents) {
      bindEventToPolygon(
        polygon,
        options as AnnotationViewerOptions,
        onClick,
        onShapeMouseEnter,
        onShapeMouseLeave,
      )
    }
  })
}

const bindEventToPolygon = (
  polygon: Line,
  options: AnnotationViewerOptions,
  onClick?: (shape: AnnotationShape) => void,
  onShapeMouseEnter?: (shape: AnnotationShape) => void,
  onShapeMouseLeave?: (shape: AnnotationShape) => void,
) => {
  const stage = polygon.getStage()
  const shape = polygon.getAttr('shape')
  polygon.on('mousedown', (event) => {
    event.cancelBubble = true
    onClick?.(shape)
    options?.onClick?.(polygon)
  })
  polygon.on('mouseleave', function (event) {
    event.cancelBubble = true
    stage!.container().style.cursor = 'inherit'
    options?.onMouseLeave?.(polygon)
    onShapeMouseLeave?.(shape)
  })
  polygon.on('mouseenter', function (event) {
    event.cancelBubble = true
    options?.onMouseEnter?.(polygon)
    stage!.container().style.cursor = 'pointer'
    onShapeMouseEnter?.(shape)
  })
}

export const scalePointToImage = (
  point: PointerPosition,
  imageBoundingBox: ImageBoundingBox,
) => {
  const { width, height, scale } = imageBoundingBox
  return {
    x: (Math.min(point.x, 1) * width) / scale,
    y: (Math.min(point.y, 1) * height) / scale,
  }
}

const mapCoordinatesToPoints = (
  coordinates: number[][],
  imageBoundingBox: ImageBoundingBox,
): number[] =>
  coordinates.reduce((accumulator, element) => {
    const { x, y } = scalePointToImage(
      { x: element[0], y: element[1] },
      imageBoundingBox,
    )
    accumulator = accumulator.concat([x, y])
    return accumulator
  }, [])

export const getMousePosition = (
  stage: Konva.Stage | null,
  imageBoundingBox: ImageBoundingBox | null,
) => {
  if (!stage || !imageBoundingBox) {
    return
  }
  const { x: pointerX, y: pointerY } = stage.getPointerPosition() || {
    x: 0,
    y: 0,
  }
  const oldScale = stage.scaleX()
  const stageX = stage.x()
  const stageY = stage.y()
  return {
    x:
      ((pointerX - stageX) * imageBoundingBox.scale) /
      (oldScale * imageBoundingBox.width),
    y:
      ((pointerY - stageY) * imageBoundingBox.scale) /
      (oldScale * imageBoundingBox.height),
  }
}
