import { Stage } from 'konva/lib/Stage'
import {
  AnnotationShape,
  AnnotationLensOptions,
  AnnotationViewerOptions,
  PointerPosition,
  Orientation,
  AnnotationData,
} from './common/types'

import {
  drawLayer,
  drawShape,
  setShapeConfig,
  drawShapes,
} from './utils/functions'
import getImagesFromPDF from './utils/getImagesFromPDF'
import AnnotationLens from './components/AnnotationLens'
import AnnotationViewer from './components/AnnotationViewer'
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
  drawShapes,
  dataURItoBlob,
  AnnotationLens,
  AnnotationViewer,
  getImagesFromPDF,
  drawShape,
  drawLayer,
  setShapeConfig,
}
