import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Checkbox, Table } from '@sovryn/ui';

import { AavePoolRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { translations } from '../../../../../locales/i18n';
import { COLUMNS_CONFIG } from './LendAssetsList.constants';
import { LendAssetDetails } from './components/LendAssetDetails/LendAssetDetails';

const pageTranslations = translations.aavePage.lendAssetsList;

type LendAssetsListProps = {
  account?: string;
};

export const LendAssetsList: FC<LendAssetsListProps> = ({ account }) => {
  const [open, setOpen] = useState<boolean>(true);

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
      <div className="py-2 mb-2">
        <Checkbox label="Show assets with 0 balance" />
      </div>

      <Table
        columns={COLUMNS_CONFIG}
        rowClassName="bg-gray-80"
        accordionClassName="bg-gray-60 border border-gray-70"
        rowTitle={r => <AavePoolRowTitle asset={r.asset} />}
        rows={[
          {
            asset: 'BTC',
            apy: 2,
            walletBalance: 12.34,
            canBeCollateral: true,
          },
          {
            asset: 'ETH',
            apy: 2,
            walletBalance: 12.34,
            canBeCollateral: false,
          },
        ]}
        mobileRenderer={p => <LendAssetDetails pool={p} />}
      />
    </Accordion>
  );
};
