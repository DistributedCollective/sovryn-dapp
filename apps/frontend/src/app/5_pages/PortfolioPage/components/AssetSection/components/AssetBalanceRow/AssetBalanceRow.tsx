import React, { FC, useEffect } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { getTokenLongName } from '../../../../../../../constants/tokens';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useDollarValue } from '../../../../../../../hooks/useDollarValue';
import { getRskChainId } from '../../../../../../../utils/chain';
import { getCurrencyPrecision } from '../../AssetSection.utils';
import styles from './AssetBalanceRow.module.css';

type AssetBalanceRowProps = {
  token: SupportedTokens;
  updateUSDValue: (usdValue: string) => void;
};

export const AssetBalanceRow: FC<AssetBalanceRowProps> = ({
  token,
  updateUSDValue,
}) => {
  const { weiBalance, balance } = useAssetBalance(token, getRskChainId());
  const { usdValue } = useDollarValue(token, weiBalance);

  useEffect(() => {
    updateUSDValue(usdValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usdValue]);

  return (
    <div className="px-4 lg:px-6 border border-gray-70 grid items-center grid-cols-3 bg-gray-70 md:bg-gray-80 rounded py-[0.8125rem] text-gray-10 font-medium">
      <Paragraph className="flex items-center">
        <AssetRenderer
          asset={token}
          showAssetLogo
          logoClassName={styles.assetLogo}
        />
        <span className="text-gray-40 hidden lg:block">
          {getTokenLongName(token)}
        </span>
      </Paragraph>
      <Paragraph className="text-right lg:text-left">
        <AmountRenderer
          value={balance}
          precision={getCurrencyPrecision(token)}
          isAnimated
        />
      </Paragraph>
      <Paragraph className="text-gray-30 text-right lg:text-left">
        $&nbsp;
        <AmountRenderer
          value={usdValue}
          prefix="$"
          precision={getCurrencyPrecision(token)}
          isAnimated
        />
      </Paragraph>
    </div>
  );
};
