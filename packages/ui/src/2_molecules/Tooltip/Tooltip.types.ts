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

export enum TooltipTrigger {
  hover = 'hover',
  focus = 'focus',
  click = 'click',
}

export type TooltipElements = {
  target: DOMRect;
  tooltip: DOMRect;
};

export enum TooltipEvents {
  resize = 'resize',
  scroll = 'scroll',
  wheel = 'wheel',
}
