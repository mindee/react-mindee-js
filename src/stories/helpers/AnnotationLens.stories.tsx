import React from 'react'
import { AnnotationLens } from '../..'
import { DUMMY_SHAPES } from '../assets/dummyData'
import LinkTo from '@storybook/addon-links/react'
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  PRIMARY_STORY,
} from '@storybook/addon-docs/blocks'
// @ts-ignore
import dummyImage from '../assets/image.jpg'
export default {
  title: 'Helpers/AnnotationLens',
  argTypes: {
    image: {
      description: 'Image URL or base64',
      control: {
        type: null,
      },
    },
    pointerPosition: {
      description:
        'pointer position relative the image rendered by AnnotationViewer',
      control: {
        type: null,
      },
      table: {
        type: {
          summary: 'PointerPosition',
          detail: `
x: number
y: number`,
        },
      },
    },
    shapes: {
      controls: {
        disable: true,
      },
      table: {
        type: {
          summary: 'AnnotationShape',
          detail: `
id: string
coordinates: number[][]
fill?: string
stroke?: string
strokeWidth?: number
listening?: boolean
visible?: boolean
crop?: string
[attribute: string]: string | number | boolean`,
        },
        defaultValue: { summary: '[]' },
      },
      description: 'List of objects to display on the canvas',
      control: {
        type: null,
      },
    },
    options: {
      description: 'Object of options to change default style and behavior',
      control: {
        type: null,
      },
      table: {
        type: {
          summary: 'Options',
          detail: `
backgroundColor?: string
zoom?: {
modifier: number
max: number
defaultZoom: number
`,
        },
      },
    },
    orientation: {
      description: 'Rotation in degree applied to the provided image',
      control: {
        type: 'select',
        options: [0, 90, 180, 270],
      },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    style: {
      description: 'Regular css object',
      control: {
        type: null,
      },
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: {
          summary: 'style',
          detail: `
display: 'flex',
width: 300,
height: 300,`,
        },
      },
    },
    className: {
      description: 'className',
      control: {
        type: null,
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"annotation-lens"' },
      },
    },
    ref: {
      description: 'Ref',
      control: {
        type: null,
      },
      table: {
        type: { summary: 'Ref' },
      },
    },
  },
  args: {
    image: dummyImage,
    shapes: DUMMY_SHAPES,
    orientation: 0,
  },
  parameters: {
    docs: {
      source: {
        code:
          '<AnnotationLens image={myImage} shapes={myShapes} pointerPosition={pointerPosition} />',
      },
      page: () => (
        <>
          <Title />
          <Subtitle>
            The AnnotationLens component provide a closer vision to the main
            canvas rendered by AnnotationViewer
          </Subtitle>
          <Description>
            The component can be easily linked to AnnotationViewer component by
            passing pointerPosition props which reflect the pointer position
            relative to the main canvas. It receive almost the same props except
            events props
          </Description>
          <LinkTo
            kind="Examples/Lens"
            title="link to second story"
            style={{ color: '#1474f3' }}
          >
            See example
          </LinkTo>
          <Primary></Primary>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      ),
    },
  },
}

export const Base = (args) => <AnnotationLens {...args} />

Base.storyName = 'AnnotationLens'
