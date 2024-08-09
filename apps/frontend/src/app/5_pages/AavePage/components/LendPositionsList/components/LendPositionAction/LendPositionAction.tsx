import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { LendPosition } from '../../LendPositionsList.types';
import { WithdrawModalContainer } from '../WithdrawModal/WithdrawModalContainer';

type LendPositionActionProps = {
  position: LendPosition;
};

export const LendPositionAction: FC<LendPositionActionProps> = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] =
    useState<boolean>(false);

  const handleWithdrawClick = useCallback(() => {
    setIsWithdrawModalOpen(true);
  }, []);

  const handleWithdrawClose = useCallback(() => {
    setIsWithdrawModalOpen(false);
  }, []);

  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      <Button
        style={ButtonStyle.secondary}
        className="flex-grow"
        text={t(translations.aavePage.lendPositionsList.withdraw)}
        onClick={handleWithdrawClick}
      />

      <WithdrawModalContainer
        handleCloseModal={handleWithdrawClose}
        isOpen={isWithdrawModalOpen}
      />
    </div>
  );
};
