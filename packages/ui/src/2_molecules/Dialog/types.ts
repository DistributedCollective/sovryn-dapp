import type { FunctionComponent } from "react";

export interface IDialogFunctionComponent<T = {}> extends FunctionComponent<T> {
  index: number;
}

export enum DialogSize {
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
  xl2 = "xl2",
  xl3 = "xl3",
  xl4 = "xl4",
  xl5 = "xl5",
  xl6 = "xl6",
  xl7 = "xl7",
  full = "full",
}

export const dialogSizeMap: Record<DialogSize, string> = {
  [DialogSize.xs]: "w-full sm:max-w-xs",
  [DialogSize.sm]: "w-full sm:max-w-sm",
  [DialogSize.md]: "w-full sm:max-w-md",
  [DialogSize.lg]: "max-w-lg",
  [DialogSize.xl]: "max-w-xl",
  [DialogSize.xl2]: "max-w-2xl",
  [DialogSize.xl3]: "max-w-3xl",
  [DialogSize.xl4]: "max-w-4xl",
  [DialogSize.xl5]: "max-w-5xl",
  [DialogSize.xl6]: "max-w-6xl",
  [DialogSize.xl7]: "max-w-7xl",
  [DialogSize.full]: "w-full",
};
