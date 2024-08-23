import React, { FC } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { BorrowForm } from './BorrowForm';

type BorrowModalContainerProps = {
  asset: string;
  isOpen: boolean;
  handleCloseModal: () => unknown;
};

export const BorrowModalContainer: FC<BorrowModalContainerProps> = ({
  asset,
  isOpen,
  handleCloseModal,
}) => {
  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader
        title={t(translations.aavePage.common.borrow)}
        onClose={handleCloseModal}
      />
      <DialogBody className="flex flex-col gap-6">
        <BorrowForm asset={asset} onSuccess={handleCloseModal} />
      </DialogBody>
    </Dialog>
  );
};
