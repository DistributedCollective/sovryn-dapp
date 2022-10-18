import React, { useMemo, useCallback } from 'react';

import classNames from 'classnames';

import styles from './Tabs.module.css';
import { TabSize, TabType } from './Tabs.types';
import { Tab } from './components/Tab/Tab';

export interface ITabItem {
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  dataLayoutId?: string;
  activeClassName?: string;
}

type TabsProps = {
  className?: string;
  contentClassName?: string;
  index: number;
  items: ITabItem[];
  onChange?: (index: number) => void;
  type?: TabType;
  size?: TabSize;
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  index,
  onChange,
  className = '',
  contentClassName,
  type = TabType.primary,
  size = TabSize.normal,
}) => {
  const selectTab = useCallback(
    (item: ITabItem, index: number) => {
      if (!item.disabled) {
        onChange?.(index);
      }
    },
    [onChange],
  );

  const content = useMemo(() => items[index]?.content, [index, items]);

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={classNames(styles.tabs, styles[type])}>
        {items.map((item, i) => (
          <Tab
            key={i}
            active={index === i}
            index={i}
            disabled={item.disabled}
            onClick={() => selectTab(item, i)}
            content={item.label}
            dataLayoutId={item.dataLayoutId}
            type={type}
            size={size}
            activeIndex={index}
            activeClassName={item.activeClassName}
          />
        ))}
      </div>
      <div
        className={classNames(styles.content, styles[type], contentClassName)}
      >
        {content}
      </div>
    </div>
  );
};
