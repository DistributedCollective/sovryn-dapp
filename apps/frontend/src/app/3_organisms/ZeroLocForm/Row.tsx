import React, { FC, ReactNode } from 'react';

import { HelperButton, SimpleTableRow, TooltipTrigger } from '@sovryn/ui';

export type RowProps = {
  label: string;
  tooltip?: ReactNode;
  tooltipTrigger?: TooltipTrigger;
  tooltipDataAttribute?: string;
  value: ReactNode;
  valueClassName?: string;
};

export const Row: FC<RowProps> = ({
  label,
  tooltip,
  tooltipTrigger,
  tooltipDataAttribute,
  ...props
}) => (
  <SimpleTableRow
    className="flex flex-row justify-between gap-4 items-center"
    label={
      <div className="flex flex-row gap-2 justify-start items-center whitespace-nowrap">
        {label}
        {tooltip && (
          <HelperButton
            content={tooltip}
            trigger={tooltipTrigger}
            dataAttribute={tooltipDataAttribute}
          />
        )}
      </div>
    }
    {...props}
  />
);
