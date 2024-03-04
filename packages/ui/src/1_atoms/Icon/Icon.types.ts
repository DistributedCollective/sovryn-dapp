import type { IconProp } from '@fortawesome/fontawesome-svg-core';

import { ReactNode } from 'react';

export enum IconNames {
  ARROW_UP = 'arrow-up',
  ARROW_BACK = 'arrow-back',
  ARROW_DOWN_WIDE = 'arrow-down-wide',
  ARROW_DOWN = 'arrow-down',
  ARROW_FORWARD = 'arrow-forward',
  DEPOSIT = 'deposit',
  DISCONNECT = 'disconnect',
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
  DOUBLE_LEFT = 'double-left',
  ARROW_LEFT = 'arrow-left',
  ARROW_RIGHT = 'arrow-right',
  WARNING = 'warning',
  WITHDRAW = 'withdraw',
  X_MARK = 'x-mark',
  COPY = 'copy',
  EXIT = 'exit',
  DISCORD_LOGO = 'discord-logo',
  TWITTER_LOGO = 'twitter-logo',
  TELEGRAM_LOGO = 'telegram-logo',
  GITHUB_LOGO = 'github-logo',
  CHECK = 'check',
  EARN_3 = 'earn-3',
  LEND = 'lend',
  SWAP = 'swap',
  TRADING = 'trading',
  FUNNEL = 'funnel',
  LINK = 'link',
  HAMBURGER_MENU = 'hamburger-menu',
  MAIL = 'mail',
  CALENDAR = 'calendar',
  TOP_RIGHT_ARROW = 'topRightArrow',
}

export type IconName = typeof IconNames[keyof typeof IconNames];

export enum ViewBoxSize {
  DEFAULT = '0 0 24 24',
}

export type IconType = IconName | ReactNode | IconProp;

export const STANDARD = 16;
export const INLINE = '1em';
export const SM = 'sm';
