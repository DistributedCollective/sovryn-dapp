import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import classNames from 'classnames';

import styles from './VerticalTabs.module.css';
import { VerticalTabsProps } from './VerticalTabs.types';
import { VerticalTabItem } from './components/VerticalTabItem';

const INDICATOR_SIZE = 16;

export const VerticalTabs: FC<VerticalTabsProps> = ({
  selectedIndex = 0,
  ...props
}) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
    if (sidebarRef.current) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const tabRect = sidebarRef.current
        ?.querySelector('[data-active=true]')
        ?.getBoundingClientRect();
      if (tabRect) {
        const top =
          tabRect.top -
          INDICATOR_SIZE / 2 +
          tabRect.height / 4 -
          sidebarRect.top;
        const middle = top + INDICATOR_SIZE;
        const bottom = middle + INDICATOR_SIZE;
        const left = sidebarRect.width - INDICATOR_SIZE;

        sidebarRef.current.style.setProperty(
          'clip-path',
          `polygon(0 0, 100% 0, 100% ${top}px, ${left}px ${middle}px, 100% ${bottom}px, 100% 100%, 0 100%)`,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, props.items]);

  useEffect(() => {
    moveIndicator();
  }, [moveIndicator]);

  return (
    <section className={classNames(styles.container, props.className)}>
      <aside
        className={classNames(styles.aside, props.tabsClassName)}
        ref={sidebarRef}
      >
        {maybeRenderHeader}
        <div className={styles.tabs}>
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
      <div
        className={classNames(styles.content, props.contentClassName)}
        ref={contentRef}
      >
        {renderContent}
      </div>
    </section>
  );
};
