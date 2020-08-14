// @flow

import { Point, GeometryElement } from "./geometry"
import type { Shape } from "common/types"
import { COLORS } from "./settings"
import { zoomInto } from "./canvasUtils"
import { type SettingsShape } from "./settings"
import { hexaColorToRGBWithAndOpacity } from "./colorUtils"

export const drawImage = (
  canvas: HTMLCanvasElement,
  imageObject: CanvasImageSource,
  imageBoundingBox: Array<number>,
  zoom: number = 1,
  offset: Point = new Point(),
  settings: SettingsShape
) => {
  const context = canvas.getContext("2d", { alpha: false })
  context.fillStyle = settings.COLORS.BACKGROUND
  context.fillRect(0, 0, canvas.width + 1, canvas.height + 1)
  zoomInto(context, zoom, offset)
  context.drawImage(imageObject, ...imageBoundingBox)
}

const drawPolyLines = (
  context: CanvasRenderingContext2D,
  points: Array<GeometryElement>,
  strokeStyle: any = COLORS.RED,
  {
    lineWidth,
    fillOpacity,
    closePath,
    strokes,
    fill,
  }: $PropertyType<SettingsShape, "shapeOptions">
) => {
  context.save()
  context.beginPath()
  const color = strokeStyle
  context.strokeStyle = color
  context.lineWidth = lineWidth
  context.fillStyle = hexaColorToRGBWithAndOpacity(color, fillOpacity / 100)
  points.map((point) => context.lineTo(...point.toList()))
  closePath && context.closePath()
  strokes && context.stroke()
  fill && context.fill()
  context.restore()
}

export const drawShapes = (
  canvas: HTMLCanvasElement,
  selectedShape: null | Shape,
  shapes: Shape[],
  imageBoundingBox: number[],
  zoom: number,
  offset: Point,
  settings: any
): void => {
  const context = canvas.getContext("2d")
  context.clearRect(0, 0, canvas.width, canvas.height)
  zoomInto(context, zoom, offset)
  shapes.forEach((shape: Shape) => {
    if (shape.polygon) {
      const scaledShape = shape.polygon.scaleToImage(imageBoundingBox)
      const isHighlighted =
        (!!selectedShape &&
          selectedShape.featureName === shape.featureName &&
          selectedShape.index === shape.index) ||
        shape.isActive

      const shapeOptions = isHighlighted
        ? { ...settings.shapeOptions, ...settings.highlightedShapeOptions }
        : settings.shapeOptions
      drawPolyLines(context, scaledShape.points, shape.color, shapeOptions, {
        isHighlighted,
        ...shape.active,
      })
    }
  })
}
