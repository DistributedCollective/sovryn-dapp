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
import { Nullable } from '../../types';
import styles from './Tooltip.module.css';
import { TooltipCoords, TooltipPlacement } from './Tooltip.types';
import { CLOSE_DELAY, getTooltipPosition } from './Tooltip.utils';

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  tooltipClassName?: string;
  dataActionId?: string;
  placement?: TooltipPlacement;
  onShow?: () => void;
  onHide?: () => void;
};

export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  className,
  tooltipClassName,
  dataActionId,
  placement = TooltipPlacement.TOP,
  onShow,
  onHide,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement>(null);
  const [coords, setCoords] = useState<Nullable<TooltipCoords>>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;

  const getCoords = useCallback(() => {
    const element = elementRef.current?.getBoundingClientRect();
    const tooltip = tooltipRef.current?.getBoundingClientRect();
    const scrollOffset = window.scrollY;
    if (element && tooltip) {
      const { top, left, right, bottom, width, height } = element;
      const { width: tooltipWidth, height: tooltipHeight } = tooltip;
      return {
        top: top + scrollOffset,
        left: left,
        right: right,
        bottom: bottom,
        tooltipWidth: tooltipWidth,
        tooltipHeight: tooltipHeight,
        elementWidth: width,
        elementHeight: height,
      };
    }
    return null;
  }, []);

  const tooltipPosition = useMemo(() => {
    if (!coords) {
      return;
    }
    return getTooltipPosition(coords, placement);
  }, [coords, placement]);

  const onMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  const onMouseLeave = useCallback(() => {
    setShouldHide(true);
  }, [setShouldHide]);

  const onMouseHover = useCallback(() => {
    setIsHovered(prevValue => !prevValue);
  }, [setIsHovered]);

  useEffect(() => {
    if (shouldHide && !isHoveredRef.current) {
      const timeout = setTimeout(() => {
        onHide?.();
        setShouldHide(false);
        setIsVisible(false);
      }, CLOSE_DELAY);

      return () => clearTimeout(timeout);
    }
  }, [
    shouldHide,
    isHoveredRef.current,
    onHide,
    setShouldHide,
    setIsVisible,
    CLOSE_DELAY,
  ]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const coords = getCoords();
    setCoords(coords);
    onShow?.();
  }, [isVisible, getCoords, placement, setCoords]);

  return (
    <>
      {cloneElement(Children.only(children) as ReactElement, {
        'data-action-id': dataActionId,
        className: className,
        ref: elementRef,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        onFocus: onMouseEnter,
        onBlur: onMouseLeave,
      })}
      {isVisible && (
        <Portal target="body">
          <div
            className={classNames(
              styles.tooltip,
              `${styles[placement]}`,
              tooltipClassName,
            )}
            style={tooltipPosition}
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
