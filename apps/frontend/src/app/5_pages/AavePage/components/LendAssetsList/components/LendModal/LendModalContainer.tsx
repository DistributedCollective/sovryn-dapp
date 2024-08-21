import React, { FC } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { LendForm } from './LendForm';

type LendModalContainerProps = {
  asset: string;
  isOpen: boolean;
  handleCloseModal: () => unknown;
};

export const LendModalContainer: FC<LendModalContainerProps> = ({
  asset,
  isOpen,
  handleCloseModal,
}) => {
  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(translations.aavePage.lendModal.title)}
        onClose={handleCloseModal}
      />
      <DialogBody className="flex flex-col gap-6">
        <LendForm onSuccess={handleCloseModal} asset={asset} />
      </DialogBody>
    </Dialog>
  );
};
