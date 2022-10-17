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
      case TooltipPlacement.TOP:
        return canOpenAbove
          ? TooltipPlacement.TOP
          : getPosition(TooltipPlacement.TOP_START);
      case TooltipPlacement.TOP_START:
        return canOpenAbove && canOpenLeft
          ? TooltipPlacement.TOP_START
          : getPosition(TooltipPlacement.TOP_END);
      case TooltipPlacement.TOP_END:
        return canOpenAbove && canOpenRight
          ? TooltipPlacement.TOP_END
          : getPosition(TooltipPlacement.BOTTOM);
      case TooltipPlacement.BOTTOM:
        return canOpenUnder
          ? TooltipPlacement.BOTTOM
          : getPosition(TooltipPlacement.BOTTOM_START);
      case TooltipPlacement.BOTTOM_START:
        return canOpenUnder && canOpenLeft
          ? TooltipPlacement.BOTTOM_START
          : getPosition(TooltipPlacement.BOTTOM_END);
      case TooltipPlacement.BOTTOM_END:
        return canOpenUnder && canOpenRight
          ? TooltipPlacement.BOTTOM_END
          : getPosition(TooltipPlacement.LEFT);
      case TooltipPlacement.LEFT:
        return canOpenLeft && canOpenVerticalCenter
          ? TooltipPlacement.LEFT
          : getPosition(TooltipPlacement.LEFT_START);
      case TooltipPlacement.LEFT_START:
        return canOpenLeft && canOpenVerticalStart
          ? TooltipPlacement.LEFT_START
          : getPosition(TooltipPlacement.LEFT_END);
      case TooltipPlacement.LEFT_END:
        return canOpenLeft && canOpenVerticalEnd
          ? TooltipPlacement.LEFT_END
          : getPosition(TooltipPlacement.TOP);
      case TooltipPlacement.RIGHT:
        return canOpenRight && canOpenVerticalCenter
          ? TooltipPlacement.RIGHT
          : getPosition(TooltipPlacement.RIGHT_START);
      case TooltipPlacement.RIGHT_START:
        return canOpenRight && canOpenVerticalStart
          ? TooltipPlacement.RIGHT_START
          : getPosition(TooltipPlacement.RIGHT_END);
      case TooltipPlacement.RIGHT_END:
        return canOpenRight && canOpenVerticalEnd
          ? TooltipPlacement.RIGHT_END
          : getPosition(TooltipPlacement.TOP);
      default:
        return placement;
    }
  };

  const position = {
    top: {
      top: `${scrollOffset - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${left + width / 2 - tooltipWidth / 2}px`,
    },
    topStart: {
      top: `${scrollOffset - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${left - tooltipWidth + width / 2 + OFFSET_DEFAULT}px`,
    },
    topEnd: {
      top: `${scrollOffset - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${right - width / 2 - OFFSET_DEFAULT}px`,
    },
    bottom: {
      top: `${bottom + OFFSET_DEFAULT}px`,
      left: `${left + width / 2 - tooltipWidth / 2}px`,
    },
    bottomStart: {
      top: `${bottom + OFFSET_DEFAULT}px`,
      left: `${left - tooltipWidth + width / 2 + OFFSET_DEFAULT}px`,
    },
    bottomEnd: {
      top: `${bottom + OFFSET_DEFAULT}px`,
      left: `${right - width / 2 - OFFSET_DEFAULT}px`,
    },
    left: {
      left: `${left - tooltipWidth - OFFSET_DEFAULT}px`,
      top: `${scrollOffset - tooltipHeight / 2 + height / 2}px`,
    },
    leftStart: {
      left: `${left - tooltipWidth - OFFSET_DEFAULT}px`,
      top: `${scrollOffset - tooltipHeight + height / 2 + OFFSET_DEFAULT}px`,
    },
    leftEnd: {
      left: `${left - tooltipWidth - OFFSET_DEFAULT}px`,
      top: `${bottom - height / 2 - OFFSET_DEFAULT}px`,
    },
    right: {
      left: `${left + width + OFFSET_DEFAULT}px`,
      top: `${scrollOffset - tooltipHeight / 2 + height / 2}px`,
    },
    rightStart: {
      left: `${left + width + OFFSET_DEFAULT}px`,
      top: `${scrollOffset - tooltipHeight + height / 2 + OFFSET_DEFAULT}px`,
    },
    rightEnd: {
      left: `${left + width + OFFSET_DEFAULT}px`,
      top: `${bottom - height / 2 - OFFSET_DEFAULT}px`,
    },
  };

  return {
    positionStyles: position[getPosition(placement)],
    arrowStyles: getPosition(placement),
  };
};
