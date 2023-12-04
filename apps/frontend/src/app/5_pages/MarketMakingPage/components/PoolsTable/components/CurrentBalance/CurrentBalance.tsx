import React, { FC } from 'react';

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
};

export const CurrentBalance: FC<CurrentBalanceProps> = ({ pool }) => {
  const { account } = useAccount();
  const { balanceA, balanceB } = useGetUserInfo(pool);
  return account ? (
    <>
      <div className="flex flex-col">
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
    </>
  ) : (
    <>{t(translations.common.na)}</>
  );
};
