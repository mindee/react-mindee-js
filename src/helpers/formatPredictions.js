// @flow
import { createPolygonFromCoordinates } from "./geometry"
import type { Shape } from "common/types"
import { settings } from "./settings"

type PredictionElement = $Shape<Shape> & {}

const formatFeaturesPrediction = (
  shapesColor = [...settings.featuresColor]
) => (
  accumulator: PredictionElement[],
  [featureName, content],
  featureIndex
) => {
  let contentArray
  if (!Array.isArray(content)) {
    contentArray = [content]
  } else {
    contentArray = [...content]
  }
  contentArray.map((element: any, index: number) => {
    const feature: PredictionElement = {
      id: `${featureName} - ${featureIndex}`,
      isActive: false,
      featureIndex,
      featureName,
      data: content,
      element,
      index,
    }
    if (
      element.hasOwnProperty("segmentation") &&
      element.segmentation.bounding_box
    ) {
      feature.polygon = createPolygonFromCoordinates(
        element.segmentation.bounding_box
      )
      const color = shapesColor.shift()
      feature.color = color
      feature.active = {
        color,
        lineWidth: settings.shapeOptions.lineWidth,
      }
    }
    accumulator.push(feature)
  })
  return accumulator
}

export const formatPrediction = (
  filePrediction: any,
  shapesColor: any
): PredictionElement[] =>
  Object.entries(filePrediction).reduce(
    formatFeaturesPrediction(shapesColor),
    []
  )

export const formatPredictions = (predictions: []) =>
  predictions.map<any>(formatPrediction)
