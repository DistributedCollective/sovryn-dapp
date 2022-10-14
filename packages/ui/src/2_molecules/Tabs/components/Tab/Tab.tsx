import React from 'react';

import classNames from 'classnames';

import { TabSize, TabType } from '../../Tabs.types';
import styles from './Tab.module.css';

type TabProps = {
  content: React.ReactNode;
  disabled?: boolean;
  active: boolean;
  onClick: () => void;
  className?: string;
  dataLayoutId?: string;
  type: TabType;
  size: TabSize;
  activeClassName?: string;
  index: number;
  activeIndex: number;
};

export const Tab: React.FC<TabProps> = ({
  content,
  onClick,
  disabled,
  className,
  dataLayoutId,
  type,
  size,
  active,
  activeClassName = '',
  activeIndex,
  index,
}) => (
  <button
    type="button"
    className={classNames(
      {
        [styles.active]: active,
        [activeClassName]: active,
        [styles.noRightBorder]: activeIndex - 1 === index,
      },
      className,
      styles.button,
      styles[size],
      styles[type],
    )}
    onClick={onClick}
    data-layout-id={dataLayoutId}
    disabled={disabled}
  >
    {content}
  </button>
);
