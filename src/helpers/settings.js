// @flow

const BLACK = "#000000"
const DARK = "#001429"
const YELLOW = "#ffc147"
export const RED = "#FD3246"
const BLUE = "#007DFF"
const GREEN = " #13ca96"
const BLUE_DARK = "#22214E"
const PURPLE = "#624de3"
const ORANGE = "#E67E22"

export const RED_LIGHTER = "#ff596c"
export const BLUE_LIGHTER = "#009bfb"
export const YELLOW_LIGHTER = "#ffc972"
export const GREEN_LIGHTER = "#7dcea0"
export const PURPLE_LIGHTER = "#cac4f3"
export const ORANGE_LIGHTER = "#f0b27a"
export const BLACK_LIGHTER = "#cad1d7"

export const LIGHT_OPACITY = "30"

export const settings = {
  COLORS: {
    BACKGROUND: BLACK,
  },
  zoom: {
    default: 1,
    modifier: 0.5,
    max: 10,
  },
  tweening: {
    duration: 200,
    strategy: "easeInOutCubic",
  },
  effects: {
    zooming: true,
    dragging: true,
    resizing: true,
    positionTracking: true,
    hovering: true,
    tweening: true,
  },
  carousel: {
    maxSlidesToShow: 4,
  },
  highlightedShapeOptions: {},
  shapeOptions: {
    fillOpacity: 20,
    strokes: true,
    fill: true,
    closePath: true,
    lineWidth: 2,
  },
  featuresColor: [
    RED,
    BLUE,
    GREEN,
    PURPLE,
    YELLOW,
    ORANGE,
    YELLOW_LIGHTER,
    RED_LIGHTER,
    BLUE_LIGHTER,
    GREEN_LIGHTER,
    PURPLE_LIGHTER,
    ORANGE_LIGHTER,
  ],
  debug: true,
}

export type SettingsShape = $Shape<typeof settings>

export const COLORS = {
  BLACK,
  DARK,
  RED,
  BLUE,
  GREEN,
  BLUE_DARK,
  PURPLE,
  YELLOW,
}
