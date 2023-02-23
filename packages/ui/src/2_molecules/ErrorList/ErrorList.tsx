import React, { FC, useMemo } from 'react';

import { ErrorBadge, ErrorBadgeProps } from '../../1_atoms';
import { applyDataAttr } from '../../utils';

export type ErrorListProps = {
  errors: ErrorBadgeProps[];
  showSingleError?: boolean;
  className?: string;
  dataAttribute?: string;
};

export const ErrorList: FC<ErrorListProps> = ({
  errors,
  showSingleError,
  className,
  dataAttribute,
}) => {
  const items = useMemo(
    () => errors.sort((a, b) => (b.weight || 1) - (a.weight || 1)),
    [errors],
  );

  if (!items.length) {
    return null;
  }

  if (showSingleError) {
    return <ErrorBadge {...items[0]} />;
  }

  return (
    <div {...applyDataAttr(dataAttribute)} className={className}>
      {items.map((error, index) => (
        <ErrorBadge key={index} {...error} />
      ))}
    </div>
  );
};
