import React, { CSSProperties, useEffect, useState } from 'react'

import dummyPDF from '@site/static/img/tutorial/demo.pdf'
import { AnnotationViewer, getImagesFromPDF } from 'react-mindee-js'

const thumbnailStyle: CSSProperties = {
  height: 50,
  width: 50,
  objectFit: 'cover',
  marginBottom: 5,
  cursor: 'pointer',
}

export default function BasicExampleWithPDF() {
  const [images, setImages] = useState<string[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    getImagesFromPDF(dummyPDF).then((images: string[]) => {
      setImages(images)
    })
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {images.map((image, key) => (
          <img
            src={image}
            alt="thumbnail"
            key={key}
            style={thumbnailStyle}
            onClick={() => setSelectedImageIndex(key)}
          />
        ))}
      </div>
      <AnnotationViewer
        style={{ width: 400, height: 400 }}
        data={{ image: images[selectedImageIndex] }}
      />
    </div>
  )
}
