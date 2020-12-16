import { Container } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'
import { COLORS } from '../../common/constants'
import { FieldData } from '../../common/types'
import React from 'react'
import Field from './Field'

const useStyles = makeStyles({
  root: {
    background: COLORS.pgrey,
  },
})

interface Props {
  style?: CSSProperties
  className?: string
  fields: FieldData[]
  itemSize?: number
  onFieldClick?: (SyntheticEvent, FieldData) => void
  onFieldMouseEnter?: (SyntheticEvent, FieldData) => void
  onFieldMouseLeave?: (SyntheticEvent, FieldData) => void
  onItemClick?: (SyntheticEvent, FieldItem) => void
  onItemMouseEnter?: (SyntheticEvent, FieldItem) => void
  onItemMouseLeave?: (SyntheticEvent, FieldItem) => void
  onSubItemClick?: (SyntheticEvent, subItem) => void
  onSubItemMouseEnter?: (SyntheticEvent, subItem) => void
  onSubItemMouseLeave?: (SyntheticEvent, subItem) => void
  maxItemsLength?: number
}
const AnnotationForm = ({ style = {}, className, fields, ...rest }: Props) => {
  const classes = useStyles()
  return (
    <Container
      className={classNames(classes.root, 'annotation-form', {
        [className]: className,
      })}
      style={style}
    >
      {fields.map((field: FieldData, key: number) => (
        <Field key={key} field={field} {...rest} />
      ))}
    </Container>
  )
}

export default AnnotationForm
