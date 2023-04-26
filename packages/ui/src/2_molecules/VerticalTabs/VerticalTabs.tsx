import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import styles from './VerticalTabs.module.css';
import { VerticalTabsProps } from './VerticalTabs.types';
import { VerticalTabItem } from './components/VerticalTabItem';

const INDICATOR_SIZE = 16;

export const VerticalTabs: FC<VerticalTabsProps> = ({
  selectedIndex = 0,
  ...props
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  const maybeRenderHeader = useMemo(() => {
    if (props.header) {
      return (
        <div className={classNames(styles.header, props.headerClassName)}>
          {props.header({ ...props, selectedIndex })}
        </div>
      );
    }
    return null;
  }, [props, selectedIndex]);

  const maybeRenderFooter = useMemo(() => {
    if (props.footer) {
      return (
        <div className={classNames(styles.footer, props.footerClassName)}>
          {props.footer({ ...props, selectedIndex })}
        </div>
      );
    }
    return null;
  }, [props, selectedIndex]);

  const renderContent = useMemo(
    () => props.items[selectedIndex].content,
    [selectedIndex, props.items],
  );

  const handleTabClick = useCallback(
    (index: number) => () => {
      props.onChange?.(index);
    },
    [props],
  );

  const moveIndicator = useCallback(() => {
    if (tabsRef.current) {
      const sidebarRect = tabsRef.current.getBoundingClientRect();
      const tabRect = tabsRef.current
        ?.querySelector('[data-active=true]')
        ?.getBoundingClientRect();
      if (tabRect) {
        const top =
          tabRect.top - sidebarRect.top + tabRect.height / 2 - INDICATOR_SIZE;
        setTop(top);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, props.items]);

  useEffect(() => {
    moveIndicator();
  }, [moveIndicator]);

  return (
    <section className={classNames(styles.container, props.className)}>
      <aside className={classNames(styles.aside, props.tabsClassName)}>
        {maybeRenderHeader}
        <div ref={tabsRef} className={styles.tabs}>
          <div
            className={styles.indicator}
            style={{
              transform: `translateY(${top}px)`,
            }}
          />
          {props.items.map((item, index) => (
            <VerticalTabItem
              key={index}
              active={index === selectedIndex}
              onClick={handleTabClick(index)}
              {...item}
            />
          ))}
        </div>
        {maybeRenderFooter}
      </aside>
      <div className={classNames(styles.content, props.contentClassName)}>
        {renderContent}
      </div>
    </section>
  );
};
