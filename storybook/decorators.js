// @flow
import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  position: relative;
  display: flex;
  height: 600px;
  display: flex;
  flex-direction: column;
`
export const withWrapper = (storyFn: any) => <Wrapper>{storyFn()}</Wrapper>
