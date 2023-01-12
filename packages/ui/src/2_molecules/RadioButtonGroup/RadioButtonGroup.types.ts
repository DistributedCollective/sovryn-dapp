import { ChangeEventHandler, ReactNode } from 'react';

export type RadioButtonOption = {
  label: string;
  value: string;
  name?: string;
  labelInfo?: ReactNode;
  disabled?: boolean;
  contentToShow?: ReactNode;
  helper?: ReactNode;
};

export type RadioButtonGroupProps = {
  label?: string;
  options: RadioButtonOption[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  dataAttribute?: string;
  defaultChecked?: number;
  className?: string;
};
