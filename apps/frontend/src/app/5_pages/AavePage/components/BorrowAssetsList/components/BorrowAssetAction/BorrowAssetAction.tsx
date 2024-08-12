import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { BorrowPoolDetails } from '../../BorrowAssetsList.types';
import { BorrowModalContainer } from '../BorrowModal/BorrowModalContainer';

const pageTranslations = translations.aavePage;

type BorrowAssetActionProps = {
  pool: BorrowPoolDetails;
};

export const BorrowAssetAction: FC<BorrowAssetActionProps> = () => {
  const navigate = useNavigate();
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState<boolean>(false);

  const handleBorrowClick = useCallback(() => {
    setIsBorrowModalOpen(true);
  }, []);

  const handleBorrowClose = useCallback(() => {
    setIsBorrowModalOpen(false);
  }, []);

  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      <Button
        className="flex-grow"
        text={t(pageTranslations.common.borrow)}
        onClick={handleBorrowClick}
      />

      <Button
        className="flex-grow"
        text={t(pageTranslations.common.details)}
        style={ButtonStyle.secondary}
        onClick={() => navigate('/aave/reserve-overview')}
      />

      <BorrowModalContainer
        handleCloseModal={handleBorrowClose}
        isOpen={isBorrowModalOpen}
      />
    </div>
  );
};
