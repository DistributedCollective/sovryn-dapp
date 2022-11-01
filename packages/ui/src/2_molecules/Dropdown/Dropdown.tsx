import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms/Icon/Icon';
import { IconNames } from '../../1_atoms/Icon/Icon.types';
import { Portal } from '../../1_atoms/Portal/Portal';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Nullable } from '../../types';
import { applyDataAttr } from '../../utils';
import styles from './Dropdown.module.css';
import { DropdownCoords, DropdownMode, DropdownSize } from './Dropdown.types';
import { getDropdownPositionStyles } from './Dropdown.utils';

export type DropdownProps = {
  text: ReactNode;
  children: ReactNode;
  mode?: DropdownMode;
  size?: DropdownSize;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  dataLayoutId?: string;
  dropdownClassName?: string;
  closeOnClick?: boolean;
  usePortal?: boolean;
};

export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      text,
      children,
      mode = DropdownMode.sameWidth,
      size = DropdownSize.large,
      onOpen,
      onClose,
      className,
      dataLayoutId,
      dropdownClassName,
      closeOnClick,
      usePortal = true,
    },
    ref,
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setOpen] = useState(false);
    const [coords, setCoords] = useState<Nullable<DropdownCoords>>(null);

    useImperativeHandle(ref, () => buttonRef.current!);

    const onButtonClick = useCallback(
      () => setOpen(prevValue => !prevValue),
      [setOpen],
    );

    const getCoords = useCallback(() => {
      const button = buttonRef.current?.getBoundingClientRect();
      const dropdownWidth = dropdownRef.current?.getBoundingClientRect().width;
      const windowWidth = document.body.getBoundingClientRect().width;
      const scrollOffset = window.scrollY;
      if (button && dropdownWidth) {
        const { top, left, right, width, height } = button;
        return {
          top: top + height + scrollOffset,
          left: left,
          right: right,
          buttonWidth: width,
          windowWidth: windowWidth,
          dropdownWidth: dropdownWidth,
        };
      }
      return null;
    }, []);

    const dropdownStyles = useMemo(() => {
      if (!coords) {
        return;
      }
      return getDropdownPositionStyles(coords, mode);
    }, [coords, mode]);

    const classNamesComplete = useMemo(
      () =>
        classNames(styles.button, styles[size], className, {
          [styles.isOpen]: isOpen,
        }),
      [size, className, isOpen],
    );

    const useClickedOutside = useCallback(() => {
      setOpen(false);
      onClose?.();
    }, [onClose]);

    useOnClickOutside([buttonRef, dropdownRef], useClickedOutside);

    useEffect(() => {
      if (!isOpen) {
        return;
      }
      const coords = getCoords();
      setCoords(coords);
      onOpen?.();
    }, [isOpen, getCoords, onOpen, mode]);

    const renderDropdown = useMemo(
      () => (
        <div
          className={classNames(styles.dropdown, dropdownClassName)}
          onClick={closeOnClick ? onButtonClick : undefined}
          style={usePortal ? dropdownStyles : undefined}
          ref={dropdownRef}
        >
          {children}
        </div>
      ),
      [
        dropdownClassName,
        closeOnClick,
        onButtonClick,
        usePortal,
        dropdownStyles,
        children,
      ],
    );

    return (
      <>
        <button
          className={classNames(classNamesComplete)}
          {...applyDataAttr(dataLayoutId)}
          onClick={onButtonClick}
          type="button"
          ref={buttonRef}
        >
          {text}
          <Icon
            icon={IconNames.ARROW_DOWN}
            size={10}
            className={classNames(styles.icon, {
              [styles.isOpen]: isOpen,
            })}
          />
        </button>

        {isOpen && (
          <>
            {usePortal ? (
              <Portal target="body">{renderDropdown}</Portal>
            ) : (
              renderDropdown
            )}
          </>
        )}
      </>
    );
  },
);
