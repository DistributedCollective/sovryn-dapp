import { TooltipElements, TooltipPlacement } from './Tooltip.types';

const OFFSET_DEFAULT = 24;

export const CLOSE_DELAY = 300;

const safeLeftPosition = (value: number) => Math.max(0, value);

export const getTooltipPosition = (
  elements: TooltipElements,
  placement: TooltipPlacement,
) => {
  const { top, left, right, bottom, width, height } = elements.target;
  const { width: tooltipWidth, height: tooltipHeight } = elements.tooltip;
  const scrollOffset = top + window.scrollY;

  const canOpenAbove = scrollOffset > tooltipHeight + OFFSET_DEFAULT;

  const canOpenUnder =
    (window.document.documentElement || window.document.body).clientHeight -
      bottom >
    tooltipHeight + OFFSET_DEFAULT;

  const canOpenLeft = left > tooltipWidth + OFFSET_DEFAULT;

  const canOpenRight =
    (window.document.documentElement || window.document.body).clientWidth -
      right >
    tooltipWidth + OFFSET_DEFAULT;

  const canOpenVerticalCenter =
    tooltipHeight / 2 + OFFSET_DEFAULT < scrollOffset &&
    tooltipHeight / 2 + OFFSET_DEFAULT <
      (window.document.documentElement || window.document.body).clientHeight -
        bottom;

  const canOpenVerticalStart =
    scrollOffset > tooltipHeight / 2 + OFFSET_DEFAULT;

  const canOpenVerticalEnd =
    (window.document.documentElement || window.document.body).clientHeight -
      bottom >
    tooltipWidth / 2 + OFFSET_DEFAULT;

  const getPosition = (position: TooltipPlacement) => {
    if (!canOpenAbove && !canOpenUnder && !canOpenLeft && !canOpenRight) {
      return placement || TooltipPlacement.top;
    }
    switch (position) {
      case TooltipPlacement.top:
        if (canOpenAbove) {
          if (canOpenLeft && canOpenRight) {
            return TooltipPlacement.top;
          } else if (canOpenLeft) {
            return TooltipPlacement.topStart;
          } else if (canOpenRight) {
            return TooltipPlacement.topEnd;
          } else {
            return TooltipPlacement.top;
          }
        } else {
          return getPosition(TooltipPlacement.bottom);
        }
      case TooltipPlacement.topStart:
        return canOpenAbove && canOpenLeft
          ? TooltipPlacement.topStart
          : getPosition(TooltipPlacement.topEnd);
      case TooltipPlacement.topEnd:
        return canOpenAbove && canOpenRight
          ? TooltipPlacement.topEnd
          : getPosition(TooltipPlacement.bottom);
      case TooltipPlacement.bottom:
        if (canOpenUnder) {
          if (canOpenLeft && canOpenRight) {
            return TooltipPlacement.bottom;
          } else if (canOpenLeft) {
            return TooltipPlacement.bottomStart;
          } else if (canOpenRight) {
            return TooltipPlacement.bottomEnd;
          } else {
            return TooltipPlacement.bottom;
          }
        } else {
          return getPosition(TooltipPlacement.left);
        }
      case TooltipPlacement.bottomStart:
        return canOpenUnder && canOpenLeft
          ? TooltipPlacement.bottomStart
          : getPosition(TooltipPlacement.bottomEnd);
      case TooltipPlacement.bottomEnd:
        return canOpenUnder && canOpenRight
          ? TooltipPlacement.bottomEnd
          : getPosition(TooltipPlacement.left);
      case TooltipPlacement.left:
        if (canOpenLeft) {
          if (canOpenVerticalCenter) {
            return TooltipPlacement.left;
          } else if (canOpenVerticalStart) {
            return TooltipPlacement.leftStart;
          } else if (canOpenVerticalEnd) {
            return TooltipPlacement.leftEnd;
          } else {
            return TooltipPlacement.left;
          }
        } else {
          return getPosition(TooltipPlacement.right);
        }
      case TooltipPlacement.leftStart:
        return canOpenLeft && canOpenVerticalStart
          ? TooltipPlacement.leftStart
          : getPosition(TooltipPlacement.leftEnd);
      case TooltipPlacement.leftEnd:
        return canOpenLeft && canOpenVerticalEnd
          ? TooltipPlacement.leftEnd
          : getPosition(TooltipPlacement.right);
      case TooltipPlacement.right:
        if (canOpenRight) {
          if (canOpenVerticalCenter) {
            return TooltipPlacement.right;
          } else if (canOpenVerticalStart) {
            return TooltipPlacement.rightStart;
          } else if (canOpenVerticalEnd) {
            return TooltipPlacement.rightEnd;
          } else {
            return TooltipPlacement.left;
          }
        } else {
          return getPosition(TooltipPlacement.top);
        }
      case TooltipPlacement.rightStart:
        return canOpenRight && canOpenVerticalStart
          ? TooltipPlacement.rightStart
          : getPosition(TooltipPlacement.rightEnd);
      case TooltipPlacement.rightEnd:
        return canOpenRight && canOpenVerticalEnd
          ? TooltipPlacement.rightEnd
          : getPosition(TooltipPlacement.top);
      default:
        return placement;
    }
  };

  const position = {
    top: {
      top: `${scrollOffset - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${safeLeftPosition(left + width / 2 - tooltipWidth / 2)}px`,
    },
    'top-start': {
      top: `${scrollOffset - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${safeLeftPosition(
        left - tooltipWidth + width / 2 + OFFSET_DEFAULT,
      )}px`,
    },
    'top-end': {
      top: `${scrollOffset - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${safeLeftPosition(right - width / 2 - OFFSET_DEFAULT)}px`,
    },
    bottom: {
      top: `${scrollOffset + height + OFFSET_DEFAULT}px`,
      left: `${safeLeftPosition(left + width / 2 - tooltipWidth / 2)}px`,
    },
    'bottom-start': {
      top: `${scrollOffset + height + OFFSET_DEFAULT}px`,
      left: `${safeLeftPosition(
        left - tooltipWidth + width / 2 + OFFSET_DEFAULT,
      )}px`,
    },
    'bottom-end': {
      top: `${scrollOffset + height + OFFSET_DEFAULT}px`,
      left: `${safeLeftPosition(right - width / 2 - OFFSET_DEFAULT)}px`,
    },
    left: {
      left: `${safeLeftPosition(left - tooltipWidth - OFFSET_DEFAULT)}px`,
      top: `${scrollOffset - tooltipHeight / 2 + height / 2}px`,
    },
    'left-start': {
      left: `${safeLeftPosition(left - tooltipWidth - OFFSET_DEFAULT)}px`,
      top: `${scrollOffset - tooltipHeight + height / 2 + OFFSET_DEFAULT}px`,
    },
    'left-end': {
      left: `${safeLeftPosition(left - tooltipWidth - OFFSET_DEFAULT)}px`,
      top: `${bottom - height / 2 - OFFSET_DEFAULT}px`,
    },
    right: {
      left: `${safeLeftPosition(left + width + OFFSET_DEFAULT)}px`,
      top: `${scrollOffset - tooltipHeight / 2 + height / 2}px`,
    },
    'right-start': {
      left: `${safeLeftPosition(left + width + OFFSET_DEFAULT)}px`,
      top: `${scrollOffset - tooltipHeight + height / 2 + OFFSET_DEFAULT}px`,
    },
    'right-end': {
      left: `${safeLeftPosition(left + width + OFFSET_DEFAULT)}px`,
      top: `${bottom - height / 2 - OFFSET_DEFAULT}px`,
    },
  };

  return {
    positionStyles: position[getPosition(placement)],
    arrowStyles: getPosition(placement),
  };
};
