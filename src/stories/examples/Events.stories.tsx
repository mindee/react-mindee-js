import { AnnotationShape } from 'mindee-js'
import React, { useState } from 'react'
import { AnnotationViewer } from '../..'
import { DUMMY_SHAPES } from '../assets/dummyData'
// @ts-ignore
import dummyImage from '../assets/image.jpg'
import {
  Title,
  Subtitle,
  Description,
  Primary,
} from '@storybook/addon-docs/blocks'
export default {
  title: 'Examples/Events',
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Example - AnnotationLens</Title>
          <Subtitle />
          <Description>
            Flexible component to display interactive and customizable shapes on
            image
          </Description>
          <Primary></Primary>
        </>
      ),
      source: {
        code: `
import React, { useState } from 'react'
import { AnnotationShape, AnnotationViewer } from 'react-mindee-js'

import dummyImage from 'assets/image.jpg'
const dummyShapes = [
  {
    id: 1,
    coordinates: [
      [0.479, 0.172],
      [0.611, 0.172],
      [0.611, 0.196],
      [0.479, 0.196],
    ],
  },
  {
    id: 2,
    coordinates: [
      [0.394, 0.068],
      [0.477, 0.068],
      [0.477, 0.087],
      [0.394, 0.087],
    ],
  },
  ...
]

const Example = () => {
  const [selectedShape, setSelectedShape] = useState<AnnotationShape | null>(
    null
  )
  return (
    <div style={{ position: 'relative' }}>
      <AnnotationViewer
        shapes={dummyShapes}
        image={dummyImage}
        onShapeMouseEnter={setSelectedShape}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          bottom: 0,
          right: 0,
        }}
      >
        <img style={{ width: '100%' }} src={selectedShape?.crop} />
      </div>
    </div>
  )
}
        `,
      },
    },
  },
}

const Example = ({ image, shapes }) => {
  const [selectedShape, setSelectedShape] = useState<AnnotationShape | null>(
    null
  )
  return (
    <div style={{ position: 'relative' }}>
      <AnnotationViewer
        shapes={shapes}
        image={image}
        onShapeMouseEnter={setSelectedShape}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          bottom: 0,
          right: 0,
        }}
      >
        <img style={{ width: '100%' }} src={selectedShape?.crop} />
      </div>
    </div>
  )
}
const Template = (args) => <Example {...args} />

export const Events = Template.bind({})
Events.args = {
  image: dummyImage,
  shapes: DUMMY_SHAPES,
}
