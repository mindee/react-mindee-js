// @flow
export const hexaColorToRGBWithAndOpacity = function (
  hexaColorString: string,
  opacity: number
) {
  const hexaColorStringWithoutSharp = hexaColorString.replace(/#/, "").trim()
  if (hexaColorStringWithoutSharp.length !== 6) {
    console.error(
      `"${hexaColorStringWithoutSharp}" is not a valid hex color only six-digit hex colors are allowed not ${hexaColorStringWithoutSharp.length}.`
    )
    return hexaColorString
  }

  const matchRgbFromHexadecimalString = hexaColorStringWithoutSharp.match(
    /.{1,2}/g
  )
  const rgbColors = [
    parseInt(matchRgbFromHexadecimalString[0], 16),
    parseInt(matchRgbFromHexadecimalString[1], 16),
    parseInt(matchRgbFromHexadecimalString[2], 16),
  ]
  return `rgba(${rgbColors.join(", ")}, ${opacity})`
}
