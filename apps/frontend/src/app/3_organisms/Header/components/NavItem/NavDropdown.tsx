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

import {
  applyDataAttr,
  DropdownCoords,
  DropdownEvents,
  DropdownMode,
  DropdownSize,
  getDropdownPositionStyles,
  Icon,
  IconNames,
  useOnClickOutside,
} from '@sovryn/ui';

import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { Nullable } from '../../../../../types/global';
import styles from './NavDropdown.module.css';

export type DropdownProps = {
  text: ReactNode;
  /**
   * The content of the dropdown.
   * */
  children: ReactNode;
  mode?: DropdownMode;
  size?: DropdownSize;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  dataAttribute?: string;
  dropdownClassName?: string;
  closeOnClick?: boolean;
  active?: boolean;
  disabled?: boolean;
};

export const NavDropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      text,
      children,
      mode = DropdownMode.sameWidth,
      size = DropdownSize.large,
      onOpen,
      onClose,
      className,
      dataAttribute,
      dropdownClassName,
      closeOnClick,
      active,
      disabled,
    },
    ref,
  ) => {
    const { isMobile } = useIsMobile();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setOpen] = useState(!!active);
    const [coords, setCoords] = useState<Nullable<DropdownCoords>>(null);

    useImperativeHandle(ref, () => buttonRef.current!);

    const isAccordionActive = useMemo(
      () => isMobile && isOpen,
      [isMobile, isOpen],
    );

    const onButtonClick = useCallback(
      () => !disabled && setOpen(prevValue => !prevValue),
      [setOpen, disabled],
    );

    const getCoords = useCallback(() => {
      const button = buttonRef.current?.getBoundingClientRect();
      const dropdownWidth = dropdownRef.current?.getBoundingClientRect().width;
      const windowWidth = document.body.getBoundingClientRect().width;
      if (button && dropdownWidth) {
        const { top, left, right, width, height } = button;
        return {
          top: top + height,
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
      if (coords) {
        return getDropdownPositionStyles(coords, mode);
      }

      if (isAccordionActive) {
        return {};
      }
    }, [coords, isAccordionActive, mode]);

    const classNamesComplete = useMemo(
      () =>
        classNames(styles.button, styles[size], className, {
          [styles.isOpen]: isOpen,
          [styles.isActive]: isAccordionActive,
          [styles.disabled]: disabled,
        }),
      [size, className, isOpen, isAccordionActive, disabled],
    );

    const useClickedOutside = useCallback(() => {
      if (!isMobile) {
        setOpen(false);
        onClose?.();
      }
    }, [onClose, isMobile]);

    useOnClickOutside([buttonRef, dropdownRef], useClickedOutside);

    const updateCoords = useCallback(
      () => setCoords(getCoords()),
      [getCoords, setCoords],
    );

    useEffect(() => {
      Object.values(DropdownEvents).forEach(event =>
        window.addEventListener(event, updateCoords),
      );
      return () => {
        Object.values(DropdownEvents).forEach(event =>
          window.removeEventListener(event, updateCoords),
        );
      };
    }, [updateCoords]);

    useEffect(() => {
      if (isOpen) {
        updateCoords();
        onOpen?.();

        return () => {
          setOpen(false);
          onClose?.();
        };
      }
    }, [isOpen, updateCoords, onOpen, mode, onClose]);

    useEffect(() => {
      if (isMobile) {
        setOpen(!!active);
      } else {
        setOpen(false);
      }
    }, [active, isMobile]);

    const renderDropdown = useMemo(
      () => (
        <div
          className={classNames(styles.dropdown, dropdownClassName, {
            [styles.isVisible]: dropdownStyles,
          })}
          onClick={closeOnClick ? onButtonClick : undefined}
          style={dropdownStyles}
          ref={dropdownRef}
        >
          {children}
        </div>
      ),
      [
        dropdownClassName,
        dropdownStyles,
        closeOnClick,
        onButtonClick,
        children,
      ],
    );

    return (
      <>
        <button
          className={classNames(classNamesComplete)}
          {...applyDataAttr(dataAttribute)}
          onClick={onButtonClick}
          type="button"
          ref={buttonRef}
        >
          {text}
          <Icon
            icon={IconNames.ARROW_DOWN}
            size={10}
            className={classNames(styles.icon, {
              [styles.isOpen]: isOpen || isAccordionActive,
            })}
          />
        </button>

        {(isOpen || isAccordionActive) && <>{renderDropdown}</>}
      </>
    );
  },
);
