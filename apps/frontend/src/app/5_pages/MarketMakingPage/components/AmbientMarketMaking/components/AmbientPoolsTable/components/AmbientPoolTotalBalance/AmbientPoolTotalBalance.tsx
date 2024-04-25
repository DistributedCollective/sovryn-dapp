import React, { FC } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useTokenDetailsByAsset } from '../../../../../../../../../hooks/useTokenDetailsByAsset';
import { translations } from '../../../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../../../utils/math';
import { useGetPositionsTotalBalance } from '../../../../hooks/useGetPositionsTotalBalance';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPoolTotalBalanceProps = {
  pool: AmbientLiquidityPool;
};

export const AmbientPoolTotalBalance: FC<AmbientPoolTotalBalanceProps> = ({
  pool,
}) => {
  const { account } = useAccount();
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);
  const result = useGetPositionsTotalBalance(pool);

  if (!account) {
    return <div>{t(translations.common.na)}</div>;
  }
  if (!result) {
    return null;
  }

  return (
    <div className="inline-flex flex-col">
      <AmountRenderer
        value={decimalic(result?.positionLiqBase || '0').toUnits(
          baseToken?.decimals,
        )}
        suffix={pool.base}
      />
      <AmountRenderer
        value={decimalic(result?.positionLiqQuote || '0').toUnits(
          quoteToken?.decimals,
        )}
        suffix={pool.quote}
      />
    </div>
  );
};
