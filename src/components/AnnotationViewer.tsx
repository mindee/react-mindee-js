import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import Konva from 'konva';

import {
  DEFAULT_ANNOTATION_VIEWER_OPTIONS,
  DEFAULT_DATA,
  DEFAULT_STYLE,
  KonvaRefs,
} from '@/common/constants';
import type {
  AnnotationShape,
  AnnotationViewerOptions,
  AnnotationViewerProps,
  ImageBoundingBox,
  ImageData,
} from '@/common/types';

import { getMousePosition, mapShapesToPolygons } from '@/utils/canvas';
import {
  handleResizeImage,
  prepareImage,
  setStageBasedImagePosition,
} from '@/utils/image';
import { clearLayers } from '@/utils/layer';
import { rotateImage } from '@/utils/orientation';
import {
  createSelectionRect,
  onSelectionEnd,
  onSelectionMove,
  onSelectionStart,
} from '@/utils/selection';
import useMultiSelection from '@/utils/useMultiSelection';
import { getZoomScale, handleStageZoom, handleZoomScale } from '@/utils/zoom';

type ShapeCallbacks = Pick<
  AnnotationViewerProps,
  | 'getPointerPosition'
  | 'getStage'
  | 'onShapeClick'
  | 'onShapeMouseEnter'
  | 'onShapeMouseLeave'
  | 'onShapeMultiSelect'
>;

const drawViewerShapes = (
  shapesLayer: Konva.Layer,
  shapes: AnnotationShape[] | undefined,
  imageBoundingBox: ImageBoundingBox | null,
  options: AnnotationViewerOptions,
  selectionRect: Konva.Rect,
  callbacks: ShapeCallbacks,
): void => {
  shapesLayer.destroyChildren();
  if (options.enableSelection === true) {
    selectionRect.setAttrs({ ...options.selectionRectConfig });
    shapesLayer.add(selectionRect);
  }
  if (!shapes) {
    return;
  }
  mapShapesToPolygons(
    shapesLayer,
    shapes,
    true,
    imageBoundingBox,
    options,
    callbacks.onShapeClick,
    callbacks.onShapeMouseEnter,
    callbacks.onShapeMouseLeave,
  );
  shapesLayer.batchDraw();
};

export default function AnnotationViewer({
  id,
  getPointerPosition,
  onShapeMouseEnter,
  onShapeMultiSelect,
  onShapeMouseLeave,
  customZoomLevel,
  customStagePosition,
  getStage,
  style = {},
  onShapeClick,
  options: customOptions = {},
  data = DEFAULT_DATA,
}: AnnotationViewerProps): ReactElement {
  const generatedId = useId();
  const containerId = id ?? generatedId;
  const options: AnnotationViewerOptions = {
    ...DEFAULT_ANNOTATION_VIEWER_OPTIONS,
    ...customOptions,
  };
  const optionsKey = JSON.stringify(options);
  const isSelectionActiveRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectionRectObject = useRef(createSelectionRect(options));
  const imageDataObject = useRef<ImageData>({
    element: new Image(),
    shape: new Konva.Image({ image: new Image() }),
  });
  const layersObject = useRef({
    shapes: new Konva.Layer({ id: KonvaRefs.ShapesLayer }),
    image: new Konva.Layer({ listening: false }),
  });
  const stageObject = useRef<Konva.Stage | null>(null);
  const imageBoundingBoxObject = useRef<ImageBoundingBox | null>(null);
  const [imageVersion, setImageVersion] = useState(0);

  const optionsRef = useRef(options);
  const callbacksRef = useRef<ShapeCallbacks>({});
  useEffect(() => {
    optionsRef.current = options;
    callbacksRef.current = {
      getPointerPosition,
      getStage,
      onShapeClick,
      onShapeMouseEnter,
      onShapeMouseLeave,
      onShapeMultiSelect,
    };
  });

  useMultiSelection({ stageRef: stageObject, isSelectionActiveRef });

  const fitImageToContainer = (): void => {
    const imageBoundingBox = handleResizeImage(
      stageObject.current,
      containerRef.current,
      imageDataObject.current,
    );
    if (!imageBoundingBox) {
      return;
    }
    imageBoundingBoxObject.current = imageBoundingBox;
    layersObject.current.image.batchDraw();
    setImageVersion((v) => v + 1);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const stage = new Konva.Stage({ container });
    const layers = layersObject.current;
    stageObject.current = stage;
    stage.add(layers.image, layers.shapes);
    layers.image.add(imageDataObject.current.shape);
    callbacksRef.current.getStage?.(stage);

    stage.on('wheel', (event) => {
      handleStageZoom(
        stage,
        imageBoundingBoxObject.current,
        event,
        optionsRef.current,
      );
    });
    stage.on('mousemove', () => {
      const { getPointerPosition: getPointerPosCallback } =
        callbacksRef.current;
      if (!getPointerPosCallback) {
        return;
      }
      const mousePointTo = getMousePosition(
        stage,
        imageBoundingBoxObject.current,
      );
      if (mousePointTo) {
        getPointerPosCallback(mousePointTo);
      }
    });
    stage.on('mousedown touchstart', (event) => {
      if (optionsRef.current.enableSelection !== true) {
        return;
      }
      onSelectionStart(
        event,
        layers.shapes,
        selectionRectObject.current,
        isSelectionActiveRef.current,
      );
    });
    stage.on('mousemove touchmove', () => {
      if (optionsRef.current.enableSelection !== true) {
        return;
      }
      onSelectionMove(layers.shapes, selectionRectObject.current);
    });
    stage.on('mouseup touchend', () => {
      if (optionsRef.current.enableSelection !== true) {
        return;
      }
      onSelectionEnd(
        layers.shapes,
        selectionRectObject.current,
        callbacksRef.current.onShapeMultiSelect,
      );
    });
    stage.on('dragstart', () => {
      if (optionsRef.current.enableSelection !== true) {
        return;
      }
      stage.container().style.cursor = 'grabbing';
    });
    stage.on('dragend', () => {
      if (optionsRef.current.enableSelection !== true) {
        return;
      }
      stage.container().style.cursor = 'pointer';
    });

    return () => {
      stage.destroy();
      stageObject.current = null;
    };
  }, []);

  useEffect(() => {
    window.addEventListener('resize', fitImageToContainer);
    return () => {
      window.removeEventListener('resize', fitImageToContainer);
    };
  }, []);

  const { image, orientation, shapes } = data;

  useEffect(() => {
    if (image === undefined || image === null || image === '') {
      clearLayers(layersObject.current);
      imageDataObject.current.element = new Image();
      imageDataObject.current.shape.image(imageDataObject.current.element);
      imageBoundingBoxObject.current = null;
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    void (async () => {
      try {
        const prepared = await prepareImage(image);
        signal.throwIfAborted();
        const src = await rotateImage(prepared, orientation);
        signal.throwIfAborted();
        const element = new Image();
        element.onload = () => {
          if (signal.aborted) {
            return;
          }
          imageDataObject.current.element = element;
          imageDataObject.current.shape.image(element);
          fitImageToContainer();
        };
        element.src = src;
      } catch (error) {
        if (!signal.aborted) {
          console.error(error);
        }
      }
    })();
    return (): void => {
      controller.abort();
    };
  }, [image, orientation]);

  useEffect(() => {
    drawViewerShapes(
      layersObject.current.shapes,
      shapes,
      imageBoundingBoxObject.current,
      {
        ...optionsRef.current,
        onClick: (polygon) => optionsRef.current.onClick?.(polygon),
        onMouseEnter: (polygon) => {
          optionsRef.current.onMouseEnter?.(polygon);
        },
        onMouseLeave: (polygon) => {
          optionsRef.current.onMouseLeave?.(polygon);
        },
      },
      selectionRectObject.current,
      {
        onShapeClick: (shape) => callbacksRef.current.onShapeClick?.(shape),
        onShapeMouseEnter: (shape) =>
          callbacksRef.current.onShapeMouseEnter?.(shape),
        onShapeMouseLeave: (shape) =>
          callbacksRef.current.onShapeMouseLeave?.(shape),
      },
    );
  }, [shapes, optionsKey, imageVersion]);

  useEffect(() => {
    if (customZoomLevel === undefined) {
      return;
    }
    handleZoomScale(
      stageObject.current,
      customZoomLevel,
      imageBoundingBoxObject.current,
    );
  }, [customZoomLevel, imageVersion]);

  useEffect(() => {
    const stage = stageObject.current;
    const imageBoundingBox = imageBoundingBoxObject.current;
    if (!customStagePosition || !stage || !imageBoundingBox) {
      return;
    }
    const zoomScale = getZoomScale(stage);
    setStageBasedImagePosition({
      imageBoundingBox,
      stage,
      newPosition: {
        x: stage.x() + customStagePosition.x * zoomScale,
        y: stage.y() + customStagePosition.y * zoomScale,
      },
    });
  }, [customStagePosition]);

  return (
    <div
      style={{ ...DEFAULT_STYLE, ...style }}
      id={containerId}
      ref={containerRef}
    ></div>
  );
}
