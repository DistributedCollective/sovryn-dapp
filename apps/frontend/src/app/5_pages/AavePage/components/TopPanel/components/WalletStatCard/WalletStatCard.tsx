import React, { FC } from 'react';

import { HelperButton } from '@sovryn/ui';

type WalletStatCardProps = {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  helperContent?: string;
};

export const WalletStatCard: FC<WalletStatCardProps> = ({
  label,
  value,
  prefix,
  suffix,
  helperContent,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex space-x-2 items-center">
        <span className="text-xs text-gray-30">{label}</span>
        {helperContent && <HelperButton content={helperContent} />}
      </div>
      <div className="text-2xl text-white">
        {prefix && <span>{prefix}</span>}
        <span>{value}</span>
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
};
