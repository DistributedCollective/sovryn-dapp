import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { BorrowPoolDetails } from '../../BorrowAssetsList.types';

const pageTranslations = translations.aavePage;

type BorrowAssetActionProps = {
  pool: BorrowPoolDetails;
};

export const BorrowAssetAction: FC<BorrowAssetActionProps> = () => {
  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      {/* TODO: these should be modal triggers */}
      <Button className="flex-grow" text={t(pageTranslations.common.borrow)} />
      <Button
        className="flex-grow"
        text={t(pageTranslations.common.details)}
        style={ButtonStyle.secondary}
      />
    </div>
  );
};
