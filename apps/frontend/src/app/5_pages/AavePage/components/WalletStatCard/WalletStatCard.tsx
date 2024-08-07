import React, { FC } from 'react';

import { Icon, Tooltip } from '@sovryn/ui';

type WalletStatCardProps = {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  tooltipContent?: string;
};

export const WalletStatCard: FC<WalletStatCardProps> = ({
  label,
  value,
  prefix,
  suffix,
  tooltipContent,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex space-x-2 items-center">
        <span className="text-xs text-gray-30">{label}</span>
        {tooltipContent && (
          <Tooltip content={<span>{tooltipContent}</span>}>
            <div>
              <Icon className="h-[10px] w-[10px] text-gray-30" icon="info" />
            </div>
          </Tooltip>
        )}
      </div>
      <div className="text-2xl text-white">
        {prefix && <span>{prefix}</span>}
        <span>{value}</span>
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
};
