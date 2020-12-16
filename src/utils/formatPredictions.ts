import { COLORS } from '../common/constants'
import { FieldSubItem } from './../common/types'
import { AnnotationShape } from 'mindee-js'
import { Prediction, FieldData, FieldItem } from '../common/types'
import { v4 as uuidv4 } from 'uuid'

type FormattedPrediction = {
  shapes: AnnotationShape[]
  fields: FieldData[]
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
export const formatPrediction = (
  prediction: Prediction,
  colors = COLORS
): FormattedPrediction => {
  const colorsList = Object.values(colors)
  return Object.entries(prediction).reduce(
    (accumulator: FormattedPrediction, [name, field]: any, index: number) => {
      const defaultColor = colorsList[index]
      const fieldId = uuidv4()
      if (!Array.isArray(field)) {
        field = [field]
      }
      const items: FieldItem[] = field.reduce((itemAccumulator, item: any) => {
        const fieldItemId = uuidv4()
        const subItems: FieldSubItem[] = Object.entries(item).reduce(
          (subItemAccumulator, [key, value]: any) => {
            const fieldSubItemId = uuidv4()
            if (key === 'segmentation') {
              accumulator.shapes.push({
                id: fieldItemId,
                fieldId,
                coordinates: value.bounding_box,
                options: {
                  default: {
                    stroke: defaultColor,
                    strokeWidth: 5,
                  },
                },
              })
            } else {
              subItemAccumulator.push({
                id: fieldSubItemId,
                fieldItemId,
                label: key,
                value,
              })
            }
            return subItemAccumulator
          },
          []
        )
        itemAccumulator.push({
          id: fieldItemId,
          fieldId: fieldId,
          subItems,
          style: {
            borderColor: defaultColor,
            paddingLeft: 10,
          },
        })
        return itemAccumulator
      }, [])
      accumulator.fields.push({
        id: fieldId,
        label: name,
        name,
        items,
        column: getRndInteger(1, 3),
      })

      return accumulator
    },
    {
      shapes: [],
      fields: [],
    }
  )
}
