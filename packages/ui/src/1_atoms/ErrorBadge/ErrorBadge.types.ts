import { ReactNode } from 'react';

export enum ErrorLevel {
  Warning = 'Warning',
  Critical = 'Critical',
}

export type ErrorBadgeProps = {
  level: ErrorLevel;
  message: ReactNode;
  weight?: number;
  className?: string;
  dataAttribute?: string;
};
