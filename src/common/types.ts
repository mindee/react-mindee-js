import Konva from 'konva'
import { Line, LineConfig } from 'konva/lib/shapes/Line'
import { RectConfig } from 'konva/lib/shapes/Rect'
import { CSSProperties } from 'react'

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

export type ImageData = {
  element: HTMLImageElement
  shape: Konva.Image
}

export interface AnnotationViewerProps {
  id?: string
  getPointerPosition?: (data: PointerPosition) => void
  data?: AnnotationData
  getStage?: (stage: Konva.Stage) => void
  onShapeMultiSelect?: (shapes: AnnotationShape[]) => void
  onShapeClick?: (shape: AnnotationShape) => void
  onShapeMouseEnter?: (shape: AnnotationShape) => void
  onShapeMouseLeave?: (shape: AnnotationShape) => void
  options?: AnnotationViewerOptions
  style?: CSSProperties
}

export interface AnnotationLensProps {
  id?: string
  zoomLevel?: number
  data?: AnnotationData
  pointerPosition?: PointerPosition
  getStage?: (stage: Konva.Stage) => void
  style?: CSSProperties
  options?: AnnotationLensOptions
}
