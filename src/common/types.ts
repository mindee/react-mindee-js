import type { CSSProperties } from 'react';
import type Konva from 'konva';
import type { Line, LineConfig } from 'konva/lib/shapes/Line';
import type { RectConfig } from 'konva/lib/shapes/Rect';
import type { Stage } from 'konva/lib/Stage';

export type AnnotationShape<T extends object = object> = T & {
  id: string;
  coordinates: number[][];
  config?: LineConfig;
};

export type Orientation = 0 | 90 | 180 | 270;

export type BaseOptions = {
  shapeConfig?: LineConfig;
};

export type AnnotationLayers = {
  shapes: Konva.Layer;
  image: Konva.Layer;
};

export type AnnotationLensOptions = BaseOptions;

export type AnnotationViewerOptions = BaseOptions & {
  selectionRectConfig?: RectConfig;
  enableSelection?: boolean;
  onMouseEnter?: (polygon: Line) => void;
  onMouseLeave?: (polygon: Line) => void;
  onClick?: (polygon: Line) => void;
  /**
   * Wheel zoom settings. All factors are relative to the fitted image
   * (1 = image fits the container), independently of its pixel size.
   */
  zoom?: {
    /** Multiplier applied per wheel step. */
    modifier: number;
    /** Highest magnification reachable through the wheel. */
    max: number;
    defaultZoom: number;
  };
};

export type ImageBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
};

export type PointerPosition = {
  x: number;
  y: number;
};

export type AnnotationData = {
  image?: string | null;
  shapes?: AnnotationShape[];
  orientation?: Orientation;
};

export type ImageData = {
  element: HTMLImageElement;
  shape: Konva.Image;
};

export type ZoomOptions = {
  scale?: number;
  position?: PointerPosition;
};
export type AnnotationViewerProps = {
  id?: string;
  getPointerPosition?: (data: PointerPosition) => void;
  data?: AnnotationData;
  getStage?: (stage: Stage) => void;
  onShapeMultiSelect?: (shapes: AnnotationShape[]) => void;
  onShapeClick?: (shape: AnnotationShape) => void;
  onShapeMouseEnter?: (shape: AnnotationShape) => void;
  onShapeMouseLeave?: (shape: AnnotationShape) => void;
  options?: AnnotationViewerOptions;
  style?: CSSProperties;
  zoomScale?: number;
  customStagePosition?: PointerPosition;
  customZoomLevel?: number;
};

export type AnnotationLensProps = {
  id?: string;
  zoomLevel?: number;
  data?: AnnotationData;
  pointerPosition?: PointerPosition;
  getStage?: (stage: Stage) => void;
  style?: CSSProperties;
  options?: AnnotationLensOptions;
};
