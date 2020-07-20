// @flow

import { Point } from "./geometry"

import type { Shape } from "common/types"
import { getImageFromShape } from "./imageUtils"

export const zoomInto = (
  context: CanvasRenderingContext2D,
  zoom: number = 1,
  offset: Point = new Point()
): void => {
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.translate(...offset.toList())
  context.scale(zoom, zoom)
}

export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  container: HTMLElement
) => {
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
}

export const getCursorPosition = (
  canvas: HTMLCanvasElement,
  { clientX, clientY }: MouseEvent
): Point => {
  /*
   ** From a click event on canvas element, retrieves cursor position
   */
  const { left, top } = canvas.getBoundingClientRect()
  return new Point(clientX - left, clientY - top)
}

export const getClickPositionOnImage = (
  position: Point,
  imageBoundingBox: Array<number>
): Point => {
  /*
     ** Canvas may be bigger than our image,
     ** we want to retrieve the selected point relative to the image
  
     ** Naive implementation would return "position - imageOffset"
     ** If user get out of the image, we want shapes to be drawn within image,
     ** so we're going to set a range (0, image_size) for coordinates
     */
  const imageOffset = new Point(...imageBoundingBox.slice(0, 2))
  const imageSize = imageBoundingBox.slice(2, 4)
  const diff = position.subtract(imageOffset)

  return new Point(
    diff.x > 0 ? Math.min(diff.x, imageSize[0]) : 0,
    diff.y > 0 ? Math.min(diff.y, imageSize[1]) : 0
  )
}

export const getNativePosition = (
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  zoom: number,
  offset: Point
) => {
  /* When we click on a zoomed canvas, cursor position gives a
   * position on the canvas itself. We need to transform coordinates to
   * get pixel position on non transformed canvas
   */
  const cursorPosition = getCursorPosition(canvas, event)
  const unscaledOffset = offset.unscale(1 - zoom)
  return unscaledOffset.add(
    cursorPosition.subtract(unscaledOffset).unscale(zoom)
  )
}

export const getImageBoundingBox = (
  canvas: HTMLCanvasElement | DOMRect,
  imageObj: Image
): any[] => {
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const imageAspectRatio = imageObj.width / imageObj.height
  const canvasAspectRatio = canvasWidth / canvasHeight

  // Happy path - keep aspect ratio
  let xStart = 0
  let yStart = 0
  let renderableHeight = canvasHeight
  let renderableWidth = canvasWidth

  // If image's aspect ratio is less than canvas's we fit on height
  // and place the image centrally along width
  if (imageAspectRatio < canvasAspectRatio) {
    renderableWidth = imageObj.width * (renderableHeight / imageObj.height)
    xStart = Math.round((canvasWidth - renderableWidth) / 2)
  }

  // If image's aspect ratio is greater than canvas's we fit on width
  // and place the image centrally along height
  else if (imageAspectRatio > canvasAspectRatio) {
    renderableHeight = imageObj.height * (renderableWidth / imageObj.width)
    yStart = Math.round((canvasHeight - renderableHeight) / 2)
  }

  return [
    xStart,
    yStart,
    Math.round(renderableWidth),
    Math.round(renderableHeight),
  ]
}

export const getDragOffset = (
  event: MouseEvent,
  zoom: number,
  offset: Point
): Point => {
  const directionX = (event.movementX * zoom) / 2
  const directionY = (event.movementY * zoom) / 2
  const delta = new Point(directionX, directionY)
  return offset.add(delta)
}

export const geNewZoomParams = (
  event: WheelEvent,
  canvas: HTMLCanvasElement,
  zoom: number,
  offset: Point,
  options: {
    modifier: number,
    max: number,
  } = {
    modifier: 1,
    max: 5,
  }
) => {
  const { modifier, max } = options
  const zoomModifier = event.deltaY < 0 ? modifier : -modifier
  const newZoom = Math.min(max, Math.max(1, zoom + zoomModifier))
  const position = getCursorPosition(canvas, event)
  let newOffset = new Point()
  if (newZoom !== 1) {
    const moveTo = position.subtract(offset).scale(newZoom / zoom)
    newOffset = position.subtract(moveTo)
  }
  return {
    newZoom,
    newOffset,
  }
}

export const getSelectedShape = (
  imageObject: any,
  shapes: Shape[],
  cursorPosition: Point
): Shape | null => {
  let selectedShape = shapes.find(
    (shape: Shape) => shape.polygon && shape.polygon.contains(cursorPosition)
  )
  if (selectedShape) {
    selectedShape.image = getImageFromShape(imageObject, selectedShape)
  }

  return selectedShape || null
}
