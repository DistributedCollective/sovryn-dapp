import React from 'react';

import classNames from 'classnames';

import { TabColor, TabSize, TabStyle } from '../../Tabs.types';
import styles from './Tab.module.css';

type TabProps = {
  content: React.ReactNode;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  dataActionId?: string;
  color?: TabColor;
  style: TabStyle;
  size: TabSize;
  withBorder: boolean;
};

export const Tab: React.FC<TabProps> = ({
  content,
  active,
  onClick,
  disabled,
  className,
  dataActionId,
  color = TabColor.default,
  style,
  size,
  withBorder,
}) => (
  <button
    type="button"
    className={classNames(
      {
        'cursor-pointer': !disabled,
        'opacity-60 cursor-not-allowed': disabled,
        [styles.active]: active,
        [styles.withBorder]: withBorder,
      },
      className,
      styles.button,
      styles[size],
      styles[style],
      styles[color],
    )}
    onClick={onClick}
    data-action-id={dataActionId}
    disabled={disabled}
  >
    {content}
  </button>
);
