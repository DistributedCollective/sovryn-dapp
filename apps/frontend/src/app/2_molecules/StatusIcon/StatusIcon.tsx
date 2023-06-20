import React from 'react';

import classNames from 'classnames';

import { applyDataAttr, Icon, IconNames, StatusType } from '@sovryn/ui';

const getStatusImage = (status: StatusType) => {
  switch (status) {
    case StatusType.error:
      return IconNames.FAILED_TX;
    case StatusType.success:
      return IconNames.SUCCESS_ICON;
    default:
      return IconNames.PENDING;
  }
};

export const getStatusClass = (status: StatusType) => {
  switch (status) {
    case StatusType.success:
      return 'text-success';
    case StatusType.error:
      return 'text-error-light';
    case StatusType.pending:
      return 'text-sov-white animate-spin';
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
    <Icon
      icon={getStatusImage(status)}
      className={classNames(
        getStatusClass(status),
        isInline ? 'h-auto flex-initial' : 'h-20 w-20',
      )}
      {...applyDataAttr(`${dataAttribute}-${getDataAttributeSuffix(status)}`)}
    />
  </div>
);
