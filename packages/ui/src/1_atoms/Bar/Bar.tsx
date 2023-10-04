import { FC, useMemo } from 'react';

import styles from './Bar.module.css';

export type BarProps = {
  value: number;
  threshold?: number;
};

export const Bar: FC<BarProps> = ({ value, threshold }) => {
  const normalized = useMemo(
    () => ({
      value: Math.min(100, Math.max(0, value ?? 0)),
      threshold: Math.min(100, Math.max(0, threshold ?? 0)),
      hasThreshold: threshold !== undefined,
    }),
    [value, threshold],
  );

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div
          className={styles.foreground}
          style={{ width: `${normalized.value}%` }}
        ></div>
        {normalized.hasThreshold && (
          <div
            className={styles.threshold}
            style={{ left: `calc(${normalized.threshold}% - 0.26rem)` }}
          >
            <div className={styles['threshold-line']} />
            <div className={styles['threshold-line']} />
          </div>
        )}
      </div>
    </div>
  );
};
