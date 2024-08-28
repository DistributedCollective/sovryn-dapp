import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { Accordion, OrderOptions, Table } from '@sovryn/ui';

import { AaveRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { translations } from '../../../../../locales/i18n';
import { COLUMNS_CONFIG } from './BorrowAssetsList.constants';
import { BorrowPoolDetails } from './BorrowAssetsList.types';
import { BorrowAssetDetails } from './components/BorrowAssetDetails/BorrowAssetDetails';

const pageTranslations = translations.aavePage.borrowAssetsList;

type BorrowAssetsListProps = {
  borrowPools: BorrowPoolDetails[];
};

export const BorrowAssetsList: FC<BorrowAssetsListProps> = ({
  borrowPools,
}) => {
  const [open, setOpen] = useState(true);
  const [orderOptions, setOrderOptions] = useState<OrderOptions>();

  const rowTitleRenderer = useCallback(
    row => (
      <AaveRowTitle
        asset={row.asset}
        value={row.apr}
        suffix="%"
        label={t(translations.aavePage.common.apy)}
        precision={2}
      />
    ),
    [],
  );
  const mobileRenderer = useCallback(p => <BorrowAssetDetails pool={p} />, []);

  return (
    <Accordion
      label={
        <span className="text-base font-medium">
          {t(pageTranslations.title)}
        </span>
      }
      className="bg-gray-70 px-4 py-3 rounded space-y-3 lg:bg-gray-90 lg:p-6"
      labelClassName="justify-between  h-7 flex items-center"
      open={open}
      onClick={setOpen}
    >
      <Table
        className="mt-3"
        columns={COLUMNS_CONFIG}
        rowClassName="bg-gray-80"
        accordionClassName="bg-gray-60 border border-gray-70"
        rowTitle={rowTitleRenderer}
        mobileRenderer={mobileRenderer}
        rows={borrowPools}
        orderOptions={orderOptions}
        setOrderOptions={setOrderOptions}
      />
    </Accordion>
  );
};
