import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { Portal } from '../../1_atoms/Portal/Portal';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Nullable } from '../../types';
import styles from './Dropdown.module.css';
import { DropdownColor, DropdownCoords, DropdownMode } from './Dropdown.types';
import { getDropdownPositionStyles } from './Dropdown.utils';

type DropdownProps = {
  text: ReactNode;
  children: ReactNode;
  mode?: DropdownMode;
  color?: DropdownColor;
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
  color = DropdownColor.gray3,
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

  const classNameComplete = useMemo(
    () =>
      classNames(styles.button, color, className, { [styles.isOpen]: isOpen }),
    [color, className, isOpen],
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
        className={classNames(classNameComplete)}
        data-action-id={dataActionId}
        onClick={onButtonClick}
        type="button"
        ref={buttonRef}
      >
        {text}
        <span
          className={classNames(styles.iconArrow, {
            'transform rotate-180 rounded-b-none': isOpen,
          })}
        ></span>
      </button>

      {isOpen && (
        <Portal target="body">
          <div
            className={classNames(styles.dropdown, dropdownClassName, color)}
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
