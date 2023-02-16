export enum ErrorLevel {
  Warning = 'Warning',
  Critical = 'Critical',
}

export type ErrorData = {
  level: ErrorLevel;
  message: string;
  weight?: number;
  className?: string;
  dataAttribute?: string;
};
