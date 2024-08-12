import React, { FC } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { LendForm } from './LendForm';

type LendModalContainerProps = {
  isOpen: boolean;
  handleCloseModal: () => unknown;
};

export const LendModalContainer: FC<LendModalContainerProps> = ({
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
        <LendForm onSuccess={handleCloseModal} />
      </DialogBody>
    </Dialog>
  );
};
