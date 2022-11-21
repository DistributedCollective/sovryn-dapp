import React, { FC, ReactNode, useMemo } from 'react';

import classNames from 'classnames';

import { Tooltip } from '../../2_molecules';
import { applyDataAttr } from '../../utils';
import styles from './HealthBar.module.css';

export type HealthBarProps = {
  className?: string;
  dataLayoutId?: string;
  start: number;
  end: number;
  middleStart: number;
  middleEnd: number;
  value?: number;
  tooltipRenderer?: (value: number) => ReactNode;
};

export const HealthBar: FC<HealthBarProps> = ({
  className,
  dataLayoutId,
  start,
  end,
  middleStart,
  middleEnd,
  value,
  tooltipRenderer = val => <>{val}%</>,
}) => {
  const tickPosition = useMemo(
    () =>
      value === undefined
        ? ''
        : (((value - start) / (end - start)) * 100).toFixed(2),
    [end, start, value],
  );

  if (!(start <= middleStart && middleStart <= middleEnd && middleEnd <= end)) {
    return <>Invalid Props</>;
  }

  return (
    <div
      {...applyDataAttr(dataLayoutId)}
      className={classNames(
        styles.healthBar,
        {
          [styles.disabled]: value === undefined,
        },
        className,
      )}
    >
      <div
        className={styles.low}
        style={{
          flexBasis: middleStart - start + '%',
        }}
      ></div>
      <div
        className={styles.middle}
        style={{
          flexBasis: middleEnd - middleStart + '%',
        }}
      ></div>
      <div
        className={styles.high}
        style={{
          flexBasis: end - middleEnd + '%',
        }}
      ></div>
      {value !== undefined && (
        <Tooltip className={styles.tick} content={tooltipRenderer(value)}>
          <span
            style={{
              left: `max(10px, min(100%, ${tickPosition}%))`,
            }}
          />
        </Tooltip>
      )}
    </div>
  );
};
