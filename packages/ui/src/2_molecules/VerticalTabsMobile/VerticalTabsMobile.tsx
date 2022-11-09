import React, { FC, useCallback, useMemo, useRef } from 'react';

import classNames from 'classnames';

import styles from './VerticalTabsMobile.module.css';
import { VerticalTabsMobileProps } from './VerticalTabsMobile.types';
import { VerticalTabMobileItem } from './components/VerticalTabMobileItem';

export const VerticalTabsMobile: FC<VerticalTabsMobileProps> = ({
  selectedIndex = null,
  ...props
}) => {
  const sidebarRef = useRef<HTMLElement>(null);
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

  const renderContent = useMemo(
    () => (selectedIndex !== null ? props.items[selectedIndex].content : null),
    [props.items, selectedIndex],
  );

  const handleTabClick = useCallback(
    (index: number) => () => {
      props.onChange?.(index);
    },
    [props],
  );

  return (
    <section className={classNames(styles.container, props.className)}>
      {selectedIndex === null ? (
        <aside
          className={classNames(styles.aside, props.tabsClassName)}
          ref={sidebarRef}
        >
          {maybeRenderHeader}
          <div className={styles.tabs}>
            {props.items.map((item, index) => (
              <VerticalTabMobileItem
                key={index}
                onClick={handleTabClick(index)}
                {...item}
              />
            ))}
          </div>
        </aside>
      ) : (
        <div
          className={classNames(styles.content, props.contentClassName)}
          ref={contentRef}
        >
          {renderContent}
        </div>
      )}
    </section>
  );
};
