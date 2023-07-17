import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import {
  Heading,
  HeadingType,
  HelperButton,
  TooltipTrigger,
  TooltipPlacement,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { useTotalStakingRewards } from './hooks/useTotalStakingRewards';

export const TotalRewardsEarned: FC = () => {
  const { totalStakingRewards } = useTotalStakingRewards();
  const { account } = useAccount();

  const renderTotalStakingRewards = useMemo(() => {
    if (account) {
      return (
        <AmountRenderer
          value={totalStakingRewards}
          suffix={BITCOIN}
          precision={BTC_RENDER_PRECISION}
          dataAttribute="total-available-rewards"
          isAnimated
        />
      );
    }
    return t(translations.common.na);
  }, [account, totalStakingRewards]);

  return (
    <div className="bg-gray-80 md:bg-gray-90 py-7 px-6 rounded">
      <Heading
        className="flex text-gray-30 items-center text-xs font-normal mb-1 gap-1"
        type={HeadingType.h1}
      >
        {t(translations.rewardPage.totalRewardsEarned.title)}
        <HelperButton
          content={t(translations.rewardPage.totalRewardsEarned.helper)}
          trigger={TooltipTrigger.click}
          placement={TooltipPlacement.bottom}
        />
      </Heading>

      <div className="w-full bg-gray-80 md:py-4 md:px-3.5 rounded text-gray-10">
        <span className="text-3xl">{renderTotalStakingRewards}</span>
      </div>
    </div>
  );
};
