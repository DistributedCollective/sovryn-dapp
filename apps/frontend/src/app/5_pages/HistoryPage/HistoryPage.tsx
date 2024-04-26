import { ApolloProvider } from '@apollo/client';

import React, { FC, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, ITabItem, Select, SelectOption, Tabs } from '@sovryn/ui';

import { Chains } from '../../../config/chains';

import { BorrowHistory } from '../../3_organisms/BorrowHistory/BorrowHistory';
import { ConvertHistory } from '../../3_organisms/ConversionsHistoryFrame/ConvertHistory';
import { EarnHistory } from '../../3_organisms/EarnHistoryFrame/EarnHistory';
import { FundingHistoryFrame } from '../../3_organisms/FundingHistoryFrame/FundingHistoryFrame';
import { RewardHistory } from '../../3_organisms/RewardHistory/RewardHistory';
import { StakingHistoryFrame } from '../../3_organisms/StakingHistoryFrame';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { translations } from '../../../locales/i18n';
import { myntClient, zeroClient } from '../../../utils/clients';
import styles from './HistoryPage.module.css';
import { UsesChain } from './HistoryPage.types';
import { isHistoryItemOnChain } from './HistoryPage.utils';

const ACTIVE_CLASSNAME = 'border-t-primary-30';
const borrowHistory = (
  <div className="px-0 py-4 lg:p-4">
    <ApolloProvider client={zeroClient}>
      <BorrowHistory />
    </ApolloProvider>
  </div>
);

const earn = (
  <div className="px-0 py-4 lg:p-4">
    <EarnHistory />
  </div>
);

const stakingHistory = (
  <div className="px-0 py-4 lg:p-4">
    <StakingHistoryFrame />
  </div>
);

const rewardHistory = (
  <div className="px-0 py-4 lg:p-4">
    <RewardHistory />
  </div>
);

const conversionsHistory = (
  <div className="px-0 py-4 lg:p-4">
    <ApolloProvider client={myntClient}>
      <ConvertHistory />
    </ApolloProvider>
  </div>
);

const fundingHistory = (
  <div className="px-0 py-4 lg:p-4">
    <FundingHistoryFrame />
  </div>
);

type HistoryTabItem = ITabItem & UsesChain;

const HistoryPage: FC = () => {
  const [index, setIndex] = useState(0);
  const chainId = useCurrentChain();
  const items: HistoryTabItem[] = useMemo(
    () => [
      {
        label: t(translations.historyPage.table.tabs.borrow),
        content: borrowHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'borrow',
        chains: [Chains.RSK],
      },
      {
        label: t(translations.historyPage.table.tabs.earn),
        content: earn,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'earn',
        chains: [Chains.RSK, Chains.BOB],
      },
      {
        label: t(translations.historyPage.table.tabs.convert),
        content: conversionsHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'conversion',
        chains: [Chains.RSK, Chains.BOB],
      },
      {
        label: t(translations.historyPage.table.tabs.funding),
        content: fundingHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'funding',
        chains: [Chains.RSK],
      },
      {
        label: t(translations.historyPage.table.tabs.staking),
        content: stakingHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'staking',
        chains: [Chains.RSK, Chains.BOB],
      },
      {
        label: t(translations.historyPage.table.tabs.rewards),
        content: rewardHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'rewards',
        chains: [Chains.RSK],
      },
    ],
    [],
  );

  const filteredItems = useMemo(
    () => items.filter(item => isHistoryItemOnChain(item, chainId)),
    [items, chainId],
  );

  const options: SelectOption[] = useMemo(
    () =>
      filteredItems.map((item, index) => ({
        value: String(index),
        label: item.label,
      })),
    [filteredItems],
  );

  useEffect(() => setIndex(0), [chainId]); // prevents partial content rendering when chain is switched

  return (
    <>
      <Helmet>
        <title>{t(translations.historyPage.meta.title)}</title>
      </Helmet>
      <div className="lg:container w-full text-gray-10 mt-9 lg:mt-10">
        <Heading className="text-center lg:mb-10 lg:text-2xl">
          {t(translations.historyPage.title)}
        </Heading>
        <div className="w-full">
          <div className={styles.mobileSelect}>
            <Select
              className="min-w-[12rem] w-full lg:w-auto"
              options={options}
              value={String(index)}
              onChange={value => setIndex(Number(value))}
            />
          </div>
          <div className={styles.desktop}>
            <Tabs
              items={filteredItems}
              onChange={setIndex}
              index={index}
              className="w-full"
            />
          </div>
          <div className={styles.mobile}>{filteredItems[index]?.content}</div>
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
