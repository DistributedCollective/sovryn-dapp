import React, { FC, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BITCOIN, USD } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { useGetData } from '../../../LandingPage/components/ProtocolData/hooks/useGetData';
import { getCurrencyPrecision } from '../../../PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { pageTranslations } from '../../ProtocolDataPage.constants';
import { ContractData, ContractDataItem } from './EcosystemStatistics.types';

export const EcosystemStatistics: FC = () => {
  const { lockedData } = useGetData();

  const currencies = useMemo(() => [BITCOIN, USD], []);
  const [selectedCurrency, setSelectedCurrency] = useState(BITCOIN);

  const renderCurrencyClassName = useMemo(
    () => (currency: string) =>
      classNames('lg:ml-2 mr-4 lg:mr-0 p-1 h-6', {
        'bg-gray-50': selectedCurrency === currency,
      }),
    [selectedCurrency],
  );

  const handleCurrencyChange = useCallback(
    () => setSelectedCurrency(selectedCurrency === BITCOIN ? USD : BITCOIN),
    [selectedCurrency, setSelectedCurrency],
  );

  const convertedValue = useCallback(
    (item: ContractDataItem) =>
      selectedCurrency === BITCOIN ? item.totalBtc : item.totalUsd,
    [selectedCurrency],
  );

  const subTotalBtcValue = useMemo(
    () =>
      selectedCurrency === BITCOIN
        ? lockedData.tvlProtocol.totalBtc +
          lockedData.tvlLending.totalBtc +
          lockedData.tvlAmm.totalBtc +
          lockedData.tvlZero.totalBtc +
          lockedData.tvlMynt.totalBtc
        : 0,
    [lockedData, selectedCurrency],
  );

  const subTotalUsdValue = useMemo(
    () =>
      selectedCurrency === USD
        ? lockedData.tvlProtocol.totalUsd +
          lockedData.tvlLending.totalUsd +
          lockedData.tvlAmm.totalUsd +
          lockedData.tvlZero.totalUsd +
          lockedData.tvlMynt.totalUsd
        : 0,
    [lockedData, selectedCurrency],
  );

  const list: ContractData[] = useMemo(
    () => [
      {
        title: t(pageTranslations.ecosystemStatistics.protocolContracts),
        value: convertedValue(lockedData.tvlProtocol),
        dataAttribute: 'ecosystem-statistics-protocol-contract-value',
      },
      {
        title: t(pageTranslations.ecosystemStatistics.lendingContracts),
        value: convertedValue(lockedData.tvlLending),
        dataAttribute: 'ecosystem-statistics-lending-contract-value',
      },
      {
        title: t(pageTranslations.ecosystemStatistics.ammContracts),
        value: convertedValue(lockedData.tvlAmm),
        dataAttribute: 'ecosystem-statistics-amm-contract-value',
      },
      {
        title: t(pageTranslations.ecosystemStatistics.zeroContracts),
        value: convertedValue(lockedData.tvlZero),
        dataAttribute: 'ecosystem-statistics-zero-contract-value',
      },
      {
        title: t(pageTranslations.ecosystemStatistics.myntAggregatorContract),
        value: convertedValue(lockedData.tvlMynt),
        dataAttribute: 'ecosystem-statistics-mynt-aggregator-value',
      },
      {
        title: t(pageTranslations.ecosystemStatistics.subTotal),
        value:
          selectedCurrency === BITCOIN ? subTotalBtcValue : subTotalUsdValue,
        dataAttribute: 'ecosystem-statistics-subtotal-value',
        highlight: true,
      },
      {
        title: t(pageTranslations.ecosystemStatistics.bitocracyStakingContract),
        value: convertedValue(lockedData.tvlStaking),
        dataAttribute: 'ecosystem-statistics-bitocracy-staking-value',
      },
      {
        title: t(pageTranslations.ecosystemStatistics.total),
        value:
          selectedCurrency === BITCOIN
            ? lockedData.total_btc
            : lockedData.total_usd,
        dataAttribute: 'ecosystem-statistics-total-value',
        highlight: true,
      },
    ],
    [
      lockedData,
      selectedCurrency,
      convertedValue,
      subTotalBtcValue,
      subTotalUsdValue,
    ],
  );

  return (
    <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-9">
      <div className="lg:flex justify-between items-center md:mb-6 mb-3 mt-2">
        <Paragraph
          className="md:text-2xl mb-3 lg:mb-0 text-base font-medium"
          children={t(pageTranslations.ecosystemStatistics.title)}
        />
        <div className="flex lg:justify-end">
          {currencies.map(currency => (
            <Button
              key={currency}
              text={t(translations.common[currency.toLowerCase()])}
              className={renderCurrencyClassName(currency)}
              onClick={handleCurrencyChange}
              style={ButtonStyle.secondary}
              dataAttribute={`ecosystem-statistics-${currency.toLowerCase()}`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-y-3 rounded bg-gray-70 lg:bg-transparent p-3 lg:p-0">
        {list.map((item, index) => (
          <div
            key={index}
            className={classNames(
              'flex justify-between items-center lg:px-6 px-0 lg:py-3 py-0 lg:rounded lg:min-h-[3.75rem] font-medium lg:border lg:border-gray-70',
              {
                'lg:bg-gray-70 text-gray-10': item.highlight,
                'lg:bg-gray-80 lg:text-gray-10 text-gray-30': !item.highlight,
              },
            )}
          >
            <Paragraph children={item.title} />
            <div className="lg:text-base text-xs xl:mr-48">
              <AmountRenderer
                value={item.value}
                suffix={selectedCurrency}
                precision={getCurrencyPrecision(selectedCurrency)}
                dataAttribute={item.dataAttribute}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
