import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ButtonStyle,
  Pagination,
  Paragraph,
  SimpleTableRow,
  Table,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { pageTranslations } from '../../ProtocolDataPage.constants';
import { COLUMNS_CONFIG } from './PricesBy24hChange.constants';
import { PriceChange } from './components/PriceChange';
import { useGetAssetData } from './hooks/useGetAssetData';
import { useGetCryptoPairs } from './hooks/useGetCryptoPairs';

const pageSize = 8;

export const PricesBy24hChange: FC = () => {
  const pairs = useGetCryptoPairs();
  const assetData = useGetAssetData();
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const rows = useMemo(() => {
    if (!pairs.length) {
      return [];
    }

    return pairs
      .map(pair => {
        const result = [
          {
            asset: pair.base_id,
            price24h: Number(pair.price_change_percent_24h_usd),
            priceWeek: Number(pair.price_change_week_usd),
            lastPrice: Number(pair.last_price_usd),
            assetData: assetData && assetData[pair?.base_id],
          },
        ];

        if (pair.base_symbol_legacy === 'USDT') {
          result.push({
            asset: pair.quote_id,
            price24h: -Number(pair.price_change_percent_24h),
            priceWeek: -Number(pair.price_change_week),
            lastPrice: Number(1 / pair.last_price),
            assetData: assetData && assetData[pair?.quote_id],
          });
        }

        return result;
      })
      .flat()
      .map(pair => {
        const marketCap = Decimal.from(
          pair.assetData?.circulating_supply || '0',
        ).mul(pair.lastPrice || '0');
        return {
          ...pair,
          marketCap,
          circulatingSupply: pair.assetData?.circulating_supply || '0',
        };
      })
      .sort((pairA, pairB) => (pairA.marketCap.gt(pairB.marketCap) ? -1 : 1));
  }, [assetData, pairs]);

  const paginatedItems = useMemo(
    () => rows?.slice(page * pageSize, (page + 1) * pageSize),
    [rows, page],
  );

  const isNextButtonDisabled = useMemo(
    () => paginatedItems && paginatedItems?.length < pageSize,
    [paginatedItems],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (rows?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, rows],
  );

  const generateRowTitle = useCallback(
    (pair: any) => (
      <div className="flex items-center w-full justify-between">
        <AssetRenderer
          showAssetLogo
          address={pair.asset}
          className="lg:justify-start justify-end"
        />
        <AmountRenderer
          value={decimalic(pair.lastPrice).toString()}
          prefix="$ "
        />
        <PriceChange value={pair.price24h} />
      </div>
    ),
    [],
  );
  const mobileRenderer = useCallback(
    (pair: any) => (
      <div className="flex flex-col">
        <SimpleTableRow
          label={t(translations.protocolDataPage.pricesBy24hChange.marketCap)}
          value={
            <AmountRenderer
              value={decimalic(pair.marketCap).toString()}
              prefix="$ "
            />
          }
        />
        <SimpleTableRow
          label={t(
            translations.protocolDataPage.pricesBy24hChange.circulationSupply,
          )}
          value={
            <AmountRenderer
              value={decimalic(pair.circulatingSupply).toString()}
              prefix="$ "
            />
          }
        />

        <Button
          text={t(translations.protocolDataPage.pricesBy24hChange.convert)}
          style={ButtonStyle.secondary}
          className="mt-2 mb-3"
          onClick={() => navigate('/convert')}
        />
      </div>
    ),
    [navigate],
  );

  return (
    <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-9">
      <div className="flex items-center justify-between mb-6">
        <Paragraph
          className="md:text-2xl text-base font-medium"
          children={t(pageTranslations.pricesBy24hChange.title)}
        />
        <Button
          className="md:block hidden"
          text={t(translations.protocolDataPage.pricesBy24hChange.convert)}
          onClick={() => navigate('/convert')}
        />
      </div>
      <div className="min-h-72 mt-5">
        <Table
          columns={COLUMNS_CONFIG}
          rows={paginatedItems}
          rowTitle={generateRowTitle}
          mobileRenderer={mobileRenderer}
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          dataAttribute="pairs-prices-pagination"
          isNextButtonDisabled={isNextButtonDisabled}
        />
      </div>
    </div>
  );
};
