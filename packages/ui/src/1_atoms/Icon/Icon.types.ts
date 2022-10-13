import type { IconProp } from '@fortawesome/fontawesome-svg-core';

import { ReactNode } from 'react';

import * as IconNames from './iconNames';

export type IconName = typeof IconNames[keyof typeof IconNames];

export enum ViewBoxSize {
  DEFAULT = '0 0 24 24',
}

export type IconType = IconName | ReactNode | IconProp;

export const STANDARD = 16;
export const INLINE = '1em';
export const SM = 'sm';
