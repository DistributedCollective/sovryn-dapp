import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { LendPosition } from '../../LendPositionsList.types';

type LendPositionActionProps = {
  pool: LendPosition;
};

export const LendPositionAction: FC<LendPositionActionProps> = () => {
  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      {/* TODO: these should be modal triggers */}
      <Button
        style={ButtonStyle.secondary}
        className="flex-grow"
        text={t(translations.aavePage.lendPositionsList.withdraw)}
      />
    </div>
  );
};
