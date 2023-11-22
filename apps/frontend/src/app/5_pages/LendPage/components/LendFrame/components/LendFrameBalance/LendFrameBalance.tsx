import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { LendingPool } from '../../../../../../../utils/LendingPool';
import { decimalic } from '../../../../../../../utils/math';
import { useGetAssetBalanceOf } from './hooks/useGetAssetBalanceOf';

type LendFrameBalanceProps = {
  pool: LendingPool;
};

export const LendFrameBalance: FC<LendFrameBalanceProps> = ({ pool }) => {
  const { account } = useAccount();
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const { assetBalance } = useGetAssetBalanceOf(asset);

  const renderBalance = useMemo(() => {
    const balance = decimalic(assetBalance);
    return balance.gt(0) ? balance.toString() : '0';
  }, [assetBalance]);

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
