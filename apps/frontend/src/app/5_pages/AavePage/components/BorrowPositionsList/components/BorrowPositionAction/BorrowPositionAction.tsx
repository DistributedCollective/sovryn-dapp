import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { RepayModalContainer } from '../RepayModal/RepayModalContainer';

export const BorrowPositionAction: FC = () => {
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

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
        handleCloseModal={handleRepayClose}
        isOpen={isRepayModalOpen}
      />
    </div>
  );
};
