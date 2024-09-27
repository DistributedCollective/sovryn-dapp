import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Accordion,
  Dialog,
  DialogBody,
  DialogHeader,
  OrderDirection,
  OrderOptions,
  Paragraph,
  Table,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AaveRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { sortRowsByOrderOptions } from '../../AavePage.utils';
import { PoolPositionStat } from '../PoolPositionStat/PoolPositionStat';
import { COLUMNS_CONFIG } from './LendPositionsList.constants';
import { LendPosition } from './LendPositionsList.types';
import { LendPositionDetails } from './components/LendPositionDetails/LendPositionDetails';
import { WithdrawForm } from './components/WithdrawForm/WithdrawForm';

const pageTranslations = translations.aavePage;

type LendPositionsListProps = {
  supplyBalance: Decimal;
  supplyWeightedApy: Decimal;
  collateralBalance: Decimal;
  lendPositions: LendPosition[];
  loading: boolean;
};

export const LendPositionsList: FC<LendPositionsListProps> = ({
  supplyBalance,
  supplyWeightedApy,
  collateralBalance,
  lendPositions,
  loading,
}) => {
  const { account } = useAccount();
  const [open, setOpen] = useState(true);
  const [withdrawAssetDialog, setWithdrawAssetDialog] = useState<string>();
  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'asset',
    orderDirection: OrderDirection.Desc,
  });

  const onWithdrawClose = useCallback(
    () => setWithdrawAssetDialog(undefined),
    [],
  );

  const mobileRenderer = useCallback(
    p => (
      <LendPositionDetails
        position={p}
        onWithdrawClick={setWithdrawAssetDialog}
      />
    ),
    [setWithdrawAssetDialog],
  );

  const rowTitleRenderer = useCallback(
    (r: LendPosition, isOpen?: boolean) => (
      <AaveRowTitle
        isOpen={isOpen}
        asset={r.asset}
        value={r.supplied}
        suffix={r.asset}
        precision={2}
      />
    ),
    [],
  );

  const rows = useMemo(
    () => sortRowsByOrderOptions(orderOptions, lendPositions),
    [orderOptions, lendPositions],
  );

  if (!account) {
    return (
      <div className="bg-gray-70 px-4 py-3 rounded lg:bg-gray-90 lg:pb-6 lg:px-6 lg:pt-3 lg:border lg:border-gray-60">
        <div className="text-base font-medium text-left py-[6px] lg:pt-2 lg:pb-3 lg:flex lg:items-center lg:gap-8">
          <span>{t(pageTranslations.lendPositionsList.title)}</span>
        </div>

        <div className="flex items-center justify-center lg:h-12">
          <Paragraph className="text-xs text-center text-gray-30 italic font-medium leading-5 lg:text-white">
            {t(pageTranslations.common.connectWallet)}
          </Paragraph>
        </div>
      </div>
    );
  }

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
      {rows.length ? (
        <>
          <div className="flex flex-col gap-2 mb-2 lg:flex-row lg:gap-6 lg:mb-6">
            <PoolPositionStat
              label={t(pageTranslations.common.balance)}
              value={supplyBalance}
              prefix="$"
              precision={2}
            />
            <PoolPositionStat
              label={t(pageTranslations.common.apy)}
              labelInfo={t(pageTranslations.common.apyInfo)}
              value={supplyWeightedApy}
              suffix="%"
              precision={2}
            />
            <PoolPositionStat
              label={t(pageTranslations.common.collateral)}
              labelInfo={t(pageTranslations.common.collateralInfo)}
              value={collateralBalance}
              prefix="$"
              precision={2}
            />
          </div>
        </>
      ) : null}

      <Table
        isLoading={loading}
        columns={COLUMNS_CONFIG(setWithdrawAssetDialog)}
        rowClassName="bg-gray-80"
        accordionClassName="bg-gray-60 border border-gray-70"
        rowTitle={rowTitleRenderer}
        mobileRenderer={mobileRenderer}
        rows={rows}
        orderOptions={orderOptions}
        setOrderOptions={setOrderOptions}
        noData={
          <span className="text-gray-30 text-sm lg:text-white">
            {t(pageTranslations.lendPositionsList.noData)}
          </span>
        }
      />

      <Dialog disableFocusTrap isOpen={!!withdrawAssetDialog}>
        <DialogHeader
          title={t(translations.aavePage.common.withdraw)}
          onClose={onWithdrawClose}
        />
        <DialogBody className="flex flex-col gap-6">
          <WithdrawForm
            asset={withdrawAssetDialog!}
            onComplete={onWithdrawClose}
          />
        </DialogBody>
      </Dialog>
    </Accordion>
  );
};
