import { TooltipCoords, TooltipPlacement } from './Tooltip.types';

const OFFSET_DEFAULT = 24;

export const CLOSE_DELAY = 300;

export const getTooltipPosition = (
  coords: TooltipCoords,
  placement: TooltipPlacement,
) => {
  const {
    top,
    left,
    right,
    bottom,
    elementWidth,
    elementHeight,
    tooltipWidth,
    tooltipHeight,
  } = coords;
  const tooltipPosition = {
    top: {
      top: `${top - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${left + elementWidth / 2 - tooltipWidth / 2}px`,
    },
    'top-start': {
      top: `${top - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${left - tooltipWidth + elementWidth / 2 + OFFSET_DEFAULT}px`,
    },
    'top-end': {
      top: `${top - tooltipHeight - OFFSET_DEFAULT}px`,
      left: `${right - elementWidth / 2 - OFFSET_DEFAULT}px`,
    },
    bottom: {
      top: `${bottom + OFFSET_DEFAULT}px`,
      left: `${left + elementWidth / 2 - tooltipWidth / 2}px`,
    },
    'bottom-start': {
      top: `${bottom + OFFSET_DEFAULT}px`,
      left: `${left - tooltipWidth + elementWidth / 2 + OFFSET_DEFAULT}px`,
    },
    'bottom-end': {
      top: `${bottom + OFFSET_DEFAULT}px`,
      left: `${right - elementWidth / 2 - OFFSET_DEFAULT}px`,
    },
    left: {
      left: `${left - tooltipWidth - OFFSET_DEFAULT}px`,
      top: `${top - tooltipHeight / 2 + elementHeight / 2}px`,
    },
    'left-start': {
      left: `${left - tooltipWidth - OFFSET_DEFAULT}px`,
      top: `${top - tooltipHeight + elementHeight / 2 + OFFSET_DEFAULT}px`,
    },
    'left-end': {
      left: `${left - tooltipWidth - OFFSET_DEFAULT}px`,
      top: `${bottom - elementHeight / 2 - OFFSET_DEFAULT}px`,
    },
    right: {
      left: `${left + elementWidth + OFFSET_DEFAULT}px`,
      top: `${top - tooltipHeight / 2 + elementHeight / 2}px`,
    },
    'right-start': {
      left: `${left + elementWidth + OFFSET_DEFAULT}px`,
      top: `${top - tooltipHeight + elementHeight / 2 + OFFSET_DEFAULT}px`,
    },
    'right-end': {
      left: `${left + elementWidth + OFFSET_DEFAULT}px`,
      top: `${bottom - elementHeight / 2 - OFFSET_DEFAULT}px`,
    },
  };

  return tooltipPosition[placement];
};
