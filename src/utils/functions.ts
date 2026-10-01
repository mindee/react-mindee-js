import Konva from 'konva';
import type { LineConfig } from 'konva/lib/shapes/Line';
import type { Stage } from 'konva/lib/Stage';

import { KonvaRefs } from '@/common/constants';

/** Konva 8 types `findOne` as non-optional although it returns undefined on miss. */
const findOne = (
  stage: Konva.Stage,
  selector: string,
): Konva.Node | undefined => stage.findOne(selector);

export const drawLayer = (stage: Konva.Stage): void => {
  const shapesLayer = findOne(stage, `#${KonvaRefs.ShapesLayer}`);
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
  const shape = findOne(stage, `#${id.toString()}`);
  if (shape instanceof Konva.Shape) {
    shape.setAttrs(config);
    shape.draw();
  } else {
    console.error('drawShape : The provided shape id is not valid');
  }
};

export const drawShapes = (stage: Stage, config: LineConfig): void => {
  const shapes = stage.find(`.${KonvaRefs.Shape}`);
  if (shapes.length) {
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
  const shape = findOne(stage, `#${id.toString()}`);
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
