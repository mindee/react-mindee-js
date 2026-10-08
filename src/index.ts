import type { Stage } from 'konva/lib/Stage';

import type {
  AnnotationData,
  AnnotationLensOptions,
  AnnotationShape,
  AnnotationViewerOptions,
  Orientation,
  PointerPosition,
} from './common/types';
import AnnotationLens from './components/AnnotationLens';
import AnnotationViewer from './components/AnnotationViewer';
import {
  usePDFDocument,
  type UsePDFDocumentOptions,
  type UsePDFDocumentResult,
  type UsePDFDocumentStatus,
} from './hooks/usePDFDocument';
import {
  drawLayer,
  drawShape,
  drawShapes,
  setShapeConfig,
  toBase64,
} from './utils/functions';
import getImagesFromPDF from './utils/getImagesFromPDF';
import getPDFPageCount from './utils/getPDFPageCount';
import { dataURItoBlob } from './utils/image';
import {
  openPDF,
  type OpenPDFOptions,
  type PDFDocumentHandle,
  type PDFPageOptions,
  type PDFPageOutput,
  type PDFPagePriority,
  type PDFRenderedPage,
  type PDFSource,
} from './utils/pdf';
import { getZoomScale } from './utils/zoom';

export type {
  Stage,
  AnnotationShape,
  AnnotationLensOptions,
  AnnotationViewerOptions,
  PointerPosition,
  Orientation,
  AnnotationData,
  OpenPDFOptions,
  PDFDocumentHandle,
  PDFPageOptions,
  PDFPageOutput,
  PDFPagePriority,
  PDFRenderedPage,
  PDFSource,
  UsePDFDocumentOptions,
  UsePDFDocumentResult,
  UsePDFDocumentStatus,
};
export {
  toBase64,
  drawShapes,
  dataURItoBlob,
  AnnotationLens,
  AnnotationViewer,
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- still part of the public API
  getImagesFromPDF,
  getPDFPageCount,
  getZoomScale,
  openPDF,
  usePDFDocument,
  drawShape,
  drawLayer,
  setShapeConfig,
};
