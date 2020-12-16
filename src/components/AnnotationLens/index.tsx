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
export interface Props {
  style?: CSSProperties
  shapes?: AnnotationShape
  orientation?: Orientation
  options?: Options
  pointerPosition: PointerPosition
  ref?: Ref<any>
  image: string
  className?: string
  zoomLevel?: number
}

const AnnotationLens = ({
  className = 'annotation-lens',
  pointerPosition,
  shapes,
  orientation,
  zoomLevel = 2,
  ref,
  options,
  image,
  style = {},
}: Props) => {
  return (
    <annotation-lens
      style={{ ...defaultStyle, ...style }}
      ref={ref}
      className={className}
      image={image}
      shapes={shapes && JSON.stringify(shapes)}
      pointer-position={pointerPosition && JSON.stringify(pointerPosition)}
      orientation={orientation}
      options={options && JSON.stringify(options)}
      zoom-level={zoomLevel}
    />
  )
}

export default AnnotationLens
