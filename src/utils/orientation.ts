import { AnnotationData } from '@/common/types'

export const rotateImage = ({
  image,
  orientation: degrees,
}: AnnotationData) => {
  let orientation = 1
  switch (degrees) {
    case 0:
      orientation = 1
      break
    case 90:
      orientation = 6
      break
    case 180:
      orientation = 3
      break
    case 270:
      orientation = 8
      break
    default:
      break
  }
  return applyRotation(image as string, orientation)
}

const applyRotation = (file: string, orientation: number) =>
  new Promise<string>((resolve) => {
    const image = new Image()

    image.onload = () => {
      // Create canvas (off screen) to render image and apply transformations
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', {
        alpha: false,
      }) as CanvasRenderingContext2D
      const { width, height } = image

      const [outputWidth, outputHeight] =
        orientation > 4 && orientation < 9 ? [height, width] : [width, height]

      // Using a square canvas on max(width, height) to rotate rectangular images
      const wh = Math.max(width, height)
      canvas.width = wh
      canvas.height = wh

      // output image can be aligned to the right or bottom
      let rightAligned = false
      let bottomAligned = false

      switch (orientation) {
        case 2:
          context.transform(-1, 0, 0, 1, wh, 0)
          rightAligned = true
          break
        case 3:
          context.transform(-1, 0, 0, -1, wh, wh)
          rightAligned = true
          bottomAligned = true
          break
        case 4:
          context.transform(1, 0, 0, -1, 0, wh)
          bottomAligned = true
          break
        case 5:
          context.transform(0, 1, 1, 0, 0, 0)
          break
        case 6:
          context.transform(0, 1, -1, 0, wh, 0)
          rightAligned = true
          break
        case 7:
          context.transform(0, -1, -1, 0, wh, wh)
          rightAligned = true
          bottomAligned = true
          break
        case 8:
          context.transform(0, -1, 1, 0, 0, wh)
          bottomAligned = true
          break
        default:
          break
      }

      // draw image now that transform matrix is set
      context.drawImage(image, 0, 0, width, height)

      // transfer image to new canvas with correct dimensions
      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = outputWidth
      outputCanvas.height = outputHeight
      const outputContext = outputCanvas.getContext('2d', { alpha: false })
      const sx = rightAligned ? canvas.width - outputCanvas.width : 0
      const sy = bottomAligned ? canvas.height - outputCanvas.height : 0
      outputContext!.drawImage(
        canvas,
        sx,
        sy,
        outputCanvas.width,
        outputCanvas.height,
        0,
        0,
        outputCanvas.width,
        outputCanvas.height
      )

      // export image data
      resolve(outputCanvas.toDataURL('image/jpeg'))
    }

    image.src = file
  })

export const rotateLeft = (file: string): Promise<string> =>
  applyRotation(file, 8)

export const rotateRight = (file: string): Promise<string> =>
  applyRotation(file, 6)
