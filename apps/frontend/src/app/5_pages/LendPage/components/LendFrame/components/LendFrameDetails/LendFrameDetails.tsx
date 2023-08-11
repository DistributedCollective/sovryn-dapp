import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { translations } from '../../../../../../../locales/i18n';
import { LendFrameProps } from '../../LendFrame.types';
import { LendFrameAction } from '../LendFrameAction/LendFrameAction';
import { LendFrameChart } from '../LendFrameChart/LendFrameChart';
import { ExpandedContent } from './components/ExpandedContent/ExpandedContent';
import { useGetMarketLiquidity } from './hooks/useGetMarketLiquidity';
import { useGetTotalAssetBorrow } from './hooks/useGetTotalAssetBorrow';

export const LendFrameDetails: FC<LendFrameProps> = ({ pool }) => {
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const { borrowedAmount } = useGetTotalAssetBorrow(asset);
  const { availableAmount } = useGetMarketLiquidity(asset);

  const balanceContent = useMemo(
    () => (
      <>
        <ExpandedContent
          label={t(translations.lendPage.table.available)}
          value={
            <AmountRenderer
              value={availableAmount}
              suffix={getTokenDisplayName(asset)}
              precision={TOKEN_RENDER_PRECISION}
              dataAttribute="lend-details-available-amount"
            />
          }
        />
        <ExpandedContent
          label={t(translations.lendPage.table.borrowed)}
          value={
            <AmountRenderer
              value={borrowedAmount}
              suffix={getTokenDisplayName(asset)}
              precision={TOKEN_RENDER_PRECISION}
              dataAttribute="lend-details-borrowed-amount"
            />
          }
        />
      </>
    ),
    [asset, availableAmount, borrowedAmount],
  );

  return (
    <div className="flex-col-reverse lg:flex-row flex items-stretch m-0 md:p-4 gap-4 rounded-b md:gap-20 outline outline-1 outline-gray-70">
      <div className="flex hidden lg:block justify-evenly">
        {balanceContent}
      </div>
      <div className="flex-1 flex flex-col">
        {pool && <LendFrameChart pool={pool} />}
      </div>
      <div className="flex lg:hidden justify-evenly">{balanceContent}</div>
      <div className="lg:hidden">
        <LendFrameAction pool={pool} />
      </div>
    </div>
  );
};
