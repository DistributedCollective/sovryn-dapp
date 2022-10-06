import React, { useMemo, useCallback } from 'react';

import classNames from 'classnames';

import { TabColor, TabSize, TabStyle } from './Tabs.types';
import { Tab } from './components/Tab/Tab';

interface ITabItem {
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  dataActionId?: string;
  activeColor?: TabColor;
}

type TabsProps = {
  className?: string;
  contentClassName?: string;
  index: number;
  items: ITabItem[];
  onChange?: (index: number) => void;
  style?: TabStyle;
  size?: TabSize;
  withBorder?: boolean;
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  index,
  onChange,
  className,
  contentClassName,
  style = TabStyle.primary,
  size = TabSize.normal,
  withBorder = false,
}) => {
  const selectTab = useCallback(
    (item: ITabItem, index: number) => {
      if (item.disabled) {
        return;
      }
      onChange?.(index);
    },
    [onChange],
  );

  const content = useMemo(() => items[index]?.content, [index, items]);

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
        {items.map((item, i) => (
          <Tab
            key={i}
            active={index === i}
            disabled={item.disabled}
            onClick={() => selectTab(item, i)}
            content={item.label}
            dataActionId={item.dataActionId}
            color={item.activeColor}
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
