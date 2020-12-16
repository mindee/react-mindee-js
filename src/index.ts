import { FieldData, FieldItem } from './common/types'
import {
  getImagesFromPDF,
  AnnotationShape,
  Options,
  PointerPosition,
  Orientation,
} from 'mindee-js'
import 'mindee-js'

import AnnotationForm from './components/AnnotationForm'
import AnnotationLens from './components/AnnotationLens'
import AnnotationViewer from './components/AnnotationViewer'

import { formatPrediction } from './utils/formatPredictions'

export {
  FieldData,
  FieldItem,
  AnnotationShape,
  Options,
  PointerPosition,
  Orientation,
  AnnotationLens,
  AnnotationViewer,
  getImagesFromPDF,
  AnnotationForm,
  formatPrediction,
}
