import React, { FC } from 'react';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';

export type AssetBalanceRendererProps = {
  asset: string;
};

export const AssetBalanceRenderer: FC<AssetBalanceRendererProps> = ({
  asset,
}) => {
  const { account } = useAccount();
  const balance = useAssetBalance(asset, BOB_CHAIN_ID);

  return account ? (
    <AmountRenderer
      value={balance.balance}
      precision={balance.decimalPrecision}
    />
  ) : (
    <span>-</span>
  );
};
