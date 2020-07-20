// @flow
import React from "react"
import styled from "styled-components"

import { type SettingsShape, BLACK_LIGHTER } from "helpers/settings"
import { useAnnotationViewer } from "./hooks"

import type { Shape, LensProps } from "common/types"
import { classnames } from "helpers/sharedUtils"

const StyleWrapper = styled.div`
  border: 1px solid ${BLACK_LIGHTER};
  width: ${({ width }) => (typeof width === "number" ? `${width}px` : width)};
  height: ${({ height }) =>
    typeof height === "number" ? `${height}px` : height};
  position: relative;
  cursor: ${({ selectedShape, isDragging }) =>
    selectedShape ? "pointer" : isDragging ? "all-scroll" : "grab"};
  canvas {
    position: absolute;
    top: 0;
    outline: none;
    max-width: 100% !important;
    max-height: 100%;
  }
`

type Props = {
  image: String | File,
  height?: number | string,
  width?: number | string,
  onShapeClick?: (shape: Shape) => void,
  onShapeHover?: (shape: Shape | null) => void,
  className?: string,
  settings?: SettingsShape,
  shapes?: Shape[],
  getLensProps?: (lensProps: LensProps) => void,
}

const AnnotationViewer = ({
  getLensProps,
  height = "100%",
  width = "100%",
  onShapeClick,
  onShapeHover,
  image,
  className,
  settings: userSettings = {},
  shapes = [],
}: Props) => {
  const {
    setRef,
    selectedShape,
    onMouseMove,
    onWheel,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    isDragging,
    onMouseOver,
  } = useAnnotationViewer({
    getLensProps,
    onShapeHover,
    onShapeClick,
    image,
    userSettings,
    shapes,
  })
  return (
    <StyleWrapper
      className={classnames("annotation-viewer", className)}
      height={height}
      width={width}
      ref={setRef("container")}
      selectedShape={!!selectedShape}
      isDragging={isDragging}
    >
      <canvas ref={setRef("background")} id="background-canvas" />
      <canvas
        id="drawing-layer"
        ref={setRef("drawingLayer")}
        onMouseLeave={onMouseLeave}
        onMouseOver={onMouseOver}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        tabIndex="0" // this is useful to catch keyboard events
      />
    </StyleWrapper>
  )
}

export default AnnotationViewer
