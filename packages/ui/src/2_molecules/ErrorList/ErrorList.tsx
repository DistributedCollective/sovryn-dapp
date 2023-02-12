import React, { FC, useMemo } from 'react';

import { ErrorBadge, ErrorData } from '../../1_atoms';

export type ErrorListProps = {
  errors: ErrorData[];
  showSingleError?: boolean;
  className?: string;
};

export const ErrorList: FC<ErrorListProps> = ({
  errors,
  showSingleError,
  className,
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
    <div className={className}>
      {items.map((error, index) => (
        <ErrorBadge key={index} {...error} />
      ))}
    </div>
  );
};
