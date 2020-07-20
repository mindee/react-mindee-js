// @flow
import React, { useEffect, useState } from "react"
import styled from "styled-components"

import {
  AnnotationViewer,
  formatPrediction,
  fakeResponse,
  AnnotationLens,
  getImagesFromPDF,
  AnnotationSidebar,
  useDocumentLoader,
  AnnotationExplorer,
  Point,
  getShapesWithImages,
} from "../../src"
import { withWrapper } from "../decorators"

import dummyImage from "../assets/dummy-image"
import mindeeLogo from "../assets/mindee-logo.gif"
//$FlowFixMe
import dummyPdf from "../assets/dummy-pdf.pdf"

export default {
  title: "Basic components | AnnotationViewer",
  decorators: [withWrapper],
}

const shapes = formatPrediction(fakeResponse.predictions[0]).filter(
  (element: any) => element.polygon
)

export const AnnotationViewerWithImage = () => (
  <AnnotationViewer image={dummyImage} type="image" />
)

const Loader = styled.img`
  position: absolute;
  height: 5rem;
  top: 40%;
  right: 45%;
`

export const AnnotationViewerWithPDF = () => {
  const [pdfPages, setPdfPages] = useState([])
  const [pdfLoading, setPdfLoading] = useState(true)
  useEffect(() => {
    getImagesFromPDF(dummyPdf).then((_pdfPages: any) => {
      setPdfPages(_pdfPages)
      setPdfLoading(false)
    })
  }, [])
  return pdfLoading ? (
    <Loader src={mindeeLogo} />
  ) : (
    <AnnotationViewer image={pdfPages[0]} />
  )
}

export const AnnotationViewerWithMultiPagePDF = () => {
  const [pdfPages, setPdfPages] = useState([])
  const [currentPdfPageIndex, setCurrentPdfPageIndex] = useState(0)
  const [pdfLoading, setPdfLoading] = useState(true)
  useEffect(() => {
    getImagesFromPDF(dummyPdf).then((_pdfPages: any) => {
      setPdfPages(_pdfPages)
      setPdfLoading(false)
    })
  }, [])
  return pdfLoading ? (
    <Loader src={mindeeLogo} />
  ) : (
    <>
      <AnnotationViewer image={pdfPages[currentPdfPageIndex]} />
      <AnnotationSidebar
        items={pdfPages}
        activeIndex={currentPdfPageIndex}
        onChange={setCurrentPdfPageIndex}
      />
    </>
  )
}

const Image = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  height: 100px;
  width: 100px;
`

export const AnnotationViewerWithShapes = () => {
  const [selectedShape, setSelectedShape] = useState(null)
  return (
    <>
      <AnnotationViewer
        image={dummyImage}
        shapes={shapes}
        onShapeClick={(shape: any) => console.log("click", shape)}
        onShapeHover={setSelectedShape}
        getImagesFromShapes={console.log}
      />

      {selectedShape && <Image src={selectedShape.image} />}
    </>
  )
}

const ShapeImage = styled.img`
  border-radius: 0.325rem;
  padding: 0.325rem;
  cursor: pointer;
  opacity: ${({ active }) => (active ? 0.5 : 1)};
  width: 100%;
  height: 100%;
  background: ${({ color }) => color};
  &:hover {
    opacity: 0.5;
  }
`
const Wrapper = styled.div`
  display: flex;
  height: 100%;
`
const BoxWrapper = styled.div`
  padding: 0.325rem;
  position: relative;
  height: 100px;
  width: 100px;
`

const EventType = styled.div`
  position: absolute;
  color: black;
  font-weight: 600;
  top: 50%;
  right: 10%;
  text-align: center;
  font-size: 18px;
`
export const AnnotationViewerControlledShapes = () => {
  const [event, setEventType] = useState("")
  const [shapesWithImages, setShapesWithImages] = useState([])
  const [selectedShape, setSelectShape] = useState(null)
  useEffect(() => {
    getShapesWithImages(dummyImage, shapes).then((_shapesWithImages) => {
      setShapesWithImages(_shapesWithImages)
    })
  }, [])
  const onMouseEnter = (index) => () => {
    const newShapes = [...shapesWithImages]
    newShapes[index].isActive = true
    setShapesWithImages(newShapes)
  }
  const onMouseLeave = (index) => () => {
    const newShapes = [...shapesWithImages]
    newShapes[index].isActive = false
    setShapesWithImages(newShapes)
  }
  const handleSelectedShape = (eventType) => (_selectedShape) => {
    setEventType(eventType)
    setSelectShape(_selectedShape)
  }
  return (
    <Wrapper>
      <AnnotationViewer
        image={dummyImage}
        shapes={shapesWithImages}
        onShapeHover={handleSelectedShape("Hovered")}
        onShapeClick={handleSelectedShape("Clicked")}
      />
      {shapesWithImages.map((shapeWithImage, key) => {
        const active = selectedShape && selectedShape.id === shapeWithImage.id
        const color = (active && selectedShape && selectedShape.color) || ""
        return (
          <BoxWrapper
            key={key}
            onMouseEnter={onMouseEnter(key)}
            onMouseLeave={onMouseLeave(key)}
          >
            <ShapeImage
              src={shapeWithImage.image}
              active={active}
              color={color}
            />
            {active && <EventType>{event}</EventType>}
          </BoxWrapper>
        )
      })}
    </Wrapper>
  )
}

const documents = [
  {
    type: "image",
    document: dummyImage,
  },
  {
    type: "pdf",
    document: dummyPdf,
  },
]

export const AnnotationViewerWithMixedTypes = () => {
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0)
  const {
    documentLoading,
    images,
    currentImageIndex,
    onImageIndexChange,
  } = useDocumentLoader(documents[currentDocumentIndex])
  useEffect(() => {
    onImageIndexChange(0)
  }, [currentDocumentIndex])
  return (
    <>
      <div style={{ height: 400 }}>
        {documentLoading ? (
          <Loader src={mindeeLogo} />
        ) : (
          <>
            <AnnotationViewer
              image={images[currentImageIndex]}
              shapes={shapes}
            />
            {images.length > 1 && (
              <AnnotationSidebar
                items={images}
                activeIndex={currentImageIndex}
                onChange={onImageIndexChange}
              />
            )}
          </>
        )}
      </div>
      <AnnotationExplorer
        items={documents}
        onChange={setCurrentDocumentIndex}
        activeIndex={currentDocumentIndex}
      />
    </>
  )
}

export const AnnotationViewerWithLens = () => {
  const [lensProps, setLensProps] = useState({
    cursorPosition: new Point(),
    selectedShape: null,
  })
  const {
    documentLoading,
    images,
    currentImageIndex,
    onImageIndexChange,
  } = useDocumentLoader({
    type: "pdf",
    document: dummyPdf,
  })
  return (
    <>
      {documentLoading ? (
        <Loader src={mindeeLogo} />
      ) : (
        <>
          <AnnotationViewer
            image={images[currentImageIndex]}
            shapes={shapes}
            getLensProps={setLensProps}
          />
          {images.length > 1 && (
            <AnnotationSidebar
              items={images}
              activeIndex={currentImageIndex}
              onChange={onImageIndexChange}
            />
          )}
        </>
      )}
      <div
        style={{
          height: 300,
          width: 300,
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        {images[currentImageIndex] && (
          <AnnotationLens
            image={images[currentImageIndex]}
            shapes={shapes}
            {...lensProps}
          />
        )}
      </div>
    </>
  )
}
