import type { CSSProperties } from 'react'
import type Konva from 'konva'
import type { Line, LineConfig } from 'konva/lib/shapes/Line'
import type { RectConfig } from 'konva/lib/shapes/Rect'
import type { Stage } from 'konva/lib/Stage'

export type AnnotationShape<T extends object = object> = T & {
  id: string
  coordinates: number[][]
  config?: LineConfig
}

export type Orientation = 0 | 90 | 180 | 270

export interface BaseOptions {
  shapeConfig?: LineConfig
}

export interface AnnotationLayers {
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

export interface ImageBoundingBox {
  x: number
  y: number
  width: number
  height: number
  scale: number
}

export interface PointerPosition {
  x: number
  y: number
}

export interface AnnotationData {
  image?: string | null
  shapes?: AnnotationShape[]
  orientation?: Orientation
}

export interface ImageData {
  element: HTMLImageElement
  shape: Konva.Image
}

export interface ZoomOptions {
  scale?: number
  position?: PointerPosition
}
export interface AnnotationViewerProps {
  id?: string
  getPointerPosition?: (data: PointerPosition) => void
  data?: AnnotationData
  getStage?: (stage: Stage) => void
  onShapeMultiSelect?: (shapes: AnnotationShape[]) => void
  onShapeClick?: (shape: AnnotationShape) => void
  onShapeMouseEnter?: (shape: AnnotationShape) => void
  onShapeMouseLeave?: (shape: AnnotationShape) => void
  options?: AnnotationViewerOptions
  style?: CSSProperties
  zoomScale?: number
  customStagePosition?: PointerPosition
  customZoomLevel?: number
}

export interface AnnotationLensProps {
  id?: string
  zoomLevel?: number
  data?: AnnotationData
  pointerPosition?: PointerPosition
  getStage?: (stage: Stage) => void
  style?: CSSProperties
  options?: AnnotationLensOptions
}
