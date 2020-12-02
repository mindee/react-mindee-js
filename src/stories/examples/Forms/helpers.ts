import { AnnotationShape } from 'mindee-js'
import { useState } from 'react'

import { FieldData, FieldItem } from '../../../common/types'

export const useInteractiveForm = ({ SHAPES, FIELDS }) => {
  const [shapes, setShapes] = useState(SHAPES)
  const [fields, setFields] = useState(FIELDS)
  const onItemMouseEnter = (_event, item: FieldItem) => {
    const newShapes = [...shapes]
    const relatedShapeIndex = shapes.findIndex(
      (shape: AnnotationShape) => shape.id === item.id
    )
    if (relatedShapeIndex >= 0) {
      newShapes[relatedShapeIndex].fill = 'red'
      newShapes[relatedShapeIndex].opacity = 0.2
      setShapes(newShapes)
    }
  }
  const onItemMouseLeave = (_event, item: FieldItem) => {
    const newShapes = [...shapes]
    const relatedShapeIndex = shapes.findIndex(
      (shape: AnnotationShape) => shape.id === item.id
    )
    if (relatedShapeIndex >= 0) {
      newShapes[relatedShapeIndex].fill = 'transparent'
      newShapes[relatedShapeIndex].opacity = 1
      setShapes(newShapes)
    }
  }
  const onShapeMouseEnter = (shape: AnnotationShape) => {
    const newFields = [...fields]
    const relatedFieldIndex = fields.findIndex(
      (field: FieldData) => field.id === shape.fieldId
    )
    if (relatedFieldIndex >= 0) {
      const relatedFieldItemIndex = fields[relatedFieldIndex].items.findIndex(
        (item: FieldItem) => item.id === shape.id
      )
      if (relatedFieldItemIndex >= 0) {
        newFields[relatedFieldIndex].items[relatedFieldItemIndex].style = {
          ...newFields[relatedFieldIndex].items[relatedFieldItemIndex].style,
          borderWidth: 8,
        }
        setFields(newFields)
      }
    }
  }
  const onShapeMouseLeave = (shape: AnnotationShape) => {
    const newFields = [...fields]
    const relatedFieldIndex = fields.findIndex(
      (field: FieldData) => field.id === shape.fieldId
    )
    if (relatedFieldIndex >= 0) {
      const relatedFieldItemIndex = fields[relatedFieldIndex].items.findIndex(
        (item: FieldItem) => item.id === shape.id
      )
      if (relatedFieldItemIndex >= 0) {
        newFields[relatedFieldIndex].items[relatedFieldItemIndex].style = {
          ...newFields[relatedFieldIndex].items[relatedFieldItemIndex].style,
          borderWidth: 4,
        }
        setFields(newFields)
      }
    }
  }
  return {
    shapes,
    fields,
    onItemMouseEnter,
    setFields,
    onShapeMouseEnter,
    onItemMouseLeave,
    onShapeMouseLeave,
  }
}
