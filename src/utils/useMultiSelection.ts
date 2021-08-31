import useEventListener from './useEventListener'
import { MutableRefObject } from 'react'
import { Key } from 'ts-key-enum'
import Konva from 'konva'

interface Props {
  stage?: Konva.Stage
  isSelectionActiveRef: MutableRefObject<boolean>
}
export default function useMultiSelection({
  stage,
  isSelectionActiveRef,
}: Props) {
  useEventListener<HTMLDivElement, KeyboardEvent>(
    'keydown',
    (event: KeyboardEvent) => {
      event.stopPropagation()
      switch (event.key) {
        case Key.Control:
          stage?.draggable(false)
          isSelectionActiveRef.current = true
          break
        default:
          break
      }
    }
  )
  useEventListener<HTMLDivElement, KeyboardEvent>(
    'keyup',
    (event: KeyboardEvent) => {
      event.stopPropagation()
      switch (event.key) {
        case Key.Control:
          stage?.draggable(true)
          isSelectionActiveRef.current = false
          break
        default:
          break
      }
    }
  )
}
