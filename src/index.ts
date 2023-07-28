import { Stage } from 'konva/lib/Stage'

import {
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
import { dataURItoBlob } from './utils/image'

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
  drawShape,
  drawLayer,
  setShapeConfig,
}
