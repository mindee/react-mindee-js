import type { AnnotationLayers } from '@/common/types';

export const clearLayers = (layers: AnnotationLayers): void => {
  layers.shapes.destroyChildren();
  layers.image.batchDraw();
  layers.shapes.batchDraw();
};
