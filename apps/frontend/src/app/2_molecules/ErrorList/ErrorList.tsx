import React, { FC, useMemo } from 'react';

import { ErrorBadge, ErrorData } from '../../1_atoms/ErrorBadge/ErrorBadge';

export type ErrorListProps = {
  errors: ErrorData[];
  showSingleError?: boolean;
};

export const ErrorList: FC<ErrorListProps> = ({ errors, showSingleError }) => {
  const items = useMemo(
    () => errors.sort((a, b) => (a.weight || 1) - (b.weight || 1)),
    [errors],
  );

  if (!items.length) {
    return null;
  }

  if (showSingleError) {
    return <ErrorBadge {...items[0]} />;
  }

  return (
    <div className="w-full my-6">
      {items.map((error, index) => (
        <ErrorBadge key={index} {...error} />
      ))}
    </div>
  );
};
