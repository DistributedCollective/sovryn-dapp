import React, { FC } from 'react';

import classNames from 'classnames';
import ReactSlider from 'react-slider';

import { applyDataAttr } from '../../utils';
import styles from './Slider.module.css';

type SliderProps = {
  max?: number;
  min?: number;
  step?: number;
  value?: number | number[];
  isDouble?: boolean;
  onChange?: (value: number | number[], thumbIndex: number) => void;
  disabled?: boolean;
  className?: string;
  dataAttribute?: string;
  onAfterChange?: (value: number | number[], thumbIndex: number) => void;
  thumbClassName?: string;
  trackClassName?: string;
  thumbActiveClassName?: string;
};

export const Slider: FC<SliderProps> = ({
  max = 100,
  min = 0,
  step = 1,
  value,
  onChange,
  isDouble = false,
  disabled = false,
  className,
  dataAttribute,
  onAfterChange,
  thumbClassName,
  trackClassName,
  thumbActiveClassName,
}) => (
  <ReactSlider
    max={max}
    min={min}
    step={step}
    value={value}
    disabled={disabled}
    onChange={onChange}
    className={classNames(isDouble && styles.isDouble, className)}
    onAfterChange={onAfterChange}
    thumbClassName={classNames(styles.thumb, thumbClassName)}
    trackClassName={classNames(styles.track, trackClassName)}
    thumbActiveClassName={thumbActiveClassName}
    {...applyDataAttr(dataAttribute)}
  />
);
