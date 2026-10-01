import type { Stage } from 'konva/lib/Stage'

import type {
  AnnotationData,
  AnnotationLensOptions,
  AnnotationShape,
  AnnotationViewerOptions,
  Orientation,
  PointerPosition,
} from './common/types'
import AnnotationLens from './components/AnnotationLens'
import AnnotationViewer from './components/AnnotationViewer'
import {
  drawLayer,
  drawShape,
  drawShapes,
  setShapeConfig,
  toBase64,
} from './utils/functions'
import getImagesFromPDF from './utils/getImagesFromPDF'
import getPDFPageCount from './utils/getPDFPageCount'
import { dataURItoBlob } from './utils/image'
import { getZoomScale } from './utils/zoom'

export type {
  Stage,
  AnnotationShape,
  AnnotationLensOptions,
  AnnotationViewerOptions,
  PointerPosition,
  Orientation,
  AnnotationData,
}
export {
  toBase64,
  drawShapes,
  dataURItoBlob,
  AnnotationLens,
  AnnotationViewer,
  getImagesFromPDF,
  getPDFPageCount,
  getZoomScale,
  drawShape,
  drawLayer,
  setShapeConfig,
}
