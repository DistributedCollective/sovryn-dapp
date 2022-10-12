import React from 'react';

import classNames from 'classnames';

import { TabSize, TabType } from '../../Tabs.types';
import styles from './Tab.module.css';

type TabProps = {
  content: React.ReactNode;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  dataActionId?: string;
  type: TabType;
  size: TabSize;
  activeClassName?: string;
};

export const Tab: React.FC<TabProps> = ({
  content,
  active,
  onClick,
  disabled,
  className,
  dataActionId,
  type,
  size,
  activeClassName = '',
}) => (
  <button
    type="button"
    className={classNames(
      {
        [styles.active]: active,
        [activeClassName]: active,
      },
      className,
      styles.button,
      styles[size],
      styles[type],
    )}
    onClick={onClick}
    data-action-id={dataActionId}
    disabled={disabled}
  >
    {content}
  </button>
);
