// @flow
import { useState, useRef } from "react"

import { resizeCanvas, getImageBoundingBox } from "helpers/canvasUtils"

const useImageCanvas = ({
  container,
  drawingLayer,
  background,
  refsLoading,
}: any) => {
  const imageObjectRef = useRef<any>(null)
  const [imageBoundingBox, setImageBoundingBox] = useState<any>(null)
  const resizeAnnotation = () => {
    if (!refsLoading) {
      resizeCanvas(drawingLayer, container)
      resizeCanvas(background, container)
      setImageBoundingBox(
        getImageBoundingBox(background, imageObjectRef.current).slice()
      )
    }
  }

  return {
    imageObject: imageObjectRef.current,
    resizeAnnotation,
    imageBoundingBox,
    imageObjectRef,
  }
}

export default useImageCanvas
