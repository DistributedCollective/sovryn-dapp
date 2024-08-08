import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { LendPoolAssetDetails } from '../../LendAssetsList.types';

type LendAssetActionProps = {
  pool: LendPoolAssetDetails;
};

export const LendAssetAction: FC<LendAssetActionProps> = () => {
  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      {/* TODO: these should be modal triggers */}
      <Button
        className="flex-grow"
        text={t(translations.aavePage.lendAssetsList.lend)}
      />
      <Button
        className="flex-grow"
        text={t(translations.aavePage.lendAssetsList.details)}
        style={ButtonStyle.secondary}
      />
    </div>
  );
};
