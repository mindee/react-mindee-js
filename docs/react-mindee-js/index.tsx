import Loadable from 'react-loadable'
import {
  AnnotationShape,
  setShapeConfig,
  drawShape,
  drawLayer,
  PointerPosition,
  getImagesFromPDF,
} from '../..'

const AnnotationViewer = Loadable({
  loader: () => import('../..').then((module) => module.AnnotationViewer),
  loading: () => '...',
})

const AnnotationLens = Loadable({
  loader: () => import('../..').then((module) => module.AnnotationLens),
  loading: () => '...',
})

export {
  PointerPosition,
  getImagesFromPDF,
  AnnotationShape,
  setShapeConfig,
  drawShape,
  drawLayer,
  AnnotationViewer,
  AnnotationLens,
}
