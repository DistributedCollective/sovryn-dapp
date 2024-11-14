import React, { FC, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';
import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../../../utils/asset';
import { useDepositContext } from '../../contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../hooks/useGetPoolInfo';

const pageTranslations =
  translations.bobMarketMakingPage.depositModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  pool: Pool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({ pool }) => {
  const { firstAssetValue, secondAssetValue, setSpotPrice } =
    useDepositContext();
  const { base, quote } = useMemo(() => pool, [pool]);
  const { spotPrice, price, feeRate } = useGetPoolInfo(pool);

  useEffect(() => {
    setSpotPrice(spotPrice);
  }, [spotPrice, setSpotPrice]);

  return (
    <SimpleTable className="mt-6">
      <SimpleTableRow
        label={t(pageTranslations.newPoolBalance)}
        value={<AmountRenderer value={firstAssetValue} suffix={base.symbol} />}
        className="mb-1"
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label=""
        value={
          <AmountRenderer value={secondAssetValue} suffix={quote.symbol} />
        }
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label={t(pageTranslations.currentPrice, {
          token: base.symbol,
        })}
        value={
          <AmountRenderer
            value={price}
            suffix={quote.symbol}
            precision={
              quote.symbol === COMMON_SYMBOLS.BTC
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
