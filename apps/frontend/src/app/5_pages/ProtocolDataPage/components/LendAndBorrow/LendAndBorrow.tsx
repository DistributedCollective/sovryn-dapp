import React, { FC, useCallback } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ButtonStyle,
  Paragraph,
  SimpleTableRow,
  Table,
} from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../../../../utils/LendingPool';
import { LendingPoolDictionary } from '../../../../../utils/LendingPoolDictionary';
import { normalizeToken } from '../../../BorrowPage/BorrowPage.utils';
import { AvailableSupply } from '../../../BorrowPage/components/BorrowAssetsTable/components/AvailableSupply/AvailableSupply';
import { NextBorrowInterestRate } from '../../../BorrowPage/components/BorrowAssetsTable/components/NextBorrowInterestRate/NextBorrowInterestRate';
import { NextSupplyInterestRate } from '../../../LendPage/components/NextSupplyInterestRate/NextSupplyInterestRate';
import { pageTranslations } from '../../ProtocolDataPage.constants';
import { COLUMNS_CONFIG } from './LendAndBorrow.constants';

const lendPools = LendingPoolDictionary.list();

export const LendAndBorrow: FC = () => {
  const navigate = useNavigate();

  const generateRowTitle = useCallback(
    (pool: LendingPool) => (
      <AssetRenderer
        showAssetLogo
        asset={pool.getAsset()}
        className="lg:justify-start justify-end my-2"
      />
    ),
    [],
  );
  const mobileRenderer = useCallback(
    (pool: LendingPool) => (
      <div className="flex flex-col px-1">
        <SimpleTableRow
          label={t(translations.protocolDataPage.lendAndBorrow.borrowApr)}
          value={
            <NextBorrowInterestRate asset={normalizeToken(pool.getAsset())} />
          }
        />

        <SimpleTableRow
          label={t(translations.protocolDataPage.lendAndBorrow.lendApr)}
          value={<NextSupplyInterestRate asset={pool.getAsset()} />}
        />

        <SimpleTableRow
          label={t(translations.protocolDataPage.lendAndBorrow.availableSupply)}
          value={<AvailableSupply pool={pool} />}
        />

        <div className="flex items-center w-full gap-3 mb-3 mt-2">
          <Button
            text={t(pageTranslations.lendAndBorrow.lend)}
            style={ButtonStyle.secondary}
            onClick={() => navigate('/earn/lend')}
            className="flex-1"
          />
          <Button
            text={t(pageTranslations.lendAndBorrow.borrow)}
            onClick={() => navigate('/borrow/fixed-interest')}
            className="flex-1"
          />
        </div>
      </div>
    ),
    [navigate],
  );

  return (
    <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-9">
      <div className="flex items-center justify-between">
        <Paragraph
          className="md:text-2xl text-base font-medium"
          children={t(pageTranslations.lendAndBorrow.title)}
        />
        <div className="items-center gap-3 md:flex hidden">
          <Button
            text={t(pageTranslations.lendAndBorrow.lend)}
            style={ButtonStyle.secondary}
            onClick={() => navigate('/earn/lend')}
          />
          <Button
            text={t(pageTranslations.lendAndBorrow.borrow)}
            onClick={() => navigate('/borrow/fixed-interest')}
          />
        </div>
      </div>
      <div className="py-4 md:mt-5">
        <Table
          columns={COLUMNS_CONFIG}
          rows={lendPools}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="lend-borrow-table"
          rowTitle={generateRowTitle}
          mobileRenderer={mobileRenderer}
        />
      </div>
    </div>
  );
};
