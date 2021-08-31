import { useRef, useEffect, RefObject } from 'react'

export default function useEventListener<
  T extends HTMLElement = HTMLDivElement,
  E = Event
>(
  eventName: string,

  handler: (event: E) => void,

  element?: RefObject<T>
) {
  // Create a ref that stores handler

  const savedHandler = useRef<(event: E) => void>()

  useEffect(() => {
    // Define the listening target

    const targetElement: T | Window = element?.current || window

    if (!(targetElement && targetElement.addEventListener)) {
      return
    }

    // Update saved handler if necessary

    if (savedHandler.current !== handler) {
      savedHandler.current = handler
    }

    // Create event listener that calls handler function stored in ref

    const eventListener = (event: E) => {
      // eslint-disable-next-line no-extra-boolean-cast

      if (!!savedHandler?.current) {
        savedHandler.current(event)
      }
    }
    // @ts-expect-error
    targetElement.addEventListener(eventName, eventListener)

    // Remove event listener on cleanup

    return () => {
      // @ts-expect-error
      targetElement.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element, handler])
}
