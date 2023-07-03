import React, { FC } from 'react';

import { t } from 'i18next';

import { Heading, HeadingType } from '@sovryn/ui';

import { AmountRenderer } from '../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../constants/currencies';
import { translations } from '../../../../locales/i18n';

export const TotalRewardsEarned: FC = () => (
  <div className="bg-gray-80 md:bg-gray-90 py-7 px-6 rounded mb-12">
    <Heading className="font-normal mb-4" type={HeadingType.h1}>
      {t(translations.rewardPage.totalRewardsEarned.title)}
    </Heading>

    <div className="bg-gray-80 md:py-4 md:px-3.5 rounded text-gray-10 w-fit">
      <span>
        <AmountRenderer
          value={0.1890174212314}
          suffix={BITCOIN}
          precision={BTC_RENDER_PRECISION}
          dataAttribute="total-available-rewards"
          isAnimated
        />
      </span>
    </div>
  </div>
);
