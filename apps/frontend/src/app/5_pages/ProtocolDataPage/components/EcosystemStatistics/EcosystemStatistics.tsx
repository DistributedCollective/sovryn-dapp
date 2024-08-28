import React, { FC, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { NativeTokenAmount } from '../../../../2_molecules/NativeTokenAmount/NativeTokenAmount';
import { BITCOIN, ETH, USD } from '../../../../../constants/currencies';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { isBobChain, isRskChain } from '../../../../../utils/chain';
import { useGetLockedData } from '../../../LandingPage/components/ProtocolData/hooks/useGetLockedData';
import { getCurrencyPrecision } from '../../../PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { pageTranslations } from '../../ProtocolDataPage.constants';
import { ContractData } from './EcosystemStatistics.types';

export const EcosystemStatistics: FC = () => {
  const lockedData = useGetLockedData();
  const chainId = useCurrentChain();

  const currencies = useMemo(
    () => (isRskChain(chainId) ? [BITCOIN, USD] : [ETH, USD]),
    [chainId],
  );
  const [selectedCurrency, setSelectedCurrency] = useState(USD);

  useEffect(() => {
    if (!currencies.includes(selectedCurrency)) {
      setSelectedCurrency(currencies[0]);
    }
  }, [currencies, selectedCurrency]);

  const totalValue = useMemo(() => {
    if (isBobChain(chainId)) {
      return (
        Number(lockedData.tvlSdex?.totalUsd || 0) +
        Number(lockedData.tvlStaking?.totalUsd || 0)
      );
    }

    return (
      Number(lockedData.tvlProtocol?.totalUsd || 0) +
      Number(lockedData.tvlLending?.totalUsd || 0) +
      Number(lockedData.tvlAmm?.totalUsd || 0) +
      Number(lockedData.tvlZero?.totalUsd || 0) +
      Number(lockedData.tvlMynt?.totalUsd || 0) +
      Number(lockedData.tvlStaking?.totalUsd || 0)
    );
  }, [
    chainId,
    lockedData.tvlAmm?.totalUsd,
    lockedData.tvlLending?.totalUsd,
    lockedData.tvlMynt?.totalUsd,
    lockedData.tvlProtocol?.totalUsd,
    lockedData.tvlSdex?.totalUsd,
    lockedData.tvlStaking?.totalUsd,
    lockedData.tvlZero?.totalUsd,
  ]);

  const subTotalValue = useMemo(() => {
    if (isBobChain(chainId)) {
      return totalValue - Number(lockedData.tvlStaking?.totalUsd || 0);
    } else {
      return totalValue - Number(lockedData.tvlStaking?.totalUsd || 0);
    }
  }, [chainId, lockedData.tvlStaking?.totalUsd, totalValue]);

  const list: ContractData[] = useMemo(() => {
    if (isBobChain(chainId)) {
      return [
        {
          title: t(pageTranslations.ecosystemStatistics.ammContracts),
          value:
            selectedCurrency === USD ? (
              <AmountRenderer
                value={lockedData.tvlSdex?.totalUsd.toString() || '0'}
                suffix={selectedCurrency}
                precision={getCurrencyPrecision(selectedCurrency)}
                dataAttribute="ecosystem-statistics-sdex-contract-value"
              />
            ) : (
              <NativeTokenAmount
                usdValue={lockedData.tvlSdex?.totalUsd}
                precision={getCurrencyPrecision(selectedCurrency)}
                dataAttribute="ecosystem-statistics-sdex-contract-value"
              />
            ),
        },
        {
          title: t(
            pageTranslations.ecosystemStatistics.bitocracyStakingContract,
          ),
          value:
            selectedCurrency === USD ? (
              <AmountRenderer
                value={lockedData.tvlStaking?.totalUsd.toString() || '0'}
                suffix={selectedCurrency}
                precision={getCurrencyPrecision(selectedCurrency)}
                dataAttribute="ecosystem-statistics-bitocracy-staking-value"
              />
            ) : (
              <NativeTokenAmount
                usdValue={lockedData.tvlStaking?.totalUsd}
                precision={getCurrencyPrecision(selectedCurrency)}
                dataAttribute="ecosystem-statistics-bitocracy-staking-value"
              />
            ),
        },
        {
          title: t(pageTranslations.ecosystemStatistics.total),
          value:
            selectedCurrency === USD ? (
              <AmountRenderer
                value={lockedData.total_usd.toString() || '0'}
                suffix={selectedCurrency}
                precision={getCurrencyPrecision(selectedCurrency)}
                dataAttribute="ecosystem-statistics-total-value"
              />
            ) : (
              <NativeTokenAmount
                usdValue={lockedData.tvlStaking?.totalUsd}
                precision={getCurrencyPrecision(selectedCurrency)}
                dataAttribute="ecosystem-statistics-total-value"
              />
            ),
          highlight: true,
        },
      ];
    }
    return [
      {
        title: t(pageTranslations.ecosystemStatistics.protocolContracts),
        value:
          selectedCurrency === USD ? (
            <AmountRenderer
              value={lockedData.tvlProtocol?.totalUsd.toString() || '0'}
              suffix={selectedCurrency}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-protocol-contract-value"
            />
          ) : (
            <NativeTokenAmount
              usdValue={lockedData.tvlProtocol?.totalUsd}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-protocol-contract-value"
            />
          ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.lendingContracts),

        value:
          selectedCurrency === USD ? (
            <AmountRenderer
              value={lockedData.tvlLending?.totalUsd.toString() || '0'}
              suffix={selectedCurrency}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-lending-contract-value"
            />
          ) : (
            <NativeTokenAmount
              usdValue={lockedData.tvlLending?.totalUsd}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-lending-contract-value"
            />
          ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.ammContracts),

        value:
          selectedCurrency === USD ? (
            <AmountRenderer
              value={lockedData.tvlAmm?.totalUsd.toString() || '0'}
              suffix={selectedCurrency}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-amm-contract-value"
            />
          ) : (
            <NativeTokenAmount
              usdValue={lockedData.tvlAmm?.totalUsd}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-amm-contract-value"
            />
          ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.zeroContracts),
        value:
          selectedCurrency === USD ? (
            <AmountRenderer
              value={lockedData.tvlZero?.totalUsd.toString() || '0'}
              suffix={selectedCurrency}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-zero-contract-value"
            />
          ) : (
            <NativeTokenAmount
              usdValue={lockedData.tvlZero?.totalUsd}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-zero-contract-value"
            />
          ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.myntAggregatorContract),
        value:
          selectedCurrency === USD ? (
            <AmountRenderer
              value={lockedData.tvlMynt?.totalUsd.toString() || '0'}
              suffix={selectedCurrency}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-mynt-aggregator-value"
            />
          ) : (
            <NativeTokenAmount
              usdValue={lockedData.tvlMynt?.totalUsd}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-mynt-aggregator-value"
            />
          ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.subTotal),
        value:
          selectedCurrency === USD ? (
            <AmountRenderer
              value={subTotalValue}
              suffix={selectedCurrency}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-subtotal-value"
            />
          ) : (
            <NativeTokenAmount
              usdValue={subTotalValue}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-subtotal-value"
            />
          ),
        highlight: true,
      },
      {
        title: t(pageTranslations.ecosystemStatistics.bitocracyStakingContract),

        value:
          selectedCurrency === USD ? (
            <AmountRenderer
              value={lockedData.tvlStaking?.totalUsd.toString() || '0'}
              suffix={selectedCurrency}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-bitocracy-staking-value"
            />
          ) : (
            <NativeTokenAmount
              usdValue={lockedData.tvlStaking?.totalUsd}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-bitocracy-staking-value"
            />
          ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.total),
        value:
          selectedCurrency === USD ? (
            <AmountRenderer
              value={totalValue}
              suffix={selectedCurrency}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-total-value"
            />
          ) : (
            <NativeTokenAmount
              usdValue={totalValue}
              precision={getCurrencyPrecision(selectedCurrency)}
              dataAttribute="ecosystem-statistics-total-value"
            />
          ),
        highlight: true,
      },
    ];
  }, [
    chainId,
    lockedData.total_usd,
    lockedData.tvlAmm,
    lockedData.tvlLending,
    lockedData.tvlMynt,
    lockedData.tvlProtocol,
    lockedData.tvlSdex,
    lockedData.tvlStaking,
    lockedData.tvlZero,
    selectedCurrency,
    subTotalValue,
    totalValue,
  ]);

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
              className={classNames('lg:ml-2 mr-4 lg:mr-0 p-1 h-6', {
                'bg-gray-50': selectedCurrency === currency,
              })}
              onClick={() => setSelectedCurrency(currency)}
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
            <div className="lg:text-base text-xs xl:mr-48">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
