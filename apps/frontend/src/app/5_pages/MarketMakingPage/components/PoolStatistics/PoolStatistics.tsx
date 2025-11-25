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

  const renderLpFeeRate = useMemo(() => {
    // Temporary fix for BOS pool
    if (pool.poolTokenA === '0xfd834bbcde8c3ac4766bf5c1f5d861400103087b') {
      return (
        <AmountRenderer
          value={0.25}
          suffix="%"
          dataAttribute="market-making-pool-statistics-lp-fee-rate"
        />
      );
    }

    if (pool.converterVersion === 2) {
      return (
        <AmountRenderer
          value={0.1}
          suffix="%"
          dataAttribute="market-making-pool-statistics-lp-fee-rate"
        />
      );
    }

    return !conversionFeeLoading && !!conversionFee ? (
      <AmountRenderer
        value={conversionFee}
        suffix="%"
        showRoundingPrefix={false}
        dataAttribute="market-making-pool-statistics-lp-fee-rate"
      />
    ) : (
      0
    );
  }, [
    conversionFee,
    conversionFeeLoading,
    pool.converterVersion,
    pool.poolTokenA,
  ]);

  const renderBitocracyFeeRate = useMemo(
    () =>
      !protocolFeeLoading && pool.converterVersion !== 2 ? (
        <AmountRenderer
          value={protocolFee}
          suffix="%"
          showRoundingPrefix={false}
          dataAttribute="market-making-pool-statistics-bitocracy-fee-rate"
        />
      ) : (
        0
      ),
    [pool.converterVersion, protocolFee, protocolFeeLoading],
  );

  const renderTotalSwapFeeRate = useMemo(() => {
    // Temporary fix for BOS pool
    if (pool.poolTokenA === '0xfd834bbcde8c3ac4766bf5c1f5d861400103087b') {
      return (
        <AmountRenderer
          value={0.35}
          suffix="%"
          dataAttribute="market-making-pool-statistics-total-swap-fee-rate"
        />
      );
    }

    if (pool.converterVersion === 2) {
      return (
        <AmountRenderer
          value={0.1}
          suffix="%"
          dataAttribute="market-making-pool-statistics-total-swap-fee-rate"
        />
      );
    }
    return !protocolFeeLoading && !conversionFeeLoading ? (
      <AmountRenderer
        value={conversionFee + protocolFee}
        suffix="%"
        showRoundingPrefix={false}
        dataAttribute="market-making-pool-statistics-total-swap-fee-rate"
      />
    ) : (
      0
    );
  }, [
    pool.poolTokenA,
    pool.converterVersion,
    protocolFeeLoading,
    conversionFeeLoading,
    conversionFee,
    protocolFee,
  ]);

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
