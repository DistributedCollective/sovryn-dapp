import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Paragraph, Table } from '@sovryn/ui';

import { AavePoolRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { PoolPositionStat } from '../PoolPositionStat/PoolPositionStat';
import { COLUMNS_CONFIG } from './LendPositionsList.constants';
import { LendPositionDetails } from './components/LendPositionDetails/LendPositionDetails';

const pageTranslations = translations.aavePage;

type LendPositionsListProps = {};

export const LendPositionsList: FC<LendPositionsListProps> = () => {
  const { account } = useAccount();
  const [open, setOpen] = useState<boolean>(true);

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
            {/* TODO: mock data */}
            <PoolPositionStat
              label={t(pageTranslations.common.balance)}
              value={123.45}
              prefix="$"
              precision={2}
            />
            <PoolPositionStat
              label={t(pageTranslations.common.apy)}
              labelInfo={t(pageTranslations.common.apyInfo)}
              value={2.05}
              suffix="%"
              precision={2}
            />
            <PoolPositionStat
              label={t(pageTranslations.common.collateral)}
              value={123.45}
              prefix="$"
              precision={2}
            />
          </div>
          <Table
            columns={COLUMNS_CONFIG}
            rowClassName="bg-gray-80"
            accordionClassName="bg-gray-60 border border-gray-70"
            rowTitle={r => <AavePoolRowTitle asset={r.asset} />}
            rows={[
              // TODO: mocked data
              {
                asset: 'BTC',
                apy: 2,
                balance: 12.34,
                collateral: true,
              },
              {
                asset: 'ETH',
                apy: 2,
                balance: 12.34,
                collateral: false,
              },
            ]}
            mobileRenderer={p => <LendPositionDetails position={p} />}
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
