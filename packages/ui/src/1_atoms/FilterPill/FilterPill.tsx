import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './FilterPill.module.css';

type FilterPillProps = {
  text: ReactNode;
  dataAttribute?: string;
  className?: string;
  isActive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const FilterPill: FC<FilterPillProps> = ({
  text,
  dataAttribute,
  className,
  isActive = false,
  onClick,
}) => (
  <button
    {...applyDataAttr(dataAttribute)}
    className={classNames(
      styles.filterPill,
      {
        [styles.active]: isActive,
      },
      className,
    )}
    type="button"
    onClick={onClick}
  >
    {text}
  </button>
);
