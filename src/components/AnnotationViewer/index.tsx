import {
  AnnotationShape,
  Options,
  Orientation,
  PointerPosition,
} from 'mindee-js'
import React, { CSSProperties, useEffect, useRef } from 'react'

const defaultStyle = {
  display: 'flex',
  width: '100%',
  height: 600,
}
interface Props {
  image: string
  style?: CSSProperties
  shapes?: AnnotationShape[]
  orientation?: Orientation
  options?: Options
  onShapeMouseEnter?: (shape: AnnotationShape) => void
  onShapeClick?: (shape: AnnotationShape) => void
  onShapeMouseLeave?: (shape: AnnotationShape) => void
  onPointerMove?: (pointerPosition: PointerPosition) => void
  className?: string
}
const AnnotationViewer = ({
  shapes,
  style = {},
  orientation,
  options,
  image,
  className = 'annotation-viewer',
  onShapeMouseEnter,
  onShapeMouseLeave,
  onShapeClick,
  onPointerMove,
}: Props) => {
  const ref = useRef<any>(null)
  const _onShapeMouseEnter = (event) => {
    onShapeMouseEnter && onShapeMouseEnter(event?.detail?.shape)
  }
  const _onShapeMouseLeave = (event) => {
    onShapeMouseLeave && onShapeMouseLeave(event?.detail?.shape)
  }
  const _onShapeClick = (event) => {
    onShapeClick && onShapeClick(event?.detail?.shape)
  }
  const _onPointerMove = (event) => {
    onPointerMove && onPointerMove(event?.detail?.pointerPosition)
  }
  useEffect(() => {
    ref.current?.addEventListener('on-shape-mouse-enter', _onShapeMouseEnter)
    ref.current?.addEventListener('on-shape-mouse-leave', _onShapeMouseLeave)
    ref.current?.addEventListener('on-shape-click', _onShapeClick)
    ref.current?.addEventListener('on-pointer-move', _onPointerMove)
    return () => {
      ref.current?.removeEventListener(
        'on-shape-mouse-enter',
        _onShapeMouseEnter
      )
      ref.current?.removeEventListener(
        'on-shape-mouse-leave',
        _onShapeMouseLeave
      )
      ref.current?.removeEventListener('on-shape-click', _onShapeClick)
      ref.current?.removeEventListener('on-pointer-move', _onPointerMove)
    }
  }, [])

  return (
    <annotation-viewer
      class={className}
      style={{ ...defaultStyle, ...style }}
      orientation={orientation}
      image={image}
      ref={ref}
      shapes={shapes && JSON.stringify(shapes)}
      options={options && JSON.stringify(options)}
    />
  )
}

export default AnnotationViewer
