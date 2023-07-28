export const roundTo = (value: number, precision = 0) => {
  const multiplier = Math.pow(10, precision)
  const newValue = parseFloat((Math.abs(value) * multiplier).toFixed(11))
  return (Math.round(newValue) / multiplier) * Math.sign(value)
}
