import type Konva from 'konva';

import type { AnnotationViewerOptions } from '@/common/types';

import {
  calculateLensZoom,
  calculateStageZoom,
  calculateZoomScale,
} from '@/utils/zoom';

describe('zoom', () => {
  describe('calculateLensZoom', () => {
    it('should return the correct position', () => {
      const pointerPosition = { x: 0.5, y: 0.5 };
      const imageBoundingBox = {
        x: 0,
        y: 75,
        width: 600,
        height: 450,
        scale: 0.586,
      };
      const stage = { width: () => 600, height: () => 600 };
      const zoomLevel = 1.5;

      const expected = { x: -467.92, y: -275.94 };

      const actual = calculateLensZoom(
        pointerPosition,
        imageBoundingBox,
        stage as Konva.Stage,
        zoomLevel,
      );

      expect(actual).to.deep.equal(expected);
    });
  });

  describe('calculateStageZoom', () => {
    it('should return the correct scale and position', () => {
      const stage = {
        scaleX: () => 1.12464,
        position: () => ({ x: -82, y: -176 }),
        getPointerPosition: () => ({ x: 350, y: 400 }),
      };
      const deltaY = -60;
      const options = { zoom: { modifier: 1.2 } };

      const expectedPos = { x: -168.4, y: -291.2 };

      const actual = calculateStageZoom(
        stage as Konva.Stage,
        deltaY,
        options as AnnotationViewerOptions,
      );

      // Scale is kept at full precision; only positions are rounded.
      expect(actual?.newScale).to.be.closeTo(1.12464 * 1.2, 1e-9);
      expect(actual?.newPos).to.deep.equal(expectedPos);
    });
  });

  describe('calculateZoomScale', () => {
    it('should return the correct scale and position', () => {
      const stage = {
        scaleX: () => 1.12464,
        position: () => ({ x: -82, y: -176 }),
        getPointerPosition: () => ({ x: 350, y: 400 }),
      };
      const imageBoundingBox = {
        x: 0,
        y: 75,
        width: 600,
        height: 450,
        scale: 0.586,
      };
      const deltaY = -60;

      const expectedPos = { x: 12242.59, y: 15181.35 };

      const actual = calculateZoomScale(
        stage as Konva.Stage,
        deltaY,
        imageBoundingBox,
      );

      expect(actual.newScale).to.be.closeTo(-60 * 0.586, 1e-9);
      expect(actual.newPos).to.deep.equal(expectedPos);
    });
  });
});
