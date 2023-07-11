import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { AddStakeRenderer } from './components/AddStakeRenderer/AddStakeRenderer';
import { PersonalStakingStatistics } from './components/PersonalStakingStatistics/PersonalStakingStatistics';
import { useGetPersonalStakingStatistics } from './components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import { StakesFrame } from './components/StakesFrame/StakesFrame';
import { StakingRewards } from './components/StakingRewards/StakingRewards';
import { StakingStatistics } from './components/StakingStatistics/StakingStatistics';
import { VestingStakesFrame } from './components/VestingStakesFrame/VestingStakesFrame';

const StakePage: FC = () => {
  const { account } = useAccount();
  const balance = useGetPersonalStakingStatistics();
  const hasStakedValue = useMemo(() => Number(balance) > 0, [balance]);

  return (
    <>
      <Helmet>
        <title>{t(translations.earnPage.meta.title)}</title>
      </Helmet>

      <div className="px-0 container md:mx-9 mx-0 md:mb-2 mt-4 mb-7">
        <div className="flex md:flex-row flex-col items-center mb-6 gap-4">
          <StakingStatistics />
          <StakingRewards />
        </div>

        {account && <PersonalStakingStatistics />}

        <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-6">
          <StakesFrame />
          <VestingStakesFrame />
        </div>

        <div className="md:hidden block w-full">
          <AddStakeRenderer hasStakedValue={hasStakedValue} />
        </div>
      </div>
    </>
  );
};
export default StakePage;
