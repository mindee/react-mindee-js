import { AnnotationLayers } from '@/common/types'

export const clearLayers = (layers: AnnotationLayers) => {
  layers.shapes.destroyChildren()
  layers.image.destroyChildren()
  layers.image.batchDraw()
  layers.shapes.batchDraw()
}
