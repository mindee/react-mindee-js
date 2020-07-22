// @flow

import { useEffect } from "react"

const useResizeListener = ({ resizeAnnotation, resizing = true }: any) => {
  const onFullScreenChange = () => {
    window.dispatchEvent(new Event("resize"))
  }

  useEffect(() => {
    document.addEventListener("fullscreenchange", onFullScreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange)
    }
  })
  useEffect(() => {
    resizing && window.addEventListener("resize", resizeAnnotation)
    return () => {
      resizing && window.removeEventListener("resize", resizeAnnotation)
    }
  }, [resizing])
}

export default useResizeListener
