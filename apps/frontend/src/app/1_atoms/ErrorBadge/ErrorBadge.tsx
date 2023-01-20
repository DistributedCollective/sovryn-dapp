import React, { FC } from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '@sovryn/ui';

export enum ErrorLevel {
  Warning = 'Warning',
  Critical = 'Critical',
}

export type ErrorData = {
  level: ErrorLevel;
  message: string;
  weight?: number;
};

export const ErrorBadge: FC<ErrorData> = ({ level, message }) => {
  return (
    <div
      className={classNames(
        'flex flex-row justify-center items-center gap-3 p-2 my-2',
        getClassnames(level),
      )}
    >
      <div>{getIcon(level)}</div>
      <div className="font-medium text-xs">{message}</div>
    </div>
  );
};

const getIcon = (level: ErrorLevel) => {
  switch (level) {
    case ErrorLevel.Warning:
      return <Icon icon={IconNames.WARNING} size={18} />;
    case ErrorLevel.Critical:
      return <Icon icon={IconNames.FAILED_TX} size={18} />;
    default:
      return null;
  }
};

const getClassnames = (level: ErrorLevel) => {
  switch (level) {
    case ErrorLevel.Warning:
      return 'bg-primary-75 bg-opacity-[0.15] text-primary-75 border border-primary-75 rounded';
    case ErrorLevel.Critical:
      return 'bg-error-light bg-opacity-[0.15] text-error-light border border-error-light rounded';
    default:
      return '';
  }
};
