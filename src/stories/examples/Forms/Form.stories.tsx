import React, { useMemo } from 'react'
import { API_RESPONSE } from '../../assets/dummyData'
import { formatPrediction } from '../../../utils/formatPredictions'
import { AnnotationViewer, AnnotationForm } from '../../..'
// @ts-ignore
import dummyImage from '../../assets/image.jpg'
import {
  Title,
  Subtitle,
  Description,
  Primary,
} from '@storybook/addon-docs/blocks'
export default {
  title: 'Examples/Forms/Basic Form',
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
import { AnnotationForm, AnnotationViewer } from 'react-mindee-js'
import dummyImage from 'assets/image.jpg'

const API_RESPONSE = {
  predictions: [
    {
      category: { probability: 0.99, value: 'food' },
      date: {
        probability: 0.99,
        raw: '26-Feb-2016',
        segmentation: {
          bounding_box: [
            [0.479, 0.173],
            [0.613, 0.173],
            [0.613, 0.197],
            [0.479, 0.197],
          ],
        },
        value: '2016-02-26',
      },
      ...
  ]
}

const Example = () => {
  const { shapes, fields } = useMemo(
      () => formatPrediction(API_RESPONSE.predictions[0]),
      []
    )
    return (
      <div style={{ display: 'flex', height: 500 }}>
        <AnnotationViewer
          style={{ width: '50%' }}
          image={dummyImage}
          shapes={shapes}
        />
        <AnnotationForm fields={fields} style={{ width: '50%' }} />
      </div>
    )
}`,
      },
    },
  },
}
const Example = ({ image }) => {
  const { shapes, fields } = useMemo(
    () => formatPrediction(API_RESPONSE.predictions[0]),
    []
  )
  console.log(fields)
  return (
    <div style={{ display: 'flex', height: 600 }}>
      <AnnotationViewer
        style={{ width: '50%' }}
        image={image}
        shapes={shapes}
      />
      <AnnotationForm fields={fields} style={{ width: '50%' }} />
    </div>
  )
}

export const Form = Example.bind({})

Form.storyName = 'Basic Form'
