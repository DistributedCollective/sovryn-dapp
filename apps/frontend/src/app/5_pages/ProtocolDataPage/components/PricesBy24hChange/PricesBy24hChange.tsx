import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { getTokenDetailsByAddress } from '@sovryn/contracts';
import {
  Button,
  ButtonStyle,
  HelperButton,
  Pagination,
  Paragraph,
  SimpleTableRow,
  Table,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { pageTranslations } from '../../ProtocolDataPage.constants';
import { COLUMNS_CONFIG } from './PricesBy24hChange.constants';
import { parseCryptoPairs } from './PricesBy24hChange.utils';
import { PriceChange } from './components/PriceChange';
import { useGetAssetData } from './hooks/useGetAssetData';
import { useGetCryptoPairs } from './hooks/useGetCryptoPairs';

const pageSize = 8;

export const PricesBy24hChange: FC = () => {
  const { pairs, isLoading } = useGetCryptoPairs();
  const assetData = useGetAssetData();
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();

  const rows = useMemo(() => {
    return parseCryptoPairs(pairs, assetData);
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

  const convert = useCallback(
    async (tokenAddress: string) => {
      try {
        const token = await getTokenDetailsByAddress(tokenAddress);
        navigate('/convert?from=' + token.symbol);
      } catch (error) {}
    },
    [navigate],
  );

  const generateRowTitle = useCallback(
    (pair: any) => (
      <div className="flex items-center w-full justify-between pr-3">
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
          label={
            <span className="flex items-center gap-1">
              {t(translations.protocolDataPage.pricesBy24hChange.marketCap)}
              <HelperButton
                content={
                  <Trans
                    i18nKey={t(
                      translations.protocolDataPage.pricesBy24hChange
                        .marketCapTooltip,
                    )}
                    components={[<strong className="font-bold" />]}
                  />
                }
              />
            </span>
          }
          value={
            <AmountRenderer
              value={decimalic(pair.marketCap).toString()}
              prefix="$ "
            />
          }
        />
        <SimpleTableRow
          label={
            <span className="flex items-center gap-1">
              {t(
                translations.protocolDataPage.pricesBy24hChange
                  .circulationSupply,
              )}
              <HelperButton
                content={
                  <Trans
                    i18nKey={t(
                      translations.protocolDataPage.pricesBy24hChange
                        .circulatingSupplyTooltip,
                    )}
                    components={[<strong className="font-bold" />]}
                  />
                }
              />
            </span>
          }
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
          onClick={() => convert(pair.asset)}
        />
      </div>
    ),
    [convert],
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
          onRowClick={pair => !isMobile && convert(pair.asset)}
          isClickable
          isLoading={isLoading && !rows.length}
          rowClassName="bg-gray-80"
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
