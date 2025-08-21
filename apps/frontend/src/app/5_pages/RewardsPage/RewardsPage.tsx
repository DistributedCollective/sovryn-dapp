import React, { FC, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  SelectOption,
  Select,
  Tabs,
  Heading,
  HeadingType,
  ErrorBadge,
  ErrorLevel,
  ButtonStyle,
  ButtonSize,
  Button,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { WIKI_LINKS } from '../../../constants/links';
import { useRequiredChain } from '../../../hooks/chain/useRequiredChain';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import { generateD1Link } from '../../../utils/helpers';
import styles from './RewardsPage.module.css';
import { Banner } from './components/Banner/Banner';
import { LiquidityMining } from './components/LiquidityMining/LiquidityMining';
import { MaxStakingAPR } from './components/MaxStakingAPR/MaxStakingAPR';
import { StabilityPool } from './components/StabilityPool/StabilityPool';
import { Staking } from './components/Staking/Staking';
import { TotalRewardsEarned } from './components/TotalRewardsEarned/TotalRewardsEarned';
import { Vesting } from './components/Vesting/Vesting';

const ACTIVE_CLASSNAME = 'border-t-primary-30';

const RewardsPage: FC = () => {
  const [params] = useSearchParams({ tab: '' });
  const tab = params.get('tab');
  const navigate = useNavigate();
  const { checkMaintenance, States } = useMaintenance();
  const rewardsLocked = checkMaintenance(States.REWARDS_FULL);
  const stabilityLocked = checkMaintenance(States.ZERO_STABILITY_CLAIM);
  const stakingLocked = checkMaintenance(States.REWARDS_STAKING);
  const { invalidChain } = useRequiredChain();
  const [index, setIndex] = useState(0);

  const items = useMemo(() => {
    return [
      {
        label: t(translations.rewardPage.tabs.titles.liquidityMining),
        content: (
          <div className="px-0 py-4 lg:p-4">
            <LiquidityMining />
          </div>
        ),
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'liquidityMiningRewards',
      },
      {
        label: t(translations.rewardPage.tabs.titles.stabilityPool),
        content: (
          <div className="px-0 py-4 lg:p-4">
            <StabilityPool />
          </div>
        ),
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'stabilityPoolRewards',
        disabled: stabilityLocked || invalidChain,
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
        disabled: stakingLocked || invalidChain,
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
        disabled: invalidChain,
      },
    ];
  }, [invalidChain, stabilityLocked, stakingLocked]);

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

  useEffect(() => {
    switch (tab) {
      case 'liquidityMining':
        setIndex(0);
        break;
      case 'stabilityPool':
        setIndex(1);
        break;
      case 'staking':
        setIndex(2);
        break;
      case 'vesting':
        setIndex(3);
        break;
      default:
        break;
    }
  }, [tab]);

  return (
    <>
      <Helmet>
        <title>{t(translations.rewardPage.meta.title)}</title>
      </Helmet>
      <div className="container flex-col">
        <NetworkBanner requiredChainId={RSK_CHAIN_ID} childClassName="flex-col">
          <div className="px-0 md:mx-9 mx-0 md:mb-2 mb-7 flex flex-col lg:flex-row gap-2 lg:gap-5 2xl:gap-28 text-gray-10 mt-6 lg:mt-12">
            <div className="flex flex-col gap-4 w-full lg:w-72 2xl:w-[26.25rem]">
              <TotalRewardsEarned />

              <div className="flex flex-row md:flex-col mt-4 gap-4 overflow-auto scrollbars-hidden">
                <Banner
                  localStorageKey="stabilityPoolBanner"
                  title={t(translations.rewardPage.stabilityPoolBanner.title)}
                  description={t(
                    translations.rewardPage.stabilityPoolBanner.description,
                  )}
                  className="min-w-[90%]"
                  action={
                    <Button
                      text={t(
                        translations.rewardPage.stabilityPoolBanner.action,
                      )}
                      onClick={() => navigate('/earn/stability-pool')}
                      style={ButtonStyle.secondary}
                      size={ButtonSize.large}
                      className="text-gray-10 whitespace-nowrap"
                    />
                  }
                  learnMore={WIKI_LINKS.STABILITY_POOL_REWARDS}
                />

                <Banner
                  localStorageKey="stakingBanner"
                  title={t(translations.rewardPage.stakingBanner.title)}
                  className="min-w-[90%]"
                  description={
                    <Trans
                      i18nKey={t(
                        translations.rewardPage.stakingBanner.description,
                      )}
                      components={[<MaxStakingAPR />]}
                    />
                  }
                  action={
                    <Button
                      text={t(translations.rewardPage.stakingBanner.action)}
                      onClick={() => navigate('/earn/staking')}
                      style={ButtonStyle.secondary}
                      size={ButtonSize.large}
                      className="text-gray-10 whitespace-nowrap"
                    />
                  }
                />

                <Banner
                  localStorageKey="yieldFarmingBanner"
                  title={t(translations.rewardPage.yieldFarmingBanner.title)}
                  className="min-w-[90%]"
                  description={t(
                    translations.rewardPage.yieldFarmingBanner.description,
                  )}
                  action={
                    <Button
                      text={t(
                        translations.rewardPage.yieldFarmingBanner.action,
                      )}
                      href={generateD1Link('/yield-farm')}
                      hrefExternal
                      style={ButtonStyle.secondary}
                      size={ButtonSize.large}
                      className="text-gray-10 whitespace-nowrap"
                    />
                  }
                  learnMore={WIKI_LINKS.YIELD_FARMING}
                />
              </div>
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
        </NetworkBanner>
      </div>
    </>
  );
};

export default RewardsPage;
