import React, { FC } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { WithdrawForm } from './WithdrawForm';

type WithdrawModalContainerProps = {
  asset: string;
  isOpen: boolean;
  handleCloseModal: () => unknown;
};

export const WithdrawModalContainer: FC<WithdrawModalContainerProps> = ({
  asset,
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
        <WithdrawForm asset={asset} onSuccess={handleCloseModal} />
      </DialogBody>
    </Dialog>
  );
};
