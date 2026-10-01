import { useEffect, useRef, type RefObject } from 'react'

export default function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: RefObject<HTMLElement | null>,
) {
  const savedHandler = useRef(handler)
  useEffect(() => {
    savedHandler.current = handler
  })

  useEffect(() => {
    const target: HTMLElement | Window = element?.current ?? window
    const listener = (event: Event) => {
      savedHandler.current(event as WindowEventMap[K])
    }
    target.addEventListener(eventName, listener)
    return () => {
      target.removeEventListener(eventName, listener)
    }
  }, [eventName, element])
}
