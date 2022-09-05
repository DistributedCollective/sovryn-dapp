import { Align, AlignVertical } from '../../types/tailwind';

export enum OverlayBackground {
  transparent = 'transparent',
  light25 = 'light25',
  light75 = 'light75',
  dark25 = 'dark25',
  dark75 = 'dark75',
}

export const OverlayBackgroundClassName: {
  [key in OverlayBackground]: string;
} = {
  [OverlayBackground.transparent]: 'bg-transparent',
  [OverlayBackground.light25]: 'bg-gray-9 bg-opacity-25',
  [OverlayBackground.light75]: 'bg-gray-9 bg-opacity-75',
  [OverlayBackground.dark25]: 'bg-gray-1 bg-opacity-25',
  [OverlayBackground.dark75]: 'bg-gray-1 bg-opacity-75',
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
