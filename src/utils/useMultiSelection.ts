import useEventListener from './useEventListener'
import { MutableRefObject } from 'react'
import Konva from 'konva'

interface Props {
  stage: Konva.Stage | null
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
      if (event.ctrlKey || event.altKey) {
        stage?.draggable(false)
        isSelectionActiveRef.current = true
      }
    }
  )
  useEventListener<HTMLDivElement, KeyboardEvent>(
    'keyup',
    (event: KeyboardEvent) => {
      event.stopPropagation()
      if (event.ctrlKey || event.altKey) {
        stage?.draggable(false)
        isSelectionActiveRef.current = true
      }
    }
  )
}
