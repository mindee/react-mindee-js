// @flow

import { useRef, useEffect } from "react"

const useTrace = (props: any): void => {
  const prev = useRef(props)
  useEffect(() => {
    const changedProps = Object.entries(props).reduce(
      (previous, [key, value]) => {
        if (prev.current[key] !== value) {
          previous[key] = [prev.current[key], value]
        }
        return previous
      },
      {}
    )
    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps)
    }
    prev.current = props
  })
}

export default useTrace
