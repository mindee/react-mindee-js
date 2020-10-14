// @flow

import type { Shape } from "common/types"
import { getImageBoundingBox } from "./canvasUtils"
import { drawImage } from "./drawingUtils"
import { Point, Polygon } from "./geometry"
import { settings } from "./settings"

const getImageFromPolygon = (canvas: HTMLCanvasElement, polygon: Polygon) => {
  const [offsetX, offsetY, width, height] = polygon.getSurroundingRectangle()
  const buffer = document.createElement("canvas")
  const context = buffer.getContext("2d")
  buffer.width = width
  buffer.height = height
  context.drawImage(
    canvas,
    offsetX,
    offsetY,
    width,
    height,
    0,
    0,
    buffer.width,
    buffer.height
  )
  return buffer.toDataURL("image/jpeg", 1.0)
}

export const getShapesWithImages = (image: string, shapes: Shape[]) => {
  const background = document.createElement("canvas")
  background.width = 800
  background.height = 800
  return new Promise<Shape[]>((resolve: (any) => void) => {
    const imageObject = new Image()
    imageObject.src = image
    imageObject.onload = () => {
      const imageBoundingBox = getImageBoundingBox(
        background,
        imageObject
      ).slice()
      drawImage(
        background,
        imageObject,
        imageBoundingBox,
        1,
        new Point(),
        settings
      )
      resolve(
        shapes
          .filter((shape: Shape) => shape.polygon)
          .map<Shape>((shape: Shape) => {
            const scaledPolygon = shape.polygon.scaleToImage(imageBoundingBox)
            return {
              ...shape,
              image: getImageFromPolygon(background, scaledPolygon),
            }
          })
      )
    }
  })
}

export const getImageFromShape = (imageObject: any, shape: Shape): string => {
  const background = document.createElement("canvas")
  background.width = 800
  background.height = 800
  const imageBoundingBox = getImageBoundingBox(background, imageObject).slice()
  drawImage(background, imageObject, imageBoundingBox, 1, new Point(), settings)
  const scaledPolygon = shape.polygon.scaleToImage(imageBoundingBox)
  return getImageFromPolygon(background, scaledPolygon)
}
