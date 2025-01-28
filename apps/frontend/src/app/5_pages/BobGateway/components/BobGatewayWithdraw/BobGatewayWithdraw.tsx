import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonSize } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { strategies } from '../../BobGateway.constants';

type BobGatewayWithdrawProps = {
  strategyAddress: string;
};

export const BobGatewayWithdraw: FC<BobGatewayWithdrawProps> = ({
  strategyAddress,
}) => {
  const strategy = strategies.find(t => t.strategyAddress === strategyAddress);

  return (
    <>
      <div className="text-gray-30 text-xs mb-2 mt-5 font-medium">
        {t(translations.bobGatewayPage.lst)}
      </div>

      <div className="p-3 flex flex-col bg-gray-80 rounded gap-2">
        <AssetRenderer
          assetClassName="font-medium"
          asset={strategy?.tokenA}
          showAssetLogo
        />
        <AssetRenderer
          assetClassName="font-medium"
          asset={strategy?.tokenB}
          showAssetLogo
        />
      </div>
      <Button
        className="mt-6 w-full"
        size={ButtonSize.large}
        text={t(translations.bobGatewayPage.withdraw)}
      />
    </>
  );
};
