import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  HelperButton,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetAmountPriceRenderer } from '../../../../../../2_molecules/AssetAmountPriceRenderer/AssetAmountPriceRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { BorrowForm } from '../../../../../AavePage/components/BorrowAssetsList/components/BorrowForm/BorrowForm';

const pageTranslations = translations.aaveReserveOverviewPage;

type BorrowActionProps = {
  asset: string;
  availableToBorrow: Decimal;
  availableToBorrowUsd: Decimal;
};

export const BorrowAction: FC<BorrowActionProps> = ({
  asset,
  availableToBorrow,
  availableToBorrowUsd,
}) => {
  const [open, setOpen] = useState(false);

  const onBorrowClose = useCallback(() => setOpen(false), []);

  const onBorrowOpen = useCallback(() => setOpen(true), []);

  const isBorrowDisabled = useMemo(
    () => availableToBorrow.lte(0),
    [availableToBorrow],
  );

  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Paragraph size={ParagraphSize.small} className="text-gray-30 ">
            {t(pageTranslations.yourWalletTab.availableToBorrow)}{' '}
          </Paragraph>
          <HelperButton
            content={t(pageTranslations.yourWalletTab.availableToBorrowInfo)}
          />
        </div>
        <AssetAmountPriceRenderer
          value={availableToBorrow}
          valueUsd={availableToBorrowUsd}
          asset={asset}
          className="text-left flex flex-col"
          valueClassName="font-medium"
        />
      </div>

      <Button
        onClick={onBorrowOpen}
        text={t(pageTranslations.yourWalletTab.borrow)}
        disabled={isBorrowDisabled}
      />

      <Dialog disableFocusTrap isOpen={open}>
        <DialogHeader
          title={t(translations.aavePage.common.borrow)}
          onClose={onBorrowClose}
        />
        <DialogBody className="flex flex-col gap-6">
          <BorrowForm asset={asset} onComplete={onBorrowClose} />
        </DialogBody>
      </Dialog>
    </div>
  );
};
