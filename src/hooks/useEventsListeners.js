// @flow
import { useEffect, useState } from "react"
import disableScroll from "disable-scroll"

import { Point } from "helpers/geometry"

import type { LensProps, Shape } from "common/types"
import {
  getNativePosition,
  getDragOffset,
  geNewZoomParams,
  getSelectedShape,
} from "helpers/canvasUtils"

const useDragging = () => {
  const [dragged, setDragged] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  return { dragged, setDragged, isDragging, setIsDragging }
}

export const useScrollControls = () => {
  const [scrollDisabled, setScrollDisabled] = useState<boolean>(false)

  useEffect(() => {
    if (scrollDisabled) {
      disableScroll.on()
    } else {
      disableScroll.off()
    }
    return () => {
      disableScroll.off()
    }
  }, [scrollDisabled])
  return {
    scrollDisabled,
    setScrollDisabled,
  }
}

const useFocus = ({ drawingLayer }) => {
  // Without canvas focus (and tabindex="0"), keyboard events aren't caught
  useEffect(() => {
    drawingLayer && drawingLayer.focus()
  }, [])
}

interface Props {
  imageObject: any;
  getLensProps?: (lensProps: LensProps) => void;
  onShapeClick?: (shape: Shape) => void;
  drawingLayer: HTMLCanvasElement;
  setSelectedShape: (selectedShape: Shape | null) => void;
  imageBoundingBox: number[] | null;
  offset: Point;
  setZoom: (zoom: number) => void;
  zoom: number;
  setOffset: (offset: Point) => void;
  settings: any;
  selectedShape: Shape | null;
  shapes: Shape[];
}

const useEventsListeners = ({
  imageObject,
  getLensProps,
  onShapeClick,
  drawingLayer,
  setSelectedShape,
  imageBoundingBox,
  offset,
  selectedShape,
  setOffset,
  setZoom,
  shapes,
  zoom,
  settings,
}: Props) => {
  const { positionTracking, zooming, dragging } = settings.effects
  const { setScrollDisabled, scrollDisabled } = useScrollControls()
  useFocus({ drawingLayer })
  const { dragged, isDragging, setIsDragging, setDragged } = useDragging()

  const onMouseLeave = () => {
    isDragging && setIsDragging(false)
    scrollDisabled && setScrollDisabled(false)
  }

  const onMouseDown = () => {
    selectedShape && onShapeClick && onShapeClick(selectedShape)
    setIsDragging(true)
  }

  const onMouseUp = (event: any) => {
    setIsDragging(false)
    if (dragged) {
      event.stopPropagation()
      setDragged(false)
    }
    if (selectedShape) {
      event.stopPropagation()
    }
  }

  const onMouseMove = (event: MouseEvent) => {
    let cursorPosition = getNativePosition(
      event,
      drawingLayer,
      zoom,
      offset
    ).toRelative(imageBoundingBox)
    getLensProps && getLensProps({ cursorPosition, selectedShape })
    if (positionTracking) {
      setSelectedShape(getSelectedShape(imageObject, shapes, cursorPosition))
    }

    if (dragging && isDragging && zoom > 1) {
      setOffset(getDragOffset(event, zoom, offset))
      setDragged(true)
    }
  }

  const onMouseOver = () => {
    !scrollDisabled && setScrollDisabled(true)
  }

  const onWheel = (event: WheelEvent) => {
    if (!zooming || !imageBoundingBox || event.deltaY === 0) {
      return
    }

    const { newZoom, newOffset } = geNewZoomParams(
      event,
      drawingLayer,
      zoom,
      offset,
      settings.zoom
    )
    newZoom !== zoom && setZoom(newZoom)
    offset !== newOffset && setOffset(newOffset)
  }
  return {
    onMouseOver,
    isDragging,
    onMouseLeave,
    onMouseMove,
    onWheel,
    onMouseDown,
    onMouseUp,
  }
}

export default useEventsListeners
