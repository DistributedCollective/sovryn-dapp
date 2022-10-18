import { TooltipElements, TooltipPlacement } from './Tooltip.types';

const OFFSET_DEFAULT = 24;

export const CLOSE_DELAY = 300;

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
    if (
      !canOpenAbove &&
      !canOpenUnder &&
      !canOpenLeft &&
      !canOpenRight &&
      !canOpenVerticalCenter &&
      !canOpenVerticalStart &&
      !canOpenVerticalEnd
    ) {
      return placement;
    }
    switch (position) {
      case TooltipPlacement.top:
        return canOpenAbove
          ? TooltipPlacement.top
          : getPosition(TooltipPlacement.topStart);
      case TooltipPlacement.topStart:
        return canOpenAbove && canOpenLeft
          ? TooltipPlacement.topStart
          : getPosition(TooltipPlacement.topEnd);
      case TooltipPlacement.topEnd:
        return canOpenAbove && canOpenRight
          ? TooltipPlacement.topEnd
          : getPosition(TooltipPlacement.bottom);
      case TooltipPlacement.bottom:
        return canOpenUnder
          ? TooltipPlacement.bottom
          : getPosition(TooltipPlacement.bottomStart);
      case TooltipPlacement.bottomStart:
        return canOpenUnder && canOpenLeft
          ? TooltipPlacement.bottomStart
          : getPosition(TooltipPlacement.bottomEnd);
      case TooltipPlacement.bottomEnd:
        return canOpenUnder && canOpenRight
          ? TooltipPlacement.bottomEnd
          : getPosition(TooltipPlacement.left);
      case TooltipPlacement.left:
        return canOpenLeft && canOpenVerticalCenter
          ? TooltipPlacement.left
          : getPosition(TooltipPlacement.leftStart);
      case TooltipPlacement.leftStart:
        return canOpenLeft && canOpenVerticalStart
          ? TooltipPlacement.leftStart
          : getPosition(TooltipPlacement.leftEnd);
      case TooltipPlacement.leftEnd:
        return canOpenLeft && canOpenVerticalEnd
          ? TooltipPlacement.leftEnd
          : getPosition(TooltipPlacement.top);
      case TooltipPlacement.right:
        return canOpenRight && canOpenVerticalCenter
          ? TooltipPlacement.right
          : getPosition(TooltipPlacement.rightStart);
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
      left: `${left + width / 2 - tooltipWidth / 2}px`,
    },
    'top-start': {
      top: `${scrollOffset - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${left - tooltipWidth + width / 2 + OFFSET_DEFAULT}px`,
    },
    'top-end': {
      top: `${scrollOffset - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${right - width / 2 - OFFSET_DEFAULT}px`,
    },
    bottom: {
      top: `${bottom + OFFSET_DEFAULT}px`,
      left: `${left + width / 2 - tooltipWidth / 2}px`,
    },
    'bottom-start': {
      top: `${bottom + OFFSET_DEFAULT}px`,
      left: `${left - tooltipWidth + width / 2 + OFFSET_DEFAULT}px`,
    },
    'bottom-end': {
      top: `${bottom + OFFSET_DEFAULT}px`,
      left: `${right - width / 2 - OFFSET_DEFAULT}px`,
    },
    left: {
      left: `${left - tooltipWidth - OFFSET_DEFAULT}px`,
      top: `${scrollOffset - tooltipHeight / 2 + height / 2}px`,
    },
    'left-start': {
      left: `${left - tooltipWidth - OFFSET_DEFAULT}px`,
      top: `${scrollOffset - tooltipHeight + height / 2 + OFFSET_DEFAULT}px`,
    },
    'left-end': {
      left: `${left - tooltipWidth - OFFSET_DEFAULT}px`,
      top: `${bottom - height / 2 - OFFSET_DEFAULT}px`,
    },
    right: {
      left: `${left + width + OFFSET_DEFAULT}px`,
      top: `${scrollOffset - tooltipHeight / 2 + height / 2}px`,
    },
    'right-start': {
      left: `${left + width + OFFSET_DEFAULT}px`,
      top: `${scrollOffset - tooltipHeight + height / 2 + OFFSET_DEFAULT}px`,
    },
    'right-end': {
      left: `${left + width + OFFSET_DEFAULT}px`,
      top: `${bottom - height / 2 - OFFSET_DEFAULT}px`,
    },
  };

  return {
    positionStyles: position[getPosition(placement)],
    arrowStyles: getPosition(placement),
  };
};
