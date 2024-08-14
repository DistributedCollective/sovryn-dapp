import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { Accordion, OrderOptions, Paragraph, Table } from '@sovryn/ui';

import { AaveRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { PoolPositionStat } from '../PoolPositionStat/PoolPositionStat';
import { COLUMNS_CONFIG } from './BorrowPositionsList.constants';
import { BorrowPosition } from './BorrowPositionsList.types';
import { BorrowPositionDetails } from './components/BorrowPositionDetails/BorrowPositionDetails';
import { EfficiencyModeCard } from './components/EfficiencyModeCard/EfficiencyModeCard';

const pageTranslations = translations.aavePage;

type BorrowPositionsListProps = {};

export const BorrowPositionsList: FC<BorrowPositionsListProps> = () => {
  const { account } = useAccount();
  const [open, setOpen] = useState<boolean>(true);
  const [balance] = useState(123.45); // TODO: mock
  const [apy] = useState(2.05); // TODO: mock
  const [borrowPowerUsed] = useState(2.05); // TODO: mock
  const [orderOptions, setOrderOptions] = useState<OrderOptions>();

  const rowTitleRenderer = useCallback(
    r => <AaveRowTitle asset={r.asset} value={r.balance} suffix={r.asset} />,
    [],
  );

  const mobileRenderer = useCallback(
    p => <BorrowPositionDetails position={p} />,
    [],
  );

  // TODO: mocked values
  const borrowPositions: BorrowPosition[] = [
    {
      asset: 'BTC',
      apr: 2.24,
      balance: 12.34,
      apyType: 'variable',
    },
    {
      asset: 'ETH',
      apr: 2.33,
      balance: 12.34,
      apyType: 'fixed',
    },
  ];

  return (
    <Accordion
      label={
        <div className="text-base font-medium text-left lg:flex lg:items-center lg:gap-8">
          <span>{t(pageTranslations.borrowPositionsList.title)}</span>
          <div className="hidden lg:flex gap-3">
            <span className="text-gray-30 font-medium text-sm">E-Mode</span>
            <EfficiencyModeCard />
          </div>
        </div>
      }
      className="bg-gray-70 px-4 py-3 rounded space-y-3 lg:bg-gray-90 lg:p-6 lg:border lg:border-gray-60"
      labelClassName="justify-between  lg:h-7 flex items-center"
      open={open}
      onClick={setOpen}
    >
      {account ? (
        <>
          <EfficiencyModeCard className="lg:hidden mb-3" />
          <div className="flex flex-col gap-2 mb-2 lg:flex-row lg:gap-6 lg:mb-6">
            <PoolPositionStat
              label={t(pageTranslations.common.balance)}
              value={balance}
              prefix="$"
              precision={2}
            />
            <PoolPositionStat
              label={t(pageTranslations.common.apy)}
              value={apy}
              suffix="%"
              precision={2}
            />
            <PoolPositionStat
              label={t(pageTranslations.borrowPositionsList.borrowPowerUsed)}
              value={borrowPowerUsed}
              suffix="%"
              precision={2}
            />
          </div>
          <Table
            columns={COLUMNS_CONFIG}
            rowClassName="bg-gray-80"
            accordionClassName="bg-gray-60 border border-gray-70"
            rowTitle={rowTitleRenderer}
            mobileRenderer={mobileRenderer}
            rows={borrowPositions}
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
