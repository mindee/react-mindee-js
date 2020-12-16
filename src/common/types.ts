import { CSSProperties } from 'react'

export type FieldSubItem = {
  id: string
  fieldId: string
  fieldItemId: string
  label: string
  value: string | number
  className?: string
  style?: CSSProperties
  onClick?: (SyntheticEvent, FieldSubItem) => void
  onMouseEnter?: (SyntheticEvent, FieldSubItem) => void
  onMouseLeave?: (SyntheticEvent, FieldSubItem) => void
}

export type FieldItem = {
  id: string
  fieldId: string
  subItems: FieldSubItem[]
  className?: string
  style?: CSSProperties
  onClick?: (SyntheticEvent, FieldItem) => void
  onMouseEnter?: (SyntheticEvent, FieldItem) => void
  onMouseLeave?: (SyntheticEvent, FieldItem) => void
  renderSubItems?: (subItems: FieldSubItem[]) => JSX.Element
}

export type FieldData = {
  id: string
  label: string
  name: string
  items: FieldItem[]
  scrollToItem?: number
  onClick?: (SyntheticEvent, FieldData) => void
  onMouseEnter?: (SyntheticEvent, FieldData) => void
  onMouseLeave?: (SyntheticEvent, FieldData) => void
  className?: string
  style?: CSSProperties
  column: number
}

export type Prediction = {
  [feature: string]: {
    segmentation?: {
      bounding_box?: number[][]
    }
    [value: string]: any
  }
}
