// @flow
import { useState, useEffect } from "react"
import { getImagesFromPDF } from "helpers/pdfUtils"

interface Props {
  type: "pdf" | "image";
  document: File | String;
}

const useDocumentLoader = ({ type, document }: Props) => {
  const [images, setImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [documentLoading, setDocumentLoading] = useState<boolean>(true)
  useEffect(() => {
    setDocumentLoading(true)
    if (type === "pdf") {
      getImagesFromPDF(document).then((_images: any) => {
        setImages(_images)
        setDocumentLoading(false)
      })
    } else {
      setImages([document])
      setDocumentLoading(false)
    }
  }, [type, document])

  return {
    documentLoading,
    currentImageIndex,
    onImageIndexChange: setCurrentImageIndex,
    images,
  }
}

export default useDocumentLoader
