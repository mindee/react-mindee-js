// @flow
import React, { useState, type Element } from "react"
import FullscreenComponent from "react-full-screen"
import styled from "styled-components"

import fullscreen from "assets/fullscreen.svg"
import { classnames } from "helpers/sharedUtils"

const Icon = styled.img`
  cursor: pointer,
  height: 2rem;
  width: 2rem;
`

const Wrapper = styled.div`
  .fullscreen {
    display: flex;
    justify-content: center;
    height: 100%;
  }
`

interface Props {
  className?: string;
  customButton?: (open: () => void) => Element<any>;
  children: Element<any>;
}

const defaultButton = (onClick: () => void) => (
  <Icon onClick={onClick} src={fullscreen} />
)
const Fullscreen = ({
  className,
  children,
  customButton = defaultButton,
}: Props) => {
  const [enabled, setEnabled] = useState<boolean>(false)
  const onChange = (isFull: boolean) => setEnabled(isFull)
  const onClick = () => onChange(true)
  return (
    <Wrapper className={classnames("fullscreen-wrapper", className)}>
      {customButton(onClick)}
      <FullscreenComponent enabled={enabled} onChange={onChange}>
        {children}
      </FullscreenComponent>
    </Wrapper>
  )
}

export default Fullscreen
