import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';

type LendPositionActionProps = {
  onWithdrawClick: () => void;
};

export const LendPositionAction: FC<LendPositionActionProps> = ({
  onWithdrawClick,
}) => {
  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      <Button
        style={ButtonStyle.secondary}
        className="flex-grow lg:flex-grow-0 lg:w-min"
        text={t(translations.common.buttons.withdraw)}
        onClick={onWithdrawClick}
      />
    </div>
  );
};
