import React from 'react'
import { AnnotationViewer, AnnotationForm } from '../../..'
// @ts-ignore
import dummyImage from '../../assets/image.jpg'

import {
  Title,
  Subtitle,
  Description,
  Primary,
} from '@storybook/addon-docs/blocks'
import { useInteractiveForm } from './helpers'
import { formatPrediction } from '../../../index'
import { API_RESPONSE } from '../..//assets/dummyData'
const { shapes: SHAPES, fields: FIELDS } = formatPrediction(
  API_RESPONSE.predictions[0]
)

export default {
  title: 'Examples/Forms/Interactive form',
  args: {
    image: dummyImage,
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description></Description>
          <Primary />
        </>
      ),
      source: {
        code: `
const { shapes: SHAPES, fields: FIELDS } = formatPrediction(
  API_RESPONSE.predictions[0]
)
const Example = ({ image }) => {
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
        newFields[relatedFieldIndex].items[
          relatedFieldItemIndex
        ].style.borderWidth = 8
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
        newFields[relatedFieldIndex].items[
          relatedFieldItemIndex
        ].style.borderWidth = 4
        setFields(newFields)
      }
    }
  }
  return (
    <div style={{ display: 'flex', height: 500 }}>
      <AnnotationViewer
        style={{ width: '50%' }}
        image={image}
        shapes={shapes}
        onShapeMouseEnter={onShapeMouseEnter}
        onShapeMouseLeave={onShapeMouseLeave}
      />
      <AnnotationForm
        fields={fields}
        style={{ width: '50%' }}
        onItemMouseEnter={onItemMouseEnter}
        onItemMouseLeave={onItemMouseLeave}
      />
    </div>
  )
}`,
      },
    },
  },
}

const Example = ({ image }) => {
  const {
    shapes,
    fields,
    onShapeMouseLeave,
    onItemMouseLeave,
    onShapeMouseEnter,
    onItemMouseEnter,
  } = useInteractiveForm({ SHAPES, FIELDS })
  return (
    <div style={{ display: 'flex', height: 600 }}>
      <AnnotationViewer
        style={{ width: '50%' }}
        image={image}
        shapes={shapes}
        onShapeMouseEnter={onShapeMouseEnter}
        onShapeMouseLeave={onShapeMouseLeave}
      />
      <AnnotationForm
        fields={fields}
        style={{ width: '50%' }}
        onItemMouseEnter={onItemMouseEnter}
        onItemMouseLeave={onItemMouseLeave}
      />
    </div>
  )
}

export const Base = Example.bind({})
Base.storyName = 'Interactive form'
