export enum TooltipPlacement {
  BOTTOM_END = 'bottomEnd',
  BOTTOM_START = 'bottomStart',
  BOTTOM = 'bottom',
  TOP_END = 'topEnd',
  TOP_START = 'topStart',
  TOP = 'top',
  LEFT = 'left',
  LEFT_START = 'leftStart',
  LEFT_END = 'leftEnd',
  RIGHT = 'right',
  RIGHT_START = 'rightStart',
  RIGHT_END = 'rightEnd',
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
