// @flow
import React, { type Element } from "react"
import { useDropzone } from "react-dropzone"
import styled from "styled-components"

import uploaderIcon from "assets/uploader.svg"
import { classnames } from "helpers/sharedUtils"

const Icon = styled.img`
  height: 2rem;
  width: 2rem;
`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

type FileData = {
  type: "image" | "pdf",
  file: File,
  document: String,
}
interface Props {
  className?: string;
  onUpload: (fileData: FileData) => void;
  children?: Element<any>;
  clickActive?: boolean;
}

const Uploader = ({
  clickActive = true,
  className,
  children = <Icon src={uploaderIcon} />,
  onUpload,
  ...options
}: Props) => {
  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.reduce((accumulator, file) => {
      const type = file.type.includes("pdf") ? "pdf" : "image"
      accumulator.push({
        file,
        type,
        document: URL.createObjectURL(file),
      })
      return accumulator
    }, [])
    onUpload(newFiles)
  }
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    ...options,
  })
  return (
    <Wrapper
      {...getRootProps()}
      className={classnames("uploader", className)}
      onMouseUp={() => clickActive && open()}
    >
      <input {...getInputProps()} />
      {children}
    </Wrapper>
  )
}

export default Uploader
