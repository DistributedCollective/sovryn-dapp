import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Accordion,
  Checkbox,
  Dialog,
  DialogBody,
  DialogHeader,
  OrderOptions,
  Table,
} from '@sovryn/ui';

import { AaveRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { translations } from '../../../../../locales/i18n';
import { COLUMNS_CONFIG } from './LendAssetsList.constants';
import { LendPoolDetails } from './LendAssetsList.types';
import { LendAssetDetails } from './components/LendAssetDetails/LendAssetDetails';
import { LendForm } from './components/LendForm/LendForm';

const pageTranslations = translations.aavePage;

type LendAssetsListProps = {
  loading: boolean;
  lendPools: LendPoolDetails[];
};

export const LendAssetsList: FC<LendAssetsListProps> = ({
  lendPools,
  loading,
}) => {
  const [open, setOpen] = useState(true);
  const [showZeroBalances, setShowZeroBalances] = useState(true);
  const [orderOptions, setOrderOptions] = useState<OrderOptions>();
  const [lendAssetDialog, setLendAssetDialog] = useState<string | undefined>();

  const onLendClose = useCallback(() => {
    setLendAssetDialog(undefined);
  }, []);

  const mobileRenderer = useCallback(
    p => (
      <LendAssetDetails
        pool={p}
        onLendClick={() => setLendAssetDialog(p.asset)}
      />
    ),
    [setLendAssetDialog],
  );

  const rowTitleRenderer = useCallback(
    row => (
      <AaveRowTitle
        asset={row.asset}
        value={row.apy}
        suffix="%"
        label={t(translations.aavePage.common.apy)}
        precision={2}
      />
    ),
    [],
  );

  const filteredLendPools = useMemo(() => {
    if (showZeroBalances) {
      return lendPools;
    }
    return lendPools.filter(p => p.walletBalance.gt(0));
  }, [lendPools, showZeroBalances]);

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
        isLoading={loading}
        columns={COLUMNS_CONFIG(setLendAssetDialog)}
        rowClassName="bg-gray-80"
        accordionClassName="bg-gray-60 border border-gray-70"
        rowTitle={rowTitleRenderer}
        mobileRenderer={mobileRenderer}
        rows={filteredLendPools}
        orderOptions={orderOptions}
        setOrderOptions={setOrderOptions}
      />

      <Dialog disableFocusTrap isOpen={!!lendAssetDialog}>
        <DialogHeader
          title={t(translations.aavePage.lendModal.title)}
          onClose={onLendClose}
        />
        <DialogBody className="flex flex-col gap-6">
          <LendForm onComplete={onLendClose} asset={lendAssetDialog!} />
        </DialogBody>
      </Dialog>
    </Accordion>
  );
};
