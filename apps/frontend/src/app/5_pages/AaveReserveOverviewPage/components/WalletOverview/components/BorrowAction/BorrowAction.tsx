import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Button, HelperButton, Paragraph, ParagraphSize } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetAmountPriceRenderer } from '../../../../../../2_molecules/AssetAmountPriceRenderer/AssetAmountPriceRenderer';
import { translations } from '../../../../../../../locales/i18n';

const pageTranslations = translations.aaveReserveOverviewPage;

type BorrowActionProps = {
  asset: string;
};

export const BorrowAction: FC<BorrowActionProps> = ({ asset }) => {
  const availableToBorrow = 0; // TODO: this is mocked

  const isBorrowDisabled = useMemo(() => {
    // TODO: add conditions
    return Decimal.from(availableToBorrow).lte(0);
  }, [availableToBorrow]);

  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-1">
          <Paragraph size={ParagraphSize.small} className="text-gray-30">
            {t(pageTranslations.yourWalletTab.availableToBorrow)}
          </Paragraph>
          <HelperButton
            content={t(pageTranslations.yourWalletTab.availableToBorrowInfo)}
          />
        </div>
        <AssetAmountPriceRenderer
          value={availableToBorrow}
          asset={asset}
          className="text-left flex flex-col"
          valueClassName="font-medium"
        />
      </div>

      <Button
        text={t(pageTranslations.yourWalletTab.borrow)}
        disabled={isBorrowDisabled}
      />
    </div>
  );
};
