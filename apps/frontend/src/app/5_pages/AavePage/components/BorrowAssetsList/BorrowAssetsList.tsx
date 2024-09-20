import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Accordion,
  Dialog,
  DialogBody,
  DialogHeader,
  ErrorBadge,
  ErrorLevel,
  OrderDirection,
  OrderOptions,
  Table,
} from '@sovryn/ui';

import { AaveRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { translations } from '../../../../../locales/i18n';
import { sortRowsByOrderOptions } from '../../AavePage.utils';
import { COLUMNS_CONFIG } from './BorrowAssetsList.constants';
import { BorrowPoolDetails } from './BorrowAssetsList.types';
import { BorrowAssetDetails } from './components/BorrowAssetDetails/BorrowAssetDetails';
import { BorrowForm } from './components/BorrowForm/BorrowForm';

const pageTranslations = translations.aavePage.borrowAssetsList;

type BorrowAssetsListProps = {
  borrowPools: BorrowPoolDetails[];
  eModeEnabled: boolean;
  loading: boolean;
};

export const BorrowAssetsList: FC<BorrowAssetsListProps> = ({
  borrowPools,
  eModeEnabled,
  loading,
}) => {
  const [open, setOpen] = useState(true);
  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'asset',
    orderDirection: OrderDirection.Desc,
  });
  const [borrowAssetDialog, setBorrowAssetDialog] = useState<string>();

  const onBorrowClose = useCallback(() => {
    setBorrowAssetDialog(undefined);
  }, []);

  const rowTitleRenderer = useCallback(
    (row: BorrowPoolDetails, isOpen?: boolean) => (
      <AaveRowTitle
        isOpen={isOpen || false}
        asset={row.asset}
        value={row.apy}
        suffix="%"
        label={t(translations.aavePage.common.apy)}
        precision={2}
      />
    ),
    [],
  );

  const mobileRenderer = useCallback(
    p => (
      <BorrowAssetDetails
        onBorrowClick={() => setBorrowAssetDialog(p.asset)}
        pool={p}
      />
    ),
    [setBorrowAssetDialog],
  );

  const rows = useMemo(
    () => sortRowsByOrderOptions(orderOptions, borrowPools),
    [orderOptions, borrowPools],
  );

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
      {eModeEnabled && (
        <ErrorBadge
          className="flex justify-start"
          level={ErrorLevel.Warning}
          message={t(translations.aavePage.eMode.eModeActivatedWarning)}
        />
      )}

      <Table
        isLoading={loading}
        className="mt-4"
        columns={COLUMNS_CONFIG(setBorrowAssetDialog)}
        rowClassName="bg-gray-80"
        accordionClassName="bg-gray-60 border border-gray-70"
        rowTitle={rowTitleRenderer}
        mobileRenderer={mobileRenderer}
        rows={rows}
        orderOptions={orderOptions}
        setOrderOptions={setOrderOptions}
      />

      <Dialog disableFocusTrap isOpen={!!borrowAssetDialog}>
        <DialogHeader
          title={t(translations.aavePage.common.borrow)}
          onClose={onBorrowClose}
        />
        <DialogBody className="flex flex-col gap-6">
          <BorrowForm asset={borrowAssetDialog!} onComplete={onBorrowClose} />
        </DialogBody>
      </Dialog>
    </Accordion>
  );
};
