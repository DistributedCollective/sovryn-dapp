import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { LendModalContainer } from '../LendModal/LendModalContainer';

export const LendAssetAction: FC = () => {
  const navigate = useNavigate();
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);

  const handleLendClick = useCallback(() => {
    setIsLendModalOpen(true);
  }, []);

  const handleLendClose = useCallback(() => {
    setIsLendModalOpen(false);
  }, []);

  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      <Button
        className="flex-grow"
        text={t(translations.aavePage.common.lend)}
        onClick={handleLendClick}
      />

      <Button
        className="flex-grow"
        text={t(translations.aavePage.common.details)}
        style={ButtonStyle.secondary}
        onClick={() => navigate('/aave/reserve-overview')}
      />

      <LendModalContainer
        handleCloseModal={handleLendClose}
        isOpen={isLendModalOpen}
      />
    </div>
  );
};
