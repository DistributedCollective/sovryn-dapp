import React from 'react';

import classNames from 'classnames';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import styles from './BannersCarousel.module.css';
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
  smallTablet: {
    breakpoint: { max: 992, min: 768 },
    items: 2,
    slidesToSlide: 1,
  },
  bigMobile: {
    breakpoint: { max: 768, min: 576 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 576, min: 0 },
    items: 1,
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
}) => (
  <div className={classNames(className, 'relative sm:px-6')}>
    <Carousel
      arrows
      responsive={responsive}
      draggable
      partialVisible
      focusOnSelect={false}
      minimumTouchDrag={80}
      customLeftArrow={<CustomLeftArrow />}
      customRightArrow={<CustomRightArrow />}
      swipeable
      className="static"
      renderButtonGroupOutside
      itemClass={styles.item}
    >
      {children}
    </Carousel>
  </div>
);
