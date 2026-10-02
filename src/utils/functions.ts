import Konva from 'konva';
import type { LineConfig } from 'konva/lib/shapes/Line';
import type { Stage } from 'konva/lib/Stage';

import { KonvaRefs } from '@/common/constants';

export const drawLayer = (stage: Konva.Stage): void => {
  const shapesLayer = stage.findOne(`#${KonvaRefs.ShapesLayer}`);
  if (shapesLayer instanceof Konva.Layer) {
    shapesLayer.batchDraw();
  } else {
    console.error('drawLayer : the layer is not found');
  }
};

export const drawShape = (
  stage: Konva.Stage,
  id: string | number,
  config: LineConfig,
): void => {
  const shape = stage.findOne(`#${id.toString()}`);
  if (shape instanceof Konva.Shape) {
    shape.setAttrs(config);
    shape.draw();
  } else {
    console.error('drawShape : The provided shape id is not valid');
  }
};

export const drawShapes = (stage: Stage, config: LineConfig): void => {
  const shapes = stage.find(`.${KonvaRefs.Shape}`);
  if (shapes.length > 0) {
    shapes.forEach((shape) => {
      shape.setAttrs(config);
    });
    drawLayer(stage);
  }
};

export const setShapeConfig = (
  stage: Konva.Stage,
  id: string | number,
  config: LineConfig,
): void => {
  const shape = stage.findOne(`#${id.toString()}`);
  if (shape) {
    shape.setAttrs(config);
  } else {
    console.error('setShapeConfig : The provided shape id is not valid');
  }
};

export const toBase64 = (
  base64: string,
  type:
    | 'application/pdf'
    | 'image/jpeg'
    | 'image/png'
    | 'image/svg+xml' = 'image/jpeg',
): string => `data:${type};base64,${base64}`;
