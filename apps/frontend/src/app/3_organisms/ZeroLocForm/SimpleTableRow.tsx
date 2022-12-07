import React, { FC, ReactNode } from 'react';

import { Icon, IconNames, SimpleTableRow, Tooltip } from '@sovryn/ui';

export type RowProps = {
  label: string;
  tooltip?: string;
  value: ReactNode;
  valueClassName?: string;
};

export const Row: FC<RowProps> = ({ label, tooltip, ...props }) => (
  <SimpleTableRow
    className="flex flex-row justify-between gap-4 items-center"
    label={
      <div className="flex flex-row gap-2 justify-start items-center whitespace-nowrap">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <Icon icon={IconNames.INFO} size={12} />
          </Tooltip>
        )}
      </div>
    }
    {...props}
  />
);
