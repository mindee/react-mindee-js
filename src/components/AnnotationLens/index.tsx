import {
  AnnotationShape,
  Options,
  Orientation,
  PointerPosition,
} from 'mindee-js'
import React, { Ref, CSSProperties } from 'react'
const defaultStyle = {
  display: 'flex',
  width: 300,
  height: 300,
}
interface Props {
  style?: CSSProperties
  shapes?: AnnotationShape
  orientation?: Orientation
  options?: Options
  pointerPosition: PointerPosition
  ref?: Ref<any>
  image: string
  className?: string
}

const AnnotationLens = ({
  className = 'annotation-lens',
  pointerPosition,
  shapes,
  orientation,
  ref,
  options,
  image,
  style = {},
}: Props) => {
  return (
    //@ts-ignore
    <annotation-lens
      style={{ ...defaultStyle, ...style }}
      ref={ref}
      className={className}
      image={image}
      shapes={shapes && JSON.stringify(shapes)}
      pointer-position={pointerPosition && JSON.stringify(pointerPosition)}
      orientation={orientation}
      options={options && JSON.stringify(options)}
    />
  )
}

export default AnnotationLens
