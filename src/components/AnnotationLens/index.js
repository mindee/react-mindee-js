// @flow
import React, { memo } from "react"
import styled from "styled-components"

import { useAnnotationLens } from "./hooks"

import { type SettingsShape } from "helpers/settings"
import type { Shape } from "common/types"
import { Point } from "helpers/geometry"
import { classnames } from "helpers/sharedUtils"

const Wrapper = styled.div`
  border: 1px solid black;
  width: ${({ width }) => (typeof width === "number" ? `${width}px` : width)};
  height: ${({ height }) =>
    typeof height === "number" ? `${height}px` : height};
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    outline: none;
    max-width: 100% !important;
    max-height: 100%;
  }
`

interface Props {
  className?: string;
  image: String | File;
  zoomLevel?: number;
  height?: number | string;
  width?: number | string;
  cursorPosition: Point;
  selectedShape: any;
  shapes?: Shape[];
  settings?: SettingsShape;
}

const AnnotationLens = ({
  className,
  selectedShape,
  image,
  shapes = [],
  zoomLevel = 3,
  height = "100%",
  width = "100%",
  cursorPosition,
  settings: userSettings = {},
}: Props) => {
  const { setRef } = useAnnotationLens({
    selectedShape,
    userSettings,
    image,
    shapes,
    cursorPosition,
    zoomLevel,
  })
  return (
    <Wrapper
      width={width}
      height={height}
      ref={setRef("container")}
      className={classnames("annotation-lens", className)}
    >
      <canvas ref={setRef("background")} />
      <canvas ref={setRef("drawingLayer")} />
    </Wrapper>
  )
}

export default memo<any>(AnnotationLens)
