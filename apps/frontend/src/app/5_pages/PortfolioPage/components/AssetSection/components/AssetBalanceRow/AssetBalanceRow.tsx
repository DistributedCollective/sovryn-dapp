import React, { FC, useEffect } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { getTokenLongName } from '../../../../../../../constants/tokens';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useDollarValue } from '../../../../../../../hooks/useDollarValue';
import { getRskChainId } from '../../../../../../../utils/chain';
import { getCurrencyPrecision } from '../../../ProtocolSection/ProtocolSection.utils';
import styles from './AssetBalanceRow.module.css';

type AssetBalanceRowProps = {
  token: SupportedTokens;
  updateUsdValue: (usdValue: string) => void;
};

export const AssetBalanceRow: FC<AssetBalanceRowProps> = ({
  token,
  updateUsdValue,
}) => {
  const { account } = useAccount();
  const { weiBalance, balance } = useAssetBalance(token, getRskChainId());
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
        />
        <span className="text-gray-40 hidden lg:block">
          {getTokenLongName(token)}
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
        $&nbsp;
        <AmountRenderer
          value={account ? usdValue : '0'}
          prefix="$"
          precision={getCurrencyPrecision(token)}
          isAnimated
        />
      </Paragraph>
    </div>
  );
};
