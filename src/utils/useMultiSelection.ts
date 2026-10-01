import type { RefObject } from 'react'
import type Konva from 'konva'

import useEventListener from './useEventListener'

interface Props {
  stageRef: RefObject<Konva.Stage | null>
  isSelectionActiveRef: RefObject<boolean>
}

const isSelectionModifier = (event: KeyboardEvent) =>
  event.ctrlKey ||
  event.altKey ||
  event.key === 'Control' ||
  event.key === 'Alt'

export default function useMultiSelection({
  stageRef,
  isSelectionActiveRef,
}: Props) {
  useEventListener('keydown', (event) => {
    event.stopPropagation()
    if (isSelectionModifier(event)) {
      stageRef.current?.draggable(false)
      isSelectionActiveRef.current = true
    }
  })
  useEventListener('keyup', (event) => {
    event.stopPropagation()
    if (isSelectionModifier(event)) {
      stageRef.current?.draggable(true)
      isSelectionActiveRef.current = false
    }
  })
}
