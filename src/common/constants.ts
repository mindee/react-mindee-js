import { Line } from 'konva/lib/shapes/Line'
import { AnnotationData } from '..'

export const DEFAULT_STYLE = {
  height: 300,
  width: 300,
  display: 'flex',
  backgroundColor: '#001429',
}

export enum KONVA_REFS {
  shapesLayer = 'shapes-layer',
  shape = 'shape',
}

const STROKE_COLOR = '#FF0000'
const SELECTION_FILL_COLOR = 'rgba(0,0,255,0.5)'
export const DEFAULT_LENS_ZOOM_LEVEL = 3 / 2
export const DEFAULT_POINTER_POSITION = { x: 0.5, y: 0.5 }
export const PDF_RESOLUTION = 1.5 * 10 ** 6 // target resolution 1.5 Mpx
export const MAX_PDF_SCALE = 5.5 // max DPI = 500
export const DEFAULT_DATA: AnnotationData = {
  image: null,
  shapes: [],
  orientation: 0,
}

export const DEFAULT_ANNOTATION_VIEWER_OPTIONS = {
  enableSelection: false,
  selectionRectConfig: {
    fill: SELECTION_FILL_COLOR,
  },
  onMouseLeave: (polygon: Line) => {
    const layer = polygon.getLayer()
    polygon.setAttr('fill', 'transparent')
    layer?.batchDraw()
  },
  onMouseEnter: (polygon: Line) => {
    const stroke = polygon.getAttr('stroke')
    polygon.setAttr('fill', `${stroke}40`)
    polygon.draw()
  },
  shapeConfig: {
    stroke: STROKE_COLOR,
    strokeWidth: 2,
    listening: true,
  },
  zoom: {
    modifier: 1.2,
    max: 10,
    defaultZoom: 1,
  },
}

export const DEFAULT_ANNOTATION_LENS_OPTIONS = {
  shapeConfig: {
    stroke: STROKE_COLOR,
    strokeWidth: 1,
    listening: false,
  },
}
