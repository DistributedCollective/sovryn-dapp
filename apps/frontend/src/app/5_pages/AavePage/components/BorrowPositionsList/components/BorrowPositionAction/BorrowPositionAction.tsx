import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { BorrowPosition } from '../../BorrowPositionsList.types';
import { RepayModalContainer } from '../RepayModal/RepayModalContainer';

type BorrowPositionActionProps = {
  position: BorrowPosition;
};

export const BorrowPositionAction: FC<BorrowPositionActionProps> = ({
  position,
}) => {
  const [isRepayModalOpen, setIsRepayModalOpen] = useState<boolean>(false);

  const handleRepayClick = useCallback(() => {
    setIsRepayModalOpen(true);
  }, []);

  const handleRepayClose = useCallback(() => {
    setIsRepayModalOpen(false);
  }, []);

  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      <Button
        style={ButtonStyle.secondary}
        className="flex-grow"
        text={t(translations.aavePage.borrowPositionsList.repay)}
        onClick={handleRepayClick}
      />

      <RepayModalContainer
        asset={position.asset}
        handleCloseModal={handleRepayClose}
        isOpen={isRepayModalOpen}
      />
    </div>
  );
};
