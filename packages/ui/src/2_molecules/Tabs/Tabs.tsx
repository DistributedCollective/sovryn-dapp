import React, { useMemo, useCallback, RefObject } from 'react';

import classNames from 'classnames';

import styles from './Tabs.module.css';
import { TabSize, TabType } from './Tabs.types';
import { Tab } from './components/Tab/Tab';

export interface ITabItem {
  label: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
  dataAttribute?: string;
  activeClassName?: string;
}

type TabsProps = {
  className?: string;
  contentClassName?: string;
  labelsClassName?: string;
  index: number;
  items: ITabItem[];
  onChange?: (index: number) => void;
  type?: TabType;
  size?: TabSize;
  wrapperRef?: RefObject<HTMLDivElement>;
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  index,
  onChange,
  className = '',
  contentClassName,
  type = TabType.primary,
  size = TabSize.normal,
  wrapperRef,
  labelsClassName,
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
    <div className={classNames(styles.wrapper, className)} ref={wrapperRef}>
      <div className={classNames(styles.tabs, styles[type], labelsClassName)}>
        {items.map((item, i) => (
          <Tab
            key={i}
            active={index === i}
            index={i}
            disabled={item.disabled}
            onClick={() => selectTab(item, i)}
            content={item.label}
            dataAttribute={item.dataAttribute}
            type={type}
            size={size}
            activeIndex={index}
            activeClassName={item.activeClassName}
          />
        ))}
      </div>
      {content && (
        <div
          className={classNames(styles.content, styles[type], contentClassName)}
        >
          {content}
        </div>
      )}
    </div>
  );
};
