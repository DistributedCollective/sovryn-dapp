import React, { FC, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import {
  SelectOption,
  Select,
  Tabs,
  Heading,
  HeadingType,
  ErrorBadge,
  ErrorLevel,
} from '@sovryn/ui';

import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import styles from './RewardsPage.module.css';
import { StabilityPool } from './components/StabilityPool/StabilityPool';
import { Staking } from './components/Staking/Staking';
import { TotalRewardsEarned } from './components/TotalRewardsEarned/TotalRewardsEarned';
import { Vesting } from './components/Vesting/Vesting';

const ACTIVE_CLASSNAME = 'border-t-primary-30';

const RewardsPage: FC = () => {
  const { checkMaintenance, States } = useMaintenance();
  const rewardsLocked = checkMaintenance(States.REWARDS_FULL);
  const stabilityLocked = checkMaintenance(States.ZERO_STABILITY_CLAIM);
  const stakingLocked = checkMaintenance(States.REWARDS_STAKING);
  const [index, setIndex] = useState(0);

  const items = useMemo(() => {
    return [
      {
        label: t(translations.rewardPage.tabs.titles.stabilityPool),
        content: (
          <div className="px-0 py-4 lg:p-4">
            <StabilityPool />
          </div>
        ),
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'stabilityPoolRewards',
        disabled: stabilityLocked,
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
        disabled: stakingLocked,
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
        disabled: false,
      },
    ];
  }, [stabilityLocked, stakingLocked]);

  const mobileSelectOptions: SelectOption[] = useMemo(
    () =>
      items.map((item, index) => ({
        value: String(index),
        label: item.label,
      })),
    [items],
  );

  useEffect(() => {
    if (items[index].disabled) {
      setIndex(items.findIndex(item => !item.disabled));
    }
  }, [items, index]);

  return (
    <>
      <Helmet>
        <title>{t(translations.rewardPage.meta.title)}</title>
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-2 lg:gap-20 w-full lg:w-5/6 text-gray-10 mt-6 lg:mt-12">
        <div className="w-full lg:w-80">
          <TotalRewardsEarned />
        </div>

        <div className="flex-1 lg:bg-gray-90 py-7 lg:px-6 rounded mb-12">
          <Heading
            className="font-normal mb-4 lg:mb-8 text-base lg:text-2xl"
            type={HeadingType.h1}
          >
            {t(translations.rewardPage.tabs.title)}
          </Heading>

          {!rewardsLocked ? (
            <>
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
                  items={items}
                  onChange={setIndex}
                  index={index}
                  className="w-full"
                />
              </div>
              <div className={styles.mobile}>{items[index].content}</div>
            </>
          ) : (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.featureDisabled)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RewardsPage;
