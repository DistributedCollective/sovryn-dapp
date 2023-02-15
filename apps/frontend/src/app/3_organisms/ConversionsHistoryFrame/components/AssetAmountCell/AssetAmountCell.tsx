import React from 'react';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BTC_TRUNCATE_COUNT } from '../../../ZeroLocForm/constants';

type AssetAmountCellProps = {
  amount: string;
  asset: string;
};

export const AssetAmountCell: React.FC<AssetAmountCellProps> = ({
  amount,
  asset,
}) => (
  <AmountRenderer
    value={amount}
    suffix={asset}
    precision={BTC_TRUNCATE_COUNT}
    dataAttribute="conversion-sent-tooltip"
  />
);
