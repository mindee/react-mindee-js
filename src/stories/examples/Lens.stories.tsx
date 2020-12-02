import React, { useState } from 'react'
import { AnnotationViewer, AnnotationLens } from '../..'
// @ts-ignore
import dummyImage from '../assets/image.jpg'
import {
  Title,
  Subtitle,
  Description,
  Primary,
} from '@storybook/addon-docs/blocks'
import { PointerPosition } from 'mindee-js'
export default {
  title: 'Examples/Lens',
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
import { PointerPosition, AnnotationLens } from 'react-mindee-js'

import dummyImage from 'assets/image.jpg'

const Example = () => {
  const [pointerPosition, setPointerPosition] = useState<PointerPosition | null>(null)
  return (
    <div style={{ position: 'relative' }}>
      <AnnotationViewer image={dummyImage} onPointerMove={setPointerPosition} />
      <AnnotationLens
        pointerPosition={pointerPosition}
        image={dummyImage}
        style={{ position: 'absolute', bottom: 0, right: 0 }}
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
  const [
    pointerPosition,
    setPointerPosition,
  ] = useState<PointerPosition | null>(null)
  return (
    <div style={{ position: 'relative' }}>
      <AnnotationViewer image={image} onPointerMove={setPointerPosition} />
      <AnnotationLens
        pointerPosition={pointerPosition}
        image={image}
        style={{ position: 'absolute', bottom: 0, right: 0 }}
      />
    </div>
  )
}

export const Lens = Example.bind({})
Lens.args = {
  image: dummyImage,
}
