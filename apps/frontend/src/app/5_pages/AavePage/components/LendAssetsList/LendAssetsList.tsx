import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Checkbox, OrderOptions, Table } from '@sovryn/ui';

import { AaveRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { translations } from '../../../../../locales/i18n';
import { COLUMNS_CONFIG } from './LendAssetsList.constants';
import { LendPoolDetails } from './LendAssetsList.types';
import { LendAssetDetails } from './components/LendAssetDetails/LendAssetDetails';

const pageTranslations = translations.aavePage;


export const LendAssetsList: FC = () => {
  const [open, setOpen] = useState(true);
  const [showZeroBalances, setShowZeroBalances] = useState(true);
  const [orderOptions, setOrderOptions] = useState<OrderOptions>();

  const mobileRenderer = useCallback(p => <LendAssetDetails pool={p} />, []);
  const rowTitleRenderer = useCallback(
    row => (
      <AaveRowTitle
        asset={row.asset}
        value={row.apy}
        suffix="%"
        label={t(translations.aavePage.common.apy)}
      />
    ),
    [],
  );

  // TODO: mocked values and filter
  const lendPools: LendPoolDetails[] = [
    {
      asset: 'BTC',
      apy: 2.02,
      walletBalance: 12.34,
      canBeCollateral: true,
    },
    {
      asset: 'ETH',
      apy: 2.02,
      walletBalance: 12.34,
      canBeCollateral: false,
    },
  ];

  return (
    <Accordion
      label={
        <span className="text-base font-medium">
          {t(pageTranslations.lendAssetsList.title)}
        </span>
      }
      className="bg-gray-70 px-4 py-3 rounded space-y-3 lg:bg-gray-90 lg:p-6"
      labelClassName="justify-between  h-7 flex items-center"
      open={open}
      onClick={setOpen}
    >
      <Checkbox
        containerClassName="mt-2 mb-4"
        label={t(pageTranslations.lendAssetsList.showZeroBalances)}
        checked={showZeroBalances}
        onClick={() => setShowZeroBalances(s => !s)}
      />

      <Table
        columns={COLUMNS_CONFIG}
        rowClassName="bg-gray-80"
        accordionClassName="bg-gray-60 border border-gray-70"
        rowTitle={rowTitleRenderer}
        mobileRenderer={mobileRenderer}
        rows={lendPools}
        orderOptions={orderOptions}
        setOrderOptions={setOrderOptions}
      />
    </Accordion>
  );
};
