import Konva from 'konva';
import type { Layer } from 'konva/lib/Layer';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Rect } from 'konva/lib/shapes/Rect';
import type { Stage } from 'konva/lib/Stage';

import { KonvaRefs } from '@/common/constants';
import type {
  AnnotationShape,
  AnnotationViewerOptions,
  PointerPosition,
} from '@/common/types';

import { getShapeFromNode } from '@/utils/canvas';

import { roundTo } from './roundTo';

const selectionAnchor = new WeakMap<Rect, PointerPosition>();

export const createSelectionRect = (options: AnnotationViewerOptions): Rect =>
  new Konva.Rect({
    visible: false,
    ...options.selectionRectConfig,
  });

export const calculateSelectionPoint = (
  stage: Stage,
): PointerPosition | undefined => {
  const stagePosition = stage.position();
  const pointerPosition = stage.getPointerPosition();

  if (!pointerPosition) return;

  const x = roundTo((pointerPosition.x - stagePosition.x) / stage.scaleX(), 2);
  const y = roundTo((pointerPosition.y - stagePosition.y) / stage.scaleX(), 2);

  return { x, y };
};

export const onSelectionStart = (
  event?: KonvaEventObject<Stage>,
  layer?: Layer,
  rect?: Rect,
  selectionEnabled?: boolean,
): void => {
  if (selectionEnabled !== true || !layer || !rect || !event) return;

  const stage = layer.getStage();
  const firstPoint = calculateSelectionPoint(stage);

  if (!firstPoint) return;

  selectionAnchor.set(rect, firstPoint);
  rect.setAttrs({ x1: firstPoint.x, y1: firstPoint.y });
  rect.visible(true);
  rect.width(0);
  rect.height(0);
  layer.draw();
};

export const onSelectionMove = (layer?: Layer, rect?: Rect): void => {
  const stage = layer?.getStage();

  if (!stage || !rect || !layer) return;

  // no nothing if we didn't start selection
  if (!rect.visible()) return;
  const anchor = selectionAnchor.get(rect);

  if (!anchor) return;

  const secondPoint = calculateSelectionPoint(stage);

  if (!secondPoint) return;
  rect.setAttrs({
    x: Math.min(anchor.x, secondPoint.x),
    y: Math.min(anchor.y, secondPoint.y),
    width: Math.abs(secondPoint.x - anchor.x),
    height: Math.abs(secondPoint.y - anchor.y),
  });

  layer.batchDraw();
};

export const onSelectionEnd = (
  layer?: Layer,
  rect?: Rect,
  onShapeMultiSelect?: (shapes: AnnotationShape[]) => void,
): void => {
  const stage = layer?.getStage();

  if (!stage || !rect || !layer) return;

  if (!rect.visible()) return;

  // update visibility in timeout, so we can check it in click event
  setTimeout(() => {
    rect.visible(false);
    layer.batchDraw();
  });

  const shapes = stage.find(`.${KonvaRefs.Shape}`);
  const box = rect.getClientRect();

  const selected = shapes
    .filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()))
    .map((node) => getShapeFromNode(node))
    .filter((shape) => shape !== undefined);

  if (selected.length) onShapeMultiSelect?.(selected);

  layer.batchDraw();
};
