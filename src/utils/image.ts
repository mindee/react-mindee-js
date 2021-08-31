import Konva from 'konva'

export const dataURItoBlob = (dataURI: string) => {
  let byteString
  const splitDataURL = dataURI.split(',')
  if (splitDataURL[0].indexOf('base64') >= 0) {
    // atob decodes base64 data
    byteString = atob(splitDataURL[1])
  } else {
    byteString = decodeURI(dataURI.split(',')[1])
  }

  const mimeString = splitDataURL[0].split(':')[1].split(';')[0]

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ia], { type: mimeString })
}

export const computeImageBoundingBox = (
  { clientWidth, clientHeight }: HTMLDivElement,
  imageObj: HTMLImageElement
) => {
  const imageAspectRatio = imageObj.width / imageObj.height
  const canvasAspectRatio = clientWidth / clientHeight
  let renderableHeight, renderableWidth, xStart, yStart

  xStart = 0
  yStart = 0
  renderableHeight = clientHeight
  renderableWidth = clientWidth

  if (imageAspectRatio < canvasAspectRatio) {
    renderableWidth = imageObj.width * (renderableHeight / imageObj.height)
    xStart = Math.round((clientWidth - renderableWidth) / 2)
  } else if (imageAspectRatio > canvasAspectRatio) {
    renderableHeight = imageObj.height * (renderableWidth / imageObj.width)
    yStart = Math.round((clientHeight - renderableHeight) / 2)
  }

  return {
    scale: Number(Number(renderableWidth / imageObj.width).toFixed(3)),
    x: xStart,
    y: yStart,
    width: Math.round(renderableWidth),
    height: Math.round(renderableHeight),
  }
}

export const createImageShape = (imageObject: HTMLImageElement) =>
  new Konva.Image({
    image: imageObject,
    listening: false,
  })

const resizeStage = (stage: Konva.Stage, container: HTMLDivElement) => {
  stage.width(container.clientWidth)
  stage.height(container.clientHeight)
}

export const handleResizeImage = (
  stage?: Konva.Stage,
  container?: HTMLDivElement | null,
  imageObject?: HTMLImageElement | null,
  imageShape?: Konva.Image
) => {
  if (!imageShape || !container || !stage || !imageObject) {
    return
  }
  resizeStage(stage, container)
  const imageBoundingBox = computeImageBoundingBox(container, imageObject)
  const { x, y, width, height, scale } = imageBoundingBox
  stage?.scale({
    x: scale,
    y: scale,
  })
  stage.position({ x, y })
  imageShape.width(width / scale)
  imageShape.height(height / scale)
  return imageBoundingBox
}
