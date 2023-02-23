import React from 'react';

import { Icon, IconNames } from '../Icon';
import { ErrorLevel } from './ErrorBadge.types';

export const getIcon = (level: ErrorLevel) => {
  switch (level) {
    case ErrorLevel.Warning:
      return <Icon icon={IconNames.WARNING} size={18} />;
    case ErrorLevel.Critical:
      return <Icon icon={IconNames.FAILED_TX} size={18} />;
    default:
      return null;
  }
};
