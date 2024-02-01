import React, { FC, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { HelperButton, SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { useGetConversionFee } from './hooks/useGetConversionFee';
import { useGetProtocolFee } from './hooks/useGetProtocolFee';

type PoolsStatisticsProps = {
  pool: AmmLiquidityPool;
};

const valueClassName = 'lg:text-sov-white';
const labelClassName = 'flex items-center gap-1';
const pageTranslations = translations.marketMakingPage.poolStatistics;

export const PoolsStatistics: FC<PoolsStatisticsProps> = ({ pool }) => {
  const { value: block } = useBlockNumber();

  const {
    conversionFee,
    loading: conversionFeeLoading,
    refetch: conversionFeeRefetch,
  } = useGetConversionFee(pool.poolTokenA);

  const {
    protocolFee,
    loading: protocolFeeLoading,
    refetch: protocolFeeRefetch,
  } = useGetProtocolFee();

  const renderLpFeeRate = useMemo(
    () =>
      !conversionFeeLoading && !!conversionFee ? (
        <AmountRenderer
          value={conversionFee}
          suffix="%"
          showRoundingPrefix={false}
          dataAttribute="market-making-pool-statistics-lp-fee-rate"
        />
      ) : (
        0
      ),
    [conversionFee, conversionFeeLoading],
  );

  const renderBitocracyFeeRate = useMemo(
    () =>
      !protocolFeeLoading ? (
        <AmountRenderer
          value={protocolFee}
          suffix="%"
          showRoundingPrefix={false}
          dataAttribute="market-making-pool-statistics-bitocracy-fee-rate"
        />
      ) : (
        0
      ),
    [protocolFee, protocolFeeLoading],
  );

  const renderTotalSwapFeeRate = useMemo(
    () =>
      !protocolFeeLoading && !conversionFeeLoading ? (
        <AmountRenderer
          value={conversionFee + protocolFee}
          suffix="%"
          showRoundingPrefix={false}
          dataAttribute="market-making-pool-statistics-total-swap-fee-rate"
        />
      ) : (
        0
      ),
    [protocolFee, conversionFee, protocolFeeLoading, conversionFeeLoading],
  );

  useEffect(() => {
    conversionFeeRefetch();
    protocolFeeRefetch();
  }, [conversionFeeRefetch, protocolFeeRefetch, block]);

  return (
    <SimpleTable
      dataAttribute="market-making-pool-statistics-table"
      className="lg:min-w-[20.5rem] lg:inline-flex bg-gray-70 rounded lg:p-4 px-0 lg:m-4"
    >
      <SimpleTableRow
        label={
          <span className={labelClassName}>
            {t(pageTranslations.lpFeeRate)}{' '}
            <HelperButton content={t(pageTranslations.lpFeeRateInfo)} />
          </span>
        }
        value={renderLpFeeRate}
        className="lg:text-base lg:mb-4"
        valueClassName={valueClassName}
      />
      <SimpleTableRow
        label={
          <span className={labelClassName}>
            {t(pageTranslations.bitocracyFeeRate)}{' '}
            <HelperButton content={t(pageTranslations.bitocracyFeeRateInfo)} />
          </span>
        }
        value={renderBitocracyFeeRate}
        className="lg:text-base lg:mb-4"
        valueClassName={valueClassName}
      />
      <SimpleTableRow
        label={
          <span className={labelClassName}>
            {t(pageTranslations.totalSwapFeeRate)}{' '}
            <HelperButton content={t(pageTranslations.totalSwapFeeRateInfo)} />
          </span>
        }
        value={renderTotalSwapFeeRate}
        className="lg:text-base"
        valueClassName={valueClassName}
      />
    </SimpleTable>
  );
};
