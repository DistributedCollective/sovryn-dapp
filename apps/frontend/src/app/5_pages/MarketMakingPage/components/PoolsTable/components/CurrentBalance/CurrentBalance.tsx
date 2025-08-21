import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

type CurrentBalanceProps = {
  pool: AmmLiquidityPool | null;
  poolAmbient?: Pool;
  balanceA: Decimal;
  balanceB: Decimal;
  showLabel?: boolean;
};

export const CurrentBalance: FC<CurrentBalanceProps> = ({
  pool,
  poolAmbient,
  balanceA,
  balanceB,
  showLabel = false,
}) => {
  const { account } = useAccount();

  const hasBalance = useMemo(
    () => balanceA.gt(0) || balanceB.gt(0),
    [balanceA, balanceB],
  );

  const renderAmount = useMemo(
    () => (
      <div className="flex-col flex font-medium gap-0.5">
        <AmountRenderer
          value={balanceA}
          suffix={
            poolAmbient
              ? poolAmbient.base.symbol
              : getTokenDisplayName(pool?.assetA!)
          }
          precision={TOKEN_RENDER_PRECISION}
        />
        <AmountRenderer
          value={balanceB}
          suffix={
            poolAmbient
              ? poolAmbient.quote.symbol
              : getTokenDisplayName(BITCOIN)
          }
          precision={
            poolAmbient ? TOKEN_RENDER_PRECISION : BTC_RENDER_PRECISION
          }
        />
      </div>
    ),
    [balanceA, balanceB, pool, poolAmbient],
  );

  return account ? (
    <>
      {showLabel && hasBalance && (
        <div className="flex justify-between items-start bg-gray-70 rounded-b -mt-2 mb-1 px-3 pt-2 pb-3 text-xs">
          <span className="text-xs font-medium">
            {t(translations.marketMakingPage.poolsTable.balance)}
          </span>
          {renderAmount}
        </div>
      )}

      {!showLabel && renderAmount}
    </>
  ) : (
    <>{!showLabel && t(translations.common.na)}</>
  );
};
