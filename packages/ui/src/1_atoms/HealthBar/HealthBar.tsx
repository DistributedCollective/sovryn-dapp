import React, { FC, useCallback } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './HealthBar.module.css';

export type HealthBarProps = {
  className?: string;
  dataAttribute?: string;
  start: number;
  end: number;
  middleStart: number;
  middleEnd: number;
  value?: number;
};

export const HealthBar: FC<HealthBarProps> = ({
  className,
  dataAttribute,
  start,
  end,
  middleStart,
  middleEnd,
  value,
}) => {
  const getBlurWidth = useCallback(
    (start: number, end: number) => {
      if (value === undefined || value <= start) {
        return 0;
      }
      return (
        (value >= end ? 1 : (value - start) / (end - start)) * 100
      ).toFixed(2);
    },
    [value],
  );

  if (!(start <= middleStart || middleStart <= middleEnd || middleEnd <= end)) {
    return <>Invalid Props</>;
  }

  return (
    <div
      {...applyDataAttr(dataAttribute)}
      className={classNames(styles.healthBar, className)}
    >
      <div
        className={styles.low}
        style={{
          flexBasis: middleStart - start + '%',
        }}
      >
        {value !== undefined && (
          <span
            className={styles.blur}
            style={{
              width: `${getBlurWidth(start, middleStart)}%`,
            }}
          />
        )}
      </div>
      <div
        className={styles.middle}
        style={{
          flexBasis: middleEnd - middleStart + '%',
        }}
      >
        {value !== undefined && (
          <span
            className={styles.blur}
            style={{
              width: `${getBlurWidth(middleStart, middleEnd)}%`,
            }}
          />
        )}
      </div>
      <div
        className={styles.high}
        style={{
          flexBasis: end - middleEnd + '%',
        }}
      >
        {value !== undefined && (
          <span
            className={styles.blur}
            style={{
              width: `${getBlurWidth(middleEnd, end)}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};
