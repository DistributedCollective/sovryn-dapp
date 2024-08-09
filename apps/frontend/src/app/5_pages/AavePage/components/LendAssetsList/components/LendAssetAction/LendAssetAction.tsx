import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { LendPoolDetails } from '../../LendAssetsList.types';
import { LendModalContainer } from '../LendModal/LendModalContainer';

type LendAssetActionProps = {
  pool: LendPoolDetails;
};

export const LendAssetAction: FC<LendAssetActionProps> = () => {
  const [isLendModalOpen, setIsLendModalOpen] = useState<boolean>(false);

  const handleLendClick = () => {
    setIsLendModalOpen(true);
  };

  const handleLendClose = () => {
    setIsLendModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center lg:justify-end space-x-2">
      <Button
        className="flex-grow"
        text={t(translations.aavePage.common.lend)}
        onClick={handleLendClick}
      />

      {/* TODO: Add action for details */}
      <Button
        className="flex-grow"
        text={t(translations.aavePage.common.details)}
        style={ButtonStyle.secondary}
      />

      <LendModalContainer
        handleCloseModal={handleLendClose}
        isOpen={isLendModalOpen}
      />
    </div>
  );
};
