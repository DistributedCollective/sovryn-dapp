import React, { FC } from 'react';

import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../../../utils/math';
import { useGetPositionsTotalBalance } from '../../../../hooks/useGetPositionsTotalBalance';

type AmbientPoolTotalBalanceProps = {
  pool: Pool;
};

export const AmbientPoolTotalBalance: FC<AmbientPoolTotalBalanceProps> = ({
  pool,
}) => {
  const { account } = useAccount();
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
          pool.base.decimals,
        )}
        suffix={pool.base.symbol}
      />
      <AmountRenderer
        value={decimalic(result?.positionLiqQuote || '0').toUnits(
          pool.quote.decimals,
        )}
        suffix={pool.quote.symbol}
      />
    </div>
  );
};
