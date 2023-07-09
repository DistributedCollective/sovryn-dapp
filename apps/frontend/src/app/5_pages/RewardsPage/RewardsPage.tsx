import React, { FC, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { SelectOption, Select, Tabs, Heading, HeadingType } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import styles from './RewardsPage.module.css';
import { StabilityPool } from './components/StabilityPool/StabilityPool';
import { Staking } from './components/Staking/Staking';
import { TotalRewardsEarned } from './components/TotalRewardsEarned/TotalRewardsEarned';
import { Vesting } from './components/Vesting/Vesting';

const ACTIVE_CLASSNAME = 'border-t-primary-30';

const tabItems = [
  {
    label: t(translations.rewardPage.tabs.titles.stabilityPool),
    content: (
      <div className="px-0 py-4 lg:p-4">
        <StabilityPool />
      </div>
    ),
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'stabilityPoolRewards',
  },
  {
    label: t(translations.rewardPage.tabs.titles.staking),
    content: (
      <div className="px-0 py-4 lg:p-4">
        <Staking />
      </div>
    ),
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'stakingRewards',
  },
  {
    label: t(translations.rewardPage.tabs.titles.vesting),
    content: (
      <div className="px-0 py-4 lg:p-4">
        <Vesting />
      </div>
    ),
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'vestingRewards',
  },
];

const mobileSelectOptions: SelectOption[] = tabItems.map((item, index) => ({
  value: String(index),
  label: item.label,
}));

const RewardsPage: FC = () => {
  const [index, setIndex] = useState(0);

  return (
    <>
      <Helmet>
        <title>{t(translations.rewardPage.meta.title)}</title>
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-20 w-full lg:w-5/6 text-gray-10 mt-6 lg:mt-12">
        <div className="w-full lg:w-80">
          <TotalRewardsEarned />
        </div>

        <div className="flex-1 bg-gray-80 md:bg-gray-90 py-7 px-6 rounded mb-12">
          <Heading className="font-normal mb-8" type={HeadingType.h1}>
            {t(translations.rewardPage.tabs.title)}
          </Heading>

          <div className={styles.mobileSelect}>
            <Select
              className="min-w-[12rem]"
              options={mobileSelectOptions}
              value={String(index)}
              onChange={value => setIndex(Number(value))}
            />
          </div>
          <div className={styles.desktop}>
            <Tabs
              items={tabItems}
              onChange={setIndex}
              index={index}
              className="w-full"
            />
          </div>
          <div className={styles.mobile}>{tabItems[index].content}</div>
        </div>
      </div>
    </>
  );
};

export default RewardsPage;
