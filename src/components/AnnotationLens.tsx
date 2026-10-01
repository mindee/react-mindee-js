import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import Konva from 'konva';

import {
  DEFAULT_ANNOTATION_LENS_OPTIONS,
  DEFAULT_DATA,
  DEFAULT_LENS_ZOOM_LEVEL,
  DEFAULT_POINTER_POSITION,
  DEFAULT_STYLE,
  KonvaRefs,
} from '@/common/constants';
import type {
  AnnotationLensOptions,
  AnnotationLensProps,
  AnnotationShape,
  ImageBoundingBox,
  ImageData,
} from '@/common/types';

import { mapShapesToPolygons } from '@/utils/canvas';
import { handleResizeImage } from '@/utils/image';
import { clearLayers } from '@/utils/layer';
import { rotateImage } from '@/utils/orientation';
import { handleLensZoom } from '@/utils/zoom';

const drawLensShapes = (
  shapesLayer: Konva.Layer,
  shapes: AnnotationShape[] | undefined,
  imageBoundingBox: ImageBoundingBox | null,
  options: AnnotationLensOptions,
): void => {
  shapesLayer.destroyChildren();
  if (!shapes) return;
  mapShapesToPolygons(shapesLayer, shapes, false, imageBoundingBox, options);
  shapesLayer.batchDraw();
};

export default function AnnotationLens({
  id,
  zoomLevel = DEFAULT_LENS_ZOOM_LEVEL,
  pointerPosition = DEFAULT_POINTER_POSITION,
  getStage,
  style = {},
  options: customOptions = {},
  data = DEFAULT_DATA,
}: AnnotationLensProps): ReactElement {
  const generatedId = useId();
  const containerId = id ?? generatedId;
  const options: AnnotationLensOptions = {
    ...DEFAULT_ANNOTATION_LENS_OPTIONS,
    ...customOptions,
  };
  const optionsKey = JSON.stringify(options);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });
  const imageDataObject = useRef<ImageData>({
    element: new Image(),
    shape: new Konva.Image({ image: new Image() }),
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layersObject = useRef({
    shapes: new Konva.Layer({ id: KonvaRefs.ShapesLayer, listening: false }),
    image: new Konva.Layer({ listening: false }),
  });
  const stageObject = useRef<Konva.Stage | null>(null);
  const imageBoundingBoxObject = useRef<ImageBoundingBox | null>(null);
  const [imageVersion, setImageVersion] = useState(0);

  const getStageRef = useRef(getStage);
  useEffect(() => {
    getStageRef.current = getStage;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const stage = new Konva.Stage({ container, listening: false });
    stageObject.current = stage;
    stage.add(layersObject.current.image, layersObject.current.shapes);
    layersObject.current.image.add(imageDataObject.current.shape);
    getStageRef.current?.(stage);
    return () => {
      stage.destroy();
      stageObject.current = null;
    };
  }, []);

  const { image, orientation, shapes } = data;

  useEffect(() => {
    if (image === undefined || image === null) {
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
        const src = await rotateImage(image, orientation);
        if (signal.aborted) return;
        const element = new Image();
        element.onload = () => {
          if (signal.aborted) return;
          imageDataObject.current.element = element;
          imageDataObject.current.shape.image(element);
          imageBoundingBoxObject.current =
            handleResizeImage(
              stageObject.current,
              containerRef.current,
              imageDataObject.current,
            ) ?? null;
          setImageVersion((v) => v + 1);
        };
        element.src = src;
      } catch (error) {
        if (!signal.aborted) console.error(error);
      }
    })();
    return () => {
      controller.abort();
    };
  }, [image, orientation]);

  useEffect(() => {
    handleLensZoom(
      stageObject.current,
      imageBoundingBoxObject.current,
      pointerPosition,
      zoomLevel,
    );
  }, [pointerPosition, zoomLevel, imageVersion]);

  useEffect(() => {
    drawLensShapes(
      layersObject.current.shapes,
      shapes,
      imageBoundingBoxObject.current,
      optionsRef.current,
    );
  }, [shapes, optionsKey, imageVersion]);

  return (
    <div
      style={{ ...DEFAULT_STYLE, ...style }}
      id={containerId}
      ref={containerRef}
    ></div>
  );
}
