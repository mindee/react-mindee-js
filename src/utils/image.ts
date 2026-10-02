import type Konva from 'konva';
import type { Stage } from 'konva/lib/Stage';
import UTIF from 'utif';

import type {
  ImageBoundingBox,
  ImageData,
  PointerPosition,
} from '@/common/types';

import { getZoomScale, setZoomScale } from '@/utils/zoom';

export const dataURItoBlob = (dataURI: string): Blob => {
  let byteString;
  const [meta, data] = dataURI.split(',');
  if (meta === undefined || data === undefined) {
    throw new Error('Invalid Data URI format');
  }
  if (meta.includes('base64')) {
    byteString = atob(data);
  } else {
    byteString = decodeURI(data);
  }

  const mimeString = meta.split(':')[1]?.split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

export const prepareImage = async (image: string): Promise<string> => {
  const blob = await urlToBlob(image);
  if (blob.type === 'image/heic') {
    return await heicToJpg(blob);
  }
  if (blob.type === 'image/tiff') {
    return await tiffToJpg(blob);
  }
  return image;
};

export const urlToBlob = async (url: string): Promise<Blob> =>
  await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
  }).then(async (r) => await r.blob());

export const tiffToJpg = async (blob: Blob): Promise<string> => {
  const arrayBuffer = await blob.arrayBuffer();
  const ifds = UTIF.decode(arrayBuffer);
  const firstPageOfTif = ifds[0];
  if (firstPageOfTif === undefined) {
    throw new Error('Invalid TIFF format');
  }
  UTIF.decodeImage(arrayBuffer, firstPageOfTif);
  const rgba = UTIF.toRGBA8(firstPageOfTif);

  const imageWidth = firstPageOfTif.width;
  const imageHeight = firstPageOfTif.height;

  const cnv = document.createElement('canvas');
  cnv.width = imageWidth;
  cnv.height = imageHeight;

  const ctx = cnv.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context');
  }
  const imageData = ctx.createImageData(imageWidth, imageHeight);
  imageData.data.set(rgba);
  ctx.putImageData(imageData, 0, 0);
  return cnv.toDataURL('image/jpeg');
};

export const heicToJpg = async (blob: Blob): Promise<string> => {
  const { default: heic2any } = await import('heic2any');
  const result = await heic2any({ blob, toType: 'image/jpeg' });
  const firstImage = Array.isArray(result) ? result[0] : result;
  if (firstImage === undefined) {
    throw new Error('HEIC file contains no image');
  }
  return await blobToDataURL(firstImage);
};

const blobToDataURL = async (blob: Blob): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read Blob as a data URL'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Could not read Blob as a data URL'));
    };
    reader.readAsDataURL(blob);
  });

export const computeImageBoundingBox = (
  { clientWidth, clientHeight }: HTMLDivElement,
  imageObj: HTMLImageElement,
): ImageBoundingBox => {
  const imageAspectRatio = imageObj.width / imageObj.height;
  const canvasAspectRatio = clientWidth / clientHeight;
  let renderableHeight, renderableWidth, xStart, yStart;

  xStart = 0;
  yStart = 0;
  renderableHeight = clientHeight;
  renderableWidth = clientWidth;

  if (imageAspectRatio < canvasAspectRatio) {
    renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
    xStart = Math.round((clientWidth - renderableWidth) / 2);
  } else if (imageAspectRatio > canvasAspectRatio) {
    renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
    yStart = Math.round((clientHeight - renderableHeight) / 2);
  }

  return {
    scale: Number(
      ((renderableWidth / imageObj.width) satisfies number).toFixed(3),
    ),
    x: xStart,
    y: yStart,
    width: Math.round(renderableWidth),
    height: Math.round(renderableHeight),
  };
};

const resizeStage = (stage: Konva.Stage, container: HTMLDivElement): void => {
  stage.width(container.clientWidth);
  stage.height(container.clientHeight);
};

export const handleResizeImage = (
  stage: Konva.Stage | null,
  container: HTMLDivElement | null,
  { element, shape }: ImageData,
): ImageBoundingBox | undefined => {
  if (!container || !stage) {
    return;
  }
  resizeStage(stage, container);
  const imageBoundingBox = computeImageBoundingBox(container, element);
  const { x, y, width, height, scale } = imageBoundingBox;
  stage.scale({
    x: scale,
    y: scale,
  });
  setZoomScale(stage, 1);
  stage.position({ x, y });
  shape.width(width / scale);
  shape.height(height / scale);
  return imageBoundingBox;
};

export const setStageBasedImagePosition = ({
  imageBoundingBox,
  stage,
  newPosition,
}: {
  imageBoundingBox: ImageBoundingBox;
  stage: Stage;
  newPosition: PointerPosition;
}): void => {
  const { x, y, width, height } = imageBoundingBox;
  const zoomScale = getZoomScale(stage);
  let stageX = stage.x();
  let stageY = stage.y();
  const { x: newStageX, y: newStageY } = newPosition;

  if (
    (newStageX < x * zoomScale || newStageX < stageX) &&
    (newStageX > stage.width() - (width + x) * zoomScale || newStageX > stageX)
  ) {
    stageX = newStageX;
  }
  if (
    (newStageY < y * zoomScale || newStageY < stageY) &&
    (newStageY > stage.height() - (height + y) * zoomScale ||
      newStageY > stageY)
  ) {
    stageY = newStageY;
  }
  stage.position({
    x: stageX,
    y: stageY,
  });
  stage.batchDraw();
};
