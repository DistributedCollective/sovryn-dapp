import React from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '../Icon';

export type DynamicValueProps<T> = {
  initialValue: T;
  value: T;
  loading?: boolean;
  renderer?: (value: T) => React.ReactNode;
};

export const DynamicValue = <T extends number>({
  initialValue,
  value,
  loading,
  renderer,
}: DynamicValueProps<T>) => {
  return (
    <div
      className={classNames('transition-colors duration-300', {
        'text-gray-30': initialValue === value,
        'text-primary-10': initialValue !== value,
        'text-gray-10': loading,
      })}
    >
      {loading ? (
        <Icon icon={IconNames.PENDING} size={13} />
      ) : renderer ? (
        <>{renderer(value)}</>
      ) : (
        <>{value}</>
      )}
    </div>
  );
};
