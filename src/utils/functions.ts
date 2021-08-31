import { KONVA_REFS } from '@/common/constants'
import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { LineConfig } from 'konva/lib/shapes/Line'
import { Stage } from '..'

export const drawLayer = (stage: Konva.Stage) => {
  const shapesLayer = stage.findOne<Layer>(`#${KONVA_REFS.shapesLayer}`)
  if (shapesLayer) {
    shapesLayer.batchDraw()
  } else {
    console.error('drawLayer : the layer is not found')
  }
}

export const drawShape = (
  stage: Konva.Stage,
  id: string | number,
  config: LineConfig
) => {
  const shape = stage.findOne(`#${id}`)
  if (shape) {
    shape.setAttrs(config)
    shape.draw()
  } else {
    console.error('drawShape : The provided shape id is not valid')
  }
}

export const drawShapes = (stage: Stage, config: LineConfig) => {
  const shapes = stage.find(`.${KONVA_REFS.shape}`)
  if (shapes.length) {
    shapes.forEach((shape) => {
      shape.setAttrs(config)
    })
    drawLayer(stage)
  }
}

export const setShapeConfig = (
  stage: Konva.Stage,
  id: string | number,
  config: LineConfig
) => {
  const shape = stage.findOne(`#${id}`)
  if (shape) {
    shape.setAttrs(config)
  } else {
    console.error('setShapeConfig : The provided shape id is not valid')
  }
}
