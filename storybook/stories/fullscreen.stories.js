// @flow
import React from "react"
import styled from "styled-components"

import { Fullscreen } from "../../src"

import image from "../assets/dummy-image"
import { withWrapper } from "../decorators"

export default {
  title: "Basic components | FullscreenWrapper",
  decorators: [withWrapper],
}

const Image = styled.img`
  height: 100%;
`

export const FullscreenWrapperBasic = () => (
  <Fullscreen>
    <Image src={image} />
  </Fullscreen>
)
