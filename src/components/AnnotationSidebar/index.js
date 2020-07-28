// @flow
import React from "react"
import styled from "styled-components"

import { BLACK_LIGHTER, RED } from "helpers/settings"

import { classnames } from "helpers/sharedUtils"

const Image = styled.img`
  height: 3rem;
  border: 1px solid ${BLACK_LIGHTER};
  border-color: ${({ active }) => (active ? RED : BLACK_LIGHTER)};
  cursor: pointer;
  border-radius: 0.125rem;
`

const Wrapper = styled.div`
  overflow-x: auto;
  height: 200px;
  padding: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 2;
`

interface Props {
  onChange?: (number) => void;
  activeIndex?: number;
  items: string[];
  className?: string;
}

const AnnotationSidebar = ({
  activeIndex,
  items,
  className,
  onChange,
}: Props) => {
  const onClick = (index: number) => (event: Event) => {
    event.stopPropagation()
    onChange && onChange(index)
  }
  return (
    <Wrapper className={classnames("annotation-sidebar", className)}>
      {items.map((item: string, key: number) => (
        <Image
          alt={`annotation-sidebar-item ${key}`}
          className={`annotation-sidebar-item ${key}`}
          key={key}
          src={item}
          active={activeIndex === key}
          onClick={onClick(key)}
        />
      ))}
    </Wrapper>
  )
}

export default AnnotationSidebar
