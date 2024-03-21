import React, { FC } from 'react';

import ReactSlider from 'react-slider';

import styles from './Slider.module.css';

type SliderProps = {
  max?: number;
  min?: number;
  step?: number;
  onAfterChange?: (value: number, thumbIndex: number) => void;
  onChange?: (value: number, thumbIndex: number) => void;
  value?: number;
};

export const Slider: FC<SliderProps> = props => (
  <ReactSlider
    thumbClassName={styles.thumb}
    trackClassName={styles.track}
    {...props}
  />
);
