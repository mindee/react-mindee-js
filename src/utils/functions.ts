import Konva from 'konva';
import type { LineConfig } from 'konva/lib/shapes/Line';
import type { Stage } from 'konva/lib/Stage';

import { KONVA_REFS } from '@/common/constants';

/** Konva 8 types `findOne` as non-optional although it returns undefined on miss. */
const findOne = (stage: Konva.Stage, selector: string) =>
  stage.findOne(selector) as Konva.Node | undefined;

export const drawLayer = (stage: Konva.Stage) => {
  const shapesLayer = findOne(stage, `#${KONVA_REFS.shapesLayer}`);
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
) => {
  const shape = findOne(stage, `#${id.toString()}`);
  if (shape instanceof Konva.Shape) {
    shape.setAttrs(config);
    shape.draw();
  } else {
    console.error('drawShape : The provided shape id is not valid');
  }
};

export const drawShapes = (stage: Stage, config: LineConfig) => {
  const shapes = stage.find(`.${KONVA_REFS.shape}`);
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
) => {
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
) => `data:${type};base64,${base64}`;
