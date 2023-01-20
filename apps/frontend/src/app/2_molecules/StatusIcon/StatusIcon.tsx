import React from 'react';

import classNames from 'classnames';

import confirmIcon from '../../../assets/images/confirm-tx.svg';
import pendingIcon from '../../../assets/images/pending-tx.svg';

type StatusIconProps = {
  isConfirmed: boolean;
  isInline?: boolean;
};

export const StatusIcon: React.FC<StatusIconProps> = ({
  isConfirmed,
  isInline = false,
}) => (
  <div className="flex justify-center">
    <img
      src={isConfirmed ? confirmIcon : pendingIcon}
      className={classNames(isInline ? 'h-auto flex-initial' : 'h-20 w-20', {
        'animate-spin': !isConfirmed,
      })}
      alt="Status"
    />
  </div>
);
