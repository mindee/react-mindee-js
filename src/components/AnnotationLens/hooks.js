// @flow
import {
  useImageViewer,
  useDrawingCanvas,
  useImageCanvas,
  useErrorsHandler,
  useAnnotationRefs,
} from "hooks"

import { settings as defaultSettings } from "helpers/settings"
import { Point } from "helpers/geometry"
import type { Shape } from "common/types"

interface Props {
  selectedShape: Shape;
  image: String | File;
  zoomLevel: number;
  cursorPosition: Point;
  shapes: Shape[];
  userSettings: any;
}

const useConstructor = ({
  background,
  zoomLevel,
  userSettings,
  cursorPosition,
  imageBoundingBox,
}: {
  background: HTMLCanvasElement,
  zoomLevel: number,
  userSettings: any,
  cursorPosition: Point,
  imageBoundingBox: number[] | null,
}) => {
  const settings = { ...defaultSettings, ...userSettings }
  const offset =
    imageBoundingBox &&
    cursorPosition
      .scale(-imageBoundingBox[2], -imageBoundingBox[3])
      .subtract(new Point(imageBoundingBox[0], imageBoundingBox[1]))
      .scale(zoomLevel)
      .add(new Point(background.width / 2, background.height / 2))
  return {
    offset,
    settings,
  }
}

export const useAnnotationLens = ({
  selectedShape,
  userSettings,
  image,
  shapes,
  cursorPosition,
  zoomLevel,
}: Props) => {
  useErrorsHandler({ image, component: "AnnotationLens" })

  const {
    refsLoading,
    setRef,
    background,
    container,
    drawingLayer,
    drawingLayerRef,
    containerRef,
    backgroundRef,
  }: any = useAnnotationRefs()

  const {
    imageBoundingBox,
    imageObjectRef,
    resizeAnnotation,
  } = useImageCanvas({ drawingLayerRef, containerRef, backgroundRef })

  const { settings, offset } = useConstructor({
    background,
    zoomLevel,
    imageBoundingBox,
    userSettings,
    cursorPosition,
  })

  useImageViewer({
    resizeAnnotation,
    imageObjectRef,
    imageBoundingBox,
    offset,
    zoom: zoomLevel,
    settings,
    refsLoading,
    background,
    container,
    image,
  })
  useDrawingCanvas({
    selectedShape,
    offset,
    zoom: zoomLevel,
    settings,
    refsLoading,
    drawingLayer,
    container,
    shapes,
    imageBoundingBox,
  })
  return {
    setRef,
  }
}
