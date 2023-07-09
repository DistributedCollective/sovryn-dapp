import React, { FC } from 'react';

import { t } from 'i18next';

import { Heading, HeadingType, HelperButton, TooltipTrigger } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { useTotalStakingRewards } from './hooks/useTotalStakingRewards';

export const TotalRewardsEarned: FC = () => {
  const { totalStakingRewards } = useTotalStakingRewards();

  return (
    <div className="bg-gray-80 md:bg-gray-90 py-7 px-6 rounded">
      <Heading
        className="flex items-center text-xs font-normal mb-1 gap-1"
        type={HeadingType.h1}
      >
        {t(translations.rewardPage.totalRewardsEarned.title)}
        <HelperButton
          content={t(translations.rewardPage.totalRewardsEarned.helper)}
          trigger={TooltipTrigger.click}
        />
      </Heading>

      <div className="bg-gray-80 md:py-4 md:px-3.5 rounded text-gray-10 w-fit">
        <span className="text-3xl">
          <AmountRenderer
            value={totalStakingRewards}
            suffix={BITCOIN}
            precision={BTC_RENDER_PRECISION}
            dataAttribute="total-available-rewards"
            isAnimated
          />
        </span>
      </div>
    </div>
  );
};
