import React, { FC } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';

type NewLoanDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const NewLoanDialog: FC<NewLoanDialogProps> = ({ isOpen, onClose }) => (
  <Dialog isOpen={isOpen}>
    <DialogHeader
      title={t(translations.fixedInterestPage.newLoanDialog.title)}
      onClose={onClose}
    ></DialogHeader>
    <DialogBody>Open new loan</DialogBody>
  </Dialog>
);
