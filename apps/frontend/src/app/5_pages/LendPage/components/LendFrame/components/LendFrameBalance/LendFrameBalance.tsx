import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { LendingPool } from '../../../../../../../utils/LendingPool';
import { LendingPoolDictionary } from '../../../../../../../utils/LendingPoolDictionary';
import { decimalic } from '../../../../../../../utils/math';
import { useGetBalanceOf } from '../../../../hooks/useGetBalanceOf';
import { useGetCheckpointPrice } from '../../../../hooks/useGetCheckpointPrice';
import { useGetProfitOf } from '../../../../hooks/useGetProfitOf';
import { useGetTokenPrice } from '../../../../hooks/useGetTokenPrice';
import { useGetAssetBalanceOf } from './hooks/useGetAssetBalanceOf';

type LendFrameBalanceProps = {
  pool: LendingPool;
};

export const LendFrameBalance: FC<LendFrameBalanceProps> = ({ pool }) => {
  const { account } = useAccount();
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const { assetBalance } = useGetAssetBalanceOf(asset);
  const { balanceTotal } = useGetBalanceOf(asset);
  const { useLM } = LendingPoolDictionary.get(asset);
  const { profit } = useGetProfitOf(asset);
  const { checkpointPrice } = useGetCheckpointPrice(asset);
  const { tokenPrice } = useGetTokenPrice(asset);
  const totalProfit = useMemo(
    () =>
      decimalic(tokenPrice)
        .sub(checkpointPrice)
        .mul(balanceTotal)
        .div(Math.pow(10, TOKEN_RENDER_PRECISION))
        .add(profit),
    [profit, balanceTotal, checkpointPrice, tokenPrice],
  );

  const poolProfit = useMemo(
    () => (useLM ? totalProfit : profit),
    [useLM, totalProfit, profit],
  );

  const renderBalance = useMemo(() => {
    const balance = decimalic(assetBalance).sub(poolProfit);
    return balance.gt(0) ? balance.toString() : '0';
  }, [assetBalance, poolProfit]);

  if (!account) {
    return <div>{t(translations.common.na)}</div>;
  }

  return (
    <div className="prevent-row-click">
      <AmountRenderer
        dataAttribute="lend-frame-balance"
        className="prevent-row-click"
        value={renderBalance}
        suffix={getTokenDisplayName(asset)}
        precision={TOKEN_RENDER_PRECISION}
      />
    </div>
  );
};
