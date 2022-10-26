import { ChangeEventHandler, ReactNode } from 'react';

export type RadioButtonOption = {
  label: string;
  name?: string;
  labelInfo?: ReactNode;
  disabled?: boolean;
};

export type RadioButtonGroupProps = {
  label: string;
  options: RadioButtonOption[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
};
