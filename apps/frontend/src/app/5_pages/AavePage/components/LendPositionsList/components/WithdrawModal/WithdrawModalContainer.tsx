import React, { FC } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { WithdrawForm } from './WithdrawForm';

type WithdrawModalContainerProps = {
  isOpen: boolean;
  handleCloseModal: () => unknown;
};

export const WithdrawModalContainer: FC<WithdrawModalContainerProps> = ({
  isOpen,
  handleCloseModal,
}) => {
  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(translations.aavePage.common.withdraw)}
        onClose={handleCloseModal}
      />
      <DialogBody className="flex flex-col gap-6">
        <WithdrawForm onSuccess={handleCloseModal} />
      </DialogBody>
    </Dialog>
  );
};
