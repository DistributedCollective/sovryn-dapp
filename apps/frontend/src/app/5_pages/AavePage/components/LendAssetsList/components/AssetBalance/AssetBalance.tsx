import React, { FC } from 'react';
import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useAccount } from '../../../../../../../hooks/useAccount';

export type AssetBalanceRendererProps = {
  asset: string;
};

export const AssetBalanceRenderer: FC<AssetBalanceRendererProps> = ({
  asset,
}) => {
  const balance = useAssetBalance(asset);
  const { account } = useAccount();

  return account ? (
    <AmountRenderer
      value={balance.balance}
      precision={balance.decimalPrecision}
    />
  ) : (
    <span>-</span>
  );
};
