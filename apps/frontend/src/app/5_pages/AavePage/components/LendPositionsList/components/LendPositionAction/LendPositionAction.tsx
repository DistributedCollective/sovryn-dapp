import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { LendPosition } from '../../LendPositionsList.types';
import { WithdrawModalContainer } from '../WithdrawModal/WithdrawModalContainer';

type LendPositionActionProps = {
  position: LendPosition;
};

export const LendPositionAction: FC<LendPositionActionProps> = ({
  position,
}) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] =
    useState<boolean>(false);

  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawClose = () => {
    setIsWithdrawModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      <Button
        style={ButtonStyle.secondary}
        className="flex-grow"
        text={t(translations.common.buttons.withdraw)}
        onClick={handleWithdrawClick}
      />

      <WithdrawModalContainer
        asset={position.asset}
        handleCloseModal={handleWithdrawClose}
        isOpen={isWithdrawModalOpen}
      />
    </div>
  );
};
