import { getImagesFromPDF } from 'mindee-js'
import React, { useEffect, useState } from 'react'
import { AnnotationViewer } from '../..'
// @ts-ignore
import dummyPdf from '../assets/pdf.pdf'
import {
  Title,
  Subtitle,
  Description,
  Primary,
} from '@storybook/addon-docs/blocks'

const Example = ({ file }) => {
  const [index, setIndex] = useState<number>(0)
  const [images, setImages] = useState<string[]>([])
  useEffect(() => {
    getImagesFromPDF(file).then((images: string[]) => {
      setImages(images)
    })
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <AnnotationViewer image={images[index]} />
      <div
        style={{
          padding: 10,
          position: 'absolute',
          width: 50,
          maxHeight: 500,
          overflowY: 'auto',
          top: 0,
          left: 0,
        }}
      >
        {images.map((image: string, key: number) => (
          <img
            onClick={() => setIndex(key)}
            key={key}
            style={{
              width: '100%',
              height: 50,
              cursor: 'pointer',
              border: '2px solid transparent',
              borderColor: key == index ? 'red' : 'transparent',
            }}
            src={image}
          />
        ))}
      </div>
    </div>
  )
}
export default {
  title: 'Examples/PDF',
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
import { getImagesFromPDF, AnnotationViewer } from 'react-mindee-js'
import React, { useEffect, useState } from 'react'

import dummyPDF from 'assets/pdf.pdf'

const Example = () => {
  const [index, setIndex] = useState<number>(0)
  const [images, setImages] = useState<string[]>([])
  useEffect(() => {
    getImagesFromPDF(dummyPDF).then((images: string[]) => {
      setImages(images)
    })
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <AnnotationViewer image={images[index]} />
      <div
        style={{
          padding: 10,
          position: 'absolute',
          width: 50,
          maxHeight: 500,
          overflowY: 'auto',
          top: 0,
          left: 0,
        }}
      >
        {images.map((image: string, key: number) => (
          <img
            onClick={() => setIndex(key)}
            key={key}
            style={{
              width: '100%',
              height: 50,
              cursor: 'pointer',
              border: '2px solid transparent',
              borderColor: key == index ? 'red' : 'transparent',
            }}
            src={image}
          />
        ))}
      </div>
    </div>
  )
}
        `,
      },
    },
  },
}
const Template = (args) => <Example {...args} />

export const PDF = Template.bind({})
PDF.args = {
  file: dummyPdf,
}
