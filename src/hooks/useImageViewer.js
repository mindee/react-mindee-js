// @flow
import { useEffect } from "react"

import { Point } from "helpers/geometry"
import type { SettingsShape } from "helpers/settings"
import { drawImage } from "helpers/drawingUtils"

type Props = {
  imageObjectRef: any,
  refsLoading: boolean,
  background: HTMLCanvasElement,
  image: String | File,
  settings: SettingsShape,
  resetZoom?: () => void,
  offset?: Point,
  zoom?: number,
  imageBoundingBox: number[],
  resizeAnnotation: () => void,
}

const useImageViewer = ({
  resizeAnnotation,
  imageObjectRef,
  imageBoundingBox,
  image,
  refsLoading = true,
  background,
  settings,
  resetZoom,
  offset = new Point(),
  zoom = 1,
}: Props) => {
  const loadImage = (source: any) => {
    const imageObject = new Image()
    imageObject.src = source
    imageObject.onload = () => {
      imageObjectRef.current = imageObject
      resizeAnnotation()
    }
  }

  useEffect(() => {
    if (!refsLoading) {
      resetZoom && resetZoom()
      loadImage(image)
    }
  }, [image, refsLoading])

  useEffect(() => {
    if (imageBoundingBox) {
      drawImage(
        background,
        imageObjectRef.current,
        imageBoundingBox,
        zoom,
        offset,
        settings
      )
    }
  }, [zoom, offset, imageBoundingBox, image])
}

export default useImageViewer
