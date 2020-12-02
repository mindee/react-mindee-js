import React from 'react'
import { AnnotationForm, formatPrediction } from '../..'
import { API_RESPONSE } from '../assets/dummyData'
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs/blocks'
import LinkTo from '@storybook/addon-links/react'
// @ts-ignore
export default {
  title: 'Helpers/AnnotationForm',
  argTypes: {
    fields: {
      description: 'List of nested objects with custom style and behavior',
      control: {
        type: null,
      },
      table: {
        type: {
          summary: 'FieldData',
          detail: `
id: string
label: string
name: string
items: FieldItem[]
onClick?: (SyntheticEvent, FieldData) => void
onMouseEnter?: (SyntheticEvent, FieldData) => void
onMouseLeave?: (SyntheticEvent, FieldData) => void
className?: string
style?: CSSProperties
column: number`,
        },
      },
    },
    style: {
      description: 'CSS object',
      control: {
        type: null,
      },
    },
    className: {
      description: 'ClassNAme',
      control: {
        type: null,
      },
    },
  },
  args: {
    fields: formatPrediction(API_RESPONSE.predictions[0]).fields,
  },
  parameters: {
    source: {
      code:
        '<AnnotationForm fields={formatPrediction(API_RESPONSE.predictions[0]).fields}/>',
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description>
            Interactive component to display textual data prediction
          </Description>
          <LinkTo
            kind="Examples/Form"
            title="link to second story"
            style={{ color: '#1474f3' }}
          >
            See example
          </LinkTo>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
}

export const Base = (args) => <AnnotationForm {...args} />
Base.storyName = 'AnnotationForm'
