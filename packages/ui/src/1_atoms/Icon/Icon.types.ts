import type { IconProp } from '@fortawesome/fontawesome-svg-core';

import { ReactNode } from 'react';

export enum IconNames {
  ARROW_DOWN_WIDE = 'arrow-down-wide',
  ARROW_DOWN = 'arrow-down',
  ARROW_RIGHT = 'arrow-right',
  ARROW_BACK = 'arrow-back',
  ARROW_FORWARD = 'arrow-forward',
  ARROW_BACK = 'arrow-back',
  DEPOSIT = 'deposit',
  EDIT = 'edit',
  FAILED_TX = 'failed-tx',
  INFO = 'info',
  MEATBALLS_MENU = 'meatballs-menu',
  NEW_TAB = 'new-tab',
  NOTIFICATIONS_ACTIVE = 'notifications-active',
  NOTIFICATIONS = 'notifications',
  PENDING = 'pending',
  SEARCH = 'search',
  SETTINGS = 'settings',
  SUCCESS_ICON = 'success-icon',
  SWAP_ARROW = 'swap-arrow',
  TRANSFER = 'transfer',
  TREND_ARROW_UP = 'trend-arrow-up',
  TREND_ARROW_DOWN = 'trend-arrow-down',
  WARNING = 'warning',
  WITHDRAW = 'withdraw',
  X_MARK = 'x-mark',
  COPY = 'copy',
  EXIT = 'exit',
}

export type IconName = typeof IconNames[keyof typeof IconNames];

export enum ViewBoxSize {
  DEFAULT = '0 0 24 24',
}

export type IconType = IconName | ReactNode | IconProp;

export const STANDARD = 16;
export const INLINE = '1em';
export const SM = 'sm';
