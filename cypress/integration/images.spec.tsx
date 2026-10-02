import dummyImageHEIC from 'cypress/assets/demo.heic';
import dummyImage from 'cypress/assets/demo.jpg';
import dummyImageTIFF from 'cypress/assets/demo.tiff';
import multiPage from 'cypress/assets/multi-page.pdf';

import { CONTAINER_STYLE, loadDist, loadedResources } from './helpers';

const containerId = 'annotationViewer';

/**
 * Asserts that the viewer ended up with a drawn image by checking that the
 * canvas pixels are not fully transparent.
 */
const expectPaintedCanvas = (): void => {
  cy.get(`#${containerId} canvas`)
    .first()
    .should(($canvas) => {
      const canvas = $canvas[0] as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (context === null) {
        throw new Error('Canvas has no 2d context');
      }
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      let opaquePixels = 0;
      for (let index = 3; index < data.length; index += 4) {
        if (data[index] !== 0) {
          opaquePixels += 1;
        }
      }
      expect(opaquePixels).to.be.greaterThan(0);
    });
};

/**
 * Format conversion runs through utif (TIFF) and a lazily loaded heic2any
 * chunk (HEIC). These paths rely on the production chunking, so they are
 * verified against the built viewer.
 */
describe('built library image formats', () => {
  it('displays a JPEG image', () => {
    loadDist().then((lib) => {
      cy.mount(
        <lib.AnnotationViewer
          id={containerId}
          data={{ image: dummyImage }}
          style={CONTAINER_STYLE}
        />,
      );
      expectPaintedCanvas();
    });
  });

  it('displays a PNG data URL produced from a PDF page', () => {
    loadDist().then((lib) => {
      cy.wrap<Promise<string[]>, string[]>(
        lib.getImagesFromPDF(multiPage),
      ).then((images) => {
        cy.mount(
          <lib.AnnotationViewer
            id={containerId}
            data={{ image: images[0] ?? null }}
            style={CONTAINER_STYLE}
          />,
        );
        expectPaintedCanvas();
      });
    });
  });

  it('converts and displays a TIFF image', () => {
    loadDist().then((lib) => {
      cy.mount(
        <lib.AnnotationViewer
          id={containerId}
          data={{ image: dummyImageTIFF }}
          style={CONTAINER_STYLE}
        />,
      );
      expectPaintedCanvas();
    });
  });

  it('converts and displays a HEIC image, downloading the heic2any chunk only then', () => {
    loadDist().then((lib) => {
      cy.mount(
        <lib.AnnotationViewer
          id={containerId}
          data={{ image: dummyImage }}
          style={CONTAINER_STYLE}
        />,
      );
      expectPaintedCanvas();
      cy.window().then((win) => {
        expect(loadedResources(win, 'heic2any')).to.have.length(0);
      });

      cy.mount(
        <lib.AnnotationViewer
          id={containerId}
          data={{ image: dummyImageHEIC }}
          style={CONTAINER_STYLE}
        />,
      );
      expectPaintedCanvas();
      cy.window().should((win) => {
        expect(loadedResources(win, 'heic2any')).to.have.length(1);
      });
    });
  });

  it('renders an empty stage without errors when no image is provided', () => {
    loadDist().then((lib) => {
      cy.mount(
        <lib.AnnotationViewer
          id={containerId}
          data={{ image: null }}
          style={CONTAINER_STYLE}
        />,
      );
      cy.get(`#${containerId}`).should('be.visible');
      cy.get(`#${containerId} canvas`).should('have.length.at.least', 1);
    });
  });
});
