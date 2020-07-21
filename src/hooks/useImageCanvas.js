// @flow
import { useState, useRef, RefObject } from "react"

import { resizeCanvas, getImageBoundingBox } from "helpers/canvasUtils"

interface Props {
  containerRef: RefObject<HTMLDivElement>;
  drawingLayerRef: RefObject<HTMLCanvasElement>;
  backgroundRef: RefObject<HTMLCanvasElement>;
}

const useImageCanvas = ({
  backgroundRef,
  drawingLayerRef,
  containerRef,
}: Props) => {
  const imageObjectRef = useRef<any>(null)
  const [imageBoundingBox, setImageBoundingBox] = useState<any>(null)
  const resizeAnnotation = () => {
    resizeCanvas(drawingLayerRef.current, containerRef.current)
    resizeCanvas(backgroundRef.current, containerRef.current)
    setImageBoundingBox(
      getImageBoundingBox(backgroundRef.current, imageObjectRef.current).slice()
    )
  }

  return {
    imageObject: imageObjectRef.current,
    resizeAnnotation,
    imageBoundingBox,
    imageObjectRef,
  }
}

export default useImageCanvas
