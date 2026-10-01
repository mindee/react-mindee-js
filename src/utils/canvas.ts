import Konva from 'konva';
import type { Layer } from 'konva/lib/Layer';
import type { Line } from 'konva/lib/shapes/Line';

import { KonvaRefs } from '@/common/constants';
import type {
  AnnotationLensOptions,
  AnnotationShape,
  AnnotationViewerOptions,
  ImageBoundingBox,
  PointerPosition,
} from '@/common/types';

import { roundTo } from './roundTo';

const shapeByNode = new WeakMap<Konva.Node, AnnotationShape>();
export const getShapeFromNode = (
  node: Konva.Node,
): AnnotationShape | undefined => shapeByNode.get(node);

export const mapShapesToPolygons = (
  shapesLayer: Layer,
  shapes: AnnotationShape[] = [],
  useEvents = true,
  imageBoundingBox: ImageBoundingBox | null,
  options: AnnotationLensOptions | AnnotationViewerOptions,
  onClick?: (shape: AnnotationShape) => void,
  onShapeMouseEnter?: (shape: AnnotationShape) => void,
  onShapeMouseLeave?: (shape: AnnotationShape) => void,
): void => {
  if (!imageBoundingBox) {
    return;
  }
  shapes.forEach((shape: AnnotationShape) => {
    const polygon = new Konva.Line({
      id: shape.id,
      name: KonvaRefs.Shape,
      points: mapCoordinatesToPoints(shape.coordinates, imageBoundingBox),
      closed: true,

      ...(options.shapeConfig ?? {}),
      ...shape.config,
    });
    shapeByNode.set(polygon, shape);
    shapesLayer.add(polygon);
    if (useEvents) {
      bindEventToPolygon(
        polygon,
        options,
        onClick,
        onShapeMouseEnter,
        onShapeMouseLeave,
      );
    }
  });
};

const bindEventToPolygon = (
  polygon: Line,
  options: AnnotationViewerOptions,
  onClick?: (shape: AnnotationShape) => void,
  onShapeMouseEnter?: (shape: AnnotationShape) => void,
  onShapeMouseLeave?: (shape: AnnotationShape) => void,
): void => {
  const stage = polygon.getStage();
  const shape = shapeByNode.get(polygon);
  if (!shape || !stage) return;
  polygon.on('mouseup', (event) => {
    event.cancelBubble = true;
    onClick?.(shape);
    options.onClick?.(polygon);
  });
  polygon.on('mouseleave', function (event) {
    event.cancelBubble = true;
    stage.container().style.cursor = 'inherit';
    options.onMouseLeave?.(polygon);
    onShapeMouseLeave?.(shape);
  });
  polygon.on('mouseenter', function (event) {
    event.cancelBubble = true;
    options.onMouseEnter?.(polygon);
    stage.container().style.cursor = 'pointer';
    onShapeMouseEnter?.(shape);
  });
};

export const scalePointToImage = (
  point: PointerPosition,
  imageBoundingBox: ImageBoundingBox,
): PointerPosition => {
  const { width, height, scale } = imageBoundingBox;
  return {
    x: roundTo((Math.min(point.x, 1) * width) / scale, 2),
    y: roundTo((Math.min(point.y, 1) * height) / scale, 2),
  };
};

const mapCoordinatesToPoints = (
  coordinates: [number, number][],
  imageBoundingBox: ImageBoundingBox,
): number[] =>
  coordinates.flatMap((element) => {
    const { x, y } = scalePointToImage(
      { x: element[0], y: element[1] },
      imageBoundingBox,
    );
    return [x, y];
  });

export const getMousePosition = (
  stage: Konva.Stage | null,
  imageBoundingBox: ImageBoundingBox | null,
): PointerPosition | undefined => {
  if (!stage || !imageBoundingBox) {
    return;
  }
  const { x: pointerX, y: pointerY } = stage.getPointerPosition() ?? {
    x: 0,
    y: 0,
  };
  const oldScale = stage.scaleX();
  const stageX = stage.x();
  const stageY = stage.y();
  return {
    x: roundTo(
      ((pointerX - stageX) * imageBoundingBox.scale) /
        (oldScale * imageBoundingBox.width),
      2,
    ),
    y: roundTo(
      ((pointerY - stageY) * imageBoundingBox.scale) /
        (oldScale * imageBoundingBox.height),
      2,
    ),
  };
};
