import type { FunctionComponent } from 'react';

import styles from './Dialog.module.css';

export interface IDialogFunctionComponent<T = {}> extends FunctionComponent<T> {
  index: number;
}

export enum DialogSize {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xl2 = 'xl2',
  xl3 = 'xl3',
  xl4 = 'xl4',
  xl5 = 'xl5',
  xl6 = 'xl6',
  xl7 = 'xl7',
  full = 'full',
}

export const dialogSizeMap: Record<DialogSize, string> = {
  [DialogSize.xs]: styles.dialogXs,
  [DialogSize.sm]: styles.dialogSm,
  [DialogSize.md]: styles.dialogMd,
  [DialogSize.lg]: styles.dialogLg,
  [DialogSize.xl]: styles.dialogXl,
  [DialogSize.xl2]: styles.dialog2Xl,
  [DialogSize.xl3]: styles.dialog3Xl,
  [DialogSize.xl4]: styles.dialog4Xl,
  [DialogSize.xl5]: styles.dialog5Xl,
  [DialogSize.xl6]: styles.dialog6Xl,
  [DialogSize.xl7]: styles.dialog7Xl,
  [DialogSize.full]: styles.dialogFull,
};
