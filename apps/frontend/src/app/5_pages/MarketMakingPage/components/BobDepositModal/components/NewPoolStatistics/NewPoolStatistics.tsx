import React, { FC, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../../../utils/asset';
import { AmbientLiquidityPool } from '../../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useGetTokenDecimals } from '../../../BobWIthdrawModal/hooks/useGetTokenDecimals';
import { useDepositContext } from '../../contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../hooks/useGetPoolInfo';

const pageTranslations =
  translations.bobMarketMakingPage.depositModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  pool: AmbientLiquidityPool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({ pool }) => {
  const { firstAssetValue, secondAssetValue, setSpotPrice } =
    useDepositContext();
  const { base, quote } = useMemo(() => pool, [pool]);
  const { spotPrice, feeRate, poolTokens } = useGetPoolInfo(
    pool.base,
    pool.quote,
  );

  const { quoteTokenDecimals } = useGetTokenDecimals(
    poolTokens?.tokenA,
    poolTokens?.tokenB,
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
        label={t(pageTranslations.currentPrice, {
          token: quote.toUpperCase(),
        })}
        value={
          <AmountRenderer
            value={spotPrice}
            suffix={base.toUpperCase()}
            precision={
              quote === COMMON_SYMBOLS.BTC
                ? BTC_RENDER_PRECISION
                : TOKEN_RENDER_PRECISION
            }
            decimals={quoteTokenDecimals}
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
