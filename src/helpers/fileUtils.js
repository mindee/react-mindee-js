// @flow

/*
 ** convert base64/URLEncoded data component
 ** to raw binary data held in a string
 */
export const dataURItoBlob = (dataURI: string) => {
  let byteString
  const splitDataURL = dataURI.split(",")
  if (splitDataURL[0].indexOf("base64") >= 0) {
    // atob decodes base64 data
    byteString = atob(splitDataURL[1])
  } else {
    byteString = decodeURI(dataURI.split(",")[1])
  }

  const mimeString = splitDataURL[0].split(":")[1].split(";")[0]

  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ia], { type: mimeString })
}

const applyRotation = (file: File | Blob, orientation: number) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()

      image.onload = () => {
        // Create canvas (off screen) to render image and apply transformations
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d", { alpha: false })
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
        const outputCanvas = document.createElement("canvas")
        outputCanvas.width = outputWidth
        outputCanvas.height = outputHeight
        const outputContext = outputCanvas.getContext("2d", { alpha: false })
        const sx = rightAligned ? canvas.width - outputCanvas.width : 0
        const sy = bottomAligned ? canvas.height - outputCanvas.height : 0
        outputContext.drawImage(
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
        resolve(outputCanvas.toDataURL("image/jpeg"))
      }

      image.src = reader.result
    }

    reader.readAsDataURL(file)
  })

export const rotateLeft = (file: File): Promise<string> =>
  applyRotation(file, 8)

export const rotateRight = (file: File): Promise<string> =>
  applyRotation(file, 6)

export const getImageUrlWithoutExifTags = (
  file: File | Blob
): Promise<string> =>
  readOrientation(file).then((orientation) =>
    applyRotation(file, orientation || 1)
  )

/**
 * @returns promise with EXIF orientation value (or undefined)
 *
 * This is intended to be a simpler approach than exif-js.
 * If it shows limitation, we could switch to exif-js code which sums up as follow
 *
 *  import EXIF from 'exif-js'
 *
 *  ...
 *  reader.onload = event => {
 *    const self = this
 *    EXIF.getData(file, function() {
 *      return EXIF.getTag(this, 'Orientation')
 *    })
 *  }
 * see https://www.exif.org/Exif2-2.PDF (page 24)
 *
 *     1        2       3      4         5            6           7          8
 *
 *   888888  888888      88  88      8888888888  88                  88  8888888888
 *   88          88      88  88      88  88      88  88          88  88      88  88
 *   8888      8888    8888  8888    88          8888888888  8888888888          88
 *   88          88      88  88
 *   88          88  888888  888888
 *
 */
export const readOrientation = (file: File | Blob): any =>
  new Promise<number>((resolve) => {
    const reader = new FileReader()

    reader.onload = () =>
      resolve(
        (() => {
          const view = new DataView(reader.result)

          if (view.getUint16(0, false) !== 0xffd8) {
            return
          }

          const length = view.byteLength

          let offset = 2
          while (offset < length) {
            const marker = view.getUint16(offset, false)

            offset += 2

            if (marker === 0xffe1) {
              offset += 2

              if (view.getUint32(offset, false) !== 0x45786966) {
                return
              }

              offset += 6

              const little = view.getUint16(offset, false) === 0x4949

              offset += view.getUint32(offset + 4, little)

              const tags = view.getUint16(offset, little)

              offset += 2

              for (let i = 0; i < tags; i++) {
                if (view.getUint16(offset + i * 12, little) === 0x0112) {
                  return view.getUint16(offset + i * 12 + 8, little)
                }
              }
            } else if ((marker & 0xff00) !== 0xff00) {
              break
            } else {
              offset += view.getUint16(offset, false)
            }
          }
        })()
      )

    reader.readAsArrayBuffer(file.slice(0, 64 * 1024))
  })
