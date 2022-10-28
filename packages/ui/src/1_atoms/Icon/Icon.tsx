import type { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { ReactNode, useMemo } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './Icon.module.css';
import { IconType, ViewBoxSize, STANDARD, INLINE, SM } from './Icon.types';
import { IconSvgPaths } from './iconSvgPaths';

export type IconProps = {
  /**
   * Name of a Sovryn UI icon, or an custom SVG element, or an Fontawesome imported icon to render.
   * This prop is required because it determines the content of the component
   */
  icon: IconType;
  /**
   * Size of the icon, in pixels or in scale (1x, 2x, 3x ...) for the Fontawesome icons.
   * @default STANDARD = 16
   */
  size?: number | SizeProp;
  /**
   * Inline sets size to 1em.
   */
  inline?: boolean;
  /**
   * Applied classNames to the outer element.
   */
  className?: string;
  /**
   * Applied data-layout-id value to the element, mainly needed for testing or for GA
   */
  dataLayoutId?: string;
  /**
   * Applied viewBox to the svg element.
   */
  viewBox?: string;
};

export const Icon: React.FC<IconProps> = ({
  icon,
  size = STANDARD,
  inline,
  className,
  dataLayoutId,
  viewBox = ViewBoxSize.DEFAULT,
}) => {
  const isFaIcon = useMemo(() => !!icon && !!icon['prefix'], [icon]);

  const iconFaSize = useMemo(() => {
    if (inline) {
      return SM;
    } else {
      return size as SizeProp;
    }
  }, [inline, size]);

  const inlineBlock = useMemo(
    () => (inline ? styles.iconInlineBlock : styles.iconBlock),
    [inline],
  );

  const renderIcon = useMemo(() => {
    const iconSize = inline ? INLINE : size;
    //checking if we trying to show a custom icon
    if (typeof icon !== 'string') {
      return (
        <div
          className={classNames(className, styles.customIcon, inlineBlock)}
          style={{ width: iconSize, height: iconSize }}
          {...applyDataAttr(dataLayoutId)}
        >
          {icon as ReactNode}
        </div>
      );
    }

    //getting the svg path(s) for the icon
    const paths = IconSvgPaths[icon].map((path: string, i: number) => (
      <path key={i} d={path} clipRule="evenodd" fillRule="evenodd" />
    ));
    return (
      <svg
        viewBox={viewBox}
        height={iconSize}
        width={iconSize}
        fill="currentColor"
        className={classNames(className, inlineBlock)}
        data-icon={icon}
        {...applyDataAttr(dataLayoutId)}
      >
        {paths}
      </svg>
    );
  }, [viewBox, icon, inline, size, inlineBlock, className, dataLayoutId]);

  return (
    <>
      {isFaIcon ? (
        <FontAwesomeIcon
          className={classNames(className, inlineBlock)}
          size={iconFaSize}
          icon={icon as IconProp}
          {...applyDataAttr(dataLayoutId)}
        />
      ) : (
        renderIcon
      )}
    </>
  );
};
