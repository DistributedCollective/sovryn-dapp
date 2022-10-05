import React, { useState, useMemo, useCallback } from 'react';

import classNames from 'classnames';

import { TabColor, TabSize, TabStyle } from './Tabs.types';
import { Tab } from './components/Tab/Tab';

interface ITabItem {
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  dataActionId?: string;
  color?: TabColor;
}

type TabsProps = {
  className?: string;
  contentClassName?: string;
  index?: number;
  items: ITabItem[];
  onChange?: (index: number) => void;
  dataActionId?: string;
  style?: TabStyle;
  size?: TabSize;
  withBorder?: boolean;
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  index = 0,
  onChange,
  className,
  contentClassName,
  dataActionId,
  style = TabStyle.primary,
  size = TabSize.normal,
  withBorder = false,
}) => {
  const [activeTab, setActiveTab] = useState(index);

  const selectTab = useCallback(
    (item: ITabItem, index: number) => {
      if (item.disabled) {
        return;
      }
      setActiveTab(index);
      onChange?.(index);
    },
    [onChange],
  );

  const content = useMemo(() => items[activeTab]?.content, [activeTab, items]);

  return (
    <div className={classNames(className, 'inline-flex flex-col')}>
      <div
        className={classNames(
          'inline-flex rounded-t items-center flex-nowrap overflow-auto',
          {
            'border border-b-0 border-gray-50':
              withBorder && style === TabStyle.primary,
            'bg-gray-80-ol': style === TabStyle.primary,
          },
        )}
      >
        {items.map((item, index) => (
          <Tab
            key={index}
            active={index === activeTab}
            disabled={item.disabled}
            onClick={() => selectTab(item, index)}
            content={item.label}
            dataActionId={item.dataActionId}
            color={item.color}
            style={style}
            size={size}
            withBorder={withBorder}
          />
        ))}
      </div>
      <div
        className={classNames(contentClassName, {
          'border-b border-x border-gray-50':
            withBorder && style === TabStyle.primary,
          'bg-gray-80 rounded-b': style === TabStyle.primary,
        })}
      >
        {content}
      </div>
    </div>
  );
};
