import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';

import { DEFAULT_LENS_ZOOM_LEVEL } from '@/common/constants';
import type {
  AnnotationViewerOptions,
  ImageBoundingBox,
  PointerPosition,
} from '@/common/types';

import { roundTo } from '@/utils/roundTo';

const ZOOM_SCALE_ATTR = 'zoomScale';

/** Zoom factor relative to the fitted image (1 = fit to container). */
export const getZoomScale = (stage: Konva.Stage): number => {
  const value: unknown = stage.getAttr(ZOOM_SCALE_ATTR);
  return typeof value === 'number' ? value : 1;
};

export const setZoomScale = (stage: Konva.Stage, zoomScale: number): void => {
  stage.setAttr(ZOOM_SCALE_ATTR, zoomScale);
};

export const calculateZoomScale = (
  stage: Konva.Stage,
  zoomScale: number,
  imageBoundingBox: ImageBoundingBox,
): { newScale: number; newPos: PointerPosition } => {
  const oldScale = stage.scaleX();

  const stagePosition = stage.position();
  const pointerPosition = {
    x: 0.5 * imageBoundingBox.width + imageBoundingBox.x,
    y: 0.5 * imageBoundingBox.height + imageBoundingBox.y,
  };

  const mousePointTo = {
    x: (pointerPosition.x - stagePosition.x) / oldScale,
    y: (pointerPosition.y - stagePosition.y) / oldScale,
  };

  const newScale = zoomScale * imageBoundingBox.scale;

  const newPos = {
    x: roundTo(pointerPosition.x - mousePointTo.x * newScale, 2),
    y: roundTo(pointerPosition.y - mousePointTo.y * newScale, 2),
  };

  return { newScale: roundTo(newScale, 2), newPos };
};

export const handleZoomScale = (
  stage: Konva.Stage | null,
  zoomScale: number,
  imageBoundingBox: ImageBoundingBox | null,
): void => {
  if (!stage || !imageBoundingBox) {
    return;
  }

  const { newScale, newPos } = calculateZoomScale(
    stage,
    zoomScale,
    imageBoundingBox,
  );

  if (newScale < imageBoundingBox.scale) {
    stage.draggable(false);
    stage.scale({ x: imageBoundingBox.scale, y: imageBoundingBox.scale });
    stage.position({ x: imageBoundingBox.x, y: imageBoundingBox.y });
    setZoomScale(stage, 1);
  } else {
    stage.draggable(true);
    stage.scale({ x: newScale, y: newScale });
    setZoomScale(stage, newScale / imageBoundingBox.scale);
    stage.position(newPos);
  }

  stage.batchDraw();
};

export const calculateStageZoom = (
  stage: Konva.Stage,
  deltaY: number,
  options: AnnotationViewerOptions,
): { newScale: number; newPos: PointerPosition } | undefined => {
  const oldScale = stage.scaleX();

  const stagePosition = stage.position();
  const pointerPosition = stage.getPointerPosition() ?? { x: 0, y: 0 };

  const mousePointTo = {
    x: (pointerPosition.x - stagePosition.x) / oldScale,
    y: (pointerPosition.y - stagePosition.y) / oldScale,
  };

  if (!options.zoom) {
    return;
  }
  const { modifier } = options.zoom;

  const newScale = deltaY < 0 ? oldScale * modifier : oldScale / modifier;

  const newPos = {
    x: roundTo(pointerPosition.x - mousePointTo.x * newScale, 2),
    y: roundTo(pointerPosition.y - mousePointTo.y * newScale, 2),
  };

  return { newScale: roundTo(newScale, 2), newPos };
};

export const handleStageZoom = (
  stage: Konva.Stage | null,
  imageBoundingBox: ImageBoundingBox | null,
  event: KonvaEventObject<WheelEvent>,
  options: AnnotationViewerOptions,
): void => {
  if (!stage || !imageBoundingBox || !options.zoom) {
    return;
  }

  event.evt.preventDefault();

  const { max } = options.zoom;

  const stageZoom = calculateStageZoom(stage, event.evt.deltaY, options);
  if (!stageZoom) {
    return;
  }
  const { newScale, newPos } = stageZoom;

  if (newScale > max) {
    return;
  }

  if (newScale < imageBoundingBox.scale) {
    stage.draggable(false);
    stage.scale({ x: imageBoundingBox.scale, y: imageBoundingBox.scale });
    stage.position({ x: imageBoundingBox.x, y: imageBoundingBox.y });
    setZoomScale(stage, 1);
  } else {
    stage.draggable(true);
    stage.scale({ x: newScale, y: newScale });
    setZoomScale(stage, newScale / imageBoundingBox.scale);
    stage.position(newPos);
  }

  stage.batchDraw();
};

export const calculateLensZoom = (
  pointerPosition: PointerPosition,
  imageBoundingBox: ImageBoundingBox,
  stage: Konva.Stage,
  zoomLevel: number,
): PointerPosition => {
  const pointerX =
    (pointerPosition.x * imageBoundingBox.width) / imageBoundingBox.scale;
  const pointerY =
    (pointerPosition.y * imageBoundingBox.height) / imageBoundingBox.scale;

  return {
    x: roundTo(-pointerX * zoomLevel + stage.width() / 2, 2),
    y: roundTo(-pointerY * zoomLevel + stage.height() / 2, 2),
  };
};

export const handleLensZoom = (
  stage: Konva.Stage | null,
  imageBoundingBox: ImageBoundingBox | null,
  pointerPosition: PointerPosition,
  zoomLevel = DEFAULT_LENS_ZOOM_LEVEL,
): void => {
  if (!stage || !imageBoundingBox) {
    return;
  }

  const newPos = calculateLensZoom(
    pointerPosition,
    imageBoundingBox,
    stage,
    zoomLevel,
  );

  stage.scale({ x: zoomLevel, y: zoomLevel });
  stage.position(newPos);
  stage.batchDraw();
};
