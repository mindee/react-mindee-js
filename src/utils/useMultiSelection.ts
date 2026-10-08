import { useRef, type RefObject } from 'react';
import type Konva from 'konva';

import useEventListener from './useEventListener';

type Props = {
  stageRef: RefObject<Konva.Stage | null>;
  isSelectionActiveRef: RefObject<boolean>;
  isEnabled: boolean;
};

const isSelectionModifier = (event: KeyboardEvent): boolean =>
  event.ctrlKey ||
  event.altKey ||
  event.key === 'Control' ||
  event.key === 'Alt';

export default function useMultiSelection({
  stageRef,
  isSelectionActiveRef,
  isEnabled,
}: Props): void {
  const wasDraggableRef = useRef(false);

  useEventListener('keydown', (event) => {
    event.stopPropagation();
    if (!isEnabled || !isSelectionModifier(event)) {
      return;
    }
    // Key repeat fires keydown repeatedly: only capture the pre-selection state once.
    if (!isSelectionActiveRef.current) {
      wasDraggableRef.current = stageRef.current?.draggable() ?? false;
    }
    stageRef.current?.draggable(false);
    isSelectionActiveRef.current = true;
  });
  useEventListener('keyup', (event) => {
    event.stopPropagation();
    if (!isSelectionActiveRef.current || !isSelectionModifier(event)) {
      return;
    }
    stageRef.current?.draggable(wasDraggableRef.current);
    isSelectionActiveRef.current = false;
  });
}
