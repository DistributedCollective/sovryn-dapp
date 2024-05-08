import React, { FC, useEffect } from 'react';

import { Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { USD } from '../../../../../../../constants/currencies';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../../../hooks/useChainStore';
import { useDollarValue } from '../../../../../../../hooks/useDollarValue';
import { findAsset } from '../../../../../../../utils/asset';
import { getCurrencyPrecision } from '../../../ProtocolSection/ProtocolSection.utils';
import styles from './AssetBalanceRow.module.css';

type AssetBalanceRowProps = {
  token: string;
  updateUsdValue: (usdValue: string) => void;
};

export const AssetBalanceRow: FC<AssetBalanceRowProps> = ({
  token,
  updateUsdValue,
}) => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const { weiBalance, balance } = useAssetBalance(token, chainId);
  const { usdValue } = useDollarValue(token, weiBalance);

  useEffect(() => {
    updateUsdValue(usdValue);
  }, [usdValue, updateUsdValue]);

  return (
    <div className="px-4 lg:px-6 border border-gray-70 grid items-center grid-cols-3 bg-gray-70 md:bg-gray-80 rounded py-[0.8125rem] text-gray-10 font-medium min-h-14">
      <div className="flex items-center font-medium text-base sm:text-xs">
        <AssetRenderer
          asset={token}
          showAssetLogo
          logoClassName={styles.assetLogo}
          assetClassName={styles.asset}
          chainId={chainId}
        />
        <span className="text-gray-40 hidden lg:block">
          {findAsset(token, chainId)?.name}
        </span>
      </div>
      <Paragraph className="text-right lg:text-left truncate">
        <AmountRenderer
          value={account ? balance : '0'}
          precision={getCurrencyPrecision(token)}
          isAnimated
        />
      </Paragraph>
      <Paragraph className="text-gray-30 text-right lg:text-left truncate">
        <AmountRenderer
          value={account ? usdValue : '0'}
          suffix={USD}
          precision={getCurrencyPrecision(token)}
          isAnimated
          asIf
        />
      </Paragraph>
    </div>
  );
};
