export enum TooltipPlacement {
  BOTTOM_END = 'bottom-end',
  BOTTOM_START = 'bottom-start',
  BOTTOM = 'bottom',
  TOP_END = 'top-end',
  TOP_START = 'top-start',
  TOP = 'top',
  LEFT = 'left',
  LEFT_START = 'left-start',
  LEFT_END = 'left-end',
  RIGHT = 'right',
  RIGHT_START = 'right-start',
  RIGHT_END = 'right-end',
}

export type TooltipCoords = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  elementWidth: number;
  elementHeight: number;
  tooltipWidth: number;
  tooltipHeight: number;
};
