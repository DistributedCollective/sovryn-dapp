import React from 'react';

import classNames from 'classnames';

import { applyDataAttr, StatusType } from '@sovryn/ui';

import confirmIcon from '../../../assets/images/confirm-tx.svg';
import failedIcon from '../../../assets/images/failed-tx.svg';
import pendingIcon from '../../../assets/images/pending-tx.svg';

const getStatusImage = (status: StatusType) => {
  switch (status) {
    case StatusType.error:
      return failedIcon;
    case StatusType.success:
      return confirmIcon;
    default:
      return pendingIcon;
  }
};

const getDataAttributeSuffix = (status: StatusType) => {
  switch (status) {
    case StatusType.error:
      return 'failed';
    case StatusType.success:
      return 'confirmed';
    default:
      return 'pending';
  }
};

type StatusIconProps = {
  status: StatusType;
  isInline?: boolean;
  dataAttribute?: string;
};

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  isInline = false,
  dataAttribute,
}) => (
  <div className="flex justify-center">
    <img
      src={getStatusImage(status)}
      className={classNames(isInline ? 'h-auto flex-initial' : 'h-20 w-20', {
        'animate-spin': status === StatusType.pending,
      })}
      {...applyDataAttr(`${dataAttribute}-${getDataAttributeSuffix(status)}`)}
      alt="Status"
    />
  </div>
);
