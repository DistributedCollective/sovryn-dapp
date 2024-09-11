import React, { FC, useCallback, useState } from 'react';

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
import { LendForm } from '../../../../../AavePage/components/LendAssetsList/components/LendForm/LendForm';

const pageTranslations = translations.aaveReserveOverviewPage;

type SupplyActionProps = {
  asset: string;
  availableToSupply: Decimal;
  availableToSupplyUsd: Decimal;
};

export const SupplyAction: FC<SupplyActionProps> = ({
  asset,
  availableToSupply,
  availableToSupplyUsd,
}) => {
  const [open, setOpen] = useState(false);

  const onSupplyClose = useCallback(() => setOpen(false), []);

  const onSupplyOpen = useCallback(() => setOpen(true), []);

  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Paragraph size={ParagraphSize.small} className="text-gray-30">
            {t(pageTranslations.yourWalletTab.availableToSupply)}
          </Paragraph>
          <HelperButton
            content={t(pageTranslations.yourWalletTab.availableToSupplyInfo)}
          />
        </div>
        <AssetAmountPriceRenderer
          value={availableToSupply}
          valueUsd={availableToSupplyUsd}
          asset={asset}
          className="text-left flex flex-col"
          valueClassName="font-medium"
        />
      </div>

      <Button
        onClick={onSupplyOpen}
        text={t(pageTranslations.yourWalletTab.supply)}
        disabled={availableToSupply.lte(0)}
      />

      <Dialog disableFocusTrap isOpen={open}>
        <DialogHeader
          title={t(pageTranslations.yourWalletTab.supply)}
          onClose={onSupplyClose}
        />
        <DialogBody className="flex flex-col gap-6">
          <LendForm asset={asset} onComplete={onSupplyClose} />
        </DialogBody>
      </Dialog>
    </div>
  );
};
