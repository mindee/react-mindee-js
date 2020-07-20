// @flow

import { useEffect } from "react"

const useResizeListener = ({ resizeAnnotation, resizing = true }: any) => {
  useEffect(() => {
    resizing && window.addEventListener("resize", resizeAnnotation)
    return () => {
      resizing && window.removeEventListener("resize", resizeAnnotation)
    }
  }, [resizing])
}

export default useResizeListener
