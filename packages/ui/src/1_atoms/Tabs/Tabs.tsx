import React, { useMemo, useCallback } from 'react';

import classNames from 'classnames';

import styles from './Tabs.module.css';
import { TabSize, TabType } from './Tabs.types';
import { Tab } from './components/Tab/Tab';

interface ITabItem {
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  dataActionId?: string;
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
  withBorder?: boolean;
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  index,
  onChange,
  className,
  contentClassName,
  type = TabType.primary,
  size = TabSize.normal,
  withBorder = false,
}) => {
  const selectTab = useCallback(
    (item: ITabItem, index: number) => {
      if (item.disabled) {
        console.log(`test`);
        return;
      }
      onChange?.(index);
    },
    [onChange],
  );

  const content = useMemo(() => items[index]?.content, [index, items]);

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div
        className={classNames(styles.tabs, styles[type], {
          [styles.withBorder]: withBorder,
        })}
      >
        {items.map((item, i) => (
          <Tab
            key={i}
            active={index === i}
            disabled={item.disabled}
            onClick={() => selectTab(item, i)}
            content={item.label}
            dataActionId={item.dataActionId}
            type={type}
            size={size}
            withBorder={withBorder}
            activeClassName={item.activeClassName}
          />
        ))}
      </div>
      <div
        className={classNames(
          styles.content,
          styles[type],
          {
            [styles.withBorder]: withBorder,
          },
          contentClassName,
        )}
      >
        {content}
      </div>
    </div>
  );
};
