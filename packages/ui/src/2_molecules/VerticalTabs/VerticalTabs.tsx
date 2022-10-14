import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';

import styles from './VerticalTabs.module.css';
import { VerticalTabsProps } from './VerticalTabs.types';
import { VerticalTabItem } from './components/VerticalTabItem';
import { findParentBackgroundColorAndElement } from './utils';

export const VerticalTabs: FC<VerticalTabsProps> = ({
  selectedIndex = 0,
  ...props
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const maybeRenderHeader = useMemo(() => {
    if (props.header) {
      return (
        <div className={styles.header}>
          {props.header({ ...props, selectedIndex })}
        </div>
      );
    }
    return null;
  }, [props, selectedIndex]);

  const maybeRenderFooter = useMemo(() => {
    if (props.footer) {
      return (
        <div className={styles.footer}>
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

  const [detectedIndicatorBgColor, setDetectedIndicatorBgColor] =
    useState('transparent');

  const indicatorBgColor = useMemo(
    () => props.tabIndicatorColor || detectedIndicatorBgColor,
    [props.tabIndicatorColor, detectedIndicatorBgColor],
  );

  useEffect(() => {
    if (contentRef.current && window !== undefined) {
      if (
        getComputedStyle(contentRef.current).display &&
        !props.tabIndicatorColor
      ) {
        const [bgColor] = findParentBackgroundColorAndElement(
          contentRef.current,
        );
        setDetectedIndicatorBgColor(bgColor);
      }
    }
  }, [props.tabIndicatorColor]);

  return (
    <section className={classNames(styles.container, props.className)}>
      <aside className={classNames(styles.aside, props.tabsClassName)}>
        {maybeRenderHeader}
        <div className={styles.tabs}>
          {props.items.map((item, index) => (
            <VerticalTabItem
              key={index}
              active={index === selectedIndex}
              onClick={handleTabClick(index)}
              activeIndicatorBgColor={indicatorBgColor}
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
