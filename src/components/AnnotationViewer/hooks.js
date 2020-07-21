// @flow
import { useState, useEffect } from "react"

import {
  useAnnotationRefs,
  useImageViewer,
  useEventsListeners,
  useDrawingCanvas,
  useResizeListener,
  useImageCanvas,
  useErrorsHandler,
} from "hooks"

import type { Shape, LensProps } from "common/types"
import { Point } from "helpers/geometry"

import { settings as defaultSettings } from "helpers/settings"

const useConstructor = ({
  onShapeHover,
  userSettings,
  container,
}: {
  onShapeHover?: (Shape | null) => void,
  container: HTMLDivElement,
  userSettings: any,
}) => {
  const [zoom, setZoom] = useState<number>(1)
  const [offset, setOffset] = useState<Point>(new Point())
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const settings = { ...defaultSettings, ...userSettings }
  const containerHeight = (container && container.clientHeight) || 200

  useEffect(() => {
    onShapeHover && onShapeHover(selectedShape)
  }, [selectedShape])

  const resetZoom = () => {
    setZoom(1)
    setOffset(new Point())
  }

  return {
    resetZoom,
    containerHeight,
    selectedShape,
    setSelectedShape,
    offset,
    setOffset,
    zoom,
    setZoom,
    settings,
  }
}

type Props = {
  image: String | File,
  height?: number | string,
  width?: number | string,
  onShapeClick?: (shape: Shape) => void,
  onShapeHover?: (shape: Shape | null) => void,
  className?: string,
  userSettings?: any,
  shapes: Shape[],
  getLensProps?: (lensProps: LensProps) => void,
}

export const useAnnotationViewer = ({
  onShapeClick,
  onShapeHover,
  image,
  userSettings,
  shapes,
  getLensProps,
}: Props) => {
  useErrorsHandler({ image, component: "AnnotationViewer" })

  const {
    backgroundRef,
    drawingLayerRef,
    containerRef,
    setRef,
    refsLoading,
    background,
    container,
    drawingLayer,
  }: any = useAnnotationRefs()
  const {
    imageObject,
    imageBoundingBox,
    imageObjectRef,
    resizeAnnotation,
  } = useImageCanvas({ backgroundRef, drawingLayerRef, containerRef })

  const {
    settings,
    resetZoom,
    containerHeight,
    offset,
    setOffset,
    zoom,
    setZoom,
    selectedShape,
    setSelectedShape,
  } = useConstructor({
    onShapeHover,
    userSettings,
    container,
  })

  useImageViewer({
    resizeAnnotation,
    imageObjectRef,
    imageBoundingBox,
    refsLoading,
    background,
    container,
    settings,
    image,
    offset,
    zoom,
    resetZoom,
  })
  useDrawingCanvas({
    refsLoading,
    drawingLayer,
    container,
    selectedShape,
    shapes,
    imageBoundingBox,
    zoom,
    offset,
    settings,
  })

  useResizeListener({ resizeAnnotation })

  const {
    onMouseMove,
    onWheel,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    isDragging,
    onMouseOver,
  } = useEventsListeners({
    imageObject,
    getLensProps,
    onShapeClick,
    drawingLayer,
    background,
    setSelectedShape,
    imageBoundingBox,
    offset,
    selectedShape,
    setOffset,
    setZoom,
    shapes,
    zoom,
    settings,
  })
  return {
    setRef,
    containerHeight,
    onMouseOver,
    isDragging,
    onMouseLeave,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    selectedShape,
  }
}
