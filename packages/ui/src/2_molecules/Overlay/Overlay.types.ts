import { Align, AlignVertical } from '../../types/tailwind';

export enum OverlayBackground {
  transparent = 'transparent',
  default = 'default',
}

export const OverlayBackgroundClassName: {
  [key in OverlayBackground]: string;
} = {
  [OverlayBackground.transparent]: 'bg-transparent',
  [OverlayBackground.default]: 'bg-gray-70 bg-opacity-[0.69]',
};

export const AlignClassName: { [key in Align]: string } = {
  [Align.left]: 'justify-start',
  [Align.center]: 'justify-center',
  [Align.right]: 'justify-end',
};

export const AlignVerticalClassName: { [key in AlignVertical]: string } = {
  [AlignVertical.top]: 'items-start',
  [AlignVertical.center]: 'items-center',
  [AlignVertical.bottom]: 'items-end',
};
