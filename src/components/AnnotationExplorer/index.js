// @flow
import React from "react"
import Slider from "react-slick"
import styled from "styled-components"
import slickStyle from "slick-carousel/slick/slick.css"
import classnames from "classnames"

import pdfLogo from "assets/pdf.svg"

import { BLACK_LIGHTER, RED_LIGHTER } from "../../helpers/settings"

const StyleWrapper = styled.div`
  width: ${({ width }) => width}rem;
  display: flex;
  .slick-slider {
    width: 100%;
  }
`

const ItemWrapper = styled.div`
  position: relative;
  margin: 0.5rem;
  cursor: pointer;
  border-radius: 0.325rem;
  border: 2px solid ${BLACK_LIGHTER};
  border-color: ${({ active }) =>
    active ? `${RED_LIGHTER}` : `${BLACK_LIGHTER}`};
  width: 70px !important;
  height: 70px;
  img {
    width: 70px;
    height: 100%;
  }
`
type Item = {
  type: "pdf" | "image",
  document: File | String,
}

interface Props {
  sliderSettings?: any;
  customPdfLogo?: string;
  maxItemsToShow?: number;
  className?: string;
  items: Item[];
  activeIndex: number;
  onChange: (number) => void;
}

const defaultSliderSettings = {
  centerMode: true,
  centerPadding: "10px",
  arrows: false,
  speed: 500,
  slidesToScroll: 2,
  focusOnSelect: true,
}

const AnnotationExplorer = ({
  sliderSettings = {},
  customPdfLogo = pdfLogo,
  className,
  activeIndex,
  onChange,
  items,
  maxItemsToShow = 4,
}: Props) => {
  const itemsToShow = Math.min(items.length, maxItemsToShow)
  return (
    <StyleWrapper
      width={6 * itemsToShow}
      className={classnames("annotation-explorer", { className })}
    >
      <Slider
        {...defaultSliderSettings}
        {...sliderSettings}
        slidesToShow={itemsToShow}
        className={slickStyle}
      >
        {items.map(({ document, type }: Item, key: number) => {
          const active = activeIndex === key
          return (
            <ItemWrapper
              className={classnames(className, { active })}
              active={active}
              onClick={() => onChange(key)}
              key={key}
            >
              <img src={type === "image" ? document : customPdfLogo} />
            </ItemWrapper>
          )
        })}
      </Slider>
    </StyleWrapper>
  )
}

export default AnnotationExplorer
