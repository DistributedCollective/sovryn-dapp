import React from 'react';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { CustomLeftArrow } from './components/CustomLeftArrow/CustomLeftArrow';
import { CustomRightArrow } from './components/CustomRightArrow/CustomRightArrow';

const responsive = {
  large: {
    breakpoint: { max: 4800, min: 1536 },
    items: 4,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1536, min: 1199 },
    items: 4,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1199, min: 992 },
    items: 3,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 992, min: 0 },
    items: 2,
    slidesToSlide: 1,
  },
};

type BannersCarouselProps = {
  children?: React.ReactNode;
  className?: string;
};

export const BannersCarousel: React.FC<BannersCarouselProps> = ({
  children,
  className,
}) => {
  return (
    <div className={className}>
      <Carousel
        arrows
        responsive={responsive}
        draggable
        focusOnSelect={false}
        minimumTouchDrag={80}
        renderDotsOutside
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        showDots
        swipeable
        className="xl:tw-block px-4"
      >
        {children}
      </Carousel>
    </div>
  );
};
