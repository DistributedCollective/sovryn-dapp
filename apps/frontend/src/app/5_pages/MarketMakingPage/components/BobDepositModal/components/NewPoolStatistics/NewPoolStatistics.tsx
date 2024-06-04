import React, { FC, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../../../../../utils/asset';
import { AmbientPositionStatus } from '../../../AmbientMarketMaking/components/AmbientPoolPositions/components/AmbientPositionStatus/AmbientPositionStatus';
import { AmbientLiquidityPool } from '../../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useDepositContext } from '../../contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../hooks/useGetPoolInfo';

const pageTranslations =
  translations.bobMarketMakingPage.depositModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  pool: AmbientLiquidityPool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({ pool }) => {
  const {
    firstAssetValue,
    secondAssetValue,
    setSpotPrice,
    isFirstAssetOutOfRange,
    isSecondAssetOutOfRange,
  } = useDepositContext();
  const { base, quote } = useMemo(() => pool, [pool]);
  const { spotPrice, price, feeRate } = useGetPoolInfo(pool.base, pool.quote);

  const isPositionInRange = useMemo(
    () => isFirstAssetOutOfRange || isSecondAssetOutOfRange,
    [isFirstAssetOutOfRange, isSecondAssetOutOfRange],
  );

  useEffect(() => {
    setSpotPrice(spotPrice);
  }, [spotPrice, setSpotPrice]);

  return (
    <SimpleTable className="mt-6">
      <SimpleTableRow
        label={t(pageTranslations.newPoolBalance)}
        value={<AmountRenderer value={firstAssetValue} suffix={base} />}
        className="mb-1"
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label=""
        value={<AmountRenderer value={secondAssetValue} suffix={quote} />}
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label={t(pageTranslations.status)}
        value={
          <AmbientPositionStatus
            className="flex justify-end"
            isInRange={isPositionInRange}
            pool={pool}
          />
        }
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label={t(pageTranslations.currentPrice, {
          token: findAsset(base, pool.chainId).symbol ?? base,
        })}
        value={
          <AmountRenderer
            value={price}
            suffix={findAsset(quote, pool.chainId).symbol ?? quote}
            precision={
              quote === COMMON_SYMBOLS.BTC
                ? BTC_RENDER_PRECISION
                : TOKEN_RENDER_PRECISION
            }
          />
        }
      />
      <SimpleTableRow
        label={t(pageTranslations.lpFeeRate)}
        value={<AmountRenderer value={feeRate} suffix="%" />}
      />
    </SimpleTable>
  );
};
