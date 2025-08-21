export enum TooltipPlacement {
  bottomEnd = 'bottom-end',
  bottomStart = 'bottom-start',
  bottom = 'bottom',
  topEnd = 'top-end',
  topStart = 'top-start',
  top = 'top',
  left = 'left',
  leftStart = 'left-start',
  leftEnd = 'left-end',
  right = 'right',
  rightStart = 'right-start',
  rightEnd = 'right-end',
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

export enum TooltipStyle {
  primary = 'primary',
  secondary = 'secondary',
}
