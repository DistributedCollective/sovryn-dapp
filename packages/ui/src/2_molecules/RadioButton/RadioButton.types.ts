import { InputHTMLAttributes, ReactNode } from 'react';

export interface IRadioButtonProps
  extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  className?: string;
  dataLayoutId?: string;
  labelInfo?: ReactNode;
}
