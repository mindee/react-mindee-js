// @flow

import { Point } from "../geometry"
import type { Shape } from "../types"

export const getSideShapes = (shapes: Shape[]): Shape[] => {
  return shapes.map((shape) => {
    const newShape = { ...shape }
    newShape.shape = newShape.shape.clone()
    const newX = newShape.shape.computeCenter().x < 0.5 ? 0 : 1
    newShape.shape.points.forEach((p) => p.set(newX, p.y))

    return newShape
  })
}

export const interpolateShapes = (
  startShapes: Shape[],
  shapes: Shape[],
  t: number,
  strategy: string
): Shape[] => {
  return shapes.map((shape, index) => {
    shape = { ...shape }
    shape.shape = interpolatePolygon(
      startShapes[index].shape,
      shape.shape,
      t,
      strategy
    )
    return shape
  })
}
export const interpolate = (
  start: number,
  end: number,
  t: number,
  strategy: string = "linear"
) => start + (end - start) * EasingFunctions[strategy](t)

export const interpolatePoint = (
  start: GeometryElement,
  end: GeometryElement,
  t: number,
  strategy: string = "linear"
): GeometryElement => {
  return new Point(
    interpolate(start.x, end.x, t, strategy),
    interpolate(start.y, end.y, t, strategy)
  )
}

export const interpolatePolygon = (
  start: Polygon,
  end: Polygon,
  t: number,
  strategy: string = "linear"
): Polygon => {
  // We clone to keep extra data
  const newPolygon = end.clone()
  newPolygon.points = newPolygon.points.map((endPoint, index) =>
    interpolatePoint(start.points[index], endPoint, t, strategy)
  )
  return newPolygon
}

export const EasingFunctions: { [string]: (number) => number } = {
  // no easing, no acceleration
  linear: (t) => t,
  // accelerating from zero velocity
  easeInQuad: (t) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t) => {
    t = t - 1
    return t * t * t + 1
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t) => {
    t = t - 1
    return 1 - t * t * t * t
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t) => {
    if (t < 0.5) {
      return 8 * t * t * t * t
    } else {
      t = t - 1
      return 1 - 8 * t * t * t * t
    }
  },
  // accelerating from zero velocity
  easeInQuint: (t) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t) => {
    t = t - 1
    return 1 + t * t * t * t * t
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t) => {
    if (t < 0.5) {
      return 16 * t * t * t * t * t
    } else {
      t = t - 1
      return 1 + 16 * t * t * t * t * t
    }
  },
}
