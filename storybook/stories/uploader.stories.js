// @flow
import React, { useState } from "react"
import styled from "styled-components"

import defaultBackground from "../assets/default-placeholder.png"
import downloadImg from "../assets/download-placeholder.png"

import { Uploader } from "../../src"

export default {
  title: "Basic components | Uploader",
}

const Image = styled.img`
  height: 300px;
  width: 300px;
`

const CustomChildImage = styled.img`
  height: 100%;
  width: 100%;
`

const PlaceholderContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`

const DownloadImg = styled.img`
  height: 3rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const PlaceholderImg = styled.img`
  height: 500px;
  width: 400px;
`

const PlaceholderOverlay = styled.div`
  border: 2px dashed #f1f1f1;
  top: 0;
  left: 0;
  height: 500px;
  width: 400px;
  position: absolute;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: rgba(0, 125, 255, 0.2);
    border: 2px dashed #0081ff;
  }

  &:hover ${DownloadImg} {
    -webkit-filter: grayscale(0%); /* Safari 6.0 - 9.0 */
    filter: grayscale(0%);
  }
`

const Placeholder = () => (
  <PlaceholderContainer>
    <PlaceholderImg src={defaultBackground} />
    <PlaceholderOverlay>
      <DownloadImg src={downloadImg} alt="" />
    </PlaceholderOverlay>
  </PlaceholderContainer>
)

export const UploaderMultiImage = () => {
  const [files, setFiles] = useState([])
  return (
    <>
      <Uploader onUpload={(files) => setFiles(files)} />
      {files.map((file: any, key: number) => (
        <Image key={key} src={file.document} />
      ))}
    </>
  )
}

const Wrapper = styled.div`
  height: 500px;
  width: 400px;
`

export const UploaderWithCustomChild = () => {
  const [file, setFile] = useState(null)
  return (
    <Wrapper>
      <Uploader
        clickActive={true}
        onUpload={(uploadedFiles) => setFile(uploadedFiles[0].document)}
      >
        {file ? <CustomChildImage src={file} /> : <Placeholder />}
      </Uploader>
    </Wrapper>
  )
}
