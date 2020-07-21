// @flow
import { useCallback, useState, useRef } from "react"

const useAnnotationRefs = () => {
  const [refsLoading, setRefsLoading] = useState<boolean>(true)
  const containerRef = useRef<HTMLElement | null>(null)
  const backgroundRef = useRef<HTMLCanvasElement | null>(null)
  const drawingLayerRef = useRef<HTMLCanvasElement | null>(null)
  const setRef = useCallback(
    (type: "background" | "drawingLayer" | "container") => (node: any) => {
      if (node) {
        const refsMapping = {
          background: backgroundRef,
          drawingLayer: drawingLayerRef,
          container: containerRef,
        }
        refsMapping[type].current = node
        if (
          containerRef.current &&
          backgroundRef.current &&
          drawingLayerRef.current
        ) {
          setRefsLoading(false)
        }
      }
    },
    []
  )

  return {
    setRef,
    refsLoading,
    backgroundRef,
    drawingLayerRef,
    containerRef,
    background: backgroundRef.current,
    drawingLayer: drawingLayerRef.current,
    container: containerRef.current,
  }
}

export default useAnnotationRefs
