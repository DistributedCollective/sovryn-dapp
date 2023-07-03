import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { PersonalStakingStatistics } from './components/PersonalStakingStatistics/PersonalStakingStatistics';
import { StakesFrame } from './components/StakesFrame/StakesFrame';
import { StakingStatistics } from './components/StakingStatistics/StakingStatistics';
import { VestingStakesFrame } from './components/VestingStakesFrame/VestingStakesFrame';

const StakePage: FC = () => {
  const { account } = useAccount();
  return (
    <>
      <Helmet>
        <title>{t(translations.earnPage.meta.title)}</title>
      </Helmet>

      <div className="px-0 container max-w-[70rem] md:mb-2 mt-4 mb-7">
        <StakingStatistics />

        {account && <PersonalStakingStatistics />}

        <div className="w-full bg-gray-80 md:bg-gray-90 py-7 px-6 rounded mb-6">
          <StakesFrame />
          <VestingStakesFrame />
        </div>
      </div>
    </>
  );
};
export default StakePage;
