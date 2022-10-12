import { Align, AlignVertical } from '../../types/tailwind';
import styles from './Overlay.module.css';

export enum OverlayBackground {
  transparent = 'transparent',
  default = 'default',
}

export const OverlayBackgroundClassName: {
  [key in OverlayBackground]: string;
} = {
  [OverlayBackground.transparent]: styles.bgTransparent,
  [OverlayBackground.default]: styles.bgDefault,
};

export const AlignClassName: { [key in Align]: string } = {
  [Align.left]: styles.alignLeft,
  [Align.center]: styles.alignCenter,
  [Align.right]: styles.veritcalRight,
};

export const AlignVerticalClassName: { [key in AlignVertical]: string } = {
  [AlignVertical.top]: styles.veritcalTop,
  [AlignVertical.center]: styles.verticalCenter,
  [AlignVertical.bottom]: styles.verticalBottom,
};
