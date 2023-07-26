import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../constants/currencies';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../utils/math';
import { useGetBalanceOf } from '../../../../hooks/useGetBalanceOf';
import { useGetCheckpointPrice } from '../../../../hooks/useGetCheckpointPrice';
import { useGetProfitOf } from '../../../../hooks/useGetProfitOf';
import { useGetTokenPrice } from '../../../../hooks/useGetTokenPrice';
import { LendingPoolDictionary } from '../../../../utils/LendingPoolDictionary';
import { LendFrameProps } from '../../LendFrame.types';

export const LendFrameInterestEarned: FC<LendFrameProps> = ({ pool }) => {
  const { account } = useAccount();
  const asset = useMemo(() => pool.getAsset(), [pool]);
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

  if (!account) {
    return <div>{t(translations.common.na)}</div>;
  }

  return (
    <div className="prevent-row-click">
      <AmountRenderer
        dataAttribute="lend-frame-interest-earned"
        className="prevent-row-click"
        value={poolProfit}
        suffix={asset}
        precision={TOKEN_RENDER_PRECISION}
      />
    </div>
  );
};
