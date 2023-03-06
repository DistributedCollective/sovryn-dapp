import { ApolloProvider } from '@apollo/client';

import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Select, SelectOption, Tabs } from '@sovryn/ui';

import {
  TransactionHistoryFrame,
  RedemptionsHistoryFrame,
} from '../../3_organisms';
import { CollateralSurplusHistoryFrame } from '../../3_organisms/CollateralSurplusWithdrawals/CollateralSurplusWithdrawals';
import { ConversionsHistoryFrame } from '../../3_organisms/ConversionsHistoryFrame/ConversionsHistoryFrame';
import { FundingHistoryFrame } from '../../3_organisms/FundingHistoryFrame/FundingHistoryFrame';
import { RewardHistory } from '../../3_organisms/RewardHistory/RewardHistory';
import { StabilityPoolHistoryFrame } from '../../3_organisms/StabilityPoolHistoryFrame';
import { translations } from '../../../locales/i18n';
import { myntClient, zeroClient } from '../../../utils/clients';
import styles from './HistoryPage.module.css';

const ACTIVE_CLASSNAME = 'border-t-primary-30';
const locHistory = (
  <div className="px-0 py-4 lg:p-4">
    <ApolloProvider client={zeroClient}>
      <TransactionHistoryFrame />
    </ApolloProvider>
  </div>
);

const redemptions = (
  <div className="px-0 py-4 lg:p-4">
    <RedemptionsHistoryFrame />
  </div>
);

const stability = (
  <div className="px-0 py-4 lg:p-4">
    <StabilityPoolHistoryFrame />
  </div>
);

const collateralSurplusHistory = (
  <div className="px-0 py-4 lg:p-4">
    <CollateralSurplusHistoryFrame />
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
      <ConversionsHistoryFrame />
    </ApolloProvider>
  </div>
);

const fundingHistory = (
  <div className="px-0 py-4 lg:p-4">
    <FundingHistoryFrame />
  </div>
);

const HistoryPage: FC = () => {
  const [index, setIndex] = useState(0);
  const items = useMemo(
    () => [
      {
        label: t(translations.historyPage.table.tabs.lineOfCredit),
        content: locHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'loc',
      },
      {
        label: t(translations.historyPage.table.tabs.redemptions),
        content: redemptions,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'redemptions',
      },
      {
        label: t(translations.historyPage.table.tabs.stability),
        content: stability,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'stability',
      },
      {
        label: t(translations.historyPage.table.tabs.convert),
        content: conversionsHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'conversion',
      },
      {
        label: t(translations.historyPage.table.tabs.funding),
        content: fundingHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'funding',
      },
      {
        label: t(
          translations.historyPage.table.tabs.collateralSurplusWithdrawals,
        ),
        content: collateralSurplusHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'collateral-surplus-withdrawals',
      },
      {
        label: t(translations.historyPage.table.tabs.reward),
        content: rewardHistory,
        activeClassName: ACTIVE_CLASSNAME,
        dataAttribute: 'rewards',
      },
    ],
    [],
  );

  const options: SelectOption[] = useMemo(
    () =>
      items.map((item, index) => ({ value: String(index), label: item.label })),
    [items],
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.historyPage.meta.title)}</title>
        <meta
          property="og:title"
          content={t(translations.historyPage.meta.title)}
        />
        <meta
          name="description"
          property="og:description"
          content={t(translations.historyPage.meta.description)}
        />
      </Helmet>
      <div className="lg:container w-full text-gray-10 mt-9 lg:mt-10">
        <Heading className="text-center lg:mb-10 lg:text-2xl">
          {t(translations.historyPage.title)}
        </Heading>
        <div className="w-full">
          <div className={styles.mobileSelect}>
            <Select
              className="min-w-[12rem]"
              options={options}
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
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
