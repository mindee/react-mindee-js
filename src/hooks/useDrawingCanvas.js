// @flow
import { useEffect } from "react"

import type { Shape } from "common/types"
import { Point } from "helpers/geometry"
import type { SettingsShape } from "helpers/settings"
import { drawShapes } from "helpers/drawingUtils"

type Props = {
  refsLoading?: boolean,
  shapes: Shape[],
  imageBoundingBox: null | number[],
  zoom?: number,
  offset?: Point,
  selectedShape: null | Shape,
  settings?: SettingsShape,
  drawingLayer: HTMLCanvasElement,
  container: HTMLDivElement,
}
const useDrawingCanvas = ({
  refsLoading = true,
  shapes,
  imageBoundingBox,
  zoom = 1,
  offset = new Point(),
  selectedShape,
  drawingLayer,
  settings,
}: Props) => {
  useEffect(() => {
    if (!refsLoading && imageBoundingBox && shapes.length) {
      drawShapes(
        drawingLayer,
        selectedShape,
        shapes,
        imageBoundingBox,
        zoom,
        offset,
        settings
      )
    }
  }, [zoom, offset, shapes, selectedShape, refsLoading, imageBoundingBox])
}

export default useDrawingCanvas
