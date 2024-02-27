import React, { FC, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BITCOIN, USD } from '../../../../../constants/currencies';
import { useGetRBTCPrice } from '../../../../../hooks/zero/useGetRBTCPrice';
import { translations } from '../../../../../locales/i18n';
import { getCurrencyPrecision } from '../../../PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { pageTranslations } from '../../ProtocolDataPage.constants';
import { PoolData } from './EcosystemStatistics.types';
import { AmmContracts } from './components/AmmContracts/AmmContracts';
import { BitocracyStakingContract } from './components/BitocracyStakingContract/BitocracyStakingContract';
import { LendingContracts } from './components/LendingContracts/LendingContracts';
import { MyntAggregatorContract } from './components/MyntAggregatorContract/MyntAggregatorContract';
import { ProtocolContracts } from './components/ProtocolContracts/ProtocolContracts';
import { ZeroContracts } from './components/ZeroContracts/ZeroContracts';

export const EcosystemStatistics: FC = () => {
  const currencies = useMemo(() => [BITCOIN, USD], []);
  const [selectedCurrency, setSelectedCurrency] = useState(BITCOIN);
  const [poolsData, setPoolsData] = useState<PoolData>({});
  const [subPoolsData, setSubPoolsData] = useState<PoolData>({});

  const { price: btcPrice } = useGetRBTCPrice();

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

  const handleBalanceChange = useCallback(
    (section: string, balance: Decimal, isSubSection: boolean = true) => {
      if (isSubSection) {
        setSubPoolsData(prevBalances => ({
          ...prevBalances,
          [section]: balance,
        }));
      } else {
        setPoolsData(prevBalances => ({
          ...prevBalances,
          [section]: balance,
        }));
      }
    },
    [setPoolsData, setSubPoolsData],
  );

  const subTotalBalance = useMemo(
    () =>
      Object.values(subPoolsData).reduce(
        (total, balance) => total.add(balance),
        Decimal.ZERO,
      ),
    [subPoolsData],
  );

  const totalBalance = useMemo(
    () =>
      Object.values(poolsData)
        .reduce((total, balance) => total.add(balance), Decimal.ZERO)
        .add(subTotalBalance),
    [poolsData, subTotalBalance],
  );

  const list = useMemo(
    () => [
      {
        title: t(pageTranslations.ecosystemStatistics.protocolContracts),
        value: (
          <ProtocolContracts
            selectedCurrency={selectedCurrency}
            btcPrice={btcPrice}
            onChange={handleBalanceChange}
          />
        ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.lendingContracts),
        value: (
          <LendingContracts
            selectedCurrency={selectedCurrency}
            btcPrice={btcPrice}
            onChange={handleBalanceChange}
          />
        ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.ammContracts),
        value: (
          <AmmContracts
            selectedCurrency={selectedCurrency}
            btcPrice={btcPrice}
            onChange={handleBalanceChange}
          />
        ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.zeroContracts),
        value: (
          <ZeroContracts
            selectedCurrency={selectedCurrency}
            btcPrice={btcPrice}
            onChange={handleBalanceChange}
          />
        ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.myntAggregatorContract),
        value: (
          <MyntAggregatorContract
            btcPrice={btcPrice}
            selectedCurrency={selectedCurrency}
            onChange={handleBalanceChange}
          />
        ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.subTotal),
        value: (
          <AmountRenderer
            value={subTotalBalance}
            suffix={selectedCurrency}
            precision={getCurrencyPrecision(selectedCurrency)}
            dataAttribute="ecosystem-statistics-subtotal-value"
          />
        ),
        highlight: true,
      },
      {
        title: t(pageTranslations.ecosystemStatistics.bitocracyStakingContract),
        value: (
          <BitocracyStakingContract
            btcPrice={btcPrice}
            selectedCurrency={selectedCurrency}
            onChange={handleBalanceChange}
          />
        ),
      },
      {
        title: t(pageTranslations.ecosystemStatistics.total),
        value: (
          <AmountRenderer
            value={totalBalance}
            suffix={selectedCurrency}
            precision={getCurrencyPrecision(selectedCurrency)}
            dataAttribute="ecosystem-statistics-total-value"
          />
        ),
        highlight: true,
      },
    ],
    [
      btcPrice,
      handleBalanceChange,
      subTotalBalance,
      totalBalance,
      selectedCurrency,
    ],
  );

  return (
    <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-9">
      <div className="lg:flex justify-between items-center lg:mb-6 mb-3">
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
            <div className="lg:text-base text-xs">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
