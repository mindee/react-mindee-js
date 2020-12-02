import React from 'react'
import { AnnotationViewer } from '../..'
import { DUMMY_SHAPES } from '../assets/dummyData'
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs/blocks'
// @ts-ignore
import dummyImage from '../assets/image.jpg'
export default {
  title: 'Main component/AnnotationViewer',
  argTypes: {
    image: {
      description: 'Image URL or base64',
      table: {
        type: { summary: 'string' },
      },
      control: {
        type: null,
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
    onShapeMouseEnter: {
      description: 'Return the shape on mouse enter event',
      control: {
        type: null,
      },
      table: {
        type: {
          summary: 'function',
          detail: '(shape: AnnotationShape) => void',
        },
      },
    },
    onShapeMouseLeave: {
      description: 'Return the shape on mouse leave event',
      control: {
        type: null,
      },
      table: {
        type: {
          summary: 'function',
          detail: '(shape: AnnotationShape) => void',
        },
      },
    },
    onShapeMouseClick: {
      description: 'Return the shape on mouse click event',
      control: {
        type: null,
      },
      table: {
        type: {
          summary: 'function',
          detail: '(shape: AnnotationShape) => void',
        },
      },
    },
    onPointerMove: {
      description:
        'Return the pointer position relative the image on mouse move event',
      control: {
        type: null,
      },
      table: {
        type: {
          summary: 'function',
          detail: '(pointerPosition: PointerPosition) => void',
        },
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
{
  display: 'flex',
  width: '100%',
  height: 500,
}
`,
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
        defaultValue: { summary: '"annotation-viewer"' },
      },
    },
  },
  args: {
    image: dummyImage,
    shapes: DUMMY_SHAPES,
    orientation: 0,
    options: {},
  },
  parameters: {
    docs: {
      source: {
        code: `
import dummyImage from '../assets/image.jpg'
const dummy_shapes = [
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

<AnnotationViewer image={dummyImage} shapes={dummy_shapes} />
        `,
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description>
            Flexible component to display interactive and customizable shapes on
            image
          </Description>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
}

const Template = (args) => <AnnotationViewer {...args} />

export const Base = Template.bind({})
Base.storyName = 'AnnotationViewer'
