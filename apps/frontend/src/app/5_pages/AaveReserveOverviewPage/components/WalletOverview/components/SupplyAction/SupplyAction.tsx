import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Button, HelperButton, Paragraph, ParagraphSize } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetAmountPriceRenderer } from '../../../../../../2_molecules/AssetAmountPriceRenderer/AssetAmountPriceRenderer';
import { translations } from '../../../../../../../locales/i18n';

const pageTranslations = translations.aaveReserveOverviewPage;

type SupplyActionProps = {
  asset: string;
};

export const SupplyAction: FC<SupplyActionProps> = ({ asset }) => {
  const availableToSupply = 0; // TODO: this is mocked.

  const isSupplyDisabled = useMemo(() => {
    // TODO: add conditions
    return Decimal.from(availableToSupply).lte(0);
  }, [availableToSupply]);

  return (
    <div className="flex justify-between items-center">
      <div>
        <Paragraph
          size={ParagraphSize.small}
          className="text-gray-30 flex items-center gap-1"
        >
          {t(pageTranslations.yourWalletTab.availableToSupply)}{' '}
          <HelperButton
            content={t(pageTranslations.yourWalletTab.availableToSupplyInfo)}
          />
        </Paragraph>
        <AssetAmountPriceRenderer
          value={availableToSupply}
          asset={asset}
          className="text-left flex flex-col"
          valueClassName="font-medium"
        />
      </div>

      <Button
        text={t(pageTranslations.yourWalletTab.supply)}
        disabled={isSupplyDisabled}
      />
    </div>
  );
};
