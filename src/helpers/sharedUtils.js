// @flow
export const classnames = (...classList) =>
  classList.filter(Boolean).join(" ").trim()
