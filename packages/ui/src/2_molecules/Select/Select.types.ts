import { ReactNode } from 'react';

export type SelectOption<T = string> = {
  value: T;
  label: ReactNode;
};
