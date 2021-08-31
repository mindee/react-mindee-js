import Konva from 'konva'
import { Line, LineConfig } from 'konva/lib/shapes/Line'
import { RectConfig } from 'konva/lib/shapes/Rect'

export type AnnotationShape<T = any> = T & {
  id: string
  coordinates: number[][]
  config?: LineConfig
}

export type Orientation = 0 | 90 | 180 | 270

export type BaseOptions = {
  shapeConfig?: LineConfig
}

export type AnnotationLayers = {
  shapes: Konva.Layer
  image: Konva.Layer
}

export type AnnotationLensOptions = BaseOptions

export type AnnotationViewerOptions = BaseOptions & {
  selectionRectConfig?: RectConfig
  enableSelection?: boolean
  onMouseEnter?: (polygon: Line) => void
  onMouseLeave?: (polygon: Line) => void
  onClick?: (polygon: Line) => void
  zoom?: {
    modifier: number
    max: number
    defaultZoom: number
  }
}

export type ImageBoundingBox = {
  x: number
  y: number
  width: number
  height: number
  scale: number
}

export type PointerPosition = {
  x: number
  y: number
}

export type AnnotationData = {
  image?: string | null
  shapes?: AnnotationShape[]
  orientation?: Orientation
}
