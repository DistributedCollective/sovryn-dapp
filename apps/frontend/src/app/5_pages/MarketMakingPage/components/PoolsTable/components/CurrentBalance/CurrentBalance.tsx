import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { renderTokenSymbol } from '../../../../../../../utils/helpers';
import { useGetUserInfo } from '../../../../hooks/useGetUserInfo';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

type CurrentBalanceProps = {
  pool: AmmLiquidityPool;
  showLabel?: boolean;
};

export const CurrentBalance: FC<CurrentBalanceProps> = ({
  pool,
  showLabel = false,
}) => {
  const { account } = useAccount();
  const { balanceA, balanceB } = useGetUserInfo(pool);

  const hasBalance = useMemo(
    () => balanceA.gt(0) && balanceB.gt(0),
    [balanceA, balanceB],
  );

  const renderAmount = useMemo(
    () => (
      <div className="flex-col flex font-medium">
        <AmountRenderer
          value={balanceA}
          suffix={renderTokenSymbol(pool.assetA)}
          precision={TOKEN_RENDER_PRECISION}
        />
        <AmountRenderer
          value={balanceB}
          suffix={BITCOIN}
          precision={BTC_RENDER_PRECISION}
        />
      </div>
    ),
    [balanceA, balanceB, pool.assetA],
  );

  return account ? (
    <>
      {showLabel && hasBalance && (
        <div className="flex justify-between items-start bg-gray-70 rounded-b -mt-2 px-3 pt-2 pb-3 text-xs">
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
