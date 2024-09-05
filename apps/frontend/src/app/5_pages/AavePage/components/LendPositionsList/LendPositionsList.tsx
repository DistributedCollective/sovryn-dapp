import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import {
  Accordion,
  OrderDirection,
  OrderOptions,
  Paragraph,
  Table,
} from '@sovryn/ui';

import { AaveRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { PoolPositionStat } from '../PoolPositionStat/PoolPositionStat';
import { COLUMNS_CONFIG } from './LendPositionsList.constants';
import { LendPosition } from './LendPositionsList.types';
import { LendPositionDetails } from './components/LendPositionDetails/LendPositionDetails';

const pageTranslations = translations.aavePage;

export const LendPositionsList: FC = () => {
  const { account } = useAccount();
  const [open, setOpen] = useState(true);
  const [balance] = useState(100); // TODO: mocked data
  const [apy] = useState(2.3); // TODO: mocked data
  const [collateral] = useState(3); // TODO: mocked data
  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'balance',
    orderDirection: OrderDirection.Asc,
  });

  const rowTitleRenderer = useCallback(
    r => <AaveRowTitle asset={r.asset} value={r.balance} suffix={r.asset} />,
    [],
  );
  const mobileRenderer = useCallback(
    p => <LendPositionDetails position={p} />,
    [],
  );

  // TODO: mocked data
  const lendPositions: LendPosition[] = [
    {
      asset: 'BTC',
      apy: 2.01,
      balance: 12.34,
      collateral: true,
    },
    {
      asset: 'ETH',
      apy: 2.04,
      balance: 1.34,
      collateral: false,
    },
  ];

  return (
    <Accordion
      label={
        <span className="text-base font-medium">
          {t(pageTranslations.lendPositionsList.title)}
        </span>
      }
      className="bg-gray-70 px-4 py-3 rounded space-y-3 lg:bg-gray-90 lg:p-6 lg:border lg:border-gray-60"
      labelClassName="justify-between  h-7 flex items-center"
      open={open}
      onClick={setOpen}
    >
      {account ? (
        <>
          <div className="flex flex-col gap-2 mb-2 lg:flex-row lg:gap-6 lg:mb-6">
            <PoolPositionStat
              label={t(pageTranslations.common.balance)}
              value={balance}
              prefix="$"
              precision={2}
            />
            <PoolPositionStat
              label={t(pageTranslations.common.apy)}
              labelInfo={t(pageTranslations.common.apyInfo)}
              value={apy}
              suffix="%"
              precision={2}
            />
            <PoolPositionStat
              label={t(pageTranslations.common.collateral)}
              value={collateral}
              prefix="$"
              precision={2}
            />
          </div>
          <Table
            columns={COLUMNS_CONFIG}
            rowClassName="bg-gray-80"
            accordionClassName="bg-gray-60 border border-gray-70"
            rowTitle={rowTitleRenderer}
            mobileRenderer={mobileRenderer}
            rows={lendPositions}
            orderOptions={orderOptions}
            setOrderOptions={setOrderOptions}
          />
        </>
      ) : (
        <div className="flex items-center justify-center lg:h-12">
          <Paragraph className="text-xs text-center text-gray-30 italic font-medium leading-5 lg:text-white">
            {t(pageTranslations.common.connectWallet)}
          </Paragraph>
        </div>
      )}
    </Accordion>
  );
};
