import React, {
  ReactNode,
  useMemo,
  useCallback,
  MouseEventHandler,
  MouseEvent,
  useEffect,
} from 'react';
import { Align, AlignVertical } from '../../types/tailwind';
import classNames from 'classnames';
import { Portal } from '../../1_atoms/Portal/Portal';

export enum OverlayBackground {
  transparent = 'transparent',
  light25 = 'light25',
  light75 = 'light75',
  dark25 = 'dark25',
  dark75 = 'dark75',
}

const OverlayBackgroundClassName: { [key in OverlayBackground]: string } = {
  [OverlayBackground.transparent]: 'bg-transparent',
  [OverlayBackground.light25]: 'bg-gray-9 bg-opacity-25',
  [OverlayBackground.light75]: 'bg-gray-9 bg-opacity-75',
  [OverlayBackground.dark25]: 'bg-gray-1 bg-opacity-25',
  [OverlayBackground.dark75]: 'bg-gray-1 bg-opacity-75',
};

const AlignClassName: { [key in Align]: string } = {
  [Align.left]: 'justify-start',
  [Align.center]: 'justify-center',
  [Align.right]: 'justify-end',
};

const AlignVerticalClassName: { [key in AlignVertical]: string } = {
  [AlignVertical.top]: 'items-start',
  [AlignVertical.center]: 'items-center',
  [AlignVertical.bottom]: 'items-end',
};

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
};

export const Overlay: React.FC<OverlayProps> = ({
  className,
  portalTarget,
  zIndex,
  fixed = false,
  isOpen = true,
  align = Align.center,
  alignVertical = AlignVertical.center,
  background = OverlayBackground.dark75,
  onBlur,
  children,
  portalClassName,
}) => {
  const onBlurHandler = useCallback(
    (event: MouseEvent) => {
      if (onBlur) {
        onBlur(event);
      }
      event.preventDefault();
      event.stopPropagation();
    },
    [onBlur],
  );

  const element = useMemo(
    () =>
      isOpen ? (
        <div
          className={classNames(
            fixed ? 'fixed' : 'absolute',
            'inset-0 flex flex-column',
            AlignClassName[align],
            AlignVerticalClassName[alignVertical],
            OverlayBackgroundClassName[background],
            className,
          )}
          style={!fixed && zIndex ? { zIndex } : undefined}
          onClick={onBlurHandler}
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
    ],
  );

  useEffect(() => {
    if (fixed && isOpen) {
      document.body.className += ' overflow-hidden';
      return () => {
        document.body.className = document.body.className.replace(
          ' overflow-hidden',
          '',
        );
      };
    }
  }, [fixed, isOpen]);

  if (fixed) {
    return (
      <Portal target={portalTarget} zIndex={zIndex} className={portalClassName}>
        {element}
      </Portal>
    );
  }
  return element;
};
