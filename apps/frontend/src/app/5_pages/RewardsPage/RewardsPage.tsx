import React, { FC, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { SelectOption, Select, Tabs, Heading, HeadingType } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import styles from './RewardsPage.module.css';
import { StabilityPool } from './components/StabilityPool';
import { Staking } from './components/Staking';
import { TotalRewardsEarned } from './components/TotalRewardsEarned';
import { Vesting } from './components/Vesting';

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

      <div className="lg:w-3/5 text-gray-10 mt-9 lg:mt-10">
        <TotalRewardsEarned />

        <div className="bg-gray-80 md:bg-gray-90 py-7 px-6 rounded mb-12">
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
