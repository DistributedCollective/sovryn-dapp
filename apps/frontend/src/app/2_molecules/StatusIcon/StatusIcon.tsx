import React from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '@sovryn/ui';

import confirmIcon from '../../../assets/images/confirm-tx.svg';
import pendingIcon from '../../../assets/images/pending-tx.svg';

type StatusIconProps = {
  isConfirmed: boolean;
  isInline?: boolean;
  dataAttribute?: string;
};

export const StatusIcon: React.FC<StatusIconProps> = ({
  isConfirmed,
  isInline = false,
  dataAttribute,
}) => (
  <div className="flex justify-center">
    <img
      src={isConfirmed ? confirmIcon : pendingIcon}
      className={classNames(isInline ? 'h-auto flex-initial' : 'h-20 w-20', {
        'animate-spin': !isConfirmed,
      })}
      {...applyDataAttr(
        `${dataAttribute}-${isConfirmed ? 'confirmed' : 'pending'}`,
      )}
      alt="Status"
    />
  </div>
);
