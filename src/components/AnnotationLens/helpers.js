// @flow
import { settings } from "helpers/settings"
import drawPolyLines from "helpers/canvas/drawingUtils/polyLines"
import zoomInto from "../../helpers/canvas/context/zoom"

export const drawZoomedImage = ({
  shapes,
  context,
  background,
  size,
  cursorPosition,
  boundingBoxSize,
  zoomLevel,
}: any) => {
  const zoom = boundingBoxSize.map((el) => (el * zoomLevel) / size)
  context.save()
  context.fillStyle = settings.COLORS.BACKGROUND
  context.fillRect(0, 0, background.width, background.height)
  context.translate(-cursorPosition.x, -cursorPosition.y)
  const backgroundContext = background.getContext("2d")
  zoomInto(backgroundContext)
  context.scale(zoom[2], zoom[3])
  context.drawImage(background, 0, 0, size, size)
  shapes.forEach((shape) => {
    const points = [
      ...shape.shape.scale(...zoom.map((z) => z * size * zoomLevel)).toInt(),
    ]
    drawPolyLines(context, points, shape.color, settings.shapeOptions)
  })
  context.restore()
}
