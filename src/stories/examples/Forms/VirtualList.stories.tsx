import React from 'react'
import {
  AnnotationViewer,
  AnnotationForm,
  AnnotationShape,
  FieldData,
  FieldItem,
  formatPrediction,
} from '../../..'
// @ts-ignore
import dummyImage from '../../assets/image.jpg'
import { useInteractiveForm } from './helpers'
import { MINDEE_VISION_DATA } from '../..//assets/dummyData'
import {
  Title,
  Subtitle,
  Description,
  Primary,
} from '@storybook/addon-docs/blocks'
const { shapes: SHAPES, fields: FIELDS } = formatPrediction(MINDEE_VISION_DATA)

export default {
  title: 'Examples/Forms/Virtual list',
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
    <div style={{ display: 'flex', height: 500 }}>
      <AnnotationViewer
        style={{ width: '50%' }}
        image={image}
        shapes={shapes}
        onShapeMouseLeave={onShapeMouseLeave}
        onShapeMouseEnter={onShapeMouseEnter}
      />
      <AnnotationForm
        onItemMouseLeave={onItemMouseLeave}
        onItemMouseEnter={onItemMouseEnter}
        fields={fields}
        style={{ width: '50%' }}
        maxItemsLength={8}
      />
    </div>
  )
}
      
      `,
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
    setFields,
  } = useInteractiveForm({ SHAPES, FIELDS })
  const onShapeClick = (shape: AnnotationShape) => {
    const newFields = [...fields]
    const relatedFieldIndex = fields.findIndex(
      (field: FieldData) => field.id === shape.fieldId
    )
    if (relatedFieldIndex >= 0) {
      const relatedFieldItemIndex = fields[relatedFieldIndex].items.findIndex(
        (item: FieldItem) => item.id === shape.id
      )
      if (relatedFieldItemIndex >= 0) {
        newFields[relatedFieldIndex] = {
          ...newFields[relatedFieldIndex],
          scrollToItem: relatedFieldItemIndex,
        }
        setFields(newFields)
      }
    }
  }
  return (
    <div style={{ display: 'flex', height: 600 }}>
      <AnnotationViewer
        onShapeClick={onShapeClick}
        style={{ width: '50%' }}
        image={image}
        shapes={shapes}
        onShapeMouseLeave={onShapeMouseLeave}
        onShapeMouseEnter={onShapeMouseEnter}
      />
      <AnnotationForm
        onItemMouseLeave={onItemMouseLeave}
        onItemMouseEnter={onItemMouseEnter}
        fields={fields}
        style={{ width: '50%' }}
        maxItemsLength={8}
      />
    </div>
  )
}

export const Base = Example.bind({})
Base.storyName = 'Virtual list'
