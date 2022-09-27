import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms/Icon/Icon';
import { ARROW_DOWN } from '../../1_atoms/Icon/iconNames';
import { Portal } from '../../1_atoms/Portal/Portal';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Nullable } from '../../types';
import styles from './Dropdown.module.css';
import { DropdownCoords, DropdownMode, DropdownSize } from './Dropdown.types';
import { getDropdownPositionStyles } from './Dropdown.utils';

type DropdownProps = {
  text: ReactNode;
  children: ReactNode;
  mode?: DropdownMode;
  size?: DropdownSize;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  dataActionId?: string;
  dropdownClassName?: string;
};

export const Dropdown: React.FC<DropdownProps> = ({
  text,
  children,
  mode = DropdownMode.sameWidth,
  size = DropdownSize.large,
  onOpen,
  onClose,
  className,
  dataActionId,
  dropdownClassName,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [coords, setCoords] = useState<Nullable<DropdownCoords>>(null);
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

  const classNames = useMemo(
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

  return (
    <>
      <button
        className={classNames(classNames)}
        data-action-id={dataActionId}
        onClick={onButtonClick}
        type="button"
        ref={buttonRef}
      >
        {text}
        <Icon
          icon={ARROW_DOWN}
          size={10}
          className={classNames('transition-transform ml-2', {
            'transform rotate-180': isOpen,
          })}
        />
      </button>

      {isOpen && (
        <Portal target="body">
          <div
            className={classNames(styles.dropdown, dropdownClassName)}
            style={dropdownStyles}
            ref={dropdownRef}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
};
