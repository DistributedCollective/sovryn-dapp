import React, {
  FC,
  ReactNode,
  cloneElement,
  useCallback,
  Children,
  useRef,
  useState,
  ReactElement,
  useEffect,
  useMemo,
} from 'react';

import classNames from 'classnames';

import { Portal } from '../../1_atoms/Portal/Portal';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Nullable } from '../../types';
import { noop, applyDataAttr } from '../../utils';
import styles from './Tooltip.module.css';
import {
  TooltipElements,
  TooltipPlacement,
  TooltipTrigger,
  TooltipEvents,
} from './Tooltip.types';
import { CLOSE_DELAY, getTooltipPosition } from './Tooltip.utils';

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  tooltipClassName?: string;
  dataAttribute?: string;
  placement?: TooltipPlacement;
  onShow?: () => void;
  onHide?: () => void;
  disabled?: boolean;
  trigger?: TooltipTrigger;
};

export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  className,
  activeClassName,
  tooltipClassName,
  dataAttribute,
  placement = TooltipPlacement.top,
  onShow,
  onHide,
  disabled = false,
  trigger = TooltipTrigger.hover,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement>(null);
  const [elements, setElements] = useState<Nullable<TooltipElements>>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  const getElements = useCallback(() => {
    const target = targetRef.current?.getBoundingClientRect();
    const tooltip = tooltipRef.current?.getBoundingClientRect();
    if (target && tooltip) {
      return { target, tooltip };
    }
    return null;
  }, []);

  const updateElements = useCallback(
    () => setElements(getElements()),
    [getElements, setElements],
  );

  const tooltipPosition = useMemo(() => {
    if (elements) {
      return getTooltipPosition(elements, placement);
    }
  }, [elements, placement]);

  const handleShow = useCallback(() => {
    setIsVisible(prevValue => !prevValue);
    if (isVisible) {
      setShouldHide(true);
    }
  }, [setIsVisible, setShouldHide, isVisible]);

  const handleHide = useCallback(() => setShouldHide(true), [setShouldHide]);

  const onMouseHover = useCallback(
    () => setIsHovered(prevValue => !prevValue),
    [setIsHovered],
  );

  const elementProps = useMemo(() => {
    const attributes = Object.assign(
      {
        className: classNames(
          className,
          isVisible ? activeClassName : undefined,
        ),
        ref: targetRef,
      },
      applyDataAttr(dataAttribute),
    );

    const events = !disabled && {
      onMouseEnter: trigger === TooltipTrigger.hover ? handleShow : noop,
      onMouseLeave: trigger === TooltipTrigger.hover ? handleHide : noop,
      onClick: trigger === TooltipTrigger.click ? handleShow : noop,
      onFocus: trigger === TooltipTrigger.focus ? handleShow : noop,
      onBlur: trigger === TooltipTrigger.focus ? handleHide : noop,
      ontouchstart: trigger === TooltipTrigger.hover ? handleShow : noop,
    };
    return { ...attributes, ...events };
  }, [
    dataAttribute,
    className,
    activeClassName,
    isVisible,
    disabled,
    trigger,
    handleShow,
    handleHide,
  ]);

  useOnClickOutside([targetRef, tooltipRef], handleHide);

  useEffect(() => {
    if (shouldHide && !isHovered) {
      const timeout = setTimeout(() => {
        onHide?.();
        setShouldHide(false);
        setIsVisible(false);
      }, CLOSE_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [shouldHide, onHide, setShouldHide, setIsVisible, isHovered]);

  useEffect(() => {
    Object.values(TooltipEvents).forEach(event =>
      window.addEventListener(event, updateElements),
    );
    return () => {
      Object.values(TooltipEvents).forEach(event =>
        window.removeEventListener(event, updateElements),
      );
    };
  }, [updateElements]);

  useEffect(() => {
    if (isVisible) {
      updateElements();
      onShow?.();
    }
  }, [isVisible, updateElements, onShow]);

  return (
    <>
      {cloneElement(Children.only(children) as ReactElement, elementProps)}
      {isVisible && !disabled && (
        <Portal target="body">
          <div
            className={classNames(
              styles.tooltip,
              styles[tooltipPosition?.arrowStyles],
              tooltipClassName,
            )}
            style={tooltipPosition?.positionStyles}
            ref={tooltipRef}
            role="tooltip"
            onMouseEnter={onMouseHover}
            onMouseLeave={onMouseHover}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};
