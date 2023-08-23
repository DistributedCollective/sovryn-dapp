import React, { FC, useMemo } from 'react';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { LendingPool } from '../../../../../../../utils/LendingPool';
import { decimalic } from '../../../../../../../utils/math';
import { useGetMarketLiquidity } from '../../../../../LendPage/components/LendFrame/components/LendFrameDetails/hooks/useGetMarketLiquidity';
import { useGetTotalAssetBorrow } from '../../../../../LendPage/components/LendFrame/components/LendFrameDetails/hooks/useGetTotalAssetBorrow';

type AvailableSupplyProps = {
  pool: LendingPool;
};

export const AvailableSupply: FC<AvailableSupplyProps> = ({ pool }) => {
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const { borrowedAmount } = useGetTotalAssetBorrow(asset);
  const { availableAmount } = useGetMarketLiquidity(asset);

  const totalLiquidity = useMemo(
    () => decimalic(availableAmount).add(borrowedAmount),
    [availableAmount, borrowedAmount],
  );

  const availableToTotalRatio = useMemo(
    () =>
      decimalic(availableAmount)
        .div(totalLiquidity)
        .mul(100)
        .toNumber()
        .toFixed(0),
    [availableAmount, totalLiquidity],
  );

  return (
    <>
      <div>
        <AmountRenderer
          value={availableAmount}
          suffix={getTokenDisplayName(asset)}
          precision={TOKEN_RENDER_PRECISION}
          dataAttribute="lend-details-borrowed-amount"
        />
      </div>

      <div className="hidden w-full lg:flex mt-1 bg-gray-50 items-center h-1 relative rounded">
        <div
          className="h-1 bg-primary-30 rounded"
          style={{ width: `${availableToTotalRatio}%` }}
        ></div>
      </div>
    </>
  );
};
