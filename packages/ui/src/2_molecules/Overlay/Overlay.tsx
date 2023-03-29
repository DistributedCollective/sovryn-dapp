import React, {
  ReactNode,
  useMemo,
  useCallback,
  MouseEventHandler,
  MouseEvent,
  useEffect,
  useRef,
} from 'react';

import classNames from 'classnames';

import { Portal } from '../../1_atoms/Portal/Portal';
import { Align, AlignVertical } from '../../types/tailwind';
import { applyDataAttr } from '../../utils';
import styles from './Overlay.module.css';
import {
  OverlayBackground,
  OverlayBackgroundClassName,
  AlignClassName,
  AlignVerticalClassName,
} from './Overlay.types';

export type OverlayProps = {
  className?: string;
  portalTarget?: string;
  zIndex?: number;
  fixed?: boolean;
  isOpen?: boolean;
  align?: Align;
  alignVertical?: AlignVertical;
  background?: OverlayBackground;
  onBlur?: MouseEventHandler;
  children: ReactNode;
  portalClassName?: string;
  dataAttribute?: string;
};

export const Overlay: React.FC<OverlayProps> = ({
  className,
  portalTarget,
  zIndex,
  fixed = false,
  isOpen = true,
  align = Align.center,
  alignVertical = AlignVertical.center,
  background = OverlayBackground.default,
  onBlur,
  children,
  portalClassName,
  dataAttribute,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const onBlurHandler = useCallback(
    (event: MouseEvent) => {
      onBlur?.(event);
      event.preventDefault();
      event.stopPropagation();
    },
    [onBlur],
  );

  const element = useMemo(
    () =>
      isOpen ? (
        <div
          ref={ref}
          tabIndex={-1}
          className={classNames(
            styles.overlay,
            fixed ? [styles.__fixed] : [styles.__absolute],
            AlignClassName[align],
            AlignVerticalClassName[alignVertical],
            OverlayBackgroundClassName[background],
            className,
          )}
          style={!fixed && zIndex ? { zIndex } : undefined}
          onClick={onBlurHandler}
          {...applyDataAttr(dataAttribute)}
        >
          {children}
        </div>
      ) : null,
    [
      children,
      isOpen,
      fixed,
      align,
      alignVertical,
      background,
      className,
      zIndex,
      onBlurHandler,
      dataAttribute,
    ],
  );

  useEffect(() => {
    if (fixed && isOpen) {
      document.body.className += ` ${styles.disableScroll}`;
      return () => {
        document.body.className = document.body.className.replace(
          ` ${styles.disableScroll}`,
          '',
        );
      };
    } else {
      document.body.className = '';
    }
  }, [fixed, isOpen]);

  useEffect(() => {
    // focus to element when open
    if (isOpen && ref.current) {
      ref.current.focus();
    }
  }, [isOpen]);

  if (fixed) {
    return (
      <Portal target={portalTarget} zIndex={zIndex} className={portalClassName}>
        {element}
      </Portal>
    );
  }
  return element;
};
