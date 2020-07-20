// @flow
import type { Polygon, Point } from "helpers/geometry"

export type Shape = {
  id: string,
  featureIndex: number,
  polygon: Polygon,
  featureName: string,
  index: number,
  isActive: boolean,
  color?: string,
  active?: {
    color: string,
    lineWidth: number,
  },
  image?: string,
  element?: any,
  data?: any,
}

export type LensProps = {
  cursorPosition: Point,
  selectedShape: Shape,
}
